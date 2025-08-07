"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/comments/comment-section";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Heart,
  Share2,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import newsApi, {
  BackendNews,
  News as FrontendNews,
  mapBackendNewsToFrontend,
} from "@/lib/api/news";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function NewsDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState<FrontendNews | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<FrontendNews[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const newsId = params.id as string;
        if (!newsId) {
          throw new Error("ID bài viết không hợp lệ");
        }

        // Fetch main article
        const newsData = await newsApi.getNewsArticle(newsId);
        const mappedNews = mapBackendNewsToFrontend(newsData);
        setPost(mappedNews);

        // Increment view count
        try {
          await newsApi.incrementNewsViews(newsId);
        } catch (viewError) {
          console.warn("Could not increment view count:", viewError);
        }

        // Fetch related articles
        try {
          const relatedResponse = await newsApi.getNews({
            category: newsData.category,
            limit: 4,
            status: "published",
          });

          const relatedMapped = relatedResponse.data
            .filter((article) => article.id !== newsId) // Exclude current article
            .slice(0, 2) // Limit to 2 related articles
            .map(mapBackendNewsToFrontend);

          setRelatedPosts(relatedMapped);
        } catch (relatedError) {
          console.warn("Could not fetch related posts:", relatedError);
          setRelatedPosts([]);
        }
      } catch (err) {
        console.error("Failed to fetch news detail:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Không thể tải thông tin bài viết";
        setError(errorMessage);
        toast({
          title: "Lỗi",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [params.id, toast]);

  const handleLike = async () => {
    if (!post) return;

    try {
      if (isLiked) {
        await newsApi.unlikeNews(post.id);
        setPost({
          ...post,
          likes: (post.likes || 0) - 1,
        });
      } else {
        await newsApi.likeNews(post.id);
        setPost({
          ...post,
          likes: (post.likes || 0) + 1,
        });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Failed to update like status:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái thích.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Đã sao chép",
        description: "Link bài viết đã được sao chép vào clipboard!",
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-xl text-muted-foreground">
              Đang tải bài viết...
            </span>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">
                Không tìm thấy bài viết
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || "Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa."}
              </p>
              <div className="space-x-4">
                <Button variant="outline" onClick={handleRetry}>
                  Thử lại
                </Button>
                <Button asChild>
                  <Link href="/news">Về danh sách tin tức</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
      return format(new Date(dateString), "dd MMMM yyyy", { locale: vi });
    } catch {
      return dateString;
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} phút đọc`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        <article className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button variant="ghost" className="mb-6" asChild>
                <Link href="/news">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại tin tức
                </Link>
              </Button>

              <div className="max-w-4xl mx-auto">
                {/* Article Header */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge
                      className={`${getCategoryColor(
                        post.category
                      )} text-white`}
                    >
                      {getCategoryText(post.category)}
                    </Badge>
                    {post.featured && (
                      <Badge className="bg-yellow-500 text-white">
                        Nổi bật
                      </Badge>
                    )}
                    {post.status === "draft" && (
                      <Badge variant="secondary">Bản nháp</Badge>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {post.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {post.author.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {post.views.toLocaleString()} lượt xem
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {calculateReadTime(post.content)}
                      </span>
                    </div>
                  </div>

                  <div className="aspect-video rounded-xl overflow-hidden mb-8">
                    <img
                      src={
                        post.cover || "/placeholder.svg?height=600&width=800"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Article Content */}
                <Card className="mb-8">
                  <CardContent className="p-8">
                    <div
                      className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags && (
                      <div className="mt-8 pt-8 border-t">
                        <h4 className="font-medium mb-3">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.split(",").map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-sm"
                            >
                              #{tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Actions */}
                    <div className="mt-8 pt-8 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant={isLiked ? "default" : "outline"}
                            onClick={handleLike}
                            className={
                              isLiked ? "bg-red-500 hover:bg-red-600" : ""
                            }
                          >
                            <Heart
                              className={`mr-2 h-4 w-4 ${
                                isLiked ? "fill-current" : ""
                              }`}
                            />
                            {post.likes || 0} Thích
                          </Button>
                          <Button variant="outline" onClick={handleShare}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Chia sẻ
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {post.commentsCount || 0} bình luận
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <Card className="mb-8">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Bài viết liên quan
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedPosts.map((relatedPost) => (
                          <Link
                            key={relatedPost.id}
                            href={`/news/${relatedPost.id}`}
                          >
                            <div className="flex space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                              <img
                                src={
                                  relatedPost.cover ||
                                  "/placeholder.svg?height=80&width=80"
                                }
                                alt={relatedPost.title}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium line-clamp-2 mb-2">
                                  {relatedPost.title}
                                </h4>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <span>{formatDate(relatedPost.date)}</span>
                                  <span>•</span>
                                  <span>{relatedPost.views} lượt xem</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comments Section */}
                <CommentSection postId={post.id} />
              </div>
            </motion.div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
