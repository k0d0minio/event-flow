import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MAX_VIDEO_FILES = 3

function extractVideoId(url: string, platform: "youtube" | "vimeo"): string | null {
  if (platform === "youtube") {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
    return match ? match[1] : null
  } else {
    // Vimeo
    const match = url.match(/(?:vimeo\.com\/)(\d+)/)
    return match ? match[1] : null
  }
}

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

    // Check current video count
    const { count } = await supabase
      .from("media")
      .select("*", { count: "exact", head: true })
      .eq("entity_type", "artist")
      .eq("entity_id", artist.id)
      .eq("media_type", "video")

    if ((count || 0) >= MAX_VIDEO_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_VIDEO_FILES} videos allowed` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { video_url, title, description } = body

    if (!video_url) {
      return NextResponse.json({ error: "Video URL is required" }, { status: 400 })
    }

    // Determine platform and extract ID
    let platform: "youtube" | "vimeo" | null = null
    let videoId: string | null = null

    if (video_url.includes("youtube.com") || video_url.includes("youtu.be")) {
      platform = "youtube"
      videoId = extractVideoId(video_url, "youtube")
    } else if (video_url.includes("vimeo.com")) {
      platform = "vimeo"
      videoId = extractVideoId(video_url, "vimeo")
    }

    if (!platform || !videoId) {
      return NextResponse.json(
        { error: "Invalid video URL. Only YouTube and Vimeo links are supported" },
        { status: 400 }
      )
    }

    // PLACEHOLDER: Video functionality not yet available
    // Return a friendly message instead of saving
    return NextResponse.json(
      {
        error: "Video upload is not yet available. This feature is coming soon.",
        placeholder: true,
      },
      { status: 503 }
    )
  } catch (error) {
    console.error("Error adding video:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
