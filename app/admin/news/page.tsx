"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import newsApi, {
  BackendNews,
  News as FrontendNews,
  CreateNewsDto,
  UpdateNewsDto,
  mapBackendNewsToFrontend,
} from "@/lib/api/news";
import { useAuth } from "@/contexts/auth-context";

// News schema matching the new API
const newsSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  excerpt: z.string().min(1, "Mô tả ngắn không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  category: z.enum(["training", "nutrition", "events", "tips"]),
  featured: z.boolean().optional(),
  cover: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["published", "draft"]).optional(),
  publishedAt: z.string().optional(),
});

type NewsForm = z.infer<typeof newsSchema>;

export default function AdminNewsPage() {
  const [news, setNews] = useState<FrontendNews[]>([]);
  const [filteredNews, setFilteredNews] = useState<FrontendNews[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<FrontendNews | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  });

  const form = useForm<NewsForm>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "training",
      featured: false,
      cover: "",
      tags: "",
      status: "published",
      publishedAt: new Date().toISOString().split("T")[0],
    },
  });

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Fetch news from API
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await newsApi.getAdminNews({
        limit: pagination.limit,
        page: 1,
      });

      console.log("API response:", response);

      // Validate response data
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      const mappedNews = response.data.map(mapBackendNewsToFrontend);
      setNews(mappedNews);
      setFilteredNews(mappedNews);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching news:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách bài viết";
      setError(errorMessage);
      toast({
        title: "Có lỗi xảy ra",
        description: errorMessage,
        variant: "destructive",
      });

      // Set empty arrays on error
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
    const filtered = news.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
  }, [news, searchTerm]);

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

  const onSubmit = async (data: NewsForm) => {
    try {
      setIsSubmitting(true);

      const newsData: CreateNewsDto | UpdateNewsDto = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        featured: data.featured || false,
        cover: data.cover,
        tags: data.tags,
        status: data.status || "published",
        publishedAt: data.publishedAt,
      };

      if (editingNews) {
        console.log("Updating news with ID:", editingNews.id);
        const updatedNews = await newsApi.updateNews(
          editingNews.id,
          newsData,
          selectedImage || undefined
        );

        const mappedNews = mapBackendNewsToFrontend(updatedNews);
        setNews(
          news.map((article) =>
            article.id === editingNews.id ? mappedNews : article
          )
        );

        toast({
          title: "Cập nhật thành công",
          description: "Bài viết đã được cập nhật.",
        });
      } else {
        console.log("Creating new news with data:", newsData);
        const newNews = await newsApi.createNews(
          newsData,
          selectedImage || undefined
        );

        const mappedNews = mapBackendNewsToFrontend(newNews);
        setNews([mappedNews, ...news]);

        toast({
          title: "Tạo thành công",
          description: "Bài viết mới đã được tạo.",
        });
      }

      setIsDialogOpen(false);
      setEditingNews(null);
      setSelectedImage(null);
      setImagePreview("");
      form.reset();
    } catch (error: any) {
      console.error("Error submitting news:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (article: FrontendNews) => {
    setEditingNews(article);
    form.reset({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      featured: article.featured,
      cover: article.cover || "",
      tags: article.tags || "",
      status: article.status || "published",
      publishedAt: article.date
        ? new Date(article.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });

    // Reset image state
    setSelectedImage(null);
    setImagePreview("");

    setIsDialogOpen(true);
  };

  const handleDelete = async (newsId: string) => {
    try {
      await newsApi.deleteNews(newsId);
      setNews(news.filter((article) => article.id !== newsId));
      toast({
        title: "Xóa thành công",
        description: "Bài viết đã được xóa.",
      });
    } catch (error) {
      console.error("Error deleting news:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể xóa bài viết.",
        variant: "destructive",
      });
    }
  };

  const handleNewNews = () => {
    setEditingNews(null);
    setSelectedImage(null);
    setImagePreview("");
    form.reset({
      title: "",
      excerpt: "",
      content: "",
      category: "training",
      featured: false,
      cover: "",
      tags: "",
      status: "published",
      publishedAt: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleRetry = () => {
    setError(null);
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Quản lý tin tức</h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý các bài viết trên website
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewNews}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo bài viết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingNews ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                    </DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tiêu đề bài viết"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả ngắn</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập mô tả ngắn"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nội dung</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập nội dung bài viết"
                                rows={10}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Danh mục</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn danh mục" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="training">
                                    Huấn luyện
                                  </SelectItem>
                                  <SelectItem value="nutrition">
                                    Dinh dưỡng
                                  </SelectItem>
                                  <SelectItem value="events">
                                    Sự kiện
                                  </SelectItem>
                                  <SelectItem value="tips">Mẹo hay</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trạng thái</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="published">
                                    Đã xuất bản
                                  </SelectItem>
                                  <SelectItem value="draft">
                                    Bản nháp
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cover"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hình ảnh</FormLabel>
                              <div className="space-y-2">
                                <FormControl>
                                  <div className="flex flex-col space-y-2">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        handleImageChange(e);
                                        field.onChange(e.target.value);
                                      }}
                                    />
                                    {imagePreview && (
                                      <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Xem trước:
                                        </p>
                                        <img
                                          src={imagePreview}
                                          alt="Preview"
                                          className="w-full max-w-[200px] h-auto rounded-md border"
                                        />
                                      </div>
                                    )}
                                    {!imagePreview && editingNews?.cover && (
                                      <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Hình ảnh hiện tại:
                                        </p>
                                        <img
                                          src={editingNews.cover}
                                          alt="Current"
                                          className="w-full max-w-[200px] h-auto rounded-md border"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="publishedAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày xuất bản</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thẻ (cách nhau bằng dấu phẩy)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập các thẻ (ví dụ: tag1, tag2, tag3)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded"
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">
                              Bài viết nổi bật
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          disabled={isSubmitting}
                        >
                          Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {editingNews ? "Đang cập nhật..." : "Đang tạo..."}
                            </>
                          ) : editingNews ? (
                            "Cập nhật"
                          ) : (
                            "Tạo bài viết"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && (
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
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-xl text-red-500 mb-4">{error}</p>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang thử lại...
                    </>
                  ) : (
                    "Thử lại"
                  )}
                </Button>
              </div>
            )}

            {/* News Table */}
            {!isLoading && !error && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Danh sách bài viết ({filteredNews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Ảnh bìa</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Lượt xem</TableHead>
                        <TableHead>Lượt thích</TableHead>
                        <TableHead>Tác giả</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNews.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{article.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {article.excerpt}
                              </div>
                              {article.featured && (
                                <Badge className="mt-1 bg-yellow-500 text-white">
                                  Nổi bật
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <img
                              src={
                                article.cover ||
                                "/placeholder.svg?height=50&width=50"
                              }
                              alt={article.title}
                              className="h-12 w-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getCategoryColor(
                                article.category
                              )} text-white`}
                            >
                              {getCategoryText(article.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                article.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {article.status === "published"
                                ? "Đã xuất bản"
                                : "Bản nháp"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {article.views.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {(article.likes || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {article.author.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {new Date(article.date).toLocaleDateString("vi-VN")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  window.open(`/news/${article.id}`, "_blank")
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(article)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(article.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
