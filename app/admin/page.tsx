import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import AdminHeader from "@/components/admin-header"
import VideoUploadForm from "@/components/video-upload-form"
import VideoOrderManager from "@/components/video-order-manager"
import CategoryManager from "@/components/category-manager"
import VideoManager from "@/components/video-manager"

export default async function AdminPage() {
  const token = cookies().get("sb-access-token")?.value
  if (!token) {
    redirect("/admin/login")
  }

  return (
    <main className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Video Portfolio Admin</h1>
        <div className="grid gap-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload New Video</h2>
            <VideoUploadForm />
          </div>
          
          {/* 分類管理 */}
          <div className="space-y-8">
            <VideoUploadForm />
            <VideoManager />
            <CategoryManager />
            <VideoOrderManager />
          </div>
        </div>
      </div>
    </main>
  )
}

