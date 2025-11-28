"use server";

import { revalidatePath } from "next/cache";
import { 
  createNews, 
  updateNews, 
  deleteNews, 
  getAdminNewsList,
  type NewsInput,
  type NewsStatus 
} from "@/lib/admin-news-service";
import { requireAdmin } from "@/lib/server-auth";

export interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  status: NewsStatus;
}

/**
 * Create a new news item
 */
export async function createNewsAction(
  data: NewsFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require admin authentication
    await requireAdmin();

    const input: NewsInput = {
      title: data.title.trim(),
      slug: data.slug.trim(),
      excerpt: data.excerpt?.trim() || undefined,
      content: data.content?.trim() || undefined,
      image_url: data.image_url?.trim() || undefined,
      status: data.status,
    };

    await createNews(input);
    revalidatePath("/employees/dashboard");
    revalidatePath("/news");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Create news error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "خطا در ایجاد خبر",
    };
  }
}

/**
 * Update an existing news item
 */
export async function updateNewsAction(
  id: number,
  data: Partial<NewsFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require admin authentication
    await requireAdmin();

    const input: Partial<NewsInput> = {};
    
    if (data.title !== undefined) input.title = data.title.trim();
    if (data.slug !== undefined) input.slug = data.slug.trim();
    if (data.excerpt !== undefined) input.excerpt = data.excerpt?.trim() || undefined;
    if (data.content !== undefined) input.content = data.content?.trim() || undefined;
    if (data.image_url !== undefined) input.image_url = data.image_url?.trim() || undefined;
    if (data.status !== undefined) input.status = data.status;

    await updateNews(id, input);
    revalidatePath("/employees/dashboard");
    revalidatePath("/news");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update news error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "خطا در ویرایش خبر",
    };
  }
}

/**
 * Delete a news item
 */
export async function deleteNewsAction(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require admin authentication
    await requireAdmin();

    await deleteNews(id);
    revalidatePath("/employees/dashboard");
    revalidatePath("/news");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete news error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "خطا در حذف خبر",
    };
  }
}

/**
 * Toggle news status between draft and published
 */
export async function toggleNewsStatusAction(
  id: number,
  newStatus: NewsStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require admin authentication
    await requireAdmin();

    await updateNews(id, { status: newStatus });
    revalidatePath("/employees/dashboard");
    revalidatePath("/news");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Toggle news status error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "خطا در تغییر وضعیت",
    };
  }
}

/**
 * Get all news for dashboard
 */
export async function getNewsForDashboard() {
  try {
    return await getAdminNewsList();
  } catch (error) {
    console.error("Get news error:", error);
    return [];
  }
}

