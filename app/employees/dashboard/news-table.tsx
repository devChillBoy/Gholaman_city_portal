"use client";

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
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { NewsItem, NewsStatus } from "@/lib/types";

interface NewsTableProps {
  news: NewsItem[];
  isFormOpen: boolean;
  isSubmitting: boolean;
  onCreateClick: () => void;
  onEditClick: (item: NewsItem) => void;
  onDeleteClick: (id: number) => void;
  onToggleStatus: (id: number, status: NewsStatus) => void;
}

/**
 * Format date to Persian locale
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function NewsTable({
  news,
  isFormOpen,
  isSubmitting,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onToggleStatus,
}: NewsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>لیست اخبار</CardTitle>
            <CardDescription>{news.length} خبر</CardDescription>
          </div>
          {!isFormOpen && (
            <Button onClick={onCreateClick}>
              <Plus className="ml-2 h-4 w-4" />
              ایجاد خبر جدید
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {news.length === 0 ? (
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
              {news.map((item) => (
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
                        onClick={() => onToggleStatus(item.id, item.status)}
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
                        onClick={() => onEditClick(item)}
                        disabled={isSubmitting || isFormOpen}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteClick(item.id)}
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
  );
}

