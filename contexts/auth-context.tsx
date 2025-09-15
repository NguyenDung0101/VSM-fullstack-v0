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
import { apiAuthClient } from "@/lib/routes/apiAuth";
import { AuthUser } from "@/lib/types";

// auth-context.tsx:
// - Tạo interface cho AuthContext Type chỉ định các phương thức và kiểu dữ liệu của AuthContext
// - hàm kiểm tra xem user có đăng nhập không
// - hàm đăng nhập
// - hàm đăng ký
// - hàm đăng xuất
// - hàm cập nhật thông tin cá nhân
// - hàm kiểm tra xem user có phải là admin không

// Temporary admin emails list - thay thế bằng database sau
const ADMIN_EMAILS = [
  "admin@vsm.com",
  "admin@example.com",
  // Thêm email admin của bạn vào đây
];

// interface cho AuthContext Type chỉ định các phương thức và kiểu dữ liệu của AuthContext
// Không dùng cho type bên ngoài, chỉ dùng cho type bên trong
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  registerWithSupabase: (
    email: string,
    password: string,
    name: string,
    newsletter?: boolean
  ) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  googleLogin: (accessToken: string) => Promise<void>;
  handleGoogleCallbackResponse: (response: any) => Promise<void>;
  handleEmailVerificationResponse: (response: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  isAdmin: boolean;
  linkRegisterSelf: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
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

  const isAdmin = checkIsAdmin(user); // kiểm tra xem user có phải là admin không

  useEffect(() => {
    checkAuth();
  }, []);

  // hàm kiểm tra xem user có đăng nhập không
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("vsm_token");
      if (token) {
        apiAuthClient.setToken(token);
        const userData = await apiAuthClient.getProfile();

        // Log để debug
        // console.log("Fetched user data:", userData);

        // Nếu backend không trả về role, set based on email
        if (!userData.role && ADMIN_EMAILS.includes(userData.email)) {
          userData.role = "admin";
        }

        setUser(userData);
        // console.log("User set with role:", userData.role);
      }
    } catch (error: any) {
      console.error("Auth check failed:", error);
      // Chỉ xóa token nếu lỗi 401
      if (error instanceof Error && error.message.includes("401")) {
        localStorage.removeItem("vsm_token");
        apiAuthClient.removeToken();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiAuthClient.login(email, password);

      // console.log("Login response:", response);
      if (!response.access_token) {
        throw new Error("Access token not found in response from /auth/login");
      }

      // Nếu backend không trả về role, set based on email
      if (!response.user.role && ADMIN_EMAILS.includes(response.user.email)) {
        response.user.role = "admin";
      }

      // Save token and user data
      localStorage.setItem("vsm_token", response.access_token);
      apiAuthClient.setToken(response.access_token);
      setUser(response.user);

      // console.log("User logged in with role:", response.user.role);

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
      const response = await apiAuthClient.register(name, email, password);

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
      apiAuthClient.setToken(response.access_token);
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

  // Hàm đăng ký với Supabase (gửi OTP)
  const registerWithSupabase = async (
    email: string,
    password: string,
    name: string,
    newsletter: boolean = false
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register-supabase`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name,
            newsletter,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng ký thất bại");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      throw new Error(message);
    }
  };

  // Hàm verify OTP
  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Xác thực OTP thất bại");
      }

      const data = await response.json();

      if (!data.accessToken) {
        throw new Error("Access token not found in response");
      }

      // Nếu backend không trả về role, set based on email
      if (!data.user.role && ADMIN_EMAILS.includes(data.user.email)) {
        data.user.role = "admin";
      }

      // Save token and user data
      localStorage.setItem("vsm_token", data.accessToken);
      apiAuthClient.setToken(data.accessToken);
      setUser(data.user);

      // Xóa email khỏi localStorage
      localStorage.removeItem("pending_verification_email");

      toast({
        title: "Xác thực thành công",
        description: `Chào mừng ${data.user.name}!`,
      });

      // Redirect to home
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Xác thực OTP thất bại";
      throw new Error(message);
    }
  };

  // Hàm gửi lại OTP
  const resendOTP = async (email: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gửi lại OTP thất bại");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gửi lại OTP thất bại";
      throw new Error(message);
    }
  };

  // Hàm xử lý response sau khi verify email
  const handleEmailVerificationResponse = async (response: any) => {
    try {
      // console.log("Handling email verification response:", response);

      if (!response.accessToken) {
        throw new Error("Access token not found in response");
      }

      // Nếu backend không trả về role, set based on email
      if (!response.user.role && ADMIN_EMAILS.includes(response.user.email)) {
        response.user.role = "admin";
      }

      // Save token and user data
      localStorage.setItem("vsm_token", response.accessToken);
      apiAuthClient.setToken(response.accessToken);
      setUser(response.user);

      // console.log("User logged in with role:", response.user.role);

      toast({
        title: "Xác thực email thành công",
        description: `Chào mừng ${response.user.name}!`,
      });

      // Redirect to home
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Xử lý xác thực email thất bại";
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

  const googleLogin = async (accessToken: string) => {
    try {
      const response = await apiAuthClient.googleLogin(accessToken);

      // console.log("Google login response:", response);
      if (!response.accessToken) {
        throw new Error(
          "Access token not found in response from /auth/google-login"
        );
      }

      // Nếu backend không trả về role, set based on email
      if (!response.user.role && ADMIN_EMAILS.includes(response.user.email)) {
        response.user.role = "admin";
      }

      // Save token and user data
      localStorage.setItem("vsm_token", response.accessToken);
      apiAuthClient.setToken(response.accessToken);
      setUser(response.user);

      // console.log("User logged in with role:", response.user.role);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${response.user.name}!`,
      });

      // Redirect to home
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng nhập Google thất bại";
      throw new Error(message);
    }
  };

  const handleGoogleCallbackResponse = async (response: any) => {
    try {
      // console.log("Handling Google callback response:", response);

      if (!response.accessToken) {
        throw new Error("Access token not found in response");
      }

      // Nếu backend không trả về role, set based on email
      if (!response.user.role && ADMIN_EMAILS.includes(response.user.email)) {
        response.user.role = "admin";
      }

      // Save token and user data
      localStorage.setItem("vsm_token", response.accessToken);
      apiAuthClient.setToken(response.accessToken);
      setUser(response.user);

      // console.log("User logged in with role:", response.user.role);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${response.user.name}!`,
      });

      // Redirect to home
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Xử lý Google callback thất bại";
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("vsm_token");
    localStorage.removeItem("pending_verification_email");
    apiAuthClient.removeToken();
    setUser(null);
    router.push("/");
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
  };

  // Link-based self registration: creates user and sends email verification link
  const linkRegisterSelf = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/self`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }
      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng kiểm tra email để xác minh tài khoản.",
      });
      // Lưu email để dùng khi quay lại từ link xác minh (nếu cần)
      localStorage.setItem("pending_verification_email", email);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        registerWithSupabase,
        verifyOTP,
        resendOTP,
        googleLogin,
        handleGoogleCallbackResponse,
        handleEmailVerificationResponse,
        logout,
        loading,
        updateProfile,
        isAdmin,
        linkRegisterSelf,
      }}
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
