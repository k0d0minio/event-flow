"use client"

import { useState, useEffect } from "react"
import { ProfileSection } from "./profile-section"
import { MediaUploader } from "./media-uploader"
import { MediaItem } from "./media-item"
import { createClient } from "@ef/db/client"

interface DocumentFile {
  id: string
  title: string | null
  storage_path: string
  metadata: Record<string, unknown> | null
}

export function DocumentUpload() {
  const [document, setDocument] = useState<DocumentFile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchDocument = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("artist_media")
        .select("*")
        .eq("artist_id", user.id)
        .eq("type", "document")
        .maybeSingle()

      if (error) throw error
      setDocument(data as DocumentFile | null)
    } catch (error) {
      console.error("Error fetching document:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocument()
  }, [])

  return (
    <ProfileSection
      title="EPK Document"
      description="Upload your Electronic Press Kit (PDF)"
    >
      <div className="space-y-4">
        {!document && (
          <MediaUploader
            type="document"
            maxFiles={1}
            acceptedTypes={["application/pdf"]}
            maxSizeMB={20}
            currentCount={document ? 1 : 0}
            onUploadSuccess={fetchDocument}
          />
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : document ? (
          <MediaItem
            id={document.id}
            type="document"
            title={document.title}
            storagePath={document.storage_path}
            metadata={document.metadata}
            onDelete={fetchDocument}
          />
        ) : null}
      </div>
    </ProfileSection>
  )
}

