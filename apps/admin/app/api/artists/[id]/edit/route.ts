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
    const { display_name, bio, genre } = body

    // Update artist record
    const { error: artistError } = await supabase
      .from("artists")
      .update({
        display_name: display_name || null,
        bio: bio || null,
        genre: genre || null,
      })
      .eq("id", id)

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

