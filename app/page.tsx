import VideoGrid from "@/components/video-grid"
import { Header } from "@/components/header"

export default function Home() {
  // Sample video data - in a real app, this would come from a database or API
  const videos = [
    {
      id: 1,
      title: "Creative Animation",
      description: "A short animation showcasing creative techniques",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      id: 2,
      title: "Product Showcase",
      description: "Demonstration of product features and benefits",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
      id: 3,
      title: "Motion Graphics",
      description: "Custom motion graphics for brand identity",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
    {
      id: 4,
      title: "UI Animation",
      description: "Smooth UI animations for better user experience",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
    {
      id: 5,
      title: "3D Rendering",
      description: "High-quality 3D rendering and animation",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    },
    {
      id: 6,
      title: "Explainer Video",
      description: "Clear and concise explanation of complex concepts",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
      id: 7,
      title: "YouTube Example",
      description: "This is an example of a YouTube video in our portfolio",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 8,
      title: "Another YouTube Example",
      description: "Another example of embedding YouTube content",
      thumbnail: "https://img.youtube.com/vi/C0DPdy98e4c/maxresdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/C0DPdy98e4c",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">My Video Portfolio</h1>
        <p className="text-muted-foreground mb-8">Hover over a video to see it in action</p>
        <VideoGrid videos={videos} />
      </div>
    </main>
  )
}

