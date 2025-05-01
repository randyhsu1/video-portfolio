"use client"

import { useState, useEffect } from "react"
import VideoGrid from "@/components/video-grid"
import { Header } from "@/components/header"
import { supabase } from "@/lib/supabase"

interface Video {
  id: number
  title: string
  description: string
  category: string
  video_url: string
  thumbnail_url: string
  created_at: string
}

interface Category {
  key: string
  name: string
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 載入分類資訊
  useEffect(() => {
    async function loadCategory() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("key, name")
          .eq("key", params.category)
          .single()

        if (error) throw error
        setCategory(data)
      } catch (err) {
        console.error("Error loading category:", err)
        setError("找不到此分類")
      }
    }

    loadCategory()
  }, [params.category])

  // 載入該分類的影片
  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true)
        setError("")

        const { data, error } = await supabase
          .from("videos")
          .select("id, title, description, category, video_url, thumbnail_url, created_at")
          .eq("category", params.category)
          .order("video_order", { ascending: true })
          .throwOnError()

        if (error) {
          console.error("Supabase error:", error)
          setError("讀取資料失敗")
          return
        }

        const validatedData = data?.map((video) => ({
          id: video.id,
          title: video.title || "",
          description: video.description || "",
          category: video.category || "",
          video_url: video.video_url || "",
          thumbnail_url: video.thumbnail_url || "",
          created_at: video.created_at || "",
        })) || []

        setVideos(validatedData)
      } catch (err) {
        console.error("Error loading videos:", err)
        setError("讀取資料失敗")
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [params.category])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">
          {category?.name || "載入中..."}
        </h1>
        {loading ? (
          <div className="text-center py-10">載入中...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : (
          <VideoGrid
            videos={videos.map((v) => ({
              id: v.id,
              title: v.title,
              description: v.description,
              thumbnailUrl: v.thumbnail_url,
              videoUrl: v.video_url,
            }))}
          />
        )}
      </div>
    </div>
  )
}
