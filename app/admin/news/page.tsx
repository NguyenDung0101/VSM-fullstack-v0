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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: Author;
  date: string;
  category: "training" | "nutrition" | "events" | "tips";
  views: number;
  featured: boolean;
  status: "published" | "draft";
  likes: number;
  commentsCount: number;
  tags: string;
}

const newsSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  excerpt: z.string().min(1, "Mô tả ngắn không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  category: z.enum(["training", "nutrition", "events", "tips"]),
  featured: z.boolean(),
  cover: z.string().optional(),
  tags: z.string().optional(),
  publishedAt: z.string().optional(),
});

type NewsForm = z.infer<typeof newsSchema>;

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      publishedAt: new Date().toISOString().split("T")[0],
    },
  });

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient.getPosts();
        // Đảm bảo data là mảng, nếu backend trả về { data: [...] }
        const postsArray = Array.isArray(data) ? data : data.data || [];
        setPosts(postsArray);
        setFilteredPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Có lỗi xảy ra",
          description: "Không thể tải danh sách bài viết.",
          variant: "destructive",
        });
        // Đặt giá trị mặc định là mảng rỗng nếu lỗi
        setPosts([]);
        setFilteredPosts([]);
      }
    };
    fetchPosts();
  }, [toast]);

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [posts, searchTerm]);

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

  const { user } = useAuth();

  const onSubmit = async (data: NewsForm) => {
    try {
      if (editingPost) {
        console.log("Attempting to edit post with ID:", editingPost.id);
        const updatePayload = {
          ...data,
          category: data.category.toLowerCase(),
        };
        console.log(
          "Full update payload:",
          JSON.stringify(updatePayload, null, 2)
        );
        const updatedPost = await apiClient.updatePost(
          editingPost.id,
          updatePayload
        );
        console.log(
          "API Response from updatePost:",
          JSON.stringify(updatedPost, null, 2)
        );
        setPosts(
          posts.map((post) =>
            post.id === editingPost.id
              ? {
                  ...updatedPost,
                  author: {
                    name: updatedPost.author?.name || "Unknown",
                    id: updatedPost.author?.id || "",
                    avatar: updatedPost.author?.avatar || "",
                  },
                }
              : post
          )
        );
        toast({
          title: "Cập nhật thành công",
          description: "Bài viết đã được cập nhật.",
        });
      } else {
        const postData = {
          ...data,
          cover: data.cover || "/placeholder.svg?height=200&width=300",
          status: "published",
          category: data.category.toLowerCase(),
        };
        console.log("Sending data to createPost:", postData);
        const newPost = await apiClient.createPost(postData);
        console.log("Raw Response from createPost:", newPost);
        const normalizedPost = {
          id: newPost.id,
          title: newPost.title,
          excerpt: newPost.excerpt,
          content: newPost.content,
          cover: newPost.cover || "/placeholder.svg?height=200&width=300",
          category: newPost.category,
          views: newPost.views || 0,
          author: {
            name: newPost.author?.name || "Unknown",
            id: newPost.author?.id || "",
            avatar: newPost.author?.avatar || "",
          },
          date:
            newPost.publishedAt ||
            newPost.date ||
            new Date().toISOString().split("T")[0],
          featured: newPost.featured || false,
          status: newPost.status || "published",
          likes: newPost.likes || 0,
          commentsCount: newPost.commentsCount || 0,
          tags: newPost.tags || "",
        };
        console.log("Normalized Post:", normalizedPost);
        setPosts([normalizedPost, ...posts]);
        toast({
          title: "Tạo thành công",
          description: "Bài viết mới đã được tạo.",
        });
      }
      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
    } catch (error: any) {
      console.error("Error submitting post:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category.toLowerCase() as
        | "training"
        | "nutrition"
        | "events"
        | "tips",
      featured: post.featured,
      cover: post.cover || "",
      tags: post.tags || "",
      publishedAt: post.date || new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    try {
      await apiClient.deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
      toast({
        title: "Xóa thành công",
        description: "Bài viết đã được xóa.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể xóa bài viết.",
        variant: "destructive",
      });
    }
  };

  const handleNewPost = () => {
    setEditingPost(null);
    form.reset({
      title: "",
      excerpt: "",
      content: "",
      category: "training",
      featured: false,
      cover: "",
      tags: "",
      publishedAt: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
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
                  <Button onClick={handleNewPost}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo bài viết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
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
                                defaultValue={field.value}
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
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 pt-8">
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
                      </div>

                      <FormField
                        control={form.control}
                        name="cover"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL ảnh bìa</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập URL ảnh bìa (ví dụ: /placeholder.svg)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit">
                          {editingPost ? "Cập nhật" : "Tạo bài viết"}
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

            {/* Posts Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Danh sách bài viết ({filteredPosts.length})
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
                      <TableHead>Số bình luận</TableHead>
                      <TableHead>Thẻ</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(filteredPosts) &&
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{post.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {post.excerpt}
                              </div>
                              {post.featured && (
                                <Badge className="mt-1 bg-yellow-500 text-white">
                                  Nổi bật
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <img
                              src={
                                post.cover ||
                                "/placeholder.svg?height=50&width=50"
                              }
                              alt={post.title}
                              className="h-12 w-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getCategoryColor(
                                post.category
                              )} text-white`}
                            >
                              {getCategoryText(post.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {post.status === "published"
                                ? "Đã xuất bản"
                                : "Bản nháp"}
                            </Badge>
                          </TableCell>
                          <TableCell>{post.views.toLocaleString()}</TableCell>
                          <TableCell>{post.likes.toLocaleString()}</TableCell>
                          <TableCell>
                            {post.commentsCount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {typeof post.tags === "string" &&
                                post.tags.split(",").map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="mr-1"
                                  >
                                    {tag.trim()}
                                  </Badge>
                                ))}
                            </div>
                          </TableCell>
                          <TableCell>{post.author.name || "Unknown"}</TableCell>
                          <TableCell>
                            {new Date(post.date).toLocaleDateString("vi-VN")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  window.open(`/news/${post.id}`, "_blank")
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(post)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(post.id)}
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
          </motion.div>
        </main>
      </div>
    </div>
  );
}
