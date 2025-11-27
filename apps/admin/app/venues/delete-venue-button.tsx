"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@ef/ui"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ef/ui"
import { Trash2 } from "lucide-react"

interface DeleteVenueButtonProps {
  venueId: string
  venueName: string
}

export function DeleteVenueButton({ venueId, venueName }: DeleteVenueButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/venues/${venueId}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete venue")
      }

      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error("Error deleting venue:", error)
      alert("Failed to delete venue. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the venue "{venueName}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

