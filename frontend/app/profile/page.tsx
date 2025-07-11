"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Camera, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { mockEvents, mockEventRegistrations } from "@/lib/mock-data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const handleAvatarChange = async (avatarUrl: string) => {
    try {
      await updateProfile({ avatar: avatarUrl });
      setIsAvatarDialogOpen(false);
      toast({
        title: "Cập nhật thành công",
        description: "Avatar đã được thay đổi.",
      });
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật avatar.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user's registered events
  const userRegistrations = mockEventRegistrations.filter(
    (reg) => reg.userId === user.id,
  );
  const registeredEvents = mockEvents.filter((event) =>
    userRegistrations.some((reg) => reg.eventId === event.id),
  );

  // Generate random avatars for selection
  const avatarOptions = [
    `https://randomuser.me/api/portraits/men/1.jpg`,
    `https://randomuser.me/api/portraits/women/1.jpg`,
    `https://randomuser.me/api/portraits/men/2.jpg`,
    `https://randomuser.me/api/portraits/women/2.jpg`,
    `https://randomuser.me/api/portraits/men/3.jpg`,
    `https://randomuser.me/api/portraits/women/3.jpg`,
    `https://randomuser.me/api/portraits/men/4.jpg`,
    `https://randomuser.me/api/portraits/women/4.jpg`,
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        <section className="py-12 bg-gradient-to-r from-primary/20 to-purple-500/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hồ sơ cá nhân
              </h1>
              <p className="text-xl text-muted-foreground">
                Quản lý thông tin cá nhân và theo dõi hoạt động của bạn
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Profile Header */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <img
                        src={
                          user.avatar || "/placeholder.svg?height=96&width=96"
                        }
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <Dialog
                        open={isAvatarDialogOpen}
                        onOpenChange={setIsAvatarDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chọn avatar</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-4 gap-4 p-4">
                            {avatarOptions.map((avatar, index) => (
                              <button
                                key={index}
                                onClick={() => handleAvatarChange(avatar)}
                                className="relative group"
                              >
                                <img
                                  src={avatar || "/placeholder.svg"}
                                  alt={`Avatar ${index + 1}`}
                                  className="w-16 h-16 rounded-full object-cover hover:ring-2 hover:ring-primary transition-all"
                                />
                              </button>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                      <p className="text-muted-foreground mb-3">{user.email}</p>
                      <Badge className="bg-green-500 text-white">
                        Người dùng
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Tabs */}
              <Tabs defaultValue="info" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Thông tin</TabsTrigger>
                  <TabsTrigger value="events">Sự ki���n</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Thông tin cá nhân</CardTitle>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? "Hủy" : "Chỉnh sửa"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
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
                                    <Input {...field} />
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
                                    <Input {...field} disabled />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex justify-end space-x-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                              >
                                Hủy
                              </Button>
                              <Button type="submit">Lưu thay đổi</Button>
                            </div>
                          </form>
                        </Form>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Họ và tên
                            </label>
                            <p className="text-lg">{user.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Email
                            </label>
                            <p className="text-lg">{user.email}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Vai trò
                            </label>
                            <p className="text-lg">Người dùng</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Ngày tham gia
                            </label>
                            <p className="text-lg">
                              {new Date(user.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Sự kiện đã đăng ký ({registeredEvents.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {registeredEvents.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Bạn chưa đăng ký sự kiện nào.
                          </p>
                          <Button className="mt-4" asChild>
                            <Link href="/events">Khám phá sự kiện</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {registeredEvents.map((event) => {
                            const registration = userRegistrations.find(
                              (reg) => reg.eventId === event.id,
                            );
                            return (
                              <div
                                key={event.id}
                                className="flex items-center space-x-4 p-4 border rounded-lg"
                              >
                                <img
                                  src={
                                    event.image ||
                                    "/placeholder.svg?height=64&width=64"
                                  }
                                  alt={event.name}
                                  className="w-16 h-16 rounded object-cover"
                                />
                                <div className="flex-1">
                                  <h3 className="font-medium">{event.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {event.location}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                    <span>
                                      {new Date(event.date).toLocaleDateString(
                                        "vi-VN",
                                      )}
                                    </span>
                                    {registration && (
                                      <Badge
                                        variant={
                                          registration.status === "confirmed"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {registration.status === "confirmed"
                                          ? "Đã xác nhận"
                                          : registration.status === "pending"
                                            ? "Chờ xác nhận"
                                            : registration.status === "waitlist"
                                              ? "Danh sách chờ"
                                              : "Đã hủy"}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button variant="outline" asChild>
                                  <Link href={`/events/${event.id}`}>
                                    Xem chi tiết
                                  </Link>
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
