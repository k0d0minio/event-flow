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

    // Verify user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch profile
    const { data: artistProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, email, created_at, updated_at")
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
      .eq("profile_id", id)
      .single()

    if (artistError || !artist) {
      return NextResponse.json({ error: "Artist data not found" }, { status: 404 })
    }

    // Fetch genres and influences
    const { data: genres } = await supabase
      .from("artist_genres")
      .select("genre")
      .eq("artist_id", artist.id)

    const { data: influences } = await supabase
      .from("artist_influences")
      .select("influence")
      .eq("artist_id", artist.id)

    // Fetch media
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("entity_type", "artist")
      .eq("entity_id", artist.id)
      .order("created_at", { ascending: false })

    // Calculate completion status
    const fields = {
      stage_name: artist.stage_name,
      formation_type: artist.formation_type,
      bio_short: artist.bio_short,
      years_active: artist.years_active,
      professional_level: artist.professional_level,
      primary_genre: artist.primary_genre,
      sub_genres: genres && genres.length > 0,
      influences: influences && influences.length > 0,
    }

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

    const hasAudio = media?.some((m) => m.media_type === "audio")
    const hasPhoto = media?.some((m) => m.media_type === "photo")
    const hasVideo = media?.some((m) => m.media_type === "video")
    const hasDocument = media?.some((m) => m.media_type === "document")

    if (hasAudio) filledCount++
    if (hasPhoto) filledCount++
    if (hasVideo) filledCount++
    if (hasDocument) filledCount++

    const totalFieldsWithMedia = totalFields + 4
    const completionPercentage = Math.round((filledCount / totalFieldsWithMedia) * 100)

    return NextResponse.json({
      profile: artistProfile,
      artist: {
        ...artist,
        sub_genres: genres?.map((g) => g.genre) || [],
        influences: influences?.map((i) => i.influence) || [],
      },
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
