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
      return NextResponse.json({
        success: true,
        data: {
          venue_name: null,
          commercial_name: null,
          venue_type: null,
          capacity: null,
          location: null,
          history: null,
          ambiance: null,
        },
      })
    }

    const venueId = relationships[0].venue_id

    // Get venue record
    const { data: venue } = await supabase
      .from("venues")
      .select("*")
      .eq("id", venueId)
      .single()

    if (!venue) {
      return NextResponse.json({
        success: true,
        data: {
          venue_name: null,
          commercial_name: null,
          venue_type: null,
          capacity: null,
          location: null,
          history: null,
          ambiance: null,
        },
      })
    }

    // Get location
    const { data: location } = await supabase
      .from("venue_locations")
      .select("*")
      .eq("venue_id", venueId)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        venue_name: venue.venue_name,
        commercial_name: venue.commercial_name,
        venue_type: venue.venue_type,
        capacity: venue.capacity_min || venue.capacity_max
          ? {
              min: venue.capacity_min,
              max: venue.capacity_max,
            }
          : null,
        location: location
          ? {
              address: location.address,
              city: location.city,
              postal_code: location.postal_code,
              country: location.country,
              coordinates: location.latitude && location.longitude
                ? {
                    lat: location.latitude,
                    lng: location.longitude,
                  }
                : null,
              public_transport: location.public_transport,
              parking: location.parking,
              pmr_access: location.pmr_access,
            }
          : null,
        history: venue.history,
        ambiance: venue.ambiance,
      },
    })
  } catch (error) {
    console.error("Error fetching booker venue identity:", error)
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

    // Use the first associated venue (or could require venue_id in request)
    const venueId = relationships[0].venue_id

    const body = await request.json()
    const {
      venue_name,
      commercial_name,
      venue_type,
      capacity,
      location,
      history,
      ambiance,
    } = body

    // Get venue record
    const { data: existingVenue } = await supabase
      .from("venues")
      .select("id")
      .eq("id", venueId)
      .single()

    if (!existingVenue) {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      )
    }

    // Update venue record
    const capacityMin = capacity?.min || null
    const capacityMax = capacity?.max || null

    const { error } = await supabase
      .from("venues")
      .update({
        venue_name: venue_name || null,
        commercial_name: commercial_name || null,
        venue_type: venue_type || null,
        capacity_min: capacityMin,
        capacity_max: capacityMax,
        history: history || null,
        ambiance: Array.isArray(ambiance) ? ambiance : null,
      })
      .eq("id", venueId)

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update venue" },
        { status: 400 }
      )
    }

    // Update location if provided
    if (location) {
      const locationData: {
        venue_id: string
        address?: string | null
        city?: string | null
        postal_code?: string | null
        country?: string | null
        latitude?: number | null
        longitude?: number | null
        public_transport?: string[] | null
        parking?: string | null
        pmr_access?: boolean | null
      } = {
        venue_id: venueId,
      }

      if (location.address) locationData.address = location.address
      if (location.city) locationData.city = location.city
      if (location.postal_code) locationData.postal_code = location.postal_code
      if (location.country) locationData.country = location.country
      if (location.coordinates?.lat) locationData.latitude = location.coordinates.lat
      if (location.coordinates?.lng) locationData.longitude = location.coordinates.lng
      if (location.public_transport) locationData.public_transport = Array.isArray(location.public_transport) ? location.public_transport : null
      if (location.parking) locationData.parking = location.parking
      if (location.pmr_access !== undefined) locationData.pmr_access = location.pmr_access

      const { error: locationError } = await supabase
        .from("venue_locations")
        .upsert(locationData, { onConflict: "venue_id" })

      if (locationError) {
        return NextResponse.json(
          { error: locationError.message || "Failed to update location" },
          { status: 400 }
        )
      }
    }

    // Fetch updated venue data
    const { data: updatedVenue } = await supabase
      .from("venues")
      .select("*")
      .eq("id", venueId)
      .single()

    const { data: locationData } = await supabase
      .from("venue_locations")
      .select("*")
      .eq("venue_id", venueId)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        ...updatedVenue,
        capacity: updatedVenue.capacity_min || updatedVenue.capacity_max
          ? {
              min: updatedVenue.capacity_min,
              max: updatedVenue.capacity_max,
            }
          : null,
        location: locationData || null,
      },
    })
  } catch (error) {
    console.error("Error updating venue identity:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
