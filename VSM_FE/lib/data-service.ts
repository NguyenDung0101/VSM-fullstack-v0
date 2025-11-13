/**
 * Data Service Layer
 * Central place for all API interactions and data management
 */

import { apiClient } from "@/lib/api";
import {
  Post,
  Event,
  Product,
  User,
  Comment,
  EventRegistration,
  PostsQuery,
  EventsQuery,
  ProductsQuery,
} from "@/lib/types";

export class DataService {
  // Posts
  static async getPosts(query?: PostsQuery) {
    try {
      return await apiClient.getPosts(query);
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  static async getPost(id: string) {
    try {
      return await apiClient.getPost(id);
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  }

  static async getFeaturedPosts(limit: number = 3) {
    return this.getPosts({ featured: true, limit });
  }

  static async getPostsByCategory(category: string, limit?: number) {
    return this.getPosts({ category, limit });
  }

  // Events
  static async getEvents(query?: EventsQuery) {
    try {
      return await apiClient.getEvents(query);
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  static async getEvent(id: string) {
    try {
      return await apiClient.getEvent(id);
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  }

  static async getFeaturedEvents(limit: number = 3) {
    return this.getEvents({ featured: true, limit });
  }

  static async getUpcomingEvents(limit?: number) {
    return this.getEvents({ status: "upcoming", limit });
  }

  static async registerForEvent(eventId: string, registrationData: any) {
    try {
      return await apiClient.registerForEvent(eventId, registrationData);
    } catch (error) {
      console.error(`Error registering for event ${eventId}:`, error);
      throw error;
    }
  }

  // Products
  static async getProducts(query?: ProductsQuery) {
    try {
      return await apiClient.getProducts(query);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getProduct(id: string) {
    try {
      return await apiClient.getProduct(id);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  static async getFeaturedProducts(limit: number = 6) {
    return this.getProducts({ featured: true, limit });
  }

  static async getProductsByCategory(category: string, limit?: number) {
    return this.getProducts({ category, limit });
  }

  // Comments
  static async getPostComments(postId: string) {
    try {
      return await apiClient.getPostComments(postId);
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }

  static async createComment(postId: string, content: string) {
    try {
      return await apiClient.createComment(postId, content);
    } catch (error) {
      console.error(`Error creating comment for post ${postId}:`, error);
      throw error;
    }
  }

  // Users
  static async getUsers() {
    try {
      return await apiClient.getUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  static async getUser(id: string) {
    try {
      return await apiClient.getUser(id);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  // Auth
  static async login(email: string, password: string) {
    try {
      return await apiClient.login(email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  static async register(name: string, email: string, password: string) {
    try {
      return await apiClient.register(name, email, password);
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  }

  static async getProfile() {
    try {
      return await apiClient.getProfile();
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  // Utils
  static formatDate(dateString: string) {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  }

  static formatDateTime(dateString: string) {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  }

  static formatPrice(price: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  static getCategoryText(category: string, type: "post" | "event" | "product") {
    switch (type) {
      case "post":
        switch (category) {
          case "training":
            return "Huấn luyện";
          case "nutrition":
            return "Dinh dưỡng";
          case "events":
            return "Sự kiện";
          case "tips":
            return "Mẹo hay";
          default:
            return category;
        }
      case "event":
        switch (category) {
          case "marathon":
            return "Marathon";
          case "half-marathon":
            return "Half Marathon";
          case "5k":
            return "5K";
          case "10k":
            return "10K";
          case "fun-run":
            return "Fun Run";
          case "trail-run":
            return "Trail Run";
          case "night-run":
            return "Night Run";
          default:
            return category;
        }
      case "product":
        switch (category) {
          case "apparel":
            return "Trang phục";
          case "accessories":
            return "Phụ kiện";
          case "equipment":
            return "Thiết bị";
          case "nutrition":
            return "Dinh dưỡng";
          default:
            return category;
        }
      default:
        return category;
    }
  }

  static getStatusText(
    status: string,
    type: "event" | "comment" | "registration",
  ) {
    switch (type) {
      case "event":
        switch (status) {
          case "upcoming":
            return "Sắp diễn ra";
          case "ongoing":
            return "Đang diễn ra";
          case "completed":
            return "Đã kết thúc";
          case "cancelled":
            return "Đã hủy";
          default:
            return status;
        }
      case "comment":
        switch (status) {
          case "approved":
            return "Đã duyệt";
          case "pending":
            return "Chờ duyệt";
          case "rejected":
            return "Đã từ chối";
          default:
            return status;
        }
      case "registration":
        switch (status) {
          case "pending":
            return "Chờ xác nhận";
          case "confirmed":
            return "Đã xác nhận";
          case "waitlist":
            return "Danh sách chờ";
          case "cancelled":
            return "Đã hủy";
          default:
            return status;
        }
      default:
        return status;
    }
  }
}

export default DataService;
