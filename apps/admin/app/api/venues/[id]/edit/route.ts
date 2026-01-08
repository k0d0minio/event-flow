import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { venue_name, capacity_min, capacity_max } = body

    if (!venue_name) {
      return NextResponse.json(
        { error: "Venue name is required" },
        { status: 400 }
      )
    }

    // Get venue record
    const { data: venue } = await supabase
      .from("venues")
      .select("id")
      .eq("profile_id", id)
      .single()

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 })
    }

    // Update venue record
    const { error: venueError } = await supabase
      .from("venues")
      .update({
        venue_name: venue_name,
        capacity_min: capacity_min || null,
        capacity_max: capacity_max || null,
      })
      .eq("id", venue.id)

    if (venueError) {
      return NextResponse.json(
        { error: venueError.message || "Failed to update venue" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating venue:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
