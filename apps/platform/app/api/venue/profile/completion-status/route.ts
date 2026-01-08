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

    // Get venue record
    const { data: venue } = await supabase
      .from("venues")
      .select("*")
      .eq("profile_id", user.id)
      .single()

    if (!venue) {
      return NextResponse.json({
        completion_percentage: 0,
        filled_fields: 0,
        total_fields: 10,
        is_basic_level: false,
      })
    }

    let filledCount = 0
    const totalFields = 10

    // Identity fields (4 fields)
    if (venue.venue_name) filledCount++
    if (venue.venue_type) filledCount++
    if (venue.capacity_min || venue.capacity_max) filledCount++

    const { data: location } = await supabase
      .from("venue_locations")
      .select("address")
      .eq("venue_id", venue.id)
      .single()
    if (location?.address) filledCount++

    // Technical equipment (at least one field filled)
    const { data: tech } = await supabase
      .from("venue_technical_equipment")
      .select("*")
      .eq("venue_id", venue.id)
      .single()
    if (tech && (tech.sound_system || tech.lighting || tech.stage_dimensions || tech.control_room || tech.artist_spaces)) {
      filledCount++
    }

    // Programming fields (2 fields)
    const { data: programming } = await supabase
      .from("venue_programming")
      .select("*")
      .eq("venue_id", venue.id)
      .single()

    const { data: genres } = await supabase
      .from("venue_genres")
      .select("genre, is_preferred")
      .eq("venue_id", venue.id)

    const preferredGenres = genres?.filter((g) => g.is_preferred) || []
    if (preferredGenres.length > 0) filledCount++
    if (programming?.event_frequency) filledCount++

    // Services (at least one service available)
    const { data: services } = await supabase
      .from("venue_services")
      .select("*")
      .eq("venue_id", venue.id)
      .single()
    if (services && (services.accommodation_available || services.catering_available || services.ticketing)) {
      filledCount++
    }

    // Additional fields (2 fields)
    if (venue.history) filledCount++
    if (venue.ambiance && Array.isArray(venue.ambiance) && venue.ambiance.length > 0) {
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
