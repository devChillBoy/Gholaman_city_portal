import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsImage } from "@/components/NewsImage";
import type { NewsItem } from "@/lib/types";
import { formatNewsDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

// Helper function to safely fetch news
async function fetchNews(page: number, pageSize: number): Promise<{ items: NewsItem[]; total: number }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables not configured");
      return { items: [], total: 0 };
    }
    
    const { getNewsList } = await import("@/lib/news-service");
    return await getNewsList(page, pageSize);
  } catch (error) {
    console.error("Failed to load news:", error);
    return { items: [], total: 0 };
  }
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const pageSize = 6;
  
  const { items, total } = await fetchNews(currentPage - 1, pageSize);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12">اخبار و رویدادها</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {items.map((news) => (
          <Card key={news.id} className="hover:shadow-lg transition-shadow">
            {news.image_url && (
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                <NewsImage src={news.image_url} alt={news.title} />
              </div>
            )}
            <CardHeader>
              <CardDescription className="text-sm text-gray-500">
                {formatNewsDate(news.published_at || news.created_at)}
              </CardDescription>
              <CardTitle className="text-xl">{news.title}</CardTitle>
              {news.excerpt && (
                <CardDescription className="mt-2 line-clamp-2">{news.excerpt}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Button asChild variant="link" className="p-0">
                <Link href={`/news/${news.slug}`}>
                  ادامه خبر
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            asChild
            variant="outline"
            disabled={currentPage === 1}
          >
            <Link href={`/news?page=${currentPage - 1}`}>قبلی</Link>
          </Button>
          <span className="text-sm text-gray-600">
            صفحه {currentPage} از {totalPages}
          </span>
          <Button
            asChild
            variant="outline"
            disabled={currentPage === totalPages}
          >
            <Link href={`/news?page=${currentPage + 1}`}>بعدی</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

