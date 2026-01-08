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
        success: true,
        data: {
          venue_name: null,
          commercial_name: null,
          venue_type: null,
          capacity: null,
          location: null,
          history: null,
          ambiance: null,
          preferred_genres: [],
        },
      })
    }

    // Get location
    const { data: location } = await supabase
      .from("venue_locations")
      .select("*")
      .eq("venue_id", venue.id)
      .single()

    // Get preferred genres
    const { data: genres } = await supabase
      .from("venue_genres")
      .select("genre")
      .eq("venue_id", venue.id)
      .eq("is_preferred", true)

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
        preferred_genres: genres?.map((g) => g.genre) || [],
      },
    })
  } catch (error) {
    console.error("Error fetching venue identity:", error)
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
    const {
      venue_name,
      commercial_name,
      venue_type,
      capacity,
      location,
      history,
      ambiance,
      preferred_genres,
    } = body

    // Get or create venue record
    const { data: existingVenue } = await supabase
      .from("venues")
      .select("id")
      .eq("profile_id", user.id)
      .single()

    let venueId: string

    if (existingVenue) {
      venueId = existingVenue.id
      // Update existing venue record
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
    } else {
      // Create new venue record
      const capacityMin = capacity?.min || null
      const capacityMax = capacity?.max || null

      const { data: newVenue, error } = await supabase
        .from("venues")
        .insert({
          profile_id: user.id,
          venue_name: venue_name || null,
          commercial_name: commercial_name || null,
          venue_type: venue_type || null,
          capacity_min: capacityMin,
          capacity_max: capacityMax,
          history: history || null,
          ambiance: Array.isArray(ambiance) ? ambiance : null,
        })
        .select("id")
        .single()

      if (error || !newVenue) {
        return NextResponse.json(
          { error: error?.message || "Failed to create venue" },
          { status: 400 }
        )
      }
      venueId = newVenue.id
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

    // Update preferred genres if provided
    if (preferred_genres !== undefined) {
      // Delete existing preferred genres
      await supabase
        .from("venue_genres")
        .delete()
        .eq("venue_id", venueId)
        .eq("is_preferred", true)

      // Insert new preferred genres if provided
      if (Array.isArray(preferred_genres) && preferred_genres.length > 0) {
        const genresToInsert = preferred_genres
          .filter((g: unknown) => typeof g === "string" && g.trim() !== "")
          .map((genre: string) => ({
            venue_id: venueId,
            genre: genre.trim(),
            is_preferred: true,
          }))

        if (genresToInsert.length > 0) {
          const { error: genresError } = await supabase
            .from("venue_genres")
            .insert(genresToInsert)

          if (genresError) {
            return NextResponse.json(
              { error: genresError.message || "Failed to update genres" },
              { status: 400 }
            )
          }
        }
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

    // Get preferred genres
    const { data: genres } = await supabase
      .from("venue_genres")
      .select("genre")
      .eq("venue_id", venueId)
      .eq("is_preferred", true)

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
        preferred_genres: genres?.map((g) => g.genre) || [],
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
