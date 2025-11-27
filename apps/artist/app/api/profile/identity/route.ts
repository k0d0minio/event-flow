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
    const {
      stage_name,
      formation_type,
      bio_short,
      bio_long,
      years_active,
      professional_level,
    } = body

    // Get current artist_data
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("artist_data")
      .eq("id", user.id)
      .single()

    const currentData = (currentProfile?.artist_data as Record<string, unknown>) || {}

    // Update artist_data with identity fields
    const updatedData = {
      ...currentData,
      stage_name: stage_name || null,
      formation_type: formation_type || null,
      bio_short: bio_short || null,
      bio_long: bio_long || null,
      years_active: years_active || null,
      professional_level: professional_level || null,
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
    console.error("Error updating artist identity:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

