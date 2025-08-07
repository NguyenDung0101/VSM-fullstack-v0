"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Download,
  Filter,
  Search,
  Mail,
  Phone,
  Edit,
  Eye,
  FileText,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Send,
  Printer,
  Share2,
  Star,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import eventsApi, { BackendEvent } from "@/lib/api/events";
import eventRegistrationsApi, {
  EventRegistration,
} from "@/lib/api/event-registrations";

export interface Author {
  id: string;
  name: string;
  email: string;
}

// Use the interface from event-registrations API
export type Registration = EventRegistration;

export interface EventCount {
  registrations: number;
}

export interface Event extends BackendEvent {
  registrations: Registration[];
  _count: EventCount;
}

export default function AdminEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const eventId = params.id as string;
        if (!eventId) {
          throw new Error("ID sự kiện không hợp lệ");
        }

        // Fetch event details
        const eventData = await eventsApi.getEvent(eventId);
        setEvent(eventData as Event);

        // Fetch registrations
        try {
          const registrationsData = await eventsApi.getEventRegistrations(
            eventId
          );
          setRegistrations(registrationsData || []);
        } catch (regError) {
          console.warn("Could not fetch registrations:", regError);
          setRegistrations([]);
        }
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Không thể tải thông tin sự kiện";
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

    fetchEventDetails();
  }, [params.id, toast]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: "Đã xác nhận",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
        };
      case "PENDING":
        return {
          label: "Chờ xác nhận",
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
        };
      case "WAITLIST":
        return {
          label: "Danh sách chờ",
          color: "bg-orange-500",
          textColor: "text-orange-700",
          bgColor: "bg-orange-50",
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
        };
      default:
        return {
          label: status,
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
        };
    }
  };

  const getExperienceText = (experience: string) => {
    switch (experience) {
      case "BEGINNER":
        return "Mới bắt đầu";
      case "INTERMEDIATE":
        return "Trung bình";
      case "ADVANCED":
        return "Nâng cao";
      default:
        return experience;
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return {
          label: "Đã thanh toán",
          color: "text-green-600",
          icon: CheckCircle,
        };
      case "pending":
        return {
          label: "Chờ thanh toán",
          color: "text-yellow-600",
          icon: Clock,
        };
      case "refunded":
        return {
          label: "Đã hoàn tiền",
          color: "text-blue-600",
          icon: ArrowLeft,
        };
      default:
        return { label: status, color: "text-gray-600", icon: AlertCircle };
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      searchTerm === "" ||
      reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      (reg.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    const matchesExperience =
      experienceFilter === "all" || reg.experience === experienceFilter;

    return matchesSearch && matchesStatus && matchesExperience;
  });

  const stats = {
    total: registrations.length,
    confirmed: registrations.filter((r) => r.status === "CONFIRMED").length,
    pending: registrations.filter((r) => r.status === "PENDING").length,
    waitlist: registrations.filter((r) => r.status === "WAITLIST").length,
    cancelled: registrations.filter((r) => r.status === "CANCELLED").length,
    paid: 0, // Placeholder - would need payment status from backend
    revenue:
      (event?.registrationFee || 0) *
      registrations.filter((r) => r.status === "CONFIRMED").length,
  };

  const handleExportRegistrations = () => {
    console.log("Exporting registrations...", filteredRegistrations);
    toast({
      title: "Xuất file",
      description: `Đang xuất ${filteredRegistrations.length} đăng ký ra file Excel...`,
    });
  };

  const handleUpdateRegistrationStatus = async (
    regId: string,
    newStatus: string
  ) => {
    try {
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === regId
            ? { ...reg, status: newStatus as Registration["status"] }
            : reg
        )
      );

      // Call API to update status
      if (event) {
        await eventsApi.updateRegistrationStatus(event.id, regId, newStatus);
        toast({
          title: "Cập nhật thành công",
          description: "Trạng thái đăng ký đã được cập nhật.",
        });
      }
    } catch (err) {
      console.error("Failed to update registration status:", err);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái đăng ký.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = (registration: Registration) => {
    console.log("Sending email to:", registration.email);
    toast({
      title: "Gửi email",
      description: `Đang gửi email tới ${registration.email}...`,
    });
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Loading state
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
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-xl text-muted-foreground">
                Đang tải thông tin sự kiện...
              </span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
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
            <div className="p-8">
              <div className="text-center py-16">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">
                  Không tìm thấy sự kiện
                </h1>
                <p className="text-muted-foreground mb-6">
                  {error ||
                    "Sự kiện bạn tìm kiếm không tồn tại hoặc đã bị xóa."}
                </p>
                <div className="space-x-4">
                  <Button variant="outline" onClick={handleRetry}>
                    Thử lại
                  </Button>
                  <Button onClick={() => router.push("/admin/events")}>
                    Về danh sách sự kiện
                  </Button>
                </div>
              </div>
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
          <div className="min-h-screen bg-background">
            <div className="border-b bg-card px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/admin/events")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Về danh sách
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">{event.name}</h1>
                    <p className="text-muted-foreground">
                      Quản lý thông tin và đăng ký sự kiện
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/events/${event.id}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      Xem công khai
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={
                            event.imageEvent ||
                            "/placeholder.svg?height=128&width=192"
                          }
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">
                              {event.name}
                            </h2>
                            <Badge
                              className={
                                event.status === "UPCOMING"
                                  ? "bg-blue-500"
                                  : event.status === "ONGOING"
                                  ? "bg-green-500"
                                  : event.status === "COMPLETED"
                                  ? "bg-gray-500"
                                  : "bg-red-500"
                              }
                              text-white
                            >
                              {event.status === "UPCOMING"
                                ? "Sắp diễn ra"
                                : event.status === "ONGOING"
                                ? "Đang diễn ra"
                                : event.status === "COMPLETED"
                                ? "Đã kết thúc"
                                : "Đã hủy"}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(event.date).toLocaleDateString("vi-VN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {new Date(event.date).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {event.registrationFee?.toLocaleString("vi-VN") ||
                              0}
                            đ
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Đã đăng ký
                          </p>
                          <p className="text-2xl font-bold">
                            {stats.confirmed + stats.pending}/
                            {event.maxParticipants}
                          </p>
                        </div>
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                ((stats.confirmed + stats.pending) /
                                  event.maxParticipants) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Doanh thu
                          </p>
                          <p className="text-2xl font-bold">
                            {stats.revenue.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Chờ xác nhận
                          </p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {stats.pending}
                          </p>
                        </div>
                        <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {stats.confirmed}
                    </p>
                    <p className="text-sm text-muted-foreground">Đã xác nhận</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pending}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Chờ xác nhận
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.waitlist}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Danh sách chờ
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {stats.cancelled}
                    </p>
                    <p className="text-sm text-muted-foreground">Đã hủy</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="registrations" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="registrations">
                    Đăng ký ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger value="analytics">Thống kê</TabsTrigger>
                  <TabsTrigger value="communications">Liên lạc</TabsTrigger>
                  <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                </TabsList>

                <TabsContent value="registrations">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <CardTitle>Danh sách đăng ký</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Tìm kiếm theo tên, email..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-full sm:w-64"
                            />
                          </div>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="WAITLIST">Danh sách chờ</option>
                            <option value="CANCELLED">Đã hủy</option>
                          </select>
                          <select
                            value={experienceFilter}
                            onChange={(e) =>
                              setExperienceFilter(e.target.value)
                            }
                            className="px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="all">Tất cả trình độ</option>
                            <option value="BEGINNER">Mới bắt đầu</option>
                            <option value="INTERMEDIATE">Trung bình</option>
                            <option value="ADVANCED">Nâng cao</option>
                          </select>
                          <Button onClick={handleExportRegistrations}>
                            <Download className="h-4 w-4 mr-2" />
                            Xuất Excel
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-medium">
                                Thông tin
                              </th>
                              <th className="text-left p-3 font-medium">
                                Liên hệ
                              </th>
                              <th className="text-left p-3 font-medium">
                                Trình độ
                              </th>
                              <th className="text-left p-3 font-medium">
                                Trạng thái
                              </th>
                              <th className="text-left p-3 font-medium">
                                Ngày ĐK
                              </th>
                              <th className="text-left p-3 font-medium">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRegistrations.map((registration) => {
                              const statusConfig = getStatusConfig(
                                registration.status
                              );

                              return (
                                <motion.tr
                                  key={registration.id}
                                  className="border-b hover:bg-muted/50 transition-colors"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <td className="p-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={`/placeholder.svg?height=32&width=32`}
                                        />
                                        <AvatarFallback>
                                          {registration.fullName.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">
                                          {registration.fullName}
                                        </p>
                                        {registration.user?.name && (
                                          <p className="text-xs text-muted-foreground">
                                            {registration.user.name}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Mail className="h-3 w-3 mr-1" />
                                        {registration.email}
                                      </div>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Phone className="h-3 w-3 mr-1" />
                                        {registration.phone}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <Badge variant="secondary">
                                      {getExperienceText(
                                        registration.experience
                                      )}
                                    </Badge>
                                  </td>
                                  <td className="p-3">
                                    <Badge
                                      className={`${statusConfig.color} text-white`}
                                    >
                                      {statusConfig.label}
                                    </Badge>
                                  </td>
                                  <td className="p-3 text-xs text-muted-foreground">
                                    {new Date(
                                      registration.registeredAt
                                    ).toLocaleDateString("vi-VN")}
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-1">
                                      <Dialog
                                        open={
                                          isRegistrationDialogOpen &&
                                          selectedRegistration?.id ===
                                            registration.id
                                        }
                                        onOpenChange={(open) => {
                                          setIsRegistrationDialogOpen(open);
                                          if (open)
                                            setSelectedRegistration(
                                              registration
                                            );
                                        }}
                                      >
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                          <DialogHeader>
                                            <DialogTitle>
                                              Chi tiết đăng ký -{" "}
                                              {registration.fullName}
                                            </DialogTitle>
                                          </DialogHeader>
                                          {selectedRegistration && (
                                            <div className="space-y-6">
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                  <label className="text-sm font-medium text-muted-foreground">
                                                    Họ tên
                                                  </label>
                                                  <p className="mt-1">
                                                    {
                                                      selectedRegistration.fullName
                                                    }
                                                  </p>
                                                </div>
                                                <div>
                                                  <label className="text-sm font-medium text-muted-foreground">
                                                    Email
                                                  </label>
                                                  <p className="mt-1">
                                                    {selectedRegistration.email}
                                                  </p>
                                                </div>
                                                <div>
                                                  <label className="text-sm font-medium text-muted-foreground">
                                                    Điện thoại
                                                  </label>
                                                  <p className="mt-1">
                                                    {selectedRegistration.phone}
                                                  </p>
                                                </div>
                                                <div>
                                                  <label className="text-sm font-medium text-muted-foreground">
                                                    Liên hệ khẩn cấp
                                                  </label>
                                                  <p className="mt-1">
                                                    {
                                                      selectedRegistration.emergencyContact
                                                    }
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="space-y-4">
                                                <div>
                                                  <label className="text-sm font-medium text-muted-foreground">
                                                    Tình trạng sức khỏe
                                                  </label>
                                                  <p className="mt-1">
                                                    {selectedRegistration.medicalConditions ||
                                                      "Không có"}
                                                  </p>
                                                </div>
                                                <div>
                                                  <label className="text-sm font-medium text-muted-foreground">
                                                    Trình độ
                                                  </label>
                                                  <p className="mt-1">
                                                    {getExperienceText(
                                                      selectedRegistration.experience
                                                    )}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex flex-wrap gap-3 pt-4 border-t">
                                                <select
                                                  value={
                                                    selectedRegistration.status
                                                  }
                                                  onChange={(e) => {
                                                    handleUpdateRegistrationStatus(
                                                      selectedRegistration.id,
                                                      e.target.value
                                                    );
                                                    setSelectedRegistration({
                                                      ...selectedRegistration,
                                                      status: e.target
                                                        .value as Registration["status"],
                                                    });
                                                  }}
                                                  className="px-3 py-2 border rounded-md text-sm"
                                                >
                                                  <option value="PENDING">
                                                    Chờ xác nhận
                                                  </option>
                                                  <option value="CONFIRMED">
                                                    Đã xác nhận
                                                  </option>
                                                  <option value="WAITLIST">
                                                    Danh sách chờ
                                                  </option>
                                                  <option value="CANCELLED">
                                                    Đã hủy
                                                  </option>
                                                </select>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    handleSendEmail(
                                                      selectedRegistration
                                                    )
                                                  }
                                                >
                                                  <Send className="h-4 w-4 mr-2" />
                                                  Gửi email
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </DialogContent>
                                      </Dialog>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleSendEmail(registration)
                                        }
                                      >
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {filteredRegistrations.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              Không có đăng ký nào.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Biểu đồ đăng ký theo thời gian</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                            <p>Biểu đồ sẽ hiển thị ở đây</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Phân bố theo trình độ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Mới bắt đầu</span>
                            <span className="font-medium">
                              {
                                registrations.filter(
                                  (r) => r.experience === "BEGINNER"
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Trung bình</span>
                            <span className="font-medium">
                              {
                                registrations.filter(
                                  (r) => r.experience === "INTERMEDIATE"
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Nâng cao</span>
                            <span className="font-medium">
                              {
                                registrations.filter(
                                  (r) => r.experience === "ADVANCED"
                                ).length
                              }
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="communications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gửi thông báo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Send className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Sắp ra mắt</h3>
                        <p className="text-muted-foreground">
                          Tính năng gửi email hàng loạt đang được phát triển
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cài đặt sự kiện</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">
                          Cài đặt nâng cao
                        </h3>
                        <p className="text-muted-foreground">
                          Các tùy chọn cài đặt sự kiện sẽ có ở đây
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
