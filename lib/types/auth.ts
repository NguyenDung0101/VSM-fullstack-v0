export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "editor" | "admin";
  createdAt: string;
  isActive: boolean;
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
  user: User;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
}