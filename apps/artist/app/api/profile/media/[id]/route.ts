import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is an artist
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "artist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get media record to verify ownership and get storage path
    const { data: media, error: fetchError } = await supabase
      .from("artist_media")
      .select("storage_path, type")
      .eq("id", id)
      .eq("artist_id", user.id)
      .single()

    if (fetchError || !media) {
      return NextResponse.json(
        { error: "Media not found or access denied" },
        { status: 404 }
      )
    }

    // Determine bucket based on type
    let bucket: string
    switch (media.type) {
      case "audio":
        bucket = "artist-audio"
        break
      case "photo":
        bucket = "artist-photos"
        break
      case "document":
        bucket = "artist-documents"
        break
      case "video":
        // Videos don't have files in storage, just URLs
        bucket = ""
        break
      default:
        return NextResponse.json({ error: "Invalid media type" }, { status: 400 })
    }

    // PLACEHOLDER: Media deletion not yet available
    // Return a friendly message instead of deleting
    return NextResponse.json(
      {
        error: "Media deletion is not yet available. Storage buckets are being configured.",
        placeholder: true,
      },
      { status: 503 }
    )
  } catch (error) {
    console.error("Error deleting media:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

