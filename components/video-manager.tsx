"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"

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

export default function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 載入分類
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("key, name")
          .order("created_at", { ascending: true })

        if (error) throw error
        setCategories(data || [])
      } catch (err) {
        console.error("Error loading categories:", err)
        setError("載入分類失敗")
      }
    }

    loadCategories()
  }, [])

  // 載入影片
  useEffect(() => {
    loadVideos()
  }, [])

  async function loadVideos() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (err) {
      console.error("Error loading videos:", err)
      setError("載入影片失敗")
    } finally {
      setLoading(false)
    }
  }

  // 更新影片
  async function handleUpdateVideo(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedVideo) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from("videos")
        .update({
          title: selectedVideo.title,
          description: selectedVideo.description,
          category: selectedVideo.category,
          video_url: selectedVideo.video_url,
          thumbnail_url: selectedVideo.thumbnail_url,
        })
        .eq("id", selectedVideo.id)

      if (error) throw error

      toast.success("影片更新成功")
      setIsDialogOpen(false)
      await loadVideos()
    } catch (err) {
      console.error("Error updating video:", err)
      toast.error("更新影片失敗")
    } finally {
      setLoading(false)
    }
  }

  // 刪除影片
  async function handleDeleteVideo(id: number) {
    if (!confirm("確定要刪除這個影片嗎？此操作無法復原。")) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast.success("影片刪除成功")
      await loadVideos()
    } catch (err) {
      console.error("Error deleting video:", err)
      toast.error("刪除影片失敗")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !videos.length) return <div>載入中...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>管理現有影片</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium truncate">{video.title}</h3>
                <p className="text-sm text-gray-500 truncate">{video.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  {selectedVideo && (
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>編輯影片</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateVideo} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">標題</Label>
                          <Input
                            id="title"
                            value={selectedVideo.title}
                            onChange={(e) =>
                              setSelectedVideo({
                                ...selectedVideo,
                                title: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">描述</Label>
                          <Textarea
                            id="description"
                            value={selectedVideo.description}
                            onChange={(e) =>
                              setSelectedVideo({
                                ...selectedVideo,
                                description: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">分類</Label>
                          <Select
                            value={selectedVideo.category}
                            onValueChange={(value) =>
                              setSelectedVideo({
                                ...selectedVideo,
                                category: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="選擇分類" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.key} value={cat.key}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="video_url">影片網址</Label>
                          <Input
                            id="video_url"
                            value={selectedVideo.video_url}
                            onChange={(e) =>
                              setSelectedVideo({
                                ...selectedVideo,
                                video_url: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="thumbnail_url">縮圖網址</Label>
                          <Input
                            id="thumbnail_url"
                            value={selectedVideo.thumbnail_url}
                            onChange={(e) =>
                              setSelectedVideo({
                                ...selectedVideo,
                                thumbnail_url: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            取消
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? "更新中..." : "更新"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  )}
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteVideo(video.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
