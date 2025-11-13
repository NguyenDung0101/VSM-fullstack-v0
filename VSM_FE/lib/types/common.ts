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

// Query interfaces
export interface PostsQuery {
  category?: string;
  featured?: boolean;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface EventsQuery {
  status?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface ProductsQuery {
  category?: string;
  featured?: boolean;
  inStock?: boolean;
  limit?: number;
  offset?: number;
}