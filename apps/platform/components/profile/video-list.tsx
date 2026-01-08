"use client"

import { useState, useEffect } from "react"
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@ef/ui"
import { ProfileSection } from "./profile-section"
import { MediaItem } from "./media-item"
import { createClient } from "@ef/db/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"

const videoSchema = z.object({
  video_url: z.string().url("Please enter a valid URL"),
  title: z.string().optional(),
  description: z.string().optional(),
})

type VideoFormData = z.infer<typeof videoSchema>

interface VideoFile {
  id: string
  title: string | null
  storage_path: string
  metadata: Record<string, unknown> | null
}

export function VideoList() {
  const [videos, setVideos] = useState<VideoFile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      video_url: "",
      title: "",
      description: "",
    },
  })

  const fetchVideos = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("artist_media")
        .select("*")
        .eq("artist_id", user.id)
        .eq("type", "video")
        .order("created_at", { ascending: false })

      if (error) throw error
      setVideos((data as VideoFile[]) || [])
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const onSubmit = async (data: VideoFormData) => {
    try {
      const response = await fetch("/api/artist/profile/media/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        // Handle placeholder responses gracefully
        if (error.placeholder) {
          toast.info(error.error || "This feature is coming soon")
          return
        }
        throw new Error(error.error || "Failed to add video")
      }

      toast.success("Video added successfully")
      form.reset()
      setShowForm(false)
      fetchVideos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add video")
    }
  }

  return (
    <ProfileSection
      title="Videos"
      description="Add up to 3 YouTube or Vimeo video links"
    >
      <div className="space-y-4">
        {videos.length < 3 && (
          <>
            {!showForm ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="video_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (YouTube or Vimeo)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Video title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Add Video</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        form.reset()
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No videos added yet</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {videos.map((video) => (
              <MediaItem
                key={video.id}
                id={video.id}
                type="video"
                title={video.title}
                storagePath={video.storage_path}
                metadata={video.metadata}
                onDelete={fetchVideos}
              />
            ))}
          </div>
        )}
      </div>
    </ProfileSection>
  )
}

