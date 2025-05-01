"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// In a real app, use a proper auth solution and store passwords securely
const ADMIN_PASSWORD = "admin123" // Change this to a secure password

export async function authenticateAdmin(password: string): Promise<boolean> {
  // This is a very basic auth mechanism - not suitable for production
  if (password === ADMIN_PASSWORD) {
    cookies().set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })
    return true
  }
  return false
}

export async function logoutAdmin() {
  cookies().delete("admin_authenticated")
  redirect("/admin/login")
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return cookies().get("admin_authenticated")?.value === "true"
}

