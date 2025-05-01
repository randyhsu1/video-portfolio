"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from "lucide-react"

interface Video {
  id: number
  title: string
  category: string
  video_order: number
}

export default function VideoOrderManager() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<{ key: string; name: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
        if (data && data.length > 0) {
          setSelectedCategory(data[0].key)
        }
      } catch (err) {
        console.error("Error loading categories:", err)
        setError("載入分類失敗")
      }
    }

    loadCategories()
  }, [])

  // 當選擇的分類改變時，載入該分類的視頻
  useEffect(() => {
    if (selectedCategory) {
      loadVideos()
    }
  }, [selectedCategory])

  async function loadVideos() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, category, video_order")
        .eq("category", selectedCategory)
        .order("video_order", { ascending: true })

      if (error) throw error

      setVideos(data || [])
    } catch (err) {
      console.error("Error loading videos:", err)
      setError("載入影片失敗")
    } finally {
      setLoading(false)
    }
  }

  // 設置拖放感應器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 處理拖放結束事件
  async function handleDragEnd(event: any) {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      setVideos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)

        // 更新數據庫中的順序
        try {
          const updates = newItems.map((video, index) => ({
            id: video.id,
            video_order: index
          }))

          supabase
            .from("videos")
            .upsert(updates)
            .then(({ error }) => {
              if (error) {
                console.error("Error updating video order:", error)
                setError("更新順序失敗")
                loadVideos() // 重新載入以還原順序
              }
            })
        } catch (err) {
          console.error("Error updating video order:", err)
          setError("更新順序失敗")
          loadVideos() // 重新載入以還原順序
        }

        return newItems
      })
    }
  }

  // 可排序的項目組件
  function SortableItem({ video }: { video: Video }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: video.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center gap-4 p-3 bg-gray-50 rounded-md cursor-move"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
        <span>{video.title}</span>
      </div>
    )
  }

  if (loading) return <div>載入中...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>管理影片順序</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`px-4 py-2 rounded-md border transition-colors ${
                selectedCategory === cat.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900"
              }`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={videos.map(v => v.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {videos.map((video) => (
                <SortableItem key={video.id} video={video} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
}
