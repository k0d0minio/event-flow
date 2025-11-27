import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(
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

    // Verify user is venue
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "venue") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch profile with artist_data
    const { data: artistProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, artist_data, created_at, updated_at")
      .eq("id", id)
      .eq("role", "artist")
      .single()

    if (profileError || !artistProfile) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    // Fetch artist record
    const { data: artist, error: artistError } = await supabase
      .from("artists")
      .select("*")
      .eq("id", id)
      .single()

    if (artistError) {
      return NextResponse.json({ error: "Artist data not found" }, { status: 404 })
    }

    // Fetch media
    const { data: media, error: mediaError } = await supabase
      .from("artist_media")
      .select("*")
      .eq("artist_id", id)
      .order("created_at", { ascending: false })

    // Calculate completion status
    const artistData = (artistProfile.artist_data as Record<string, unknown>) || {}
    const fields = {
      stage_name: artistData.stage_name,
      formation_type: artistData.formation_type,
      bio_short: artistData.bio_short,
      years_active: artistData.years_active,
      professional_level: artistData.professional_level,
      primary_genre: artistData.primary_genre,
      sub_genres: artistData.sub_genres,
      influences: artistData.influences,
    }

    let filledCount = 0
    const totalFields = 8

    for (const value of Object.values(fields)) {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          if (value.length > 0) filledCount++
        } else if (typeof value === "string") {
          if (value.trim().length > 0) filledCount++
        } else {
          filledCount++
        }
      }
    }

    const hasAudio = media?.some((m) => m.type === "audio")
    const hasPhoto = media?.some((m) => m.type === "photo")
    const hasVideo = media?.some((m) => m.type === "video")
    const hasDocument = media?.some((m) => m.type === "document")

    if (hasAudio) filledCount++
    if (hasPhoto) filledCount++
    if (hasVideo) filledCount++
    if (hasDocument) filledCount++

    const totalFieldsWithMedia = totalFields + 4
    const completionPercentage = Math.round((filledCount / totalFieldsWithMedia) * 100)

    return NextResponse.json({
      profile: artistProfile,
      artist,
      media: media || [],
      completionPercentage,
    })
  } catch (error) {
    console.error("Error fetching artist profile:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

