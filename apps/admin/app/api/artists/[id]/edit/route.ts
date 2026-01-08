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
    const { stage_name, bio_short, bio_long, primary_genre } = body

    // Get artist record
    const { data: artist } = await supabase
      .from("artists")
      .select("id")
      .eq("profile_id", id)
      .single()

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    // Update artist record
    const { error: artistError } = await supabase
      .from("artists")
      .update({
        stage_name: stage_name || null,
        bio_short: bio_short || null,
        bio_long: bio_long || null,
        primary_genre: primary_genre || null,
      })
      .eq("id", artist.id)

    if (artistError) {
      return NextResponse.json(
        { error: artistError.message || "Failed to update artist" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating artist:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
