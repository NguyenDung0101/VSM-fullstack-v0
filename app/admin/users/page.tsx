"use client";

import { useState, useEffect } from "react";
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
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import usersApi, { User, CreateUserDto, UpdateUserDto } from "@/lib/api/users";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

const userSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .optional()
    .or(z.literal("")),
  role: z.enum(["USER", "EDITOR", "ADMIN"]),
});

type UserForm = z.infer<typeof userSchema>;

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await usersApi.getUsersForAdmin();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách người dùng",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, router, toast]);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500";
      case "EDITOR":
        return "bg-blue-500";
      case "USER":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "EDITOR":
        return "Biên tập viên";
      case "USER":
        return "Người dùng";
      default:
        return role;
    }
  };

  const generateRandomAvatar = () => {
    const gender = Math.random() > 0.5 ? "men" : "women";
    const id = Math.floor(Math.random() * 99) + 1;
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
  };

  const onSubmit = async (data: UserForm) => {
    console.log("Submit form:", data);
    try {
      setIsSubmitting(true);

      if (editingUser) {
        // Update existing user
        const updateData: UpdateUserDto = {
          name: data.name,
          email: data.email,
          role: data.role,
        };
        // Nếu có nhập password mới thì mới gửi lên
        if (data.password && data.password.length >= 6) {
          updateData.password = data.password;
        }

        const updatedUser = await usersApi.updateUser(
          editingUser.id,
          updateData
        );

        setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin người dùng đã được cập nhật.",
        });
      } else {
        // Create new user
        const createData: CreateUserDto = {
          name: data.name,
          email: data.email,
          password: data.password || "defaultPassword123",
          role: data.role,
          avatar: generateRandomAvatar(),
          isActive: true,
        };

        const newUser = await usersApi.createUser(createData);
        setUsers([newUser, ...users]);
        toast({
          title: "Tạo thành công",
          description: "Người dùng mới đã được tạo.",
        });
      }

      setIsDialogOpen(false);
      setEditingUser(null);
      form.reset();
    } catch (error) {
      console.error("Failed to save user:", error);
      toast({
        title: "Có lỗi xảy ra",
        description:
          error instanceof Error ? error.message : "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (targetUser: User) => {
    setEditingUser(targetUser);
    form.reset({
      name: targetUser.name,
      email: targetUser.email,
      password: undefined, // Không truyền password khi edit
      role: targetUser.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    console.log("Click xóa user:", userId);
    if (userId === currentUser?.id) {
      toast({
        title: "Không thể xóa",
        description: "Bạn không thể xóa tài khoản của chính mình.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      await usersApi.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      toast({
        title: "Xóa thành công",
        description: "Người dùng đã được xóa.",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể xóa người dùng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const updatedUser = await usersApi.toggleUserStatus(userId);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));

      toast({
        title: "Cập nhật thành công",
        description: `Tài khoản đã được ${
          updatedUser.isActive ? "kích hoạt" : "vô hiệu hóa"
        }.`,
      });
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast({
        title: "Có lỗi xảy ra",
        description:
          "Không thể thay đổi trạng thái tài khoản. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleNewUser = () => {
    setEditingUser(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (currentUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span>Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span>Bạn không có quyền truy cập trang này.</span>
      </div>
    );
  }

  if (isLoading) {
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
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-xl text-muted-foreground">
                Đang tải danh sách người dùng...
              </span>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
          <div className="space-y-8 px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý tài khoản người dùng trong hệ thống
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewUser}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo người dùng
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingUser
                        ? "Chỉnh sửa người dùng"
                        : "Tạo người dùng mới"}
                    </DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập họ và tên" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="user@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {!editingUser && (
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Nhập mật khẩu"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vai trò</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USER">Người dùng</SelectItem>
                                <SelectItem value="EDITOR">
                                  Biên tập viên
                                </SelectItem>
                                <SelectItem value="ADMIN">
                                  Quản trị viên
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting
                            ? "Đang xử lý..."
                            : editingUser
                            ? "Cập nhật"
                            : "Tạo người dùng"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm người dùng..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Danh sách người dùng ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((rowUser) => (
                      <TableRow key={rowUser.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                rowUser.avatar ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={rowUser.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{rowUser.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {rowUser.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getRoleColor(
                              rowUser.role
                            )} text-white`}
                          >
                            {getRoleText(rowUser.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={rowUser.isActive ? "default" : "secondary"}
                          >
                            {rowUser.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(rowUser.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleToggleStatus(rowUser.id)}
                              title={
                                rowUser.isActive ? "Vô hiệu hóa" : "Kích hoạt"
                              }
                            >
                              {rowUser.isActive ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(rowUser)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(rowUser.id)}
                              className="text-destructive hover:text-destructive"
                              disabled={rowUser.id === currentUser?.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">
                      Không có người dùng nào
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
