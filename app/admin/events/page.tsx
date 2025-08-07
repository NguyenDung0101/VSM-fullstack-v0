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
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import eventsApi, {
  Event as ApiEvent,
  CreateEventDto,
  UpdateEventDto,
} from "@/lib/api/events";

// Định nghĩa schema cho form dựa trên CreateEventDto
const eventSchema = z.object({
  name: z.string().min(1, "Tên sự kiện không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  date: z.string().min(1, "Ngày tổ chức không được để trống"),
  location: z.string().min(1, "Địa điểm không được để trống"),
  maxParticipants: z.number().min(1, "Số lượng tham gia phải lớn hơn 0"),
  category: z.enum([
    "MARATHON",
    "HALF_MARATHON",
    "FIVE_K",
    "TEN_K",
    "FUN_RUN",
    "TRAIL_RUN",
    "NIGHT_RUN",
  ]),
  distance: z.string().min(1, "Cự ly không được để trống").optional(),
  registrationFee: z
    .number()
    .min(0, "Phí đăng ký phải lớn hơn hoặc bằng 0")
    .optional(),
  requirements: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  registrationDeadline: z.string().optional(),
  organizer: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
});

type EventForm = z.infer<typeof eventSchema>;

// Interface cho sự kiện từ backend
interface Event extends ApiEvent {
  // Các trường bổ sung từ interface hiện tại
  content?: string;
  currentParticipants?: number;
  registeredUsers?: string[];
  published?: boolean;
  featured?: boolean;
  organizer?: string;
  registrationFee?: number;
  requirements?: string;
  registrationDeadline?: string | Date;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      content: "",
      date: "",
      location: "",
      maxParticipants: 100,
      category: "FUN_RUN",
      distance: "",
      registrationFee: 0,
      requirements: "",
      published: true,
      featured: false,
      registrationDeadline: "",
      organizer: "",
      image: "",
      status: "UPCOMING",
    },
  });

  // Thêm state để lưu trữ file ảnh
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Xử lý khi chọn file ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsApi.getAdminEvents({
          take: 50, // Lấy tối đa 50 sự kiện
        });

        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
          setFilteredEvents(response.data);
        } else {
          setEvents([]);
          setFilteredEvents([]);
          toast({
            title: "Cảnh báo",
            description: "Không có dữ liệu sự kiện.",
            variant: "default",
          });
        }
      } catch (err) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách sự kiện: " + (err as string),
          variant: "destructive",
        });
        setEvents([]);
        setFilteredEvents([]);
      }
    };
    fetchEvents();
  }, []);

  // Lọc sự kiện theo từ khóa tìm kiếm
  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  // Chuyển đổi category sang text
  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      MARATHON: "Marathon",
      HALF_MARATHON: "Half Marathon",
      FIVE_K: "5K",
      TEN_K: "10K",
      FUN_RUN: "Fun Run",
      TRAIL_RUN: "Trail Run",
      NIGHT_RUN: "Night Run",
    };
    return categoryMap[category] || category;
  };

  // Màu sắc cho category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "MARATHON":
        return "bg-red-500";
      case "HALF_MARATHON":
        return "bg-orange-500";
      case "FIVE_K":
      case "TEN_K":
        return "bg-blue-500";
      case "FUN_RUN":
        return "bg-green-500";
      case "TRAIL_RUN":
        return "bg-purple-500";
      case "NIGHT_RUN":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  // Màu sắc cho status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-green-500";
      case "ONGOING":
        return "bg-yellow-500";
      case "COMPLETED":
        return "bg-gray-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Chuyển đổi status sang text
  const getStatusText = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "Sắp diễn ra";
      case "ONGOING":
        return "Đang diễn ra";
      case "COMPLETED":
        return "Đã kết thúc";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Xử lý submit form (tạo hoặc cập nhật)
  const onSubmit = async (data: EventForm) => {
    try {
      const eventData: CreateEventDto = {
        name: data.name,
        description: data.description,
        date: new Date(data.date),
        location: data.location,
        maxParticipants: Number(data.maxParticipants),
        category: data.category,
        status: data.status,
        distance: data.distance,
      };

      if (editingEvent) {
        // Cập nhật sự kiện
        const updatedEvent = await eventsApi.updateEvent(
          editingEvent.id,
          eventData,
          selectedImage || undefined
        );
        setEvents(
          events.map((event) =>
            event.id === editingEvent.id ? (updatedEvent as Event) : event
          )
        );
        toast({
          title: "Cập nhật thành công",
          description: "Sự kiện đã được cập nhật.",
        });
      } else {
        // Tạo sự kiện mới
        const newEvent = await eventsApi.createEvent(
          eventData,
          selectedImage || undefined
        );
        if (newEvent && newEvent.id) {
          setEvents([newEvent as Event, ...events]);
          toast({
            title: "Tạo thành công",
            description: "Sự kiện mới đã được tạo.",
          });
        } else {
          throw new Error("Không nhận được dữ liệu sự kiện từ server");
        }
      }
      setIsDialogOpen(false);
      setEditingEvent(null);
      setSelectedImage(null);
      setImagePreview("");
      form.reset();
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: `Vui lòng thử lại sau: ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }`,
        variant: "destructive",
      });
      console.error("Error details:", error);
    }
  };

  // Xử lý chỉnh sửa
  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      name: event.name,
      description: event.description,
      content: event.content || "",
      date: new Date(event.date).toISOString().split("T")[0] || "", // Tránh lỗi nếu date không hợp lệ
      location: event.location,
      maxParticipants: event.maxParticipants,
      category: event.category,
      distance: event.distance || "",
      registrationFee: event.registrationFee || 0,
      requirements: event.requirements || "",
      published: event.published || true,
      featured: event.featured || false,
      registrationDeadline: event.registrationDeadline
        ? new Date(event.registrationDeadline).toISOString().split("T")[0] || ""
        : "",
      organizer: event.organizer || "",
      image: event.image || "",
      status: event.status,
    });
    setIsDialogOpen(true);
  };

  // Xử lý xóa
  const handleDelete = async (eventId: string) => {
    try {
      await eventsApi.deleteEvent(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
      toast({
        title: "Xóa thành công",
        description: "Sự kiện đã được xóa.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sự kiện: " + (error as string),
        variant: "destructive",
      });
    }
  };

  // Mở form tạo sự kiện mới
  const handleNewEvent = () => {
    setEditingEvent(null);
    form.reset();
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
                <h1 className="text-3xl font-bold">Quản lý sự kiện</h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý các sự kiện chạy bộ
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewEvent}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo sự kiện
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
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
                            <FormLabel>Tên sự kiện</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên sự kiện"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập mô tả sự kiện"
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
                                placeholder="Nhập nội dung chi tiết"
                                rows={4}
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
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày tổ chức</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Địa điểm</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập địa điểm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="maxParticipants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số lượng tối đa</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="100"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại sự kiện</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="MARATHON">
                                    Marathon
                                  </SelectItem>
                                  <SelectItem value="HALF_MARATHON">
                                    Half Marathon
                                  </SelectItem>
                                  <SelectItem value="FIVE_K">5K</SelectItem>
                                  <SelectItem value="TEN_K">10K</SelectItem>
                                  <SelectItem value="FUN_RUN">
                                    Fun Run
                                  </SelectItem>
                                  <SelectItem value="TRAIL_RUN">
                                    Trail Run
                                  </SelectItem>
                                  <SelectItem value="NIGHT_RUN">
                                    Night Run
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="distance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cự ly</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="5km"
                                  value={field.value || ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="registrationFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phí đăng ký (VND)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="registrationDeadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hạn đăng ký</FormLabel>
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
                        name="requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yêu cầu</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập yêu cầu (nếu có)"
                                rows={2}
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
                          name="organizer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tổ chức bởi</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập tên tổ chức"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="image"
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
                                        field.onChange(e.target.value); // Vẫn cập nhật giá trị của field
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
                                    {!imagePreview && editingEvent?.image && (
                                      <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-1">
                                          Hình ảnh hiện tại:
                                        </p>
                                        <img
                                          src={editingEvent.image}
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
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="published"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Đã xuất bản</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(value === "true")
                                  }
                                  value={field.value ? "true" : "false"}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="true">Có</SelectItem>
                                    <SelectItem value="false">Không</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nổi bật</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(value === "true")
                                  }
                                  value={field.value ? "true" : "false"}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="true">Có</SelectItem>
                                    <SelectItem value="false">Không</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
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
                                  <SelectItem value="UPCOMING">
                                    Sắp diễn ra
                                  </SelectItem>
                                  <SelectItem value="ONGOING">
                                    Đang diễn ra
                                  </SelectItem>
                                  <SelectItem value="COMPLETED">
                                    Đã kết thúc
                                  </SelectItem>
                                  <SelectItem value="CANCELLED">
                                    Đã hủy
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit">
                          {editingEvent ? "Cập nhật" : "Tạo sự kiện"}
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
                    placeholder="Tìm kiếm sự kiện..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Danh sách sự kiện ({filteredEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sự kiện</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tham gia</TableHead>
                      <TableHead>Ngày tổ chức</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {event.distance}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getCategoryColor(
                              event.category
                            )} text-white`}
                          >
                            {getCategoryText(event.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              event.status
                            )} text-white`}
                          >
                            {getStatusText(event.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.registeredParticipants || 0}/
                              {event.maxParticipants}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1 mt-1">
                            <div
                              className="bg-primary h-1 rounded-full"
                              style={{
                                width: `${
                                  ((event.registeredParticipants || 0) /
                                    event.maxParticipants) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                window.open(
                                  `/admin/events/${event.id}`,
                                  "_blank"
                                )
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(event.id)}
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
