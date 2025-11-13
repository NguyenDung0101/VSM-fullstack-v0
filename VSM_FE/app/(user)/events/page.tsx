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
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import eventsApi, {
  BackendEvent,
  Event as FrontendEvent,
  mapBackendEventToFrontend,
} from "@/lib/api/events";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function EventsPage() {
  const [events, setEvents] = useState<FrontendEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<FrontendEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  const fetchEvents = async (
    page: number = 1,
    search?: string,
    status?: string,
    category?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: any = {
        limit: pagination.limit,
        page: page,
      };

      if (search) filters.search = search;
      if (status && status !== "all") filters.status = status;
      if (category && category !== "all") filters.category = category;

      console.log("Fetching events with filters:", filters);
      const response = await eventsApi.getEvents(filters);
      console.log("API response:", response);

      // Validate response data
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      const mappedEvents = response.data.map(mapBackendEventToFrontend);
      console.log("Mapped events:", mappedEvents);

      // Append new events to existing list if not on first page
      setEvents((prevEvents) =>
        page === 1 ? mappedEvents : [...prevEvents, ...mappedEvents]
      );
      setFilteredEvents((prevEvents) =>
        page === 1 ? mappedEvents : [...prevEvents, ...mappedEvents]
      );
      setPagination((prev) => ({
        ...response.pagination,
        page, // Ensure the current page is updated
      }));

      console.log("Updated events:", events);
      console.log("Updated filteredEvents:", filteredEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Không thể tải dữ liệu sự kiện. Vui lòng thử lại sau.";
      setError(errorMessage);

      // Fallback to empty arrays on error
      if (page === 1) {
        setEvents([]);
        setFilteredEvents([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Debounce search and filters to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchEvents(1, searchTerm, statusFilter, categoryFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, categoryFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-500";
      case "ongoing":
        return "bg-yellow-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "marathon":
        return "Marathon";
      case "fun-run":
        return "Fun Run";
      case "trail-run":
        return "Trail Run";
      default:
        return category;
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
    if (pagination.page < pagination.totalPages && !isLoading) {
      fetchEvents(
        pagination.page + 1,
        searchTerm,
        statusFilter,
        categoryFilter
      );
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchEvents(1, searchTerm, statusFilter, categoryFilter);
  };

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
                Sự kiện <span className="gradient-text">VSM</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tham gia các sự kiện chạy bộ hấp dẫn được tổ chức bởi VSM. Cùng
                nhau tạo nên những kỷ niệm đáng nhớ!
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
                  placeholder="Tìm kiếm sự kiện..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="UPCOMING">Sắp diễn ra</SelectItem>
                    <SelectItem value="ONGOING">Đang diễn ra</SelectItem>
                    <SelectItem value="COMPLETED">Đã kết thúc</SelectItem>
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
                    <SelectItem value="HALF_MARATHON">Half Marathon</SelectItem>
                    <SelectItem value="FIVE_K">5K</SelectItem>
                    <SelectItem value="TEN_K">10K</SelectItem>
                    <SelectItem value="FUN_RUN">Fun Run</SelectItem>
                    <SelectItem value="TRAIL_RUN">Trail Run</SelectItem>
                    <SelectItem value="NIGHT_RUN">Night Run</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Loading State */}
            {isLoading && events.length === 0 && (
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

            {/* Empty State */}
            {!error && !isLoading && filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  Không tìm thấy sự kiện nào.
                </p>
                {(searchTerm ||
                  statusFilter !== "all" ||
                  categoryFilter !== "all") && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Thử thay đổi bộ lọc để xem thêm kết quả.
                  </p>
                )}
              </div>
            )}

            {/* Events Grid */}
            {!error && !isLoading && filteredEvents.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                        <div className="relative overflow-hidden">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <Badge
                              className={`${getStatusColor(
                                event.status
                              )} text-white`}
                            >
                              {getStatusText(event.status)}
                            </Badge>
                            <Badge variant="secondary">
                              {getCategoryText(event.category)}
                            </Badge>
                            {event.featured && (
                              <Badge variant="destructive">Nổi bật</Badge>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <Badge
                              variant="outline"
                              className="bg-white/90 text-black"
                            >
                              {event.distance}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {event.title}
                          </CardTitle>
                          <p className="text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(event.date)}
                          </div>

                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>

                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {event.participants}/{event.maxParticipants} người
                            tham gia
                          </div>

                          {event.registrationFee &&
                            event.registrationFee > 0 && (
                              <div className="text-sm text-muted-foreground">
                                Phí tham gia:{" "}
                                {event.registrationFee.toLocaleString("vi-VN")}{" "}
                                VNĐ
                              </div>
                            )}

                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (event.participants / event.maxParticipants) *
                                  100
                                }%`,
                              }}
                            />
                          </div>

                          <Button className="w-full" asChild>
                            <Link href={`/events/${event.id}`}>
                              {event.status === "upcoming"
                                ? "Đăng ký tham gia"
                                : "Xem chi tiết"}
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
                        "Tải thêm sự kiện"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
