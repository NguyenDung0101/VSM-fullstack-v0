"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  cover?: string;
  category: string;
  categoryColor: string;
  author: string;
  date: string;
  views: number;
  featured?: boolean;
  variant?: "featured" | "regular";
}

export function NewsCard({
  id,
  title,
  excerpt,
  cover,
  category,
  categoryColor,
  author,
  date,
  views,
  featured = false,
  variant = "regular",
}: NewsCardProps) {
  const imageHeight = variant === "featured" ? "h-64" : "h-48";

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={cover || "/placeholder.svg"}
          alt={title}
          className={`w-full ${imageHeight} object-cover group-hover:scale-105 transition-transform duration-300`}
        />
        <Badge className={`absolute top-4 left-4 ${categoryColor} text-white`}>
          {category}
        </Badge>
        {featured && (
          <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
            Nổi bật
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle
          className={`group-hover:text-primary transition-colors ${
            variant === "regular" ? "line-clamp-2" : "text-xl"
          }`}
        >
          {title}
        </CardTitle>
        <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {author}
            </div>
            {variant === "featured" && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {date}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {views.toLocaleString()}
          </div>
        </div>

        {variant === "regular" && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {date}
          </div>
        )}

        <Button
          className="w-full"
          asChild
          variant={variant === "featured" ? "default" : "outline"}
        >
          <Link href={`/news/${id}`}>
            Đọc tiếp
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
