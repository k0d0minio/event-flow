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
    const { technical_equipment } = body

    // Get current venue_data
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("venue_data")
      .eq("id", user.id)
      .single()

    const currentData = (currentProfile?.venue_data as Record<string, unknown>) || {}

    // Update venue_data with technical equipment fields
    const updatedData = {
      ...currentData,
      technical_equipment: technical_equipment || null,
    }

    const { error } = await supabase
      .from("profiles")
      .update({ venue_data: updatedData })
      .eq("id", user.id)

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update profile" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error("Error updating technical equipment:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

