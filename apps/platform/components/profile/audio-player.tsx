"use client"

import { useState, useEffect } from "react"
import { ProfileSection } from "./profile-section"
import { MediaUploader } from "./media-uploader"
import { MediaItem } from "./media-item"
import { createClient } from "@ef/db/client"

interface AudioFile {
  id: string
  title: string | null
  storage_path: string
  metadata: Record<string, unknown> | null
}

export function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchAudioFiles = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("artist_media")
        .select("*")
        .eq("artist_id", user.id)
        .eq("type", "audio")
        .order("metadata->priority", { ascending: true })

      if (error) throw error
      setAudioFiles((data as AudioFile[]) || [])
    } catch (error) {
      console.error("Error fetching audio files:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAudioFiles()
  }, [])

  return (
    <ProfileSection
      title="Audio Demos"
      description="Upload up to 5 audio files to showcase your music"
    >
      <div className="space-y-4">
        <MediaUploader
          type="audio"
          maxFiles={5}
          acceptedTypes={["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/m4a"]}
          maxSizeMB={50}
          currentCount={audioFiles.length}
          onUploadSuccess={fetchAudioFiles}
        />

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : audioFiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audio files uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {audioFiles.map((file) => (
              <MediaItem
                key={file.id}
                id={file.id}
                type="audio"
                title={file.title}
                storagePath={file.storage_path}
                metadata={file.metadata}
                onDelete={fetchAudioFiles}
              />
            ))}
          </div>
        )}
      </div>
    </ProfileSection>
  )
}

