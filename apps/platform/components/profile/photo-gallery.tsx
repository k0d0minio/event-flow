"use client"

import { useState, useEffect } from "react"
import { ProfileSection } from "./profile-section"
import { MediaUploader } from "./media-uploader"
import { MediaItem } from "./media-item"
import { createClient } from "@ef/db/client"

interface PhotoFile {
  id: string
  title: string | null
  storage_path: string
  metadata: Record<string, unknown> | null
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchPhotos = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("artist_media")
        .select("*")
        .eq("artist_id", user.id)
        .eq("type", "photo")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPhotos((data as PhotoFile[]) || [])
    } catch (error) {
      console.error("Error fetching photos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  return (
    <ProfileSection
      title="Photos"
      description="Upload up to 10 photos (Studio, Live, Promo)"
    >
      <div className="space-y-4">
        <MediaUploader
          type="photo"
          maxFiles={10}
          acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
          maxSizeMB={10}
          currentCount={photos.length}
          onUploadSuccess={fetchPhotos}
        />

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : photos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No photos uploaded yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <MediaItem
                key={photo.id}
                id={photo.id}
                type="photo"
                title={photo.title}
                storagePath={photo.storage_path}
                metadata={photo.metadata}
                onDelete={fetchPhotos}
              />
            ))}
          </div>
        )}
      </div>
    </ProfileSection>
  )
}

