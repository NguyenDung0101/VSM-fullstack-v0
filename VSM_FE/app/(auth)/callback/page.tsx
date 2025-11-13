// frontend/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  handleGoogleCallback,
  handleEmailVerificationCallback,
} from "@/lib/supabase/auth";
import { useAuth } from "@/contexts/auth-context";

export default function AuthCallback() {
  const router = useRouter();
  const { handleGoogleCallbackResponse, handleEmailVerificationResponse } =
    useAuth();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Kiểm tra xem có phải là Google OAuth callback hay email verification callback
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");

        if (type === "recovery") {
          // Xử lý password recovery
          console.log("Password recovery callback");
          router.push("/login?message=Password recovery link sent");
          return;
        }

        // Thử xử lý email verification callback trước
        try {
          const response = await handleEmailVerificationCallback();

          if (response.accessToken) {
            await handleEmailVerificationResponse(response);
            return;
          }
        } catch (emailError) {
          console.log(
            "Not an email verification callback, trying Google callback..."
          );
        }

        // Nếu không phải email verification, thử Google callback
        try {
          const response = await handleGoogleCallback();

          if (response.accessToken) {
            await handleGoogleCallbackResponse(response);
            return;
          }
        } catch (googleError) {
          console.log("Not a Google callback either...");
        }

        // Nếu không phải cả hai, redirect về home
        router.push("/");
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/");
      }
    }

    handleCallback();
  }, [router, handleGoogleCallbackResponse, handleEmailVerificationResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-purple-500/20">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <span className="text-white font-bold text-2xl">VSM</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">Đang xử lý...</h2>
        <p className="text-muted-foreground">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
}
