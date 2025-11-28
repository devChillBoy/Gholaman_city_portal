import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAdminNewsList, deleteNews } from "@/lib/admin-news-service";
import { formatPersianDate } from "@/lib/utils";
import { Plus, Edit } from "lucide-react";
import { DeleteButton } from "./delete-button";
import { AdminClient } from "../admin-client";

async function handleDelete(formData: FormData): Promise<void> {
  "use server";
  
  const id = formData.get("id");
  if (!id) {
    throw new Error("شناسه خبر الزامی است");
  }
  
  const newsId = Number(id);
  if (isNaN(newsId)) {
    throw new Error("شناسه خبر نامعتبر است");
  }
  
  try {
    await deleteNews(newsId);
    revalidatePath("/admin/news");
  } catch (error) {
    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`خطا در حذف خبر: ${error.message}`);
    }
    throw new Error("خطا در حذف خبر. لطفاً دوباره تلاش کنید.");
  }
}

export default async function AdminNewsPage() {
  const items = await getAdminNewsList();

  return (
    <AdminClient>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">مدیریت اخبار</h1>
            <p className="text-gray-600">ایجاد، ویرایش و حذف اخبار</p>
          </div>
          <Button asChild>
            <Link href="/admin/news/new">
              <Plus className="ml-2 h-4 w-4" />
              ایجاد خبر جدید
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>لیست اخبار</CardTitle>
            <CardDescription>{items.length} خبر یافت شد</CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                خبری یافت نشد. برای ایجاد خبر جدید، روی دکمه «ایجاد خبر جدید» کلیک کنید.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان</TableHead>
                    <TableHead>تاریخ انتشار</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold">{item.title}</TableCell>
                      <TableCell>
                        {item.published_at
                          ? formatPersianDate(item.published_at)
                          : "منتشر نشده"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === "published" ? "success" : "secondary"}>
                          {item.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/news/${item.id}`}>
                              <Edit className="ml-2 h-4 w-4" />
                              ویرایش
                            </Link>
                          </Button>
                          <DeleteButton id={item.id} deleteAction={handleDelete} />
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
    </AdminClient>
  );
}
