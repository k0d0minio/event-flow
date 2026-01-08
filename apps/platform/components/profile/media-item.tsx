"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@ef/ui"
import { Trash2, Play, Pause } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@ef/db/client"

interface MediaItemProps {
  id: string
  type: "audio" | "photo" | "video" | "document"
  title?: string | null
  storagePath: string
  metadata?: Record<string, unknown> | null
  onDelete?: () => void
}

export function MediaItem({ id, type, title, storagePath, metadata, onDelete }: MediaItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imageError, setImageError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const supabase = createClient()

  // Load image URL for photos
  useEffect(() => {
    if (type === "photo") {
      const loadImageUrl = async () => {
        const url = await getFileUrl()
        if (url) {
          setImageUrl(url)
        } else {
          setImageError(true)
        }
      }
      loadImageUrl()
    }
  }, [type, storagePath])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/artist/profile/media/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        // Handle placeholder responses gracefully
        if (error.placeholder) {
          toast.info(error.error || "This feature is coming soon")
          return
        }
        throw new Error(error.error || "Failed to delete")
      }

      toast.success("File deleted successfully")
      onDelete?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete file")
    } finally {
      setIsDeleting(false)
    }
  }

  const getFileUrl = async () => {
    if (type === "video") {
      return storagePath // Video URLs are stored directly
    }

    // PLACEHOLDER: Storage buckets not yet configured
    // Return empty string to prevent errors
    try {
      const bucket = type === "audio" ? "artist-audio" : type === "photo" ? "artist-photos" : "artist-documents"
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storagePath, 3600)
      if (error) {
        console.warn("Storage bucket not available:", error.message)
        return ""
      }
      return data?.signedUrl || ""
    } catch (error) {
      console.warn("Storage not available:", error)
      return ""
    }
  }

  const handlePlayPause = async () => {
    if (type !== "audio") return

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    try {
      const { data, error } = await supabase.storage.from("artist-audio").createSignedUrl(storagePath, 3600)
      if (error) {
        toast.info("Audio playback is not yet available. Storage buckets are being configured.")
        return
      }
      if (data?.signedUrl) {
        if (audioRef.current) {
          audioRef.current.pause()
        }
        const audio = new Audio(data.signedUrl)
        audioRef.current = audio
        audio.play()
        setIsPlaying(true)
        audio.onended = () => setIsPlaying(false)
        audio.onerror = () => {
          setIsPlaying(false)
          toast.info("Audio playback is not yet available")
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      toast.info("Audio playback is not yet available")
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  if (type === "audio") {
    return (
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
          disabled={isDeleting}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1">
          <p className="font-medium">{title || "Untitled Audio"}</p>
          {metadata?.priority && (
            <p className="text-xs text-muted-foreground">Priority: {metadata.priority}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (type === "photo") {
    return (
      <div className="group relative overflow-hidden rounded-lg border">
        {imageError || !imageUrl ? (
          <div className="flex h-48 w-full items-center justify-center bg-muted text-muted-foreground">
            <span className="text-sm">Photo preview not available</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title || "Photo"}
            className="h-48 w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-full items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-white hover:bg-white/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-sm text-white">
            {title}
          </div>
        )}
      </div>
    )
  }

  if (type === "video") {
    const videoId = metadata?.video_id as string | undefined
    const platform = metadata?.platform as "youtube" | "vimeo" | undefined
    const thumbnailUrl =
      platform === "youtube"
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : platform === "vimeo"
          ? `https://vumbnail.com/${videoId}.jpg`
          : ""

    return (
      <div className="rounded-lg border p-4">
        <div className="aspect-video overflow-hidden rounded-lg bg-muted">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title || "Video"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">No thumbnail</div>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-medium">{title || "Untitled Video"}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Document type
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="flex-1">
        <p className="font-medium">{title || "Document"}</p>
        <p className="text-xs text-muted-foreground">PDF</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

