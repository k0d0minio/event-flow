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

    // Verify user is a venue
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "venue") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get venue ID
    const { data: venue } = await supabase
      .from("venues")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    if (!venue) {
      return NextResponse.json({
        success: true,
        data: {
          technical_equipment: null,
        },
      })
    }

    // Get technical equipment
    const { data: tech } = await supabase
      .from("venue_technical_equipment")
      .select("*")
      .eq("venue_id", venue.id)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        technical_equipment: tech
          ? {
              sound_system: tech.sound_system,
              lighting: tech.lighting,
              stage: tech.stage_dimensions,
              control_room: tech.control_room,
              artist_spaces: tech.artist_spaces,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Error fetching technical equipment:", error)
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

    // Verify user is a venue
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "venue") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { technical_equipment } = body

    // Get venue ID
    const { data: venue } = await supabase
      .from("venues")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    if (!venue) {
      return NextResponse.json(
        { error: "Venue profile not found. Please complete your identity first." },
        { status: 404 }
      )
    }

    const techData = technical_equipment || {}

    // Upsert technical equipment
    const { error } = await supabase
      .from("venue_technical_equipment")
      .upsert(
        {
          venue_id: venue.id,
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
      .eq("venue_id", venue.id)
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
