// frontend/lib/supabase/auth.ts
import { createClient } from './client';
const supabase = createClient();

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/callback` },
  });
  if (error) throw error;
}

export async function handleGoogleLogin() {
  try {
    console.log('Bắt đầu Google login...');
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      console.error('Lỗi Supabase OAuth:', error.message);
      throw error;
    }
    console.log('OAuth thành công, đang redirect...');
  } catch (err) {
    console.error('Lỗi handleGoogleLogin:', err);
    throw err;
  }
}

export async function handleGoogleCallback() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) throw new Error('Không lấy được session.');

  // Gửi access_token đến backend
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: session.access_token }),
  });

  if (!response.ok) throw new Error('Lỗi khi gọi backend');
  return response.json();
}