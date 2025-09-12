// frontend/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleGoogleCallback } from "@/lib/supabase/auth";
import { useAuth } from "@/contexts/auth-context";

export default function AuthCallback() {
  const router = useRouter();
  const { handleGoogleCallbackResponse } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Gọi hàm handleGoogleCallback để xử lý callback từ Google
        const response = await handleGoogleCallback();

        // console.log("Backend response:", response);

        if (response.accessToken) {
          // Sử dụng AuthContext để xử lý response từ backend
          await handleGoogleCallbackResponse(response);
        } else {
          throw new Error("No access token received from backend");
        }
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/");
      }
    }
    handleCallback();
  }, [router, handleGoogleCallbackResponse]);

  return <div>Loading...</div>;
}
