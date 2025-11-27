import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
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
      .select("role, artist_data")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "artist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const artistData = (profile.artist_data as Record<string, unknown>) || {}

    // Count filled fields
    const fields = {
      // Identity fields (6 fields)
      stage_name: artistData.stage_name,
      formation_type: artistData.formation_type,
      bio_short: artistData.bio_short,
      years_active: artistData.years_active,
      professional_level: artistData.professional_level,
      // Musical info fields (3 fields)
      primary_genre: artistData.primary_genre,
      sub_genres: artistData.sub_genres,
      influences: artistData.influences,
    }

    // Count non-null/non-empty fields
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

    // Check for media files
    const { count: mediaCount } = await supabase
      .from("artist_media")
      .select("*", { count: "exact", head: true })
      .eq("artist_id", user.id)

    // Media adds up to 4 additional fields (at least one of each type)
    const { data: mediaByType } = await supabase
      .from("artist_media")
      .select("type")
      .eq("artist_id", user.id)

    const hasAudio = mediaByType?.some((m) => m.type === "audio")
    const hasPhoto = mediaByType?.some((m) => m.type === "photo")
    const hasVideo = mediaByType?.some((m) => m.type === "video")
    const hasDocument = mediaByType?.some((m) => m.type === "document")

    if (hasAudio) filledCount++
    if (hasPhoto) filledCount++
    if (hasVideo) filledCount++
    if (hasDocument) filledCount++

    const totalFieldsWithMedia = totalFields + 4
    const completionPercentage = Math.round((filledCount / totalFieldsWithMedia) * 100)

    return NextResponse.json({
      completion_percentage: completionPercentage,
      filled_fields: filledCount,
      total_fields: totalFieldsWithMedia,
      is_basic_level: completionPercentage >= 30,
    })
  } catch (error) {
    console.error("Error getting completion status:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

