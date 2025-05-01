"use client"

import { useState } from "react"
import VideoCard from "./video-card"

interface Video {
  id: number;
  title: string;
  description: string;
  category: string;
  videoUrl: string;  // 使用駝峰式命名來匹配資料庫
  thumbnail: string;  // 使用原始欄位名稱
  created_at: string;
}

interface VideoGridProps {
  videos: Video[]
}

export default function VideoGrid({ videos }: VideoGridProps) {
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null)

  // 顯示影片資料
  if (videos.length > 0) {
    console.log('Videos in VideoGrid:', videos)
    videos.forEach((video, index) => {
      console.log(`Video ${index + 1}:`, {
        id: video.id,
        title: video.title,
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url
      })
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          isActive={activeVideoId === video.id}
          onMouseEnter={() => setActiveVideoId(video.id)}
          onMouseLeave={() => setActiveVideoId(null)}
        />
      ))}
    </div>
  )
}

