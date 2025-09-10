"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, User, Eye, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import newsApi, {
  BackendNews,
  News as FrontendNews,
  mapBackendNewsToFrontend,
} from "@/lib/api/news";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { NewsCard } from "@/components/NewsCard";

export default function NewsPage() {
  const [news, setNews] = useState<FrontendNews[]>([]);
  const [filteredNews, setFilteredNews] = useState<FrontendNews[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  const fetchNews = async (
    page: number = 1,
    search?: string,
    category?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: any = {
        limit: pagination.limit,
        page: page,
        status: "published", // Only show published articles
      };

      if (search) filters.search = search;
      if (category && category !== "all") filters.category = category;

      console.log("Fetching news with filters:", filters);
      const response = await newsApi.getNews(filters);
      console.log("API response:", response);

      const mappedNews = response.data.map(mapBackendNewsToFrontend);
      console.log("Mapped news:", mappedNews);

      // Append new news to existing list if not on first page
      setNews((prevNews) =>
        page === 1 ? mappedNews : [...prevNews, ...mappedNews]
      );
      setFilteredNews((prevNews) =>
        page === 1 ? mappedNews : [...prevNews, ...mappedNews]
      );
      setPagination((prev) => ({
        ...response.pagination,
        page, // Ensure the current page is updated
      }));

      console.log("Updated news:", news);
      console.log("Updated filteredNews:", filteredNews);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError("Không thể tải dữ liệu tin tức. Vui lòng thử lại sau.");

      // Fallback to empty arrays if API fails
      setNews([]);
      setFilteredNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    // Debounce search and filters to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchNews(1, searchTerm, categoryFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter]);

  const getCategoryText = (category: string) => {
    switch (category.toLowerCase()) {
      case "training":
        return "Huấn luyện";
      case "nutrition":
        return "Dinh dưỡng";
      case "events":
        return "Sự kiện";
      case "tips":
        return "Mẹo hay";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "training":
        return "bg-blue-500";
      case "nutrition":
        return "bg-green-500";
      case "events":
        return "bg-purple-500";
      case "tips":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return as is if not a valid date
      }
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchNews(pagination.page + 1, searchTerm, categoryFilter);
    }
  };

  const featuredNews = filteredNews.filter((article) => article.featured); // Lấy ra các bài viết nổi bật
  const regularNews = filteredNews.filter((article) => !article.featured); // Lấy ra các bài viết không nổi bật

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary/20 to-purple-500/20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Tin tức <span className="gradient-text">VSM</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Cập nhật kiến thức, mẹo hay và hoạt động mới nhất từ cộng đồng
                chạy bộ sinh viên Việt Nam.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="training">Huấn luyện</SelectItem>
                  <SelectItem value="nutrition">Dinh dưỡng</SelectItem>
                  <SelectItem value="events">Sự kiện</SelectItem>
                  <SelectItem value="tips">Mẹo hay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && news.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-xl text-muted-foreground">
              Đang tải dữ liệu...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-xl text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => fetchNews(1, searchTerm, categoryFilter)}
              variant="outline"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Featured News */}
        {!error && !isLoading && featuredNews.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Bài viết nổi bật</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <NewsCard
                      id={post.id}
                      title={post.title}
                      excerpt={post.excerpt}
                      cover={post.cover}
                      category={getCategoryText(post.category)}
                      categoryColor={getCategoryColor(post.category)}
                      author={post.author.name}
                      date={formatDate(post.date)}
                      views={post.views}
                      featured
                      variant="featured"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular News */}
        {!error && !isLoading && (
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Tất cả bài viết</h2>
              {regularNews.length === 0 && news.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">
                    Không tìm thấy bài viết nào.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularNews.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                          <div className="relative overflow-hidden">
                            <img
                              src={post.cover || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge
                              className={`absolute top-4 left-4 ${getCategoryColor(
                                post.category
                              )} text-white`}
                            >
                              {getCategoryText(post.category)}
                            </Badge>
                          </div>

                          <CardHeader>
                            <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </CardTitle>
                            <p className="text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {post.author.name}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {post.views.toLocaleString()}
                              </div>
                            </div>

                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(post.date)}
                            </div>

                            <Button
                              className="w-full bg-transparent"
                              variant="outline"
                              asChild
                            >
                              <Link href={`/news/${post.id}`}>
                                Đọc tiếp
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {pagination.page < pagination.totalPages && (
                    <div className="text-center mt-12">
                      <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tải...
                          </>
                        ) : (
                          "Tải thêm bài viết"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
