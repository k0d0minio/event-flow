"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../base/card.js"
import { Button } from "../../base/button.js"
import { Play, Pause, ExternalLink, Download } from "lucide-react"

interface MediaItem {
  id: string
  type: "audio" | "photo" | "video" | "document"
  title: string | null
  storage_path: string
  metadata: Record<string, unknown> | null
}

interface ArtistMediaViewProps {
  media: MediaItem[]
}

export function ArtistMediaView({ media }: ArtistMediaViewProps) {
  const [audioFiles, setAudioFiles] = useState<MediaItem[]>([])
  const [photos, setPhotos] = useState<MediaItem[]>([])
  const [videos, setVideos] = useState<MediaItem[]>([])
  const [documents, setDocuments] = useState<MediaItem[]>([])
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (media) {
      setAudioFiles(media.filter((m: MediaItem) => m.type === "audio") as MediaItem[])
      setPhotos(media.filter((m: MediaItem) => m.type === "photo") as MediaItem[])
      setVideos(media.filter((m: MediaItem) => m.type === "video") as MediaItem[])
      setDocuments(media.filter((m: MediaItem) => m.type === "document") as MediaItem[])
    }
  }, [media])

  const getFileUrl = async (type: string, storagePath: string): Promise<string | null> => {
    if (type === "video") {
      return storagePath
    }

    // Fetch signed URLs from API endpoint
    // This avoids bundling the Supabase client in the UI package
    try {
      // Determine the API route based on the current path
      const apiPath = "/api/media/signed-url"

      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, storagePath }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.placeholder) {
          console.warn("Storage not available:", error.error)
          return null
        }
        throw new Error(error.error || "Failed to get signed URL")
      }

      const data = await response.json()
      return data.url || null
    } catch (error) {
      console.warn("Storage not available:", error)
      return null
    }
  }

  const handlePlayPause = async (id: string, storagePath: string) => {
    if (currentPlaying === id && audioRef.current) {
      audioRef.current.pause()
      setCurrentPlaying(null)
      return
    }

    try {
      const url = await getFileUrl("audio", storagePath)
      if (!url) {
        return
      }

      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(url)
      audioRef.current = audio
      audio.play()
      setCurrentPlaying(id)
      audio.onended = () => setCurrentPlaying(null)
      audio.onerror = () => setCurrentPlaying(null)
    } catch (error) {
      console.error("Error playing audio:", error)
    }
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const hasMedia = audioFiles.length > 0 || photos.length > 0 || videos.length > 0 || documents.length > 0

  if (!hasMedia) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>Audio, photos, videos, and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No media available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {audioFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Audio Demos</CardTitle>
            <CardDescription>{audioFiles.length} audio file{audioFiles.length !== 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {audioFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePlayPause(file.id, file.storage_path)}
                  >
                    {currentPlaying === file.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <p className="font-medium">{file.title || "Untitled Audio"}</p>
                    {file.metadata?.priority != null && (
                      <p className="text-xs text-muted-foreground">
                        Priority: {String(file.metadata.priority)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>{photos.length} photo{photos.length !== 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoGrid photos={photos} getFileUrl={getFileUrl} />
          </CardContent>
        </Card>
      )}

      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Videos</CardTitle>
            <CardDescription>{videos.length} video{videos.length !== 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>EPK and other documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{doc.title || "Document"}</p>
                    <p className="text-sm text-muted-foreground">PDF</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={doc.storage_path} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PhotoGrid({
  photos,
  getFileUrl,
}: {
  photos: MediaItem[]
  getFileUrl: (type: string, path: string) => Promise<string | null>
}) {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    photos.forEach((photo) => {
      getFileUrl("photo", photo.storage_path).then((url) => {
        if (url) {
          setImageUrls((prev) => ({ ...prev, [photo.id]: url }))
        }
      })
    })
  }, [photos, getFileUrl])

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative overflow-hidden rounded-lg border aspect-square">
          {imageUrls[photo.id] ? (
            <img
              src={imageUrls[photo.id]}
              alt={photo.title || "Photo"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
              <span className="text-sm">Loading...</span>
            </div>
          )}
          {photo.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
              {photo.title}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function VideoCard({ video }: { video: MediaItem }) {
  const videoId = video.metadata?.video_id as string | undefined
  const platform = video.metadata?.platform as "youtube" | "vimeo" | undefined
  const thumbnailUrl =
    platform === "youtube"
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : platform === "vimeo"
        ? `https://vumbnail.com/${videoId}.jpg`
        : ""

  return (
    <div className="rounded-lg border p-4">
      <div className="aspect-video overflow-hidden rounded-lg bg-muted mb-2">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={video.title || "Video"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">No thumbnail</div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="font-medium">{video.title || "Untitled Video"}</p>
        <Button variant="outline" size="sm" asChild>
          <a href={video.storage_path} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Watch
          </a>
        </Button>
      </div>
    </div>
  )
}

