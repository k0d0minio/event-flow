import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MAX_DOCUMENT_FILES = 1
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const ALLOWED_MIME_TYPES = ["application/pdf"]

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

    // Check if document already exists
    const { count } = await supabase
      .from("artist_media")
      .select("*", { count: "exact", head: true })
      .eq("artist_id", user.id)
      .eq("type", "document")

    if ((count || 0) >= MAX_DOCUMENT_FILES) {
      return NextResponse.json(
        { error: "Only one document (EPK) is allowed. Please delete the existing one first." },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const title = formData.get("title") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF files are allowed" },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 20MB limit" },
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
    console.error("Error uploading document:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

