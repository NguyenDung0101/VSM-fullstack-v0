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
import { Calendar, MapPin, Users, Search } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
  category: "marathon" | "fun-run" | "trail-run";
  distance: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "VSM Marathon Hà Nội 2024",
        description:
          "Giải chạy marathon lớn nhất dành cho sinh viên tại Hà Nội với cung đường đẹp qua các địa danh nổi tiếng.",
        date: "2024-03-15",
        location: "Hồ Gươm, Hà Nội",
        participants: 1250,
        maxParticipants: 2000,
        image: "/placeholder.svg?height=300&width=400",
        status: "upcoming",
        category: "marathon",
        distance: "42.2km",
      },
      {
        id: "2",
        title: "VSM Fun Run TP.HCM",
        description:
          "Chạy vui cùng cộng đồng sinh viên Sài Gòn trong không khí thoải mái và năng động.",
        date: "2024-02-28",
        location: "Công viên Tao Đàn, TP.HCM",
        participants: 800,
        maxParticipants: 1000,
        image: "/placeholder.svg?height=300&width=400",
        status: "upcoming",
        category: "fun-run",
        distance: "5km",
      },
      {
        id: "3",
        title: "VSM Trail Run Đà Lạt",
        description:
          "Khám phá vẻ đẹp Đà Lạt qua từng bước chạy trên những con đường mòn thơ mộng.",
        date: "2024-04-20",
        location: "Đà Lạt, Lâm Đồng",
        participants: 300,
        maxParticipants: 500,
        image: "/placeholder.svg?height=300&width=400",
        status: "upcoming",
        category: "trail-run",
        distance: "15km",
      },
      {
        id: "4",
        title: "VSM Night Run Hải Phòng",
        description:
          "Chạy đêm độc đáo tại thành phố cảng với ánh đèn lung linh.",
        date: "2024-01-20",
        location: "Bờ sông Cấm, Hải Phòng",
        participants: 500,
        maxParticipants: 500,
        image: "/placeholder.svg?height=300&width=400",
        status: "completed",
        category: "fun-run",
        distance: "10km",
      },
      {
        id: "5",
        title: "VSM Night Run Hải Phòng",
        description:
          "Chạy đêm độc đáo tại thành phố cảng với ánh đèn lung linh.",
        date: "2024-01-20",
        location: "Bờ sông Cấm, Hải Phòng",
        participants: 500,
        maxParticipants: 500,
        image: "/placeholder.svg?height=300&width=400",
        status: "completed",
        category: "fun-run",
        distance: "10km",
      },
      {
        id: "6",
        title: "VSM Night Run Hải Phòng",
        description:
          "Chạy đêm độc đáo tại thành phố cảng với ánh đèn lung linh.",
        date: "2024-01-20",
        location: "Bờ sông Cấm, Hải Phòng",
        participants: 500,
        maxParticipants: 500,
        image: "/placeholder.svg?height=300&width=400",
        status: "completed",
        category: "fun-run",
        distance: "10km",
      },
    ];
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, categoryFilter]);

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
                    <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                    <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                    <SelectItem value="completed">Đã kết thúc</SelectItem>
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
                    <SelectItem value="marathon">Marathon</SelectItem>
                    <SelectItem value="fun-run">Fun Run</SelectItem>
                    <SelectItem value="trail-run">Trail Run</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  Không tìm thấy sự kiện nào.
                </p>
              </div>
            ) : (
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
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge variant="outline" className="bg-white/90">
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
                          {new Date(event.date).toLocaleDateString("vi-VN")}
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
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
