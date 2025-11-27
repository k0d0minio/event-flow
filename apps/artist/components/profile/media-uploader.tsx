"use client"

import { useState, useCallback } from "react"
import { Button } from "@ef/ui"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"

interface MediaUploaderProps {
  type: "audio" | "photo" | "document"
  maxFiles: number
  acceptedTypes: string[]
  maxSizeMB: number
  onUploadSuccess?: () => void
  currentCount?: number
}

export function MediaUploader({
  type,
  maxFiles,
  acceptedTypes,
  maxSizeMB,
  onUploadSuccess,
  currentCount = 0,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFile = useCallback(
    async (file: File) => {
      if (currentCount >= maxFiles) {
        toast.error(`Maximum ${maxFiles} ${type} files allowed`)
        return
      }

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`Invalid file type. Allowed: ${acceptedTypes.join(", ")}`)
        return
      }

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        toast.error(`File size exceeds ${maxSizeMB}MB limit`)
        return
      }

      setUploading(true)
      setUploadProgress(0)

      try {
        const formData = new FormData()
        formData.append("file", file)

        // Simulate progress (in real app, you'd track actual upload progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        const endpoint = `/api/profile/media/${type}`
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (!response.ok) {
          const error = await response.json()
          // Handle placeholder responses gracefully
          if (error.placeholder) {
            toast.info(error.error || "This feature is coming soon")
            return
          }
          throw new Error(error.error || "Upload failed")
        }

        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`)
        onUploadSuccess?.()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed")
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [type, maxFiles, acceptedTypes, maxSizeMB, currentCount, onUploadSuccess]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  if (currentCount >= maxFiles) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        Maximum {maxFiles} {type} files reached
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-8 transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      <input
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileInput}
        disabled={uploading}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">
            {uploading ? "Uploading..." : `Drop ${type} file here or click to browse`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max {maxSizeMB}MB • {acceptedTypes.map((t) => t.split("/")[1]).join(", ").toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            (Coming soon - storage configuration in progress)
          </p>
        </div>
        {uploading && (
          <div className="w-full max-w-xs">
            <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

