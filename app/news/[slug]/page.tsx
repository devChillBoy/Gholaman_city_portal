import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsImage } from "@/components/NewsImage";
import { getNewsBySlug, getNewsList } from "@/lib/news-service";
import { formatNewsDate } from "@/lib/utils";
import { ArrowRight, ArrowLeft } from "lucide-react";

// Revalidate news details every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">خبر یافت نشد</CardTitle>
              <CardDescription className="text-lg">
                خبر مورد نظر شما وجود ندارد یا حذف شده است.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/news">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  بازگشت به اخبار
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get related news (excluding current item)
  const { items: allNews } = await getNewsList(0, 3);
  const relatedNews = allNews.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/news">
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت به اخبار
            </Link>
          </Button>
        </div>

        <article className="mb-12">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              {formatNewsDate(news.published_at || news.created_at)}
            </p>
            <h1 className="text-4xl font-bold mb-6">{news.title}</h1>
          </div>

          {news.image_url && (
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8 relative">
              <NewsImage src={news.image_url} alt={news.title} priority />
            </div>
          )}

          {news.content && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          )}
        </article>

        {relatedNews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">اخبار مرتبط</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  {item.image_url && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                      <NewsImage src={item.image_url} alt={item.title} />
                    </div>
                  )}
                  <CardHeader>
                    <CardDescription className="text-sm text-gray-500">
                      {formatNewsDate(item.published_at || item.created_at)}
                    </CardDescription>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {item.excerpt && (
                      <CardDescription className="mt-2 line-clamp-2">{item.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="link" className="p-0">
                      <Link href={`/news/${item.slug}`}>
                        ادامه خبر
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

