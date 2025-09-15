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

// Hàm đăng ký với Supabase Auth
export async function signUpWithSupabase(email: string, password: string, name: string, newsletter: boolean = false) {
  try {
    console.log('Bắt đầu đăng ký với Supabase...');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          newsletter: newsletter,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Lỗi Supabase signUp:', error.message);
      throw error;
    }

    console.log('Đăng ký thành công, đang gửi email xác thực...');
    return data;
  } catch (err) {
    console.error('Lỗi signUpWithSupabase:', err);
    throw err;
  }
}

// Hàm xử lý callback sau khi verify email
export async function handleEmailVerificationCallback() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Lỗi khi lấy session:', error.message);
      throw error;
    }

    if (!session) {
      throw new Error('Không tìm thấy session sau khi verify email');
    }

    // Gửi thông tin user đến backend để lưu vào database
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register-supabase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabase_user_id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name || '',
        newsletter: session.user.user_metadata?.newsletter || false,
        email_verified: session.user.email_confirmed_at ? true : false,
      }),
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lưu thông tin user vào database');
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Lỗi handleEmailVerificationCallback:', err);
    throw err;
  }
}