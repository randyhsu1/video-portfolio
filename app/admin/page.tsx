import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import AdminHeader from "@/components/admin-header"
import VideoUploadForm from "@/components/video-upload-form"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("admin_authenticated")?.value === "true"

  if (!isAuthenticated) {
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
        </div>
      </div>
    </main>
  )
}

