import { getSupabaseClient } from "./supabaseClient";
import { requireAdmin } from "./server-auth";
import type { NewsItem, NewsInput, NewsStatus } from "./types";

// Re-export types for convenience (AdminNewsItem is the same as NewsItem)
export type { NewsStatus, NewsInput };
export type AdminNewsItem = NewsItem;

/**
 * Get all news items (both draft and published), ordered by created_at desc
 * @returns Array of all news items
 */
export async function getAdminNewsList(): Promise<AdminNewsItem[]> {
  const supabase = getSupabaseClient();

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
  const supabase = getSupabaseClient();

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
  // Require admin authentication
  await requireAdmin();
  
  const supabase = getSupabaseClient();

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
    throw new Error("Failed to create news");
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
  // Require admin authentication
  await requireAdmin();
  
  const supabase = getSupabaseClient();

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

  // If status is updated to "published" and published_at is null, set it to now()
  if (updateData.status === "published" && updateData.published_at === null) {
    updateData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("news")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update news");
  }

  return data as AdminNewsItem;
}

/**
 * Delete a news item
 * @param id - The id of the news item to delete
 * @throws Error if user is not authenticated or not an admin
 */
export async function deleteNews(id: number): Promise<void> {
  // Require admin authentication
  await requireAdmin();
  
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete news");
  }
}

