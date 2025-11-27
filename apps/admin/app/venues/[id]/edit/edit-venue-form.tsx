"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Card, Input, Label } from "@ef/ui"

interface Venue {
  id: string
  name: string
  address: string | null
  capacity: number | null
}

interface EditVenueFormProps {
  venue: Venue
}

export function EditVenueForm({ venue }: EditVenueFormProps) {
  const [name, setName] = useState(venue.name)
  const [address, setAddress] = useState(venue.address || "")
  const [capacity, setCapacity] = useState(venue.capacity?.toString() || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/venues/${venue.id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address: address || null,
          capacity: capacity ? parseInt(capacity, 10) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update venue")
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
    <Card className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Venue</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Updating..." : "Update Venue"}
          </Button>
          <Link href="/venues" className="w-full sm:w-auto">
            <Button type="button" variant="outline" disabled={loading} className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  )
}

