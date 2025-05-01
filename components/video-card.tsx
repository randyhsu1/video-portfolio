"use client"

import { useRef, useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface Video {
  id: number
  title: string
  description: string
  category: string
  videoUrl: string
  thumbnail: string
  created_at: string
  isYoutubeVideo?: boolean
}

interface VideoCardProps {
  video: Video
  isActive: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function VideoCard({ video, isActive, onMouseEnter, onMouseLeave }: VideoCardProps) {
  console.log('VideoCard received:', {
    id: video.id,
    title: video.title,
    video_url: video.video_url,
    thumbnail_url: video.thumbnail_url
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false)

  // 轉換 YouTube URL
  const getVideoUrl = (url: string) => {
    if (!url) return '';
    const baseUrl = url.split('?')[0]; // 移除現有的參數
    return `${baseUrl}?autoplay=1&mute=1&enablejsapi=1&origin=${window.location.origin}`;
  }

  // 判斷是否為 YouTube 影片
  useEffect(() => {
    if (!video.videoUrl) return
    setIsYoutubeVideo(video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be'))
  }, [video.videoUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video || isYoutubeVideo) return

    // 設定影片屬性
    video.muted = true
    video.playsInline = true
    video.loop = true
    video.preload = "auto"

    // 處理播放狀態
    const handleCanPlay = async () => {
      if (isActive) {
        try {
          await video.play()
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Failed to play video:', err)
          }
        }
      }
    }

    // 監聽 canplay 事件
    video.addEventListener('canplay', handleCanPlay)

    // 當不活躍時暫停
    if (!isActive) {
      video.pause()
      video.currentTime = 0
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.pause()
    }
  }, [isActive, isYoutubeVideo])

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-0 relative aspect-video">
        {isYoutubeVideo ? (
          <>
            {isActive ? (
              <iframe
                key={video.videoUrl}
                src={getVideoUrl(video.videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              ></iframe>
            ) : (
              <div className="w-full h-full relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="sr-only">Hover to play</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <video
            ref={videoRef}
            src={video.video_url}
            poster={video.thumbnail_url}
            className="w-full h-full object-cover"
            preload="auto"
          />
        )}
        {!isActive && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="sr-only">Hover to play</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start p-4">
        <h3 className="text-lg font-semibold">{video.title}</h3>
        <p className="text-sm text-muted-foreground">{video.description}</p>
      </div>
    </div>
  )
}

