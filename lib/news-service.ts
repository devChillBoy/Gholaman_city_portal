import { createServerSupabaseClient } from "./supabase-server";
import type { NewsItem } from "./types";

export type { NewsItem };

/**
 * Get a paginated list of published news items
 * @param page - Page number (0-based)
 * @param pageSize - Number of items per page
 * @returns Object containing items array and total count
 */
export async function getNewsList(
  page: number,
  pageSize: number
): Promise<{ items: NewsItem[]; total: number }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return { items: [], total: 0 };
  }

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("news")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to load news list:", error);
    return { items: [], total: 0 };
  }

  return {
    items: (data as NewsItem[]) || [],
    total: count || 0,
  };
}

/**
 * Get a single published news item by slug
 * @param slug - The slug of the news item
 * @returns NewsItem if found, null otherwise
 */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return null;
  }

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load news item:", error);
    return null;
  }

  return (data as NewsItem) || null;
}

