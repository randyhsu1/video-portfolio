"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "./auth"
import { redirect } from "next/navigation"
import { supabase } from "./supabase"

// Helper function to extract YouTube video ID
function extractYoutubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : null
}

// Helper function to get YouTube thumbnail URL
function getYoutubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export async function uploadVideo(formData: FormData) {
  // Check if user is authenticated
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const videoSource = formData.get("videoSource") as "file" | "youtube"
    const category = formData.get("category") as string

    if (!title || !description || !category) {
      return { success: false, error: "Missing required fields" }
    }

    let videoUrl: string
    let thumbnailUrl: string

    if (videoSource === "youtube") {
      const youtubeUrl = formData.get("youtubeUrl") as string
      if (!youtubeUrl) {
        return { success: false, error: "Missing YouTube URL" }
      }

      const videoId = extractYoutubeId(youtubeUrl)
      if (!videoId) {
        return { success: false, error: "Invalid YouTube URL" }
      }

      // For YouTube videos, we store the embed URL
      videoUrl = `https://www.youtube.com/embed/${videoId}`

      // Check if a custom thumbnail was provided
      const thumbnailFile = formData.get("thumbnail") as File | null

      if (thumbnailFile && typeof thumbnailFile === 'object' && 'size' in thumbnailFile && thumbnailFile.size > 0) {
        // Upload custom thumbnail
        // (此段可依需求改為上傳到 Supabase Storage 或其他雲端)
        // 目前略過，直接用 YouTube 預設縮圖
        thumbnailUrl = getYoutubeThumbnailUrl(videoId)
      } else {
        // Use YouTube default thumbnail
        thumbnailUrl = getYoutubeThumbnailUrl(videoId)
      }
    } else {
      // File upload (略)
      return { success: false, error: "僅支援 YouTube 影片新增" }
    }

    // 新增影片到 Supabase videos 資料表
    const { error } = await supabase.from('videos').insert([
      {
        title,
        description,
        category,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      }
    ])
    if (error) return { success: false, error: error.message }
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error('Upload Video Error:', err)
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}
