import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MAX_AUDIO_FILES = 5
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/x-m4a",
]

export async function POST(request: NextRequest) {
  try {
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

    // Get artist ID
    const { data: artist } = await supabase
      .from("artists")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    if (!artist) {
      return NextResponse.json(
        { error: "Artist profile not found. Please complete your identity first." },
        { status: 404 }
      )
    }

    // Check current audio file count
    const { count } = await supabase
      .from("media")
      .select("*", { count: "exact", head: true })
      .eq("entity_type", "artist")
      .eq("entity_id", artist.id)
      .eq("media_type", "audio")

    if ((count || 0) >= MAX_AUDIO_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_AUDIO_FILES} audio files allowed` },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const title = formData.get("title") as string | null
    const description = formData.get("description") as string | null
    const priority = formData.get("priority") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: MP3, WAV, OGG, M4A" },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      )
    }

    // PLACEHOLDER: Storage buckets not yet configured
    // Return a friendly message instead of attempting upload
    return NextResponse.json(
      {
        error: "Media upload is not yet available. Storage buckets are being configured.",
        placeholder: true,
      },
      { status: 503 }
    )
  } catch (error) {
    console.error("Error uploading audio:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
