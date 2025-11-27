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

    // Verify user is an artist
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "artist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { primary_genre, sub_genres, influences } = body

    // Validate sub_genres limit
    if (sub_genres && Array.isArray(sub_genres) && sub_genres.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 sub-genres allowed" },
        { status: 400 }
      )
    }

    // Get current artist_data
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("artist_data")
      .eq("id", user.id)
      .single()

    const currentData = (currentProfile?.artist_data as Record<string, unknown>) || {}

    // Update artist_data with musical info fields
    const updatedData = {
      ...currentData,
      primary_genre: primary_genre || null,
      sub_genres: sub_genres && Array.isArray(sub_genres) ? sub_genres : null,
      influences: influences && Array.isArray(influences) ? influences : null,
    }

    const { error } = await supabase
      .from("profiles")
      .update({ artist_data: updatedData })
      .eq("id", user.id)

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update profile" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error("Error updating musical info:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

