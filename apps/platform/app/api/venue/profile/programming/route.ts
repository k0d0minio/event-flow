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
          programming: null,
        },
      })
    }

    // Get programming data
    const { data: programming } = await supabase
      .from("venue_programming")
      .select("*")
      .eq("venue_id", venue.id)
      .single()

    // Get genres
    const { data: genres } = await supabase
      .from("venue_genres")
      .select("genre, is_preferred")
      .eq("venue_id", venue.id)

    const preferredGenres = genres?.filter((g) => g.is_preferred).map((g) => g.genre) || []
    const excludedGenres = genres?.filter((g) => !g.is_preferred).map((g) => g.genre) || []

    return NextResponse.json({
      success: true,
      data: {
        programming: programming
          ? {
              preferred_genres: preferredGenres,
              excluded_genres: excludedGenres,
              event_frequency: programming.event_frequency,
              preferred_schedule: programming.preferred_schedule,
              budget_range: programming.budget_range_min && programming.budget_range_max
                ? `€${programming.budget_range_min} - €${programming.budget_range_max} per show`
                : null,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("Error fetching programming info:", error)
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
    const { programming } = body

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
          venue_id: venue.id,
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
      await supabase.from("venue_genres").delete().eq("venue_id", venue.id)

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
            venue_id: venue.id,
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
      .eq("venue_id", venue.id)
      .single()

    const { data: genres } = await supabase
      .from("venue_genres")
      .select("genre, is_preferred")
      .eq("venue_id", venue.id)

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
