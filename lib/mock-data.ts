import { requestStatuses } from "./constants";

export type RequestStatus = "pending" | "in-review" | "completed" | "rejected";

export interface TrackedRequest {
  code: string;
  service_type: string;
  title: string;
  description: string;
  status: RequestStatus;
  created_at: string;
  payload?: Record<string, unknown>;
}

// In-memory storage for mock requests
const mockRequests: Record<string, TrackedRequest> = {};

/**
 * Generate a unique tracking code for a service request
 * Format: REQ-{SERVICE_TYPE}-{TIMESTAMP}
 */
export function generateTrackingCode(serviceType: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const servicePrefix = serviceType.toUpperCase().replace(/-/g, "_");
  return `REQ-${servicePrefix}-${timestamp}`;
}

/**
 * Save a request to mock storage
 */
export function saveRequest(request: TrackedRequest): void {
  mockRequests[request.code] = request;
}

/**
 * Get a tracked request by code
 */
export function getTrackedRequest(code: string): TrackedRequest | null {
  return mockRequests[code] || null;
}

/**
 * Get all requests (for employee dashboard)
 */
export function getAllRequests(): TrackedRequest[] {
  return Object.values(mockRequests);
}

/**
 * Get requests filtered by status
 */
export function getRequestsByStatus(status: RequestStatus | "all"): TrackedRequest[] {
  if (status === "all") {
    return getAllRequests();
  }
  return getAllRequests().filter((req) => req.status === status);
}

/**
 * Update request status (for employee dashboard)
 */
export function updateRequestStatus(code: string, status: RequestStatus): boolean {
  if (mockRequests[code]) {
    mockRequests[code].status = status;
    return true;
  }
  return false;
}

/**
 * Format Persian date from ISO string
 */
export function formatPersianDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  // Simple conversion to Persian calendar (approximate)
  // In production, use a proper Persian date library like moment-jalaali
  const persianYear = year - 621;
  return `${persianYear}/${month}/${day}`;
}

/**
 * Create a complaint 137 request
 */
export function createComplaintRequest(data: {
  title: string;
  description: string;
  category: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
}): TrackedRequest {
  const code = generateTrackingCode("complaint_137");
  const request: TrackedRequest = {
    code,
    service_type: "complaint_137",
    title: data.title,
    description: `${data.description}\n\nدسته‌بندی: ${data.category}${data.latitude ? `\nموقعیت: ${data.latitude}, ${data.longitude}` : ""}${data.phone ? `\nشماره تماس: ${data.phone}` : ""}`,
    status: "pending",
    created_at: new Date().toISOString(),
    payload: data,
  };
  saveRequest(request);
  return request;
}

/**
 * Create a building permit request
 */
export function createBuildingPermitRequest(data: {
  ownerName: string;
  address: string;
  permitType: string;
  description?: string;
  phone: string;
}): TrackedRequest {
  const code = generateTrackingCode("building_permit");
  const request: TrackedRequest = {
    code,
    service_type: "building_permit",
    title: `درخواست پروانه ساختمانی - ${data.permitType}`,
    description: `نام مالک: ${data.ownerName}\nآدرس: ${data.address}\nنوع درخواست: ${data.permitType}${data.description ? `\nتوضیحات: ${data.description}` : ""}\nشماره تماس: ${data.phone}`,
    status: "pending",
    created_at: new Date().toISOString(),
    payload: data,
  };
  saveRequest(request);
  return request;
}

/**
 * Create a payment request
 */
export function createPaymentRequest(data: {
  fileNumber: string;
  paymentType: string;
  amount: number;
}): TrackedRequest {
  const code = generateTrackingCode("payment");
  const request: TrackedRequest = {
    code,
    service_type: "payment",
    title: `پرداخت عوارض - ${data.paymentType}`,
    description: `شماره پرونده: ${data.fileNumber}\nنوع عوارض: ${data.paymentType}\nمبلغ: ${data.amount.toLocaleString("fa-IR")} تومان`,
    status: "completed",
    created_at: new Date().toISOString(),
    payload: data,
  };
  saveRequest(request);
  return request;
}

