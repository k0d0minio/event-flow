import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function DELETE(
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

    // Get artist record
    const { data: artist } = await supabase
      .from("artists")
      .select("id")
      .eq("profile_id", id)
      .single()

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    // Delete artist record (cascade will handle related records if configured)
    const { error: artistError } = await supabase
      .from("artists")
      .delete()
      .eq("id", artist.id)

    if (artistError) {
      return NextResponse.json(
        { error: artistError.message || "Failed to delete artist" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting artist:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
