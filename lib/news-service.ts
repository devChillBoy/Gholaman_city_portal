import { createServerSupabaseClient } from "./supabase-server";
import type { NewsItem } from "./types";

export type { NewsItem };

/**
 * Safe empty result for news list
 */
const EMPTY_NEWS_RESULT = { items: [] as NewsItem[], total: 0 };

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
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.error("Supabase client not available for news list");
      return EMPTY_NEWS_RESULT;
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
      console.error("Failed to load news list:", error.message, error.code);
      return EMPTY_NEWS_RESULT;
    }

    return {
      items: (data as NewsItem[]) || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("Unexpected error in getNewsList:", error);
    return EMPTY_NEWS_RESULT;
  }
}

/**
 * Get a single published news item by slug
 * @param slug - The slug of the news item
 * @returns NewsItem if found, null otherwise
 */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.error("Supabase client not available for news by slug");
      return null;
    }

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Failed to load news item:", error.message, error.code);
      return null;
    }

    return (data as NewsItem) || null;
  } catch (error) {
    console.error("Unexpected error in getNewsBySlug:", error);
    return null;
  }
}

