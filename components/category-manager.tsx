"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Trash2, Plus } from "lucide-react"

interface Category {
  id: number
  key: string
  name: string
  created_at: string
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState({ key: "", name: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 載入分類
  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) throw error

      setCategories(data || [])
    } catch (err) {
      console.error("Error loading categories:", err)
      setError("載入分類失敗")
    } finally {
      setLoading(false)
    }
  }

  // 新增分類
  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategory.key || !newCategory.name) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from("categories")
        .insert([newCategory])

      if (error) throw error

      setNewCategory({ key: "", name: "" })
      await loadCategories()
    } catch (err) {
      console.error("Error adding category:", err)
      setError("新增分類失敗")
    } finally {
      setLoading(false)
    }
  }

  // 刪除分類
  async function handleDeleteCategory(id: number) {
    if (!confirm("確定要刪除這個分類嗎？相關的影片將會失去分類。")) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)

      if (error) throw error

      await loadCategories()
    } catch (err) {
      console.error("Error deleting category:", err)
      setError("刪除分類失敗")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>管理分類</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddCategory} className="flex gap-4 mb-6">
          <Input
            placeholder="分類代碼 (英文)"
            value={newCategory.key}
            onChange={(e) => setNewCategory({ ...newCategory, key: e.target.value.toLowerCase() })}
            className="flex-1"
          />
          <Input
            placeholder="分類名稱 (中文)"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            新增
          </Button>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-500 ml-2">({category.key})</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
