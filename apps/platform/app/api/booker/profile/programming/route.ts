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
    const { programming } = body

    const progData = programming || {}

    // Update programming preferences
    const budgetRange = progData.budget_range
    let budgetMin: number | null = null
    let budgetMax: number | null = null

    if (budgetRange) {
      // Parse budget range string like "€500 - €2000 per show"
      const match = budgetRange.match(/€?\s*(\d+)\s*-\s*€?\s*(\d+)/i)
      if (match) {
        budgetMin = parseInt(match[1], 10)
        budgetMax = parseInt(match[2], 10)
      }
    }

    const { error: progError } = await supabase
      .from("venue_programming")
      .upsert(
        {
          venue_id: venueId,
          event_frequency: progData.event_frequency || null,
          preferred_schedule: progData.preferred_schedule || null,
          budget_range_min: budgetMin,
          budget_range_max: budgetMax,
        },
        { onConflict: "venue_id" }
      )

    if (progError) {
      return NextResponse.json(
        { error: progError.message || "Failed to update programming" },
        { status: 400 }
      )
    }

    // Update genres
    if (progData.preferred_genres !== undefined || progData.excluded_genres !== undefined) {
      // Delete existing genres
      await supabase.from("venue_genres").delete().eq("venue_id", venueId)

      // Insert preferred genres
      if (Array.isArray(progData.preferred_genres) && progData.preferred_genres.length > 0) {
        const preferredGenres = progData.preferred_genres
          .filter((g: unknown) => typeof g === "string" && g.trim() !== "")
          .map((genre: string) => ({
            venue_id: venue.id,
            genre: genre.trim(),
            is_preferred: true,
          }))

        if (preferredGenres.length > 0) {
          await supabase.from("venue_genres").insert(preferredGenres)
        }
      }

      // Insert excluded genres
      if (Array.isArray(progData.excluded_genres) && progData.excluded_genres.length > 0) {
        const excludedGenres = progData.excluded_genres
          .filter((g: unknown) => typeof g === "string" && g.trim() !== "")
          .map((genre: string) => ({
            venue_id: venueId,
            genre: genre.trim(),
            is_preferred: false,
          }))

        if (excludedGenres.length > 0) {
          await supabase.from("venue_genres").insert(excludedGenres)
        }
      }
    }

    // Fetch updated data
    const { data: updatedProg } = await supabase
      .from("venue_programming")
      .select("*")
      .eq("venue_id", venueId)
      .single()

    const { data: genres } = await supabase
      .from("venue_genres")
      .select("genre, is_preferred")
      .eq("venue_id", venueId)

    const preferredGenres = genres?.filter((g) => g.is_preferred).map((g) => g.genre) || []
    const excludedGenres = genres?.filter((g) => !g.is_preferred).map((g) => g.genre) || []

    return NextResponse.json({
      success: true,
      data: {
        programming: {
          preferred_genres: preferredGenres,
          excluded_genres: excludedGenres,
          event_frequency: updatedProg?.event_frequency,
          preferred_schedule: updatedProg?.preferred_schedule,
          budget_range: updatedProg?.budget_range_min && updatedProg?.budget_range_max
            ? `€${updatedProg.budget_range_min} - €${updatedProg.budget_range_max} per show`
            : null,
        },
      },
    })
  } catch (error) {
    console.error("Error updating programming info:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
