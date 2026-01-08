import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is a booker
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "booker") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get booker record
    const { data: booker } = await supabase
      .from("bookers")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    if (!booker) {
      return NextResponse.json(
        { error: "Booker profile not found" },
        { status: 404 }
      )
    }

    // Get associated venues
    const { data: relationships } = await supabase
      .from("booker_venue_relationships")
      .select("venue_id")
      .eq("booker_id", booker.id)

    if (!relationships || relationships.length === 0) {
      return NextResponse.json(
        { error: "No venues associated with this booker" },
        { status: 404 }
      )
    }

    const venueId = relationships[0].venue_id

    const body = await request.json()
    const { technical_equipment } = body

    const techData = technical_equipment || {}

    // Upsert technical equipment
    const { error } = await supabase
      .from("venue_technical_equipment")
      .upsert(
        {
          venue_id: venueId,
          sound_system: techData.sound_system || null,
          lighting: techData.lighting || null,
          stage_dimensions: techData.stage || null,
          control_room: techData.control_room || null,
          artist_spaces: techData.artist_spaces || null,
        },
        { onConflict: "venue_id" }
      )

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update technical equipment" },
        { status: 400 }
      )
    }

    // Fetch updated data
    const { data: updatedTech } = await supabase
      .from("venue_technical_equipment")
      .select("*")
      .eq("venue_id", venueId)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        technical_equipment: updatedTech
          ? {
              sound_system: updatedTech.sound_system,
              lighting: updatedTech.lighting,
              stage: updatedTech.stage_dimensions,
              control_room: updatedTech.control_room,
              artist_spaces: updatedTech.artist_spaces,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Error updating technical equipment:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
