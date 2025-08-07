// Shared types for the VSM frontend application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "editor" | "admin";
  createdAt: string;
  isActive: boolean;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: string;
  authorId: string;
  date: string;
  category: "training" | "nutrition" | "events" | "tips";
  views: number;
  likes: number;
  featured: boolean;
  status: "published" | "draft";
  tags: string[];
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  status: "approved" | "pending" | "rejected";
  parentId?: string;
  replies?: Comment[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
  content: string;
  date: string;
  location: string;
  image: string;
  maxParticipants: number;
  currentParticipants: number;
  registeredUsers: string[];
  category:
    | "marathon"
    | "half-marathon"
    | "5k"
    | "10k"
    | "fun-run"
    | "trail-run"
    | "night-run";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  distance?: string;
  registrationFee?: number;
  requirements?: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  registrationDeadline?: string;
  organizer?: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: "apparel" | "accessories" | "nutrition" | "equipment";
  inStock: boolean;
  stock: number;
  featured: boolean;
  rating: number;
  reviews: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone: string;
  emergencyContact: string;
  medicalConditions?: string;
  experience: "beginner" | "intermediate" | "advanced";
  status: "pending" | "confirmed" | "waitlist" | "cancelled";
  registeredAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
// lib/types.ts
export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'ADMIN' | 'USER'; // Thêm role field
  user_type?: string; // Backup field nếu backend dùng user_type
  isAdmin?: boolean; // Backup field nếu backend dùng isAdmin
  avatar?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Extend để support multiple role formats
export interface AdminUser extends AuthUser {
  role: 'admin' | 'ADMIN';
}

// Helper function để check admin
export function isUserAdmin(user: AuthUser | null): user is AdminUser {
  if (!user) return false;
  
  return (
    user.role === 'admin' ||
    user.role === 'ADMIN' ||
    (user as any).user_type === 'admin' ||
    (user as any).isAdmin === true
  );
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// Query Parameters
export interface PostsQuery {
  category?: string;
  featured?: boolean;
  status?: string;
  limit?: number;
  page?: number;
}

export interface EventsQuery {
  category?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}

export interface ProductsQuery {
  category?: string;
  featured?: boolean;
  inStock?: boolean;
  limit?: number;
  page?: number;
}
