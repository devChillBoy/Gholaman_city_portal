import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAdminNewsById,
  createNews,
  updateNews,
  type NewsInput,
  type NewsStatus,
} from "@/lib/admin-news-service";
import { ArrowRight } from "lucide-react";
import { NewsForm } from "./news-form";
import { AdminClient } from "../admin-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function handleSubmit(
  id: string | number,
  formData: FormData
): Promise<{ error?: string }> {
  "use server";

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const image_url = formData.get("image_url") as string;
  const status = formData.get("status") as NewsStatus;
  const published_at = formData.get("published_at") as string;

  // Validation
  if (!title || !slug) {
    return { error: "عنوان و شناسه لینک الزامی هستند" };
  }

  const input: NewsInput = {
    title: title.trim(),
    slug: slug.trim(),
    excerpt: excerpt?.trim() || undefined,
    content: content?.trim() || undefined,
    image_url: image_url?.trim() || undefined,
    status: status || "draft",
    published_at: published_at?.trim() ? published_at.trim() : null,
  };

  try {
    if (id === "new") {
      await createNews(input);
    } else {
      await updateNews(Number(id), input);
    }
    revalidatePath("/admin/news");
    redirect("/admin/news");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "خطا در ذخیره خبر",
    };
  }
}

export default async function AdminNewsEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const isNew = id === "new";

  let newsItem = null;
  if (!isNew) {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return (
        <AdminClient>
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">شناسه نامعتبر</p>
                    <Button asChild>
                      <Link href="/admin/news">بازگشت به لیست اخبار</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AdminClient>
      );
    }
    newsItem = await getAdminNewsById(parsedId);
    if (!newsItem) {
      return (
        <AdminClient>
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">خبر یافت نشد</p>
                    <Button asChild>
                      <Link href="/admin/news">بازگشت به لیست اخبار</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AdminClient>
      );
    }
  }

  return (
    <AdminClient>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="outline">
              <Link href="/admin/news">
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به لیست اخبار
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{isNew ? "ایجاد خبر جدید" : "ویرایش خبر"}</CardTitle>
              <CardDescription>
                {isNew
                  ? "اطلاعات خبر جدید را وارد کنید"
                  : "اطلاعات خبر را ویرایش کنید"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsForm
                id={id}
                newsItem={newsItem}
                onSubmit={handleSubmit}
                isNew={isNew}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminClient>
  );
}
