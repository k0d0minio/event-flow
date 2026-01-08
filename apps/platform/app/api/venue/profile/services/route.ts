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
          services: null,
        },
      })
    }

    // Get services
    const { data: services } = await supabase
      .from("venue_services")
      .select("*")
      .eq("venue_id", venue.id)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        services: services
          ? {
              accommodation: services.accommodation_available
                ? {
                    available: true,
                    capacity: services.accommodation_capacity,
                  }
                : { available: false },
              catering: services.catering_available
                ? {
                    available: true,
                    type: services.catering_type,
                  }
                : { available: false },
              ticketing: services.ticketing,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Error fetching services:", error)
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
    const { services } = body

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

    const servicesData = services || {}

    // Upsert services
    const { error } = await supabase
      .from("venue_services")
      .upsert(
        {
          venue_id: venue.id,
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
      .eq("venue_id", venue.id)
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
