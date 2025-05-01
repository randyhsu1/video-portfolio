"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Film, Menu } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Category {
  key: string
  name: string
}

export function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const pathname = usePathname()

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
      }
    }

    loadCategories()
  }, [])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Film className="h-6 w-6" />
          <span className="text-xl font-bold">VideoPortfolio</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
          >
            全部
          </Link>
          {categories.map((category) => (
            <Link
              key={category.key}
              href={`/categories/${category.key}`}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === `/categories/${category.key}` ? "text-primary" : "text-muted-foreground"}`}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

