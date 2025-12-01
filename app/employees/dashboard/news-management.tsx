"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewsForm, type NewsFormData } from "./news-form";
import { NewsTable } from "./news-table";
import type { NewsItem, NewsStatus } from "@/lib/types";

// Re-export NewsFormData for external use
export type { NewsFormData };

interface NewsManagementProps {
  initialNews: NewsItem[];
  onCreateNews: (data: NewsFormData) => Promise<{ success: boolean; error?: string }>;
  onUpdateNews: (id: number, data: Partial<NewsFormData>) => Promise<{ success: boolean; error?: string }>;
  onDeleteNews: (id: number) => Promise<{ success: boolean; error?: string }>;
  onToggleStatus: (id: number, status: NewsStatus) => Promise<{ success: boolean; error?: string }>;
}

const emptyFormData: NewsFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  status: "draft",
};

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s\u200C]+/g, "-") // Replace spaces and half-spaces with dashes
    .replace(/[^\u0600-\u06FF\w-]/g, "") // Keep Persian chars, alphanumeric, and dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

export function NewsManagement({
  initialNews,
  onCreateNews,
  onUpdateNews,
  onDeleteNews,
  onToggleStatus,
}: NewsManagementProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isFormOpen = isCreating || editingId !== null;

  // ==========================================================================
  // Message helpers
  // ==========================================================================

  const showMessage = (message: string, isError: boolean = false) => {
    if (isError) {
      setError(message);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(message);
      setError(null);
    }
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 3000);
  };

  // ==========================================================================
  // Form handlers
  // ==========================================================================

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(emptyFormData);
    setError(null);
  };

  const handleEditClick = (item: NewsItem) => {
    setEditingId(item.id);
    setIsCreating(false);
    setFormData({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      content: item.content || "",
      image_url: item.image_url || "",
      status: item.status,
    });
    setError(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData(emptyFormData);
    setError(null);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("عنوان خبر الزامی است");
      return;
    }
    if (!formData.slug.trim()) {
      setError("شناسه لینک الزامی است");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isCreating) {
        const result = await onCreateNews(formData);
        if (result.success) {
          showMessage("خبر با موفقیت ایجاد شد");
          setIsCreating(false);
          setFormData(emptyFormData);
          router.refresh();
        } else {
          showMessage(result.error || "خطا در ایجاد خبر", true);
        }
      } else if (editingId !== null) {
        const result = await onUpdateNews(editingId, formData);
        if (result.success) {
          showMessage("خبر با موفقیت ویرایش شد");
          setEditingId(null);
          setFormData(emptyFormData);
          router.refresh();
        } else {
          showMessage(result.error || "خطا در ویرایش خبر", true);
        }
      }
    } catch (err) {
      console.error("Create/Update news error:", err);
      const message = err instanceof Error ? err.message : "خطای غیرمنتظره رخ داد";
      showMessage(message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================================
  // Table handlers
  // ==========================================================================

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این خبر اطمینان دارید؟")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onDeleteNews(id);
      if (result.success) {
        showMessage("خبر با موفقیت حذف شد");
        router.refresh();
      } else {
        showMessage(result.error || "خطا در حذف خبر", true);
      }
    } catch (err) {
      console.error("Delete news error:", err);
      const message = err instanceof Error ? err.message : "خطای غیرمنتظره رخ داد";
      showMessage(message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: NewsStatus) => {
    const newStatus: NewsStatus = currentStatus === "published" ? "draft" : "published";
    
    setIsSubmitting(true);
    try {
      const result = await onToggleStatus(id, newStatus);
      if (result.success) {
        showMessage(newStatus === "published" ? "خبر منتشر شد" : "خبر به پیش‌نویس تغییر یافت");
        router.refresh();
      } else {
        showMessage(result.error || "خطا در تغییر وضعیت", true);
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      const message = err instanceof Error ? err.message : "خطای غیرمنتظره رخ داد";
      showMessage(message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Create/Edit Form */}
      {isFormOpen && (
        <NewsForm
          formData={formData}
          isCreating={isCreating}
          isSubmitting={isSubmitting}
          onFormDataChange={setFormData}
          onTitleChange={handleTitleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* News List */}
      <NewsTable
        news={initialNews}
        isFormOpen={isFormOpen}
        isSubmitting={isSubmitting}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
