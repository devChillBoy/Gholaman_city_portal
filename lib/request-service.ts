import { createServerSupabaseClient } from "./supabase-server";
import type { RequestStatus, ServiceType, RequestRecord, CreateRequestInput } from "./types";

// Re-export types for convenience
export type { RequestStatus, ServiceType, RequestRecord, CreateRequestInput };

/**
 * Generate a random alphanumeric string
 * @param length - Length of the random string
 * @returns Random alphanumeric string
 */
function generateRandomSuffix(length: number = 4): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excludes confusing chars like 0/O, 1/I/L
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a unique tracking code for a request
 * Format: REQ-{SERVICE_TYPE_SHORT}-{TIMESTAMP_BASE36}-{RANDOM_SUFFIX}
 * @param serviceType - The type of service request
 * @returns A unique tracking code
 */
export function generateTrackingCode(serviceType: ServiceType): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = generateRandomSuffix(4);
  
  // Use shorter service type codes for cleaner tracking codes
  const serviceShortCodes: Record<ServiceType, string> = {
    complaint_137: "137",
    building_permit: "BLD",
    payment: "PAY",
  };
  
  const shortCode = serviceShortCodes[serviceType] || serviceType.substring(0, 3).toUpperCase();
  return `REQ-${shortCode}-${timestamp}-${randomSuffix}`;
}

/**
 * Create a new citizen request
 * @param input - The request data
 * @returns The created request record or null if failed
 */
export async function createRequest(
  input: CreateRequestInput
): Promise<RequestRecord | null> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.error("Supabase client not available for createRequest");
      return null;
    }

    const code = generateTrackingCode(input.service_type);

    const { data, error } = await supabase
      .from("requests")
      .insert({
        code,
        service_type: input.service_type,
        title: input.title,
        description: input.description || null,
        status: "pending" as RequestStatus,
        payload: input.payload || null,
        citizen_name: input.citizen_name || null,
        citizen_phone: input.citizen_phone || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create request:", error.message, error.code);
      return null;
    }

    return data as RequestRecord;
  } catch (error) {
    console.error("Unexpected error in createRequest:", error);
    return null;
  }
}

/**
 * Get a request by its tracking code
 * @param code - The tracking code of the request
 * @returns The request record if found, null otherwise
 */
export async function getRequestByCode(
  code: string
): Promise<RequestRecord | null> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.error("Supabase client not available for getRequestByCode");
      return null;
    }

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      console.error("Failed to load request:", error.message, error.code);
      return null;
    }

    return (data as RequestRecord) || null;
  } catch (error) {
    console.error("Unexpected error in getRequestByCode:", error);
    return null;
  }
}

/**
 * Get the most recent requests
 * @param limit - Maximum number of requests to return (default: 20)
 * @returns Array of request records ordered by creation date (newest first)
 */
export async function getRecentRequests(
  limit = 20
): Promise<RequestRecord[]> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.error("Supabase client not available for getRecentRequests");
      return [];
    }

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to load requests:", error.message, error.code);
      return [];
    }

    return (data as RequestRecord[]) || [];
  } catch (error) {
    console.error("Unexpected error in getRecentRequests:", error);
    return [];
  }
}

/**
 * Get requests filtered by status
 * @param status - Optional status filter. If not provided, returns recent requests
 * @param limit - Maximum number of requests to return (default: 50)
 * @returns Array of request records ordered by creation date (newest first)
 */
export async function getRequestsByStatus(
  status?: RequestStatus,
  limit = 50
): Promise<RequestRecord[]> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.error("Supabase client not available for getRequestsByStatus");
      return [];
    }

    let query = supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to load requests:", error.message, error.code);
      return [];
    }

    return (data as RequestRecord[]) || [];
  } catch (error) {
    console.error("Unexpected error in getRequestsByStatus:", error);
    return [];
  }
}

/**
 * Statistics for request counts by status
 */
export interface RequestStats {
  all: number;
  pending: number;
  "in-review": number;
  completed: number;
  rejected: number;
}

/**
 * Get request statistics using optimized RPC function
 * Falls back to multiple queries if RPC is not available
 * @returns Object containing counts for each status and total
 */
export async function getRequestStats(): Promise<RequestStats> {
  const emptyStats: RequestStats = {
    all: 0,
    pending: 0,
    "in-review": 0,
    completed: 0,
    rejected: 0,
  };

  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.error("Supabase client not available for getRequestStats");
      return emptyStats;
    }

    // Try to use the optimized RPC function first (single query)
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_request_stats");

    if (!rpcError && rpcData) {
      // RPC succeeded - return the result
      return {
        all: rpcData.all || 0,
        pending: rpcData.pending || 0,
        "in-review": rpcData["in-review"] || 0,
        completed: rpcData.completed || 0,
        rejected: rpcData.rejected || 0,
      };
    }

    // Fallback: Run all count queries in parallel
    // This is used if the RPC function hasn't been created yet
    const [allResult, pendingResult, inReviewResult, completedResult, rejectedResult] = await Promise.all([
      supabase.from("requests").select("*", { count: "exact", head: true }),
      supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "in-review"),
      supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "rejected"),
    ]);

    // Check for errors
    if (allResult.error || pendingResult.error || inReviewResult.error || completedResult.error || rejectedResult.error) {
      console.error("Failed to load request statistics");
      return emptyStats;
    }

    return {
      all: allResult.count || 0,
      pending: pendingResult.count || 0,
      "in-review": inReviewResult.count || 0,
      completed: completedResult.count || 0,
      rejected: rejectedResult.count || 0,
    };
  } catch (error) {
    console.error("Unexpected error in getRequestStats:", error);
    return emptyStats;
  }
}

