"use client"

import { Button } from "../button.js"
import { Card, CardContent } from "../card.js"
import { Mail, Calendar } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

interface ArtistContactActionsProps {
  artistId: string
  userRole: "admin" | "venue"
}

export function ArtistContactActions({ artistId, userRole }: ArtistContactActionsProps) {
  const [isContacting, setIsContacting] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const handleContact = async () => {
    setIsContacting(true)
    try {
      const response = await fetch(`/api/artists/${artistId}/contact`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.placeholder) {
          toast.info("Contact functionality is coming soon")
        } else {
          throw new Error(error.error || "Failed to send contact request")
        }
      } else {
        toast.success("Contact request sent successfully")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send contact request")
    } finally {
      setIsContacting(false)
    }
  }

  const handleBooking = async () => {
    setIsBooking(true)
    try {
      const response = await fetch(`/api/artists/${artistId}/book`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.placeholder) {
          toast.info("Booking functionality is coming soon")
        } else {
          throw new Error(error.error || "Failed to send booking request")
        }
      } else {
        toast.success("Booking request sent successfully")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send booking request")
    } finally {
      setIsBooking(false)
    }
  }

  if (userRole === "admin") {
    return null // Admins don't need contact actions
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleContact} disabled={isContacting} className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            {isContacting ? "Sending..." : "Contact Artist"}
          </Button>
          <Button onClick={handleBooking} disabled={isBooking} variant="default" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            {isBooking ? "Sending..." : "Request Booking"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

