"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { AuthUser } from "@/lib/types";

// Temporary admin emails list - thay thế bằng database sau
const ADMIN_EMAILS = [
  "admin@vsm.com",
  "admin@example.com",
  // Thêm email admin của bạn vào đây
];

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Helper function để check admin
  const checkIsAdmin = (userData: AuthUser | null): boolean => {
    if (!userData) return false;

    // Check role field
    if (userData.role === "admin" || userData.role === "ADMIN") {
      return true;
    }

    // Check user_type field
    if ((userData as any).user_type === "admin") {
      return true;
    }

    // Check isAdmin field
    if ((userData as any).isAdmin === true) {
      return true;
    }

    // Check email in admin list (temporary solution)
    if (ADMIN_EMAILS.includes(userData.email)) {
      return true;
    }

    return false;
  };

  const isAdmin = checkIsAdmin(user);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("vsm_token");
      if (token) {
        apiClient.setToken(token);
        const userData = await apiClient.getProfile();

        // Log để debug
        console.log("Fetched user data:", userData);

        // Nếu backend không trả về role, set based on email
        if (!userData.role && ADMIN_EMAILS.includes(userData.email)) {
          userData.role = "admin";
        }

        setUser(userData);
        console.log("User set with role:", userData.role);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Chỉ xóa token nếu lỗi 401
      if (error.message.includes("401")) {
        localStorage.removeItem("vsm_token");
        apiClient.removeToken();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);

      console.log("Login response:", response);
      if (!response.access_token) {
        throw new Error("Access token not found in response from /auth/login");
      }

      // Nếu backend không trả về role, set based on email
      if (!response.user.role && ADMIN_EMAILS.includes(response.user.email)) {
        response.user.role = "admin";
      }

      // Save token and user data
      localStorage.setItem("vsm_token", response.access_token);
      apiClient.setToken(response.access_token);
      setUser(response.user);

      console.log("User logged in with role:", response.user.role);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${response.user.name}!`,
      });

      // Redirect to home
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      throw new Error(message);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.register(name, email, password);

      if (!response.access_token) {
        throw new Error(
          "Access token not found in response from /auth/register"
        );
      }

      // Nếu backend không trả về role, set based on email
      if (!response.user.role && ADMIN_EMAILS.includes(response.user.email)) {
        response.user.role = "admin";
      }

      // Save token and user data
      localStorage.setItem("vsm_token", response.access_token);
      apiClient.setToken(response.access_token);
      setUser(response.user);

      toast({
        title: "Đăng ký thành công",
        description: `Chào mừng ${response.user.name} đến với VSM!`,
      });

      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      throw new Error(message);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      if (!user) throw new Error("Chưa đăng nhập");

      // Note: This would need to be implemented in the backend
      // For now, we'll just update the local state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
    } catch (error: any) {
      throw new Error(error.message || "Cập nhật thất bại");
    }
  };

  const logout = () => {
    localStorage.removeItem("vsm_token");
    apiClient.removeToken();
    setUser(null);
    router.push("/");
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, updateProfile, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
