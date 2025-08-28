// constants/route.ts
import {
  LayoutDashboard,
  Calendar,
  FileText,
  ShoppingBag,
  Users,
  Upload,
  House,
  Layout,
} from "lucide-react";

// ====================
// NAVIGATION ITEMS
// ====================

// đây là interface của NavItem, dùng để định nghĩa các thuộc tính của NavItem
export interface NavItem { 
  href: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/events", label: "Sự kiện" },
  { href: "/news", label: "Tin tức" },
  { href: "/gallery", label: "Thư viện ảnh" },
  { href: "/contact", label: "Liên hệ" },
  // { href: "/shop", label: "Cửa hàng" },
];

// ====================
// ADMIN MENU ITEMS
// ====================
export interface AdminMenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  { href: "/admin", label: "Thống kê", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Quản lý trang chủ", icon: Layout },
  { href: "/admin/events", label: "Quản lý sự kiện", icon: Calendar },
  { href: "/admin/news", label: "Quản lý bài viết", icon: FileText },
  { href: "/admin/products", label: "Quản lý sản phẩm", icon: ShoppingBag },
  { href: "/admin/users", label: "Quản lý người dùng", icon: Users },
  { href: "/admin/uploads", label: "Quản lý thư viện", icon: Upload },
  { href: "/", label: "Về trang chủ", icon: House },
  // { href: "/admin/contacts", label: "Quản lý thư liên hệ", icon: Upload },
  // { href: "/admin/messages", label: "Quản lý tin nhắn", icon: MessageCircle },
  // { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];
