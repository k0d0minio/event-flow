"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Card, Input, Label, Textarea } from "@ef/ui"

interface Artist {
  id: string
  display_name: string | null
  bio: string | null
  genre: string | null
}

interface EditArtistFormProps {
  artist: Artist
}

export function EditArtistForm({ artist }: EditArtistFormProps) {
  const [displayName, setDisplayName] = useState(artist.display_name || "")
  const [bio, setBio] = useState(artist.bio || "")
  const [genre, setGenre] = useState(artist.genre || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/artists/${artist.id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_name: displayName || null,
          bio: bio || null,
          genre: genre || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update artist")
        setLoading(false)
        return
      }

      router.push("/artists")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Artist</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Artist display name"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g., Rock, Jazz, Electronic"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Artist biography"
            rows={6}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Updating..." : "Update Artist"}
          </Button>
          <Link href="/artists" className="w-full sm:w-auto">
            <Button type="button" variant="outline" disabled={loading} className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  )
}

