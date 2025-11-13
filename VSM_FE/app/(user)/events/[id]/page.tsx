"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  UserPlus,
  CheckCircle,
  Info,
  Loader2,
  AlertCircle,
  DollarSign,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import eventsApi, { BackendEvent } from "@/lib/api/events";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<BackendEvent | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const eventId = params.id as string;
        if (!eventId) {
          throw new Error("ID sự kiện không hợp lệ");
        }

        const eventData = await eventsApi.getEvent(eventId);
        setEvent(eventData);

        // Check if user is already registered (if we have registration data)
        // This would need to be implemented based on your registration system
        setIsRegistered(false); // Placeholder logic
      } catch (err) {
        console.error("Failed to fetch event:", err);
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

    fetchEvent();
  }, [params.id, user, toast]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.name,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Đã sao chép",
        description: "Link sự kiện đã được sao chép vào clipboard!",
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
              Đang tải thông tin sự kiện...
            </span>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">
                Không tìm thấy sự kiện
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || "Sự kiện bạn tìm kiếm không tồn tại hoặc đã bị xóa."}
              </p>
              <div className="space-x-4">
                <Button variant="outline" onClick={handleRetry}>
                  Thử lại
                </Button>
                <Button asChild>
                  <Link href="/events">Về danh sách sự kiện</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, dd MMMM yyyy", { locale: vi });
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

  const eventDate = new Date(event.date);
  const isEventPast = eventDate < new Date();
  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const canRegister =
    !isEventPast &&
    !isEventFull &&
    !isRegistered &&
    event.status === "UPCOMING";

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

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button variant="ghost" className="mb-6" asChild>
                <Link href="/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại danh sách sự kiện
                </Link>
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Event Header */}
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-6">
                      <img
                        src={event.imageEvent || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-muted-foreground">
                            {getCategoryText(event.category)}
                          </span>
                          {event.featured && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                              Nổi bật
                            </span>
                          )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                          {event.name}
                        </h1>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatTime(event.date)}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      {event.distance && (
                        <div className="flex items-center text-muted-foreground">
                          <span className="text-sm">
                            Cự ly: {event.distance}
                          </span>
                        </div>
                      )}
                    </div>

                    {isEventPast && (
                      <div className="bg-muted p-4 rounded-lg mb-6">
                        <div className="flex items-center">
                          <Info className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-muted-foreground">
                            Sự kiện này đã kết thúc
                          </span>
                        </div>
                      </div>
                    )}

                    {event.status === "CANCELLED" && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                          <span className="text-red-800 font-medium">
                            Sự kiện này đã bị hủy
                          </span>
                        </div>
                      </div>
                    )}

                    {isRegistered && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">
                            Bạn đã đăng ký tham gia sự kiện này
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Về sự kiện</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="mb-4">{event.description}</p>

                        {event.content && (
                          <div
                            className="mt-4"
                            dangerouslySetInnerHTML={{ __html: event.content }}
                          />
                        )}

                        <h3 className="text-lg font-semibold mt-6 mb-3">
                          Thông tin chi tiết
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Thời gian tập trung: {formatTime(event.date)}</li>
                          <li>Địa điểm: {event.location}</li>
                          <li>
                            Số lượng tham gia tối đa: {event.maxParticipants}{" "}
                            người
                          </li>
                          <li>
                            Phí tham gia:{" "}
                            {event.registrationFee && event.registrationFee > 0
                              ? `${event.registrationFee.toLocaleString(
                                  "vi-VN"
                                )} VNĐ`
                              : "Miễn phí"}
                          </li>
                          {event.distance && <li>Cự ly: {event.distance}</li>}
                        </ul>

                        {event.requirements && (
                          <>
                            <h3 className="text-lg font-semibold mt-6 mb-3">
                              Yêu cầu tham gia
                            </h3>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: event.requirements,
                              }}
                            />
                          </>
                        )}

                        <h3 className="text-lg font-semibold mt-6 mb-3">
                          Lưu ý quan trọng
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          <li>
                            Người tham gia phải có trách nhiệm với sức khỏe của
                            bản thân
                          </li>
                          <li>
                            Ban tổ chức sẽ cung cấp nước uống và y tế cơ bản
                          </li>
                          <li>
                            Sự kiện có thể bị hoãn hoặc hủy do thời tiết xấu
                          </li>
                          {event.registrationDeadline && (
                            <li>
                              Hạn đăng ký:{" "}
                              {formatDate(event.registrationDeadline)}
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lịch trình sự kiện</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { time: "06:00", activity: "Tập trung, check-in" },
                          { time: "06:30", activity: "Khởi động tập thể" },
                          { time: "07:00", activity: "Xuất phát chính thức" },
                          { time: "09:00", activity: "Về đích, nghỉ ngơi" },
                          { time: "09:30", activity: "Trao giải và kết thúc" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4"
                          >
                            <div className="w-16 text-sm font-medium text-primary">
                              {item.time}
                            </div>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="flex-1">{item.activity}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Registration Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Đăng ký tham gia
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Đã đăng ký:
                        </span>
                        <span className="font-medium">
                          {event.currentParticipants}/{event.maxParticipants}
                        </span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (event.currentParticipants /
                                event.maxParticipants) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      {canRegister ? (
                        <Button className="w-full" asChild>
                          <Link href={`/events/${event.id}/register`}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Đăng ký ngay
                          </Link>
                        </Button>
                      ) : (
                        <Button className="w-full" disabled>
                          {isRegistered
                            ? "Đã đăng ký"
                            : isEventFull
                            ? "Đã đầy"
                            : isEventPast
                            ? "Đã kết thúc"
                            : event.status === "CANCELLED"
                            ? "Đã hủy"
                            : "Không thể đăng ký"}
                        </Button>
                      )}

                      {!user && (
                        <p className="text-sm text-muted-foreground text-center">
                          <Link
                            href="/login"
                            className="text-primary hover:underline"
                          >
                            Đăng nhập
                          </Link>{" "}
                          để đăng ký tham gia
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Event Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin sự kiện</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Ngày tổ chức:
                        </span>
                        <span className="text-sm font-medium">
                          {format(new Date(event.date), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Thời gian:
                        </span>
                        <span className="text-sm font-medium">
                          {formatTime(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Địa điểm:
                        </span>
                        <span className="text-sm font-medium">
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Phí tham gia:
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {event.registrationFee && event.registrationFee > 0
                            ? `${event.registrationFee.toLocaleString(
                                "vi-VN"
                              )} VNĐ`
                            : "Miễn phí"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Trạng thái:
                        </span>
                        <span className="text-sm font-medium">
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      {event.organizer && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Tổ chức bởi:
                          </span>
                          <span className="text-sm font-medium">
                            {event.organizer}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Liên hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Email:</p>
                        <p className="text-sm font-medium">events@vsm.org.vn</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Hotline:
                        </p>
                        <p className="text-sm font-medium">1900 1234</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Fanpage:
                        </p>
                        <p className="text-sm font-medium">
                          facebook.com/VSMVietnam
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
