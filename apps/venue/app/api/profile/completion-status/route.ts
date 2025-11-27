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
      .select("role, venue_data")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "venue") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const venueData = (profile.venue_data as Record<string, unknown>) || {}

    // Count filled fields
    let filledCount = 0
    const totalFields = 10

    // Identity fields (4 fields)
    if (venueData.venue_name) filledCount++
    if (venueData.venue_type) filledCount++
    if (venueData.capacity) {
      const capacity = venueData.capacity as Record<string, unknown>
      if (capacity.min || capacity.max) filledCount++
    }
    if (venueData.location) {
      const location = venueData.location as Record<string, unknown>
      if (location.address) filledCount++
    }

    // Technical equipment (at least one field filled)
    if (venueData.technical_equipment) {
      const tech = venueData.technical_equipment as Record<string, unknown>
      if (tech.sound_system || tech.lighting || tech.stage || tech.control_room || tech.artist_spaces) {
        filledCount++
      }
    }

    // Programming fields (2 fields)
    if (venueData.programming) {
      const programming = venueData.programming as Record<string, unknown>
      if (programming.preferred_genres && Array.isArray(programming.preferred_genres) && programming.preferred_genres.length > 0) {
        filledCount++
      }
      if (programming.event_frequency) filledCount++
    }

    // Services (at least one service available)
    if (venueData.services) {
      const services = venueData.services as Record<string, unknown>
      if (services.accommodation || services.catering || services.ticketing) {
        filledCount++
      }
    }

    // Additional fields (2 fields)
    if (venueData.history) filledCount++
    if (venueData.ambiance && Array.isArray(venueData.ambiance) && venueData.ambiance.length > 0) {
      filledCount++
    }

    const completionPercentage = Math.round((filledCount / totalFields) * 100)

    return NextResponse.json({
      completion_percentage: completionPercentage,
      filled_fields: filledCount,
      total_fields: totalFields,
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

