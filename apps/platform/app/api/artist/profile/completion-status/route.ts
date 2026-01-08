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
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "artist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get artist record
    const { data: artist } = await supabase
      .from("artists")
      .select("*")
      .eq("profile_id", user.id)
      .single()

    if (!artist) {
      return NextResponse.json({
        completion_percentage: 0,
        filled_fields: 0,
        total_fields: 12,
        is_basic_level: false,
      })
    }

    // Get genres and influences
    const { data: genres } = await supabase
      .from("artist_genres")
      .select("genre")
      .eq("artist_id", artist.id)

    const { data: influences } = await supabase
      .from("artist_influences")
      .select("influence")
      .eq("artist_id", artist.id)

    // Count filled fields
    const fields = {
      // Identity fields (5 fields)
      stage_name: artist.stage_name,
      formation_type: artist.formation_type,
      bio_short: artist.bio_short,
      years_active: artist.years_active,
      professional_level: artist.professional_level,
      // Musical info fields (3 fields)
      primary_genre: artist.primary_genre,
      sub_genres: genres && genres.length > 0,
      influences: influences && influences.length > 0,
    }

    // Count non-null/non-empty fields
    let filledCount = 0
    const totalFields = 8

    for (const value of Object.values(fields)) {
      if (value !== null && value !== undefined) {
        if (typeof value === "boolean") {
          if (value) filledCount++
        } else if (typeof value === "string") {
          if (value.trim().length > 0) filledCount++
        } else {
          filledCount++
        }
      }
    }

    // Check for media files
    const { data: mediaByType } = await supabase
      .from("media")
      .select("media_type")
      .eq("entity_type", "artist")
      .eq("entity_id", artist.id)

    const hasAudio = mediaByType?.some((m) => m.media_type === "audio")
    const hasPhoto = mediaByType?.some((m) => m.media_type === "photo")
    const hasVideo = mediaByType?.some((m) => m.media_type === "video")
    const hasDocument = mediaByType?.some((m) => m.media_type === "document")

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
