"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Card, Input, Label, Textarea } from "@ef/ui"
import { ArrowLeft } from "lucide-react"

export default function NewArtistPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [genre, setGenre] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/artists/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          display_name: displayName || null,
          bio: bio || null,
          genre: genre || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create artist")
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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/artists" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Artists
        </Link>

        <Card className="p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Artist</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="artist@example.com"
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                A user account will be created with this email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

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
                {loading ? "Creating..." : "Create Artist"}
              </Button>
              <Link href="/artists" className="w-full sm:w-auto">
                <Button type="button" variant="outline" disabled={loading} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

