"use client";

import VideoGrid from "@/components/video-grid";
import { Header } from "@/components/header";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Video {
  id: number
  title: string
  description: string
  category: string
  video_url: string
  thumbnail_url: string
  created_at: string
}



export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        setError("");
        // 直接從 supabase 讀取
        const { data, error } = await supabase
          .from('videos')
          .select('id, title, description, category, video_url, thumbnail_url, created_at')
          .order('created_at', { ascending: false })
          .throwOnError();

        if (error) {
          console.error('Supabase error:', error);
          setError("讀取資料失敗");
          return;
        }

        console.log('Raw data from Supabase:', data);
        
        // 確保所有必要欄位都存在
        const validatedData = data?.map(video => ({
          id: video.id,
          title: video.title || '',
          description: video.description || '',
          category: video.category || '',
          video_url: video.video_url || '',
          thumbnail_url: video.thumbnail_url || '',
          created_at: video.created_at || ''
        })) || [];

        console.log('Setting videos to:', validatedData);
        setVideos(validatedData);
      } catch (err) {
        console.error('Error loading videos:', err);
        setError("讀取資料失敗");
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">所有作品</h1>
        {loading ? (
          <div className="text-center py-10">載入中...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : (
          <VideoGrid videos={videos.map(v => ({
            id: v.id,
            title: v.title,
            description: v.description,
            thumbnail: v.thumbnail_url || "",
            videoUrl: v.video_url || "",
            category: v.category || "",
            created_at: v.created_at || ""
          }))} />
        )}
      </div>
    </div>
  );
}

