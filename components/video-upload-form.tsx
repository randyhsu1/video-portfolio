"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadVideo } from "@/lib/actions"
import { Loader2, Upload } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// 所有可用的分類，請與 categories/page.tsx 保持一致
const CATEGORY_OPTIONS = [
  { key: "product", label: "產品影片" },
  { key: "Brand", label: "形象影片" },
  { key: "Ad", label: "網路廣告" },
  { key: "Short", label: "劇情短片" },
  { key: "Show", label: "網路節目" },
  { key: "Interview", label: "訪談紀實" },
];

export default function VideoUploadForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("animation")
  const [videoSource, setVideoSource] = useState<"file" | "youtube">("youtube")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (videoSource === "file" && (!videoFile || !thumbnailFile)) {
      setError("Please select both video and thumbnail files")
      return
    }

    if (videoSource === "youtube" && !youtubeUrl) {
      setError("Please enter a YouTube URL")
      return
    }

    setIsUploading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 500)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("videoSource", videoSource)

      if (videoSource === "youtube") {
        formData.append("youtubeUrl", youtubeUrl)
        // For YouTube videos, we can either use a custom thumbnail or extract one from YouTube
        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile)
        }
      } else {
        formData.append("video", videoFile as File)
        formData.append("thumbnail", thumbnailFile as File)
      }

      const result = await uploadVideo(formData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        setSuccess("Video added successfully!")
        setTitle("")
        setDescription("")
        setCategory("animation")
        setVideoFile(null)
        setThumbnailFile(null)
        setYoutubeUrl("")
      } else {
        setError(result.error || "Failed to add video")
      }
    } catch (err) {
      setError("An error occurred during upload")
      console.error(err)
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-3">
        <Label htmlFor="category">分類</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 text-base"
          disabled={isUploading}
          required
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="title">Video Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          required
          disabled={isUploading}
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          required
          disabled={isUploading}
        />
      </div>

      <div className="grid gap-3">
        <Label>Video Source</Label>
        <RadioGroup
          value={videoSource}
          onValueChange={(value) => setVideoSource(value as "file" | "youtube")}
          className="flex flex-row space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="youtube" id="youtube" />
            <Label htmlFor="youtube">YouTube URL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="file" id="file" />
            <Label htmlFor="file">Upload File</Label>
          </div>
        </RadioGroup>
      </div>

      {videoSource === "youtube" ? (
        <div className="grid gap-3">
          <Label htmlFor="youtubeUrl">YouTube URL</Label>
          <Input
            id="youtubeUrl"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground">
            Enter the full YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          <Label htmlFor="video">Video File</Label>
          <Input
            id="video"
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            required
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground">Accepted formats: MP4, WebM, OGG</p>
        </div>
      )}

      <div className="grid gap-3">
        <Label htmlFor="thumbnail">
          {videoSource === "youtube" ? "Custom Thumbnail (Optional)" : "Thumbnail Image"}
        </Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
          required={videoSource === "file"}
          disabled={isUploading}
        />
        <p className="text-sm text-muted-foreground">
          {videoSource === "youtube"
            ? "If not provided, the YouTube thumbnail will be used"
            : "Accepted formats: JPEG, PNG, WebP"}
        </p>
      </div>

      {uploadProgress > 0 && (
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <Button type="submit" disabled={isUploading} className="w-full">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {videoSource === "youtube" ? "Adding..." : "Uploading..."}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {videoSource === "youtube" ? "Add Video" : "Upload Video"}
          </>
        )}
      </Button>
    </form>
  )
}

