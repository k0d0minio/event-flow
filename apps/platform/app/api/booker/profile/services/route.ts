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
    const { services } = body

    const servicesData = services || {}

    // Upsert services
    const { error } = await supabase
      .from("venue_services")
      .upsert(
        {
          venue_id: venueId,
          accommodation_available: servicesData.accommodation?.available || false,
          accommodation_capacity: servicesData.accommodation?.capacity || null,
          catering_available: servicesData.catering?.available || false,
          catering_type: servicesData.catering?.type || null,
          ticketing: servicesData.ticketing || null,
        },
        { onConflict: "venue_id" }
      )

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update services" },
        { status: 400 }
      )
    }

    // Fetch updated data
    const { data: updatedServices } = await supabase
      .from("venue_services")
      .select("*")
      .eq("venue_id", venueId)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        services: updatedServices
          ? {
              accommodation: updatedServices.accommodation_available
                ? {
                    available: true,
                    capacity: updatedServices.accommodation_capacity,
                  }
                : { available: false },
              catering: updatedServices.catering_available
                ? {
                    available: true,
                    type: updatedServices.catering_type,
                  }
                : { available: false },
              ticketing: updatedServices.ticketing,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Error updating services:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
