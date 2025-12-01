"use server";

import { revalidatePath } from "next/cache";
import {
  createNews,
  updateNews,
  deleteNews,
  getAdminNewsList,
  type NewsInput,
  type NewsStatus,
} from "@/lib/admin-news-service";
import { newsLogger } from "@/lib/logger";

export interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  status: NewsStatus;
}

// =============================================================================
// Error Messages (User-friendly Persian messages)
// =============================================================================

const ERROR_MESSAGES = {
  CREATE_FAILED: "خطا در ایجاد خبر. لطفاً دوباره تلاش کنید.",
  UPDATE_FAILED: "خطا در ویرایش خبر. لطفاً دوباره تلاش کنید.",
  DELETE_FAILED: "خطا در حذف خبر. لطفاً دوباره تلاش کنید.",
  STATUS_CHANGE_FAILED: "خطا در تغییر وضعیت. لطفاً دوباره تلاش کنید.",
  AUTH_REQUIRED: "برای این عملیات نیاز به ورود مجدد دارید.",
  ADMIN_REQUIRED: "شما دسترسی لازم برای این عملیات را ندارید.",
} as const;

// =============================================================================
// Helper to revalidate all news-related paths
// =============================================================================

function revalidateNewsPaths(): void {
  revalidatePath("/employees/dashboard");
  revalidatePath("/news");
  revalidatePath("/");
}

// =============================================================================
// News Actions
// =============================================================================

/**
 * Create a new news item
 * Note: Admin authentication is handled by createNews() internally
 */
export async function createNewsAction(
  data: NewsFormData
): Promise<{ success: boolean; error?: string }> {
  newsLogger.info("Creating news item", { title: data.title, status: data.status });

  try {
    const input: NewsInput = {
      title: data.title.trim(),
      slug: data.slug.trim(),
      excerpt: data.excerpt?.trim() || undefined,
      content: data.content?.trim() || undefined,
      image_url: data.image_url?.trim() || undefined,
      status: data.status,
    };

    const result = await createNews(input);
    revalidateNewsPaths();

    newsLogger.info("News item created successfully", {
      newsId: result.id,
      slug: result.slug,
    });

    return { success: true };
  } catch (error) {
    newsLogger.error("Failed to create news", error, {
      title: data.title,
      slug: data.slug,
    });

    // Provide user-friendly error message
    if (error instanceof Error) {
      if (error.message.includes("Authentication")) {
        return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
      }
      if (error.message.includes("Admin")) {
        return { success: false, error: ERROR_MESSAGES.ADMIN_REQUIRED };
      }
    }

    return { success: false, error: ERROR_MESSAGES.CREATE_FAILED };
  }
}

/**
 * Update an existing news item
 * Note: Admin authentication is handled by updateNews() internally
 */
export async function updateNewsAction(
  id: number,
  data: Partial<NewsFormData>
): Promise<{ success: boolean; error?: string }> {
  newsLogger.info("Updating news item", { newsId: id });

  try {
    const input: Partial<NewsInput> = {};

    if (data.title !== undefined) input.title = data.title.trim();
    if (data.slug !== undefined) input.slug = data.slug.trim();
    if (data.excerpt !== undefined) input.excerpt = data.excerpt?.trim() || undefined;
    if (data.content !== undefined) input.content = data.content?.trim() || undefined;
    if (data.image_url !== undefined) input.image_url = data.image_url?.trim() || undefined;
    if (data.status !== undefined) input.status = data.status;

    await updateNews(id, input);
    revalidateNewsPaths();

    newsLogger.info("News item updated successfully", { newsId: id });

    return { success: true };
  } catch (error) {
    newsLogger.error("Failed to update news", error, { newsId: id });

    if (error instanceof Error) {
      if (error.message.includes("Authentication")) {
        return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
      }
      if (error.message.includes("Admin")) {
        return { success: false, error: ERROR_MESSAGES.ADMIN_REQUIRED };
      }
    }

    return { success: false, error: ERROR_MESSAGES.UPDATE_FAILED };
  }
}

/**
 * Delete a news item
 * Note: Admin authentication is handled by deleteNews() internally
 */
export async function deleteNewsAction(
  id: number
): Promise<{ success: boolean; error?: string }> {
  newsLogger.info("Deleting news item", { newsId: id });

  try {
    await deleteNews(id);
    revalidateNewsPaths();

    newsLogger.info("News item deleted successfully", { newsId: id });

    return { success: true };
  } catch (error) {
    newsLogger.error("Failed to delete news", error, { newsId: id });

    if (error instanceof Error) {
      if (error.message.includes("Authentication")) {
        return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
      }
      if (error.message.includes("Admin")) {
        return { success: false, error: ERROR_MESSAGES.ADMIN_REQUIRED };
      }
    }

    return { success: false, error: ERROR_MESSAGES.DELETE_FAILED };
  }
}

/**
 * Toggle news status between draft and published
 * Note: Admin authentication is handled by updateNews() internally
 */
export async function toggleNewsStatusAction(
  id: number,
  newStatus: NewsStatus
): Promise<{ success: boolean; error?: string }> {
  newsLogger.info("Toggling news status", { newsId: id, newStatus });

  try {
    await updateNews(id, { status: newStatus });
    revalidateNewsPaths();

    newsLogger.info("News status changed successfully", { newsId: id, newStatus });

    return { success: true };
  } catch (error) {
    newsLogger.error("Failed to toggle news status", error, {
      newsId: id,
      newStatus,
    });

    if (error instanceof Error) {
      if (error.message.includes("Authentication")) {
        return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
      }
      if (error.message.includes("Admin")) {
        return { success: false, error: ERROR_MESSAGES.ADMIN_REQUIRED };
      }
    }

    return { success: false, error: ERROR_MESSAGES.STATUS_CHANGE_FAILED };
  }
}

/**
 * Get all news for dashboard
 */
export async function getNewsForDashboard() {
  newsLogger.debug("Fetching news for dashboard");

  try {
    const news = await getAdminNewsList();
    newsLogger.debug("News fetched successfully", { count: news.length });
    return news;
  } catch (error) {
    newsLogger.error("Failed to fetch news for dashboard", error);
    return [];
  }
}
