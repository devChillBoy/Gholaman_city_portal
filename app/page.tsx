import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsImage } from "@/components/NewsImage";
import { services } from "@/lib/constants";
import type { NewsItem } from "@/lib/types";
import { formatNewsDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

// Force dynamic rendering to handle Supabase connection
export const dynamic = "force-dynamic";

// Helper function to safely fetch news
async function fetchLatestNews(): Promise<NewsItem[]> {
  try {
    // Check if Supabase env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables not configured");
      return [];
    }
    
    // Dynamically import to avoid issues during build
    const { getNewsList } = await import("@/lib/news-service");
    const newsResult = await getNewsList(0, 3);
    return newsResult.items;
  } catch (error) {
    console.error("Failed to load news:", error);
    return [];
  }
}

export default async function HomePage() {
  const popularServices = services.slice(0, 4);
  const latestNews = await fetchLatestNews();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary/90 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              خوش‌آمدید به شهرداری غلامان
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              سامانه خدمات الکترونیکی برای دسترسی آسان به خدمات شهری
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link href="/services">مشاهده خدمات</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">خدمات پرکاربرد</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="mt-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={service.href}>شروع درخواست</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">آخرین اخبار</h2>
            <Button asChild variant="outline">
              <Link href="/news">مشاهده همه اخبار</Link>
            </Button>
          </div>
          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">هیچ خبری ثبت نشده است.</p>
            </div>
          )}
        </div>
      </section>

      {/* Track Request CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">پیگیری درخواست</CardTitle>
              <CardDescription>
                برای پیگیری وضعیت درخواست خود، کد رهگیری را وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg">
                <Link href="/track">پیگیری درخواست</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

