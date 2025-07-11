import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VSM Admin - Vietnam Student Marathon CMS",
  description:
    "Hệ thống quản lý nội dung cho Vietnam Student Marathon - Content Management System",
  generator: "VSM Admin Frontend",
  applicationName: "VSM Admin Frontend",
  keywords: [
    "VSM",
    "Vietnam Student Marathon",
    "admin",
    "CMS",
    "content management",
    "quản lý nội dung",
    "hệ thống quản trị",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
