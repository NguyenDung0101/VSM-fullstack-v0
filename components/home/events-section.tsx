"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NewsCard, NewsCardProps } from "@/components/NewsCard";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import newsApi, {
  BackendNews,
  News as FrontendNews,
  mapBackendNewsToFrontend,
} from "@/lib/api/news";

interface EventsSectionProps {
  events?: Event[];
  title?: string;
  title1?: string;
  description?: string;
  backgroundColor?: string;
  customClasses?: string;
}

export function EventsSection({
  title = "Sự kiện",
  title1 = "sắp tới",
  description = "Tham gia các sự kiện chạy bộ hấp dẫn được tổ chức bởi VSM.",
  backgroundColor = "bg-muted/20",
  customClasses = "",
}: EventsSectionProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [events, setEvents] = useState<NewsCardProps[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(
          "https://vsm-be-deploy.onrender.com/api/v1/events/"
        );
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const result = await res.json();

        const mappedEvents: NewsCardProps[] = result.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          excerpt: item.description,
          cover: item.imageEvent,
          category: item.category || "Sự kiện",
          categoryColor: "bg-purple-500", // Hoặc viết hàm getCategoryColor(item.category)
          author: item.author?.name || "VSM Team",
          date: item.date,
          views: item._count?.registrations || 0,
          featured: item.featured,
          variant: "featured",
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);

  const getCategoryText = (category: string) => {
    switch (category?.toLowerCase()) {
      case "training":
        return "Huấn luyện";
      case "nutrition":
        return "Dinh dưỡng";
      case "events":
        return "Sự kiện";
      case "tips":
        return "Mẹo hay";
      default:
        return category || "Khác";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : format(date, "dd/MM/yyyy", { locale: vi });
  };

  return (
    <section ref={ref} className={`py-20 ${backgroundColor} ${customClasses}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {title} <span className="gradient-text">{title1}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.length > 0 ? (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <NewsCard {...event} />
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-full">
              Chưa có sự kiện nào.
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/events">
              Xem tất cả sự kiện
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
