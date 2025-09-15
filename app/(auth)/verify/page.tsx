"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const verifySchema = z.object({
  otp: z
    .string()
    .min(6, "Mã OTP phải có 6 chữ số")
    .max(6, "Mã OTP phải có 6 chữ số")
    .regex(/^\d{6}$/, "Mã OTP chỉ được chứa số"),
});

type VerifyForm = z.infer<typeof verifySchema>;

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const { verifyOTP, resendOTP } = useAuth();
  const { toast } = useToast();

  const form = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    // Lấy email từ localStorage hoặc URL params
    const savedEmail = localStorage.getItem("pending_verification_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // Nếu không có email, redirect về register
      window.location.href = "/register";
    }

    // Bắt đầu countdown 60 giây
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: VerifyForm) => {
    setIsLoading(true);
    try {
      await verifyOTP(email, data.otp);
      toast({
        title: "Xác thực thành công",
        description: "Chào mừng bạn đến với VSM!",
      });
      // Redirect sẽ được xử lý trong auth-context
    } catch (error: any) {
      toast({
        title: "Xác thực thất bại",
        description: error.message || "Mã OTP không đúng, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await resendOTP(email);
      toast({
        title: "Gửi lại mã OTP",
        description: "Mã OTP mới đã được gửi đến email của bạn",
      });
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Gửi lại mã OTP thất bại",
        description: error.message || "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-purple-500/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/register">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng ký
            </Link>
          </Button>
        </div>

        <Card className="glass backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Xác thực Email</CardTitle>
            <CardDescription>
              Nhập mã OTP đã được gửi đến {email}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã OTP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập 6 chữ số"
                          className="text-center text-2xl tracking-widest"
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground text-center">
                        Mã OTP có hiệu lực trong 10 phút
                      </p>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang xác thực..." : "Xác thực"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Không nhận được mã OTP?
              </p>

              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi lại...
                  </>
                ) : countdown > 0 ? (
                  `Gửi lại sau ${countdown}s`
                ) : (
                  "Gửi lại mã OTP"
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
