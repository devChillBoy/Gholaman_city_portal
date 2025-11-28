"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AdminNewsItem, type NewsStatus } from "@/lib/admin-news-service";
import { Save } from "lucide-react";
import Link from "next/link";

interface NewsFormProps {
  id: string;
  newsItem: AdminNewsItem | null;
  onSubmit: (id: string | number, formData: FormData) => Promise<{ error?: string }>;
  isNew: boolean;
}

export function NewsForm({ id, newsItem, onSubmit, isNew }: NewsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<NewsStatus>(newsItem?.status || "draft");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.set("status", status);
    
    startTransition(async () => {
      const result = await onSubmit(id, formData);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">
          عنوان <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={newsItem?.title || ""}
          placeholder="عنوان خبر"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">
          شناسه لینک/اسلاگ <span className="text-red-500">*</span>
        </Label>
        <Input
          id="slug"
          name="slug"
          required
          defaultValue={newsItem?.slug || ""}
          placeholder="new-news-item"
        />
        <p className="text-xs text-gray-500">
          شناسه یکتای خبر که در آدرس استفاده می‌شود (فقط حروف انگلیسی، اعداد و خط تیره)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">خلاصه</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={newsItem?.excerpt || ""}
          placeholder="خلاصه کوتاه خبر"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">متن کامل</Label>
        <Textarea
          id="content"
          name="content"
          rows={10}
          defaultValue={newsItem?.content || ""}
          placeholder="متن کامل خبر (می‌توانید از HTML استفاده کنید)"
        />
        <p className="text-xs text-gray-500">
          می‌توانید از تگ‌های HTML مانند &lt;p&gt;، &lt;strong&gt; و غیره استفاده کنید
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">آدرس تصویر</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={newsItem?.image_url || ""}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">
            وضعیت <span className="text-red-500">*</span>
          </Label>
          <Select value={status} onValueChange={(value) => setStatus(value as NewsStatus)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">پیش‌نویس</SelectItem>
              <SelectItem value="published">منتشر شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_at">تاریخ انتشار</Label>
          <Input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={
              newsItem?.published_at
                ? new Date(newsItem.published_at).toISOString().slice(0, 16)
                : ""
            }
          />
          <p className="text-xs text-gray-500">
            در صورت خالی بودن، هنگام انتشار به صورت خودکار تنظیم می‌شود
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={isPending}>
          <Save className="ml-2 h-4 w-4" />
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </Button>
        <Button asChild type="button" variant="outline" size="lg">
          <Link href="/admin/news">انصراف</Link>
        </Button>
      </div>
    </form>
  );
}

