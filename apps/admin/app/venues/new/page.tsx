"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Card, Input, Label } from "@ef/ui"
import { ArrowLeft } from "lucide-react"

export default function NewVenuePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [capacity, setCapacity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/venues/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          address: address || null,
          capacity: capacity ? parseInt(capacity, 10) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create venue")
        setLoading(false)
        return
      }

      router.push("/venues")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/venues" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Venues
        </Link>

        <Card className="p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Venue</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="venue@example.com"
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
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Venue name"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="500"
                min="1"
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
                {loading ? "Creating..." : "Create Venue"}
              </Button>
              <Link href="/venues" className="w-full sm:w-auto">
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

