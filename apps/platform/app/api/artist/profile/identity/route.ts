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
        success: true,
        data: {
          stage_name: null,
          formation_type: null,
          bio_short: null,
          bio_long: null,
          years_active: null,
          professional_level: null,
        },
      })
    }

    const artistData = artist as unknown as {
      stage_name: string | null
      formation_type: string | null
      bio_short: string | null
      bio_long: string | null
      years_active: number | null
      professional_level: string | null
    }

    return NextResponse.json({
      success: true,
      data: {
        stage_name: artistData.stage_name,
        formation_type: artistData.formation_type,
        bio_short: artistData.bio_short,
        bio_long: artistData.bio_long,
        years_active: artistData.years_active,
        professional_level: artistData.professional_level,
      },
    })
  } catch (error) {
    console.error("Error fetching artist identity:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const {
      stage_name,
      formation_type,
      bio_short,
      bio_long,
      years_active,
      professional_level,
    } = body

    // Get or create artist record
    const { data: existingArtist } = await supabase
      .from("artists")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    let artistId: string

    if (existingArtist) {
      artistId = existingArtist.id
      // Update existing artist record
      const { error } = await supabase
        .from("artists")
        .update({
          stage_name: stage_name || null,
          formation_type: formation_type || null,
          bio_short: bio_short || null,
          bio_long: bio_long || null,
          years_active: years_active || null,
          professional_level: professional_level || null,
        } as never)
        .eq("id", artistId)

      if (error) {
        return NextResponse.json(
          { error: error.message || "Failed to update artist" },
          { status: 400 }
        )
      }
    } else {
      // Create new artist record
      const { data: newArtist, error } = await supabase
        .from("artists")
        .insert({
          profile_id: user.id,
          stage_name: stage_name || null,
          formation_type: formation_type || null,
          bio_short: bio_short || null,
          bio_long: bio_long || null,
          years_active: years_active || null,
          professional_level: professional_level || null,
        } as never)
        .select("id")
        .single()

      if (error || !newArtist) {
        return NextResponse.json(
          { error: error?.message || "Failed to create artist" },
          { status: 400 }
        )
      }
      artistId = newArtist.id
    }

    // Fetch updated artist data
    const { data: updatedArtist } = await supabase
      .from("artists")
      .select("*")
      .eq("id", artistId)
      .single()

    return NextResponse.json({ success: true, data: updatedArtist })
  } catch (error) {
    console.error("Error updating artist identity:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
