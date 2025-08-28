"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, User, ShoppingCart, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { NAV_ITEMS } from "@/constants/route";

// này gọi là các item trong navbar dùng kiến thức nào: object array
// Mỗi item có href và label, href là đường dẫn, label là tên hiển tiết trên navbar
// Sử dụng usePathname để lấy đường dẫn hiện tại, từ đó xác định item
// const navItems = [
//   { href: "/", label: "Trang chủ" },
//   { href: "/about", label: "Giới thiệu" },
//   { href: "/events", label: "Sự kiện" },
// { href: "/shop", label: "Cửa hàng" },
//   { href: "/news", label: "Tin tức" },
//   { href: "/gallery", label: "Thư viện ảnh" },
//   { href: "/contact", label: "Liên hệ" },
// ];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // trạng thái mở/đóng của menu di động,
  const [isScrolled, setIsScrolled] = useState(false); // trạng thái scroll của navbar
  const pathname = usePathname(); // lấy đường dẫn hiện tại
  const { user, logout } = useAuth(); // lấy user và logout từ auth-context

  // DEBUG: Log user object
  // useEffect(() => {
  //   console.log("Current user:", user);
  //   console.log("User role:", user?.role);
  //   console.log("Is admin:", user?.role === "ADMIN");
  // }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // nếu scrollY lớn hơn 50 thì setIsScrolled là true, nếu không thì setIsScrolled là false
    };
    window.addEventListener("scroll", handleScroll); // thêm event listener để khi scroll thì gọi hàm handleScroll
    return () => window.removeEventListener("scroll", handleScroll); // xóa event listener khi component unmount
  }, []);

  const handleDashboardClick = () => {
    console.log("Dashboard clicked, user:", user);

    // Tạo URL với token và user info
    const adminUrl = new URL("https://vsm-fullstack-v0.vercel.app/admin");
    const token = localStorage.getItem("vsm_token");

    if (token) {
      adminUrl.searchParams.set("token", token);
    }

    if (user?.id) {
      adminUrl.searchParams.set("userId", user.id.toString());
    }

    console.log("Opening admin URL:", adminUrl.toString());
    window.open(adminUrl.toString(), "_blank");
  };

  // Kiểm tra user có phải admin không (flexible checking)
  const isAdmin =
    user &&
    (user.role === "admin" ||
      user.role === "ADMIN" ||
      (user as any).user_type === "ADMIN" ||
      (user as any).isAdmin === true);

  return (
    <motion.nav // đây là phần chính của Navbar, sử dụng motion.nav để có hiệu ứng chuyển động, motion là một phần của framer-motion
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`} // fixed để Navbar luôn ở trên cùng, z-50 để đảm bảo nó nằm trên các thành phần khác
      style={{
        backgroundColor: isScrolled
          ? "var(--nav-bg-scrolled-light)"
          : "var(--nav-bg-light)",
        borderBottomColor: isScrolled ? "var(--border-color)" : "transparent", // hiệu ứng khi scroll là có màu, khi không scroll là không màu
        backdropFilter: isScrolled ? "blur(10px)" : "none", // hiệu ứng khi scroll là có blur, khi không scroll là không blur, blur là hiệu ứng mờ
        boxShadow: isScrolled ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none", // hiệu ứng khi scroll là có box shadow, khi không scroll là không box shadow, box shadow là hiệu ứng bóng
      }}
      initial={{ opacity: 0, scale: 0.95 }} // Khởi tạo hiệu ứng khi Navbar xuất hiện
      animate={{ opacity: 1, scale: 1 }} // Hiệu ứng khi Navbar đang hoạt động
      transition={{ duration: 0.5, ease: "easeOut" }} // Thời gian và kiểu chuyển động
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/img/logo-vsm.png"
              alt="Logo"
              width={125}
              height={125}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center xl:space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-primary" // nếu đường dẫn hiện tại trùng với đường dẫn của item thì màu sắc là primary
                    : "text-muted-foreground" // nếu đường dẫn hiện tại không trùng với đường dẫn của item thì màu sắc là muted-foreground
                }`}
              >
                {item.label} {/* item.label là tên của item */}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {/* <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button> */}

            {user ? ( // nếu user có tài khoản thì hiện thị dropdown menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Tài khoản</Link>
                  </DropdownMenuItem>

                  {/* Debug info */}
                  <DropdownMenuItem disabled>
                    <span className="text-xs text-muted-foreground">
                      Role: {user.role || "undefined"}
                    </span>
                  </DropdownMenuItem>

                  {/* Hiển thị Dashboard - sử dụng isAdmin check linh hoạt */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDashboardClick}>
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)} // isOpen này nếu đang mở thì chức năng sẽ đóng, nếu đang đóng thì chức năng sẽ mở
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {" "}
          {/* AnimatePresence là một component của framer-motion, dùng để quản lý việc hiện thị và ẩn đi các thành phần */}
          {isOpen && ( // nếu isOpen là true thì hiện thị mobile navigation
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md rounded-lg mt-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Tài khoản
                      </Link>

                      {/* Dashboard cho mobile */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            handleDashboardClick();
                            setIsOpen(false);
                          }}
                          className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link
                        href="/login"
                        className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        className="block px-3 py-2 text-base font-medium text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
