import { createServerSupabaseClient } from "./supabase-server";
import { requireAdmin, type AuthenticatedContext } from "./server-auth";
import { newsLogger } from "./logger";
import type { NewsItem, NewsInput, NewsStatus } from "./types";

// Re-export types for convenience (AdminNewsItem is the same as NewsItem)
export type { NewsStatus, NewsInput };
export type AdminNewsItem = NewsItem;

/**
 * Get all news items (both draft and published), ordered by created_at desc
 * @returns Array of all news items
 */
export async function getAdminNewsList(): Promise<AdminNewsItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load admin news list");
  }

  return (data as AdminNewsItem[]) || [];
}

/**
 * Get a single news item by id
 * @param id - The id of the news item
 * @returns AdminNewsItem if found, null otherwise
 */
export async function getAdminNewsById(id: number): Promise<AdminNewsItem | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load news item");
  }

  return (data as AdminNewsItem) || null;
}

/**
 * Create a new news item
 * @param input - The news item data
 * @returns The created news item
 * @throws Error if user is not authenticated or not an admin
 */
export async function createNews(input: NewsInput): Promise<AdminNewsItem> {
  // Require admin authentication - use the returned client for session consistency
  const { supabase, user } = await requireAdmin();

  // Debug: Log session state before create
  const { data: sessionData } = await supabase.auth.getSession();
  newsLogger.debug("Session state before create", {
    hasSession: !!sessionData?.session,
    sessionUserId: sessionData?.session?.user?.id || null,
    authUserId: user.id,
  });

  const insertData: Record<string, unknown> = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt ?? null,
    content: input.content ?? null,
    image_url: input.image_url ?? null,
    status: input.status ?? "draft",
    published_at: input.published_at ?? null,
  };

  // If status is "published" and published_at is not provided, set it to now()
  if (insertData.status === "published" && !insertData.published_at) {
    insertData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("news")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    newsLogger.error("Supabase create error", error, {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
    });
    throw new Error(`خطا در ایجاد خبر: ${error.message}`);
  }

  return data as AdminNewsItem;
}

/**
 * Update an existing news item
 * @param id - The id of the news item to update
 * @param input - Partial news item data to update
 * @returns The updated news item
 * @throws Error if user is not authenticated or not an admin
 */
export async function updateNews(
  id: number,
  input: Partial<NewsInput>
): Promise<AdminNewsItem> {
  // Require admin authentication - use the returned client for session consistency
  const { supabase } = await requireAdmin();

  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) {
    updateData.title = input.title;
  }
  if (input.slug !== undefined) {
    updateData.slug = input.slug;
  }
  if (input.excerpt !== undefined) {
    updateData.excerpt = input.excerpt ?? null;
  }
  if (input.content !== undefined) {
    updateData.content = input.content ?? null;
  }
  if (input.image_url !== undefined) {
    updateData.image_url = input.image_url ?? null;
  }
  if (input.status !== undefined) {
    updateData.status = input.status;
  }
  if (input.published_at !== undefined) {
    updateData.published_at = input.published_at;
  }

  // If status is changed to "published" and published_at was not explicitly provided,
  // automatically set it to the current timestamp
  if (updateData.status === "published" && input.published_at === undefined) {
    updateData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("news")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    newsLogger.error("Supabase update error", error, {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
      newsId: id,
    });
    throw new Error(`خطا در ویرایش خبر: ${error.message}`);
  }

  return data as AdminNewsItem;
}

/**
 * Delete a news item
 * @param id - The id of the news item to delete
 * @throws Error if user is not authenticated or not an admin
 */
export async function deleteNews(id: number): Promise<void> {
  // Require admin authentication - use the returned client for session consistency
  const { supabase, user } = await requireAdmin();

  // Debug: Log session state before delete
  const { data: sessionData } = await supabase.auth.getSession();
  newsLogger.debug("Session state before delete", {
    newsId: id,
    hasSession: !!sessionData?.session,
    sessionUserId: sessionData?.session?.user?.id || null,
    sessionUserEmail: sessionData?.session?.user?.email || null,
    authUserId: user.id,
    authUserEmail: user.email,
    accessToken: sessionData?.session?.access_token ? "present" : "missing",
  });

  // Try to check what role Supabase sees (requires running 004_rls_diagnostic.sql first)
  const { data: authStatus, error: authStatusError } = await supabase
    .rpc('check_auth_status')
    .maybeSingle();
  
  if (authStatusError) {
    newsLogger.debug("Could not check auth status (RPC may not exist)", {
      error: authStatusError.message,
      hint: "Run 004_rls_diagnostic.sql in Supabase to enable this check",
    });
  } else if (authStatus) {
    newsLogger.debug("Supabase auth status (what RLS sees)", {
      current_user_id: authStatus.current_user_id,
      current_role: authStatus.current_role,
    });
  }

  // First check if the news item exists
  const { data: existingNews, error: checkError } = await supabase
    .from("news")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (checkError) {
    newsLogger.error("Supabase check error before delete", checkError, {
      code: checkError.code,
      message: checkError.message,
      newsId: id,
    });
    throw new Error(`خطا در بررسی خبر: ${checkError.message}`);
  }

  if (!existingNews) {
    throw new Error("خبر مورد نظر یافت نشد یا قبلاً حذف شده است");
  }

  // Now delete
  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) {
    newsLogger.error("Supabase delete error", error, {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
      newsId: id,
    });
    throw new Error(`خطا در حذف خبر: ${error.message}`);
  }

  // Verify deletion by checking if the row still exists
  const { data: stillExists } = await supabase
    .from("news")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (stillExists) {
    newsLogger.error("Delete failed - row still exists", null, { newsId: id });
    throw new Error("حذف خبر انجام نشد. احتمالاً دسترسی لازم را ندارید.");
  }

  newsLogger.debug("Delete verified successful", { newsId: id });
}

