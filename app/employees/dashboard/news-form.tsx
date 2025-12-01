"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { X, Check } from "lucide-react";
import type { NewsStatus } from "@/lib/types";

export interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  status: NewsStatus;
}

interface NewsFormProps {
  formData: NewsFormData;
  isCreating: boolean;
  isSubmitting: boolean;
  onFormDataChange: (data: NewsFormData) => void;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function NewsForm({
  formData,
  isCreating,
  isSubmitting,
  onFormDataChange,
  onTitleChange,
  onSubmit,
  onCancel,
}: NewsFormProps) {
  return (
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
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="عنوان خبر را وارد کنید"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">شناسه لینک (slug) *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => onFormDataChange({ ...formData, slug: e.target.value })}
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
            onChange={(e) => onFormDataChange({ ...formData, excerpt: e.target.value })}
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
            onChange={(e) => onFormDataChange({ ...formData, content: e.target.value })}
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
              onChange={(e) => onFormDataChange({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
              dir="ltr"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">وضعیت</Label>
            <Select
              value={formData.status}
              onValueChange={(value: NewsStatus) => onFormDataChange({ ...formData, status: value })}
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
          <Button onClick={onSubmit} disabled={isSubmitting}>
            <Check className="ml-2 h-4 w-4" />
            {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            <X className="ml-2 h-4 w-4" />
            انصراف
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

