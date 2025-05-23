"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabase } from "./supabase"

// 管理員的 email，應該存在環境變數中
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com"

export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
  try {
    // 使用 Supabase Auth 進行驗證
    // 確保只有管理員可以登入
    if (email !== ADMIN_EMAIL) {
      console.error('Unauthorized email:', email)
      return false
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) {
      console.error('Auth error:', error)
      return false
    }

    // 如果登入成功，設置 session cookie
    if (data.session) {
      const cookieStore = await cookies();
      await cookieStore.set("sb-access-token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })
      return true
    }

    return false
  } catch (err) {
    console.error('Unexpected error:', err)
    return false
  }
}

export async function logoutAdmin() {
  // 登出 Supabase session
  await supabase.auth.signOut()
  const cookieStore = await cookies();
  await cookieStore.delete("sb-access-token")
  redirect("/admin/login")
}

import { createClient } from '@supabase/supabase-js';

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    console.log('[isAdminAuthenticated] token:', token);
    if (!token) return false;

    // 用 access_token 驗證 user
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
    const { data, error } = await supabaseServer.auth.getUser();
    console.log('[isAdminAuthenticated] user:', data?.user);
    console.log('[isAdminAuthenticated] error:', error);
    if (error || !data?.user) return false;

    // 確認是管理員的 email
    console.log('[isAdminAuthenticated] user.email:', data.user.email);
    return data.user.email === ADMIN_EMAIL;
  } catch (err) {
    console.error('Session check error:', err);
    return false;
  }
}


