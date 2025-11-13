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
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Clock,
  DollarSign,
  BarChart3,
  Filter,
  Download,
  MoreVertical,
  Star,
  Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import eventsApi, {
  BackendEvent,
  CreateEventDto,
  UpdateEventDto,
} from "@/lib/api/events";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Schema for form validation
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
  distance: z.string().optional(),
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

interface Event extends BackendEvent {
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

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

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Fetch events with improved error handling
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await eventsApi.getAdminEvents({
        limit: 50,
      });

      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải danh sách sự kiện";
      setError(errorMessage);
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || event.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, categoryFilter]);

  // Helper functions
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: vi });
    } catch {
      return "";
    }
  };

  // Submit form handler
  const onSubmit = async (data: EventForm) => {
    try {
      setIsSubmitting(true);

      const eventData: CreateEventDto = {
        name: data.name,
        description: data.description,
        content: data.content,
        date: data.date,
        location: data.location,
        maxParticipants: Number(data.maxParticipants),
        category: data.category,
        status: data.status,
        distance: data.distance,
        registrationFee: data.registrationFee,
        requirements: data.requirements,
        published: data.published,
        featured: data.featured,
        registrationDeadline: data.registrationDeadline,
        organizer: data.organizer,
      };

      if (editingEvent) {
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
      console.error("Error submitting event:", error);
      toast({
        title: "Có lỗi xảy ra",
        description:
          error instanceof Error ? error.message : "Vui lòng thử lại sau",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      name: event.name,
      description: event.description,
      content: event.content || "",
      date: new Date(event.date).toISOString().split("T")[0] || "",
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
      image: event.imageEvent || "",
      status: event.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    try {
      await eventsApi.deleteEvent(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
      toast({
        title: "Xóa thành công",
        description: "Sự kiện đã được xóa.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể xóa sự kiện",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchEvents();
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setSelectedImage(null);
    setImagePreview("");
    form.reset();
    setIsDialogOpen(true);
  };

  // Calculate statistics
  const stats = {
    total: events.length,
    upcoming: events.filter((e) => e.status === "UPCOMING").length,
    ongoing: events.filter((e) => e.status === "ONGOING").length,
    completed: events.filter((e) => e.status === "COMPLETED").length,
    cancelled: events.filter((e) => e.status === "CANCELLED").length,
    totalParticipants: events.reduce(
      (sum, event) => sum + (event.currentParticipants || 0),
      0
    ),
    revenue: events.reduce(
      (sum, event) =>
        sum + (event.registrationFee || 0) * (event.currentParticipants || 0),
      0
    ),
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
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Quản lý sự kiện</h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý các sự kiện chạy bộ
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setViewMode(viewMode === "table" ? "grid" : "table")
                  }
                >
                  {viewMode === "table" ? (
                    <BarChart3 className="h-4 w-4 mr-2" />
                  ) : (
                    <Activity className="h-4 w-4 mr-2" />
                  )}
                  {viewMode === "table" ? "Xem dạng lưới" : "Xem dạng bảng"}
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleNewEvent}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tạo sự kiện
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Địa điểm</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập địa điểm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ngày tổ chức</FormLabel>
                                <FormControl>
                                  <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            name="registrationDeadline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hạn đăng ký</FormLabel>
                                <FormControl>
                                  <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hình ảnh sự kiện</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      handleImageChange(e);
                                      field.onChange(e.target.value);
                                    }}
                                  />
                                  {imagePreview && (
                                    <div className="mt-4">
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Xem trước:
                                      </p>
                                      <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-w-md h-48 object-cover rounded-md border"
                                      />
                                    </div>
                                  )}
                                  {!imagePreview &&
                                    editingEvent?.imageEvent && (
                                      <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-2">
                                          Hình ảnh hiện tại:
                                        </p>
                                        <img
                                          src={editingEvent.imageEvent}
                                          alt="Current"
                                          className="w-full max-w-md h-48 object-cover rounded-md border"
                                        />
                                      </div>
                                    )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center space-x-6">
                          <FormField
                            control={form.control}
                            name="published"
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
                                  Xuất bản
                                </FormLabel>
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
                                <FormLabel className="!mt-0">Nổi bật</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>

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
                                {editingEvent
                                  ? "Đang cập nhật..."
                                  : "Đang tạo..."}
                              </>
                            ) : editingEvent ? (
                              "Cập nhật"
                            ) : (
                              "Tạo sự kiện"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tổng sự kiện
                      </p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Sắp diễn ra
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.upcoming}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tổng người tham gia
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.totalParticipants}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Doanh thu</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.revenue.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm sự kiện..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="UPCOMING">Sắp diễn ra</SelectItem>
                        <SelectItem value="ONGOING">Đang diễn ra</SelectItem>
                        <SelectItem value="COMPLETED">Đã kết thúc</SelectItem>
                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Loại sự kiện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="MARATHON">Marathon</SelectItem>
                        <SelectItem value="HALF_MARATHON">
                          Half Marathon
                        </SelectItem>
                        <SelectItem value="FIVE_K">5K</SelectItem>
                        <SelectItem value="TEN_K">10K</SelectItem>
                        <SelectItem value="FUN_RUN">Fun Run</SelectItem>
                        <SelectItem value="TRAIL_RUN">Trail Run</SelectItem>
                        <SelectItem value="NIGHT_RUN">Night Run</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Xuất báo cáo
                    </Button>
                  </div>
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

            {/* Events Display */}
            {!isLoading && !error && (
              <>
                {viewMode === "table" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Danh sách sự kiện ({filteredEvents.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Sự kiện</TableHead>
                              <TableHead>Loại</TableHead>
                              <TableHead>Trạng thái</TableHead>
                              <TableHead>Tham gia</TableHead>
                              <TableHead>Ngày & Giờ</TableHead>
                              <TableHead>Doanh thu</TableHead>
                              <TableHead>Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredEvents.map((event) => (
                              <TableRow key={event.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                      {event.imageEvent ? (
                                        <img
                                          src={event.imageEvent}
                                          alt={event.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <ImageIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {event.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {event.location}
                                      </div>
                                      {event.distance && (
                                        <div className="text-sm text-muted-foreground">
                                          {event.distance}
                                        </div>
                                      )}
                                      {event.featured && (
                                        <Badge
                                          variant="secondary"
                                          className="mt-1"
                                        >
                                          <Star className="h-3 w-3 mr-1" />
                                          Nổi bật
                                        </Badge>
                                      )}
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
                                      {event.currentParticipants || 0}/
                                      {event.maxParticipants}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-1 mt-1">
                                    <div
                                      className="bg-primary h-1 rounded-full"
                                      style={{
                                        width: `${
                                          ((event.currentParticipants || 0) /
                                            event.maxParticipants) *
                                          100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(event.date)}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTime(event.date)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm font-medium">
                                    {(
                                      (event.registrationFee || 0) *
                                      (event.currentParticipants || 0)
                                    ).toLocaleString("vi-VN")}
                                    đ
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {event.registrationFee?.toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ/người
                                  </div>
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
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-video relative">
                          {event.imageEvent ? (
                            <img
                              src={event.imageEvent}
                              alt={event.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge
                              className={`${getStatusColor(
                                event.status
                              )} text-white`}
                            >
                              {getStatusText(event.status)}
                            </Badge>
                            {event.featured && (
                              <Badge variant="secondary">
                                <Star className="h-3 w-3 mr-1" />
                                Nổi bật
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {event.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {event.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge
                                className={`${getCategoryColor(
                                  event.category
                                )} text-white`}
                              >
                                {getCategoryText(event.category)}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {event.distance}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2" />
                                {formatDate(event.date)} -{" "}
                                {formatTime(event.date)}
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2" />
                                {event.location}
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="h-4 w-4 mr-2" />
                                {event.currentParticipants || 0}/
                                {event.maxParticipants} người
                              </div>
                              {event.registrationFee &&
                                event.registrationFee > 0 && (
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    {event.registrationFee.toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ
                                  </div>
                                )}
                            </div>

                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${
                                    ((event.currentParticipants || 0) /
                                      event.maxParticipants) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="text-sm font-medium">
                                {(
                                  (event.registrationFee || 0) *
                                  (event.currentParticipants || 0)
                                ).toLocaleString("vi-VN")}
                                đ doanh thu
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
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
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(event.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">
                      Không tìm thấy sự kiện nào.
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
