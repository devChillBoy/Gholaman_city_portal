"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, X, Check, Eye, EyeOff } from "lucide-react";
import type { NewsItem, NewsStatus } from "@/lib/types";

interface NewsManagementProps {
  initialNews: NewsItem[];
  onCreateNews: (data: NewsFormData) => Promise<{ success: boolean; error?: string }>;
  onUpdateNews: (id: number, data: Partial<NewsFormData>) => Promise<{ success: boolean; error?: string }>;
  onDeleteNews: (id: number) => Promise<{ success: boolean; error?: string }>;
  onToggleStatus: (id: number, status: NewsStatus) => Promise<{ success: boolean; error?: string }>;
}

export interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  status: NewsStatus;
}

const emptyFormData: NewsFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  status: "draft",
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s\u200C]+/g, "-") // Replace spaces and half-spaces with dashes
    .replace(/[^\u0600-\u06FF\w-]/g, "") // Keep Persian chars, alphanumeric, and dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function NewsManagement({
  initialNews,
  onCreateNews,
  onUpdateNews,
  onDeleteNews,
  onToggleStatus,
}: NewsManagementProps) {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      showMessage("خطای غیرمنتظره رخ داد", true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      showMessage("خطای غیرمنتظره رخ داد", true);
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
      showMessage("خطای غیرمنتظره رخ داد", true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {(isCreating || editingId !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? "ایجاد خبر جدید" : "ویرایش خبر"}</CardTitle>
            <CardDescription>
              {isCreating ? "اطلاعات خبر جدید را وارد کنید" : "اطلاعات خبر را ویرایش کنید"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان خبر *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="عنوان خبر را وارد کنید"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">شناسه لینک (slug) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="news-slug"
                  className="font-mono text-sm"
                  dir="ltr"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">خلاصه خبر</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="خلاصه کوتاه از خبر..."
                rows={2}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوای خبر</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="محتوای کامل خبر را وارد کنید..."
                rows={6}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">آدرس تصویر</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  dir="ltr"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">وضعیت</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: NewsStatus) => setFormData({ ...formData, status: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">پیش‌نویس</SelectItem>
                    <SelectItem value="published">منتشر شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                <Check className="ml-2 h-4 w-4" />
                {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                <X className="ml-2 h-4 w-4" />
                انصراف
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* News List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>لیست اخبار</CardTitle>
              <CardDescription>{initialNews.length} خبر</CardDescription>
            </div>
            {!isCreating && editingId === null && (
              <Button onClick={handleCreateClick}>
                <Plus className="ml-2 h-4 w-4" />
                ایجاد خبر جدید
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {initialNews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              هیچ خبری ثبت نشده است
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>عنوان</TableHead>
                  <TableHead>تاریخ ایجاد</TableHead>
                  <TableHead>تاریخ انتشار</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {item.title}
                    </TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>{formatDate(item.published_at)}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "published" ? "success" : "secondary"}>
                        {item.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          disabled={isSubmitting}
                          title={item.status === "published" ? "تبدیل به پیش‌نویس" : "انتشار"}
                        >
                          {item.status === "published" ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(item)}
                          disabled={isSubmitting || editingId !== null || isCreating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

