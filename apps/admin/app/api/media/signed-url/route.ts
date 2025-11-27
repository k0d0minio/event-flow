import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { type, storagePath } = await request.json()

    if (!type || !storagePath) {
      return NextResponse.json(
        { error: "Type and storagePath are required" },
        { status: 400 }
      )
    }

    // Video URLs are returned as-is
    if (type === "video") {
      return NextResponse.json({ url: storagePath })
    }

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

    const bucket =
      type === "audio"
        ? "artist-audio"
        : type === "photo"
          ? "artist-photos"
          : "artist-documents"

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, 3600)

    if (error) {
      console.error("Error creating signed URL:", error)
      return NextResponse.json(
        { error: "Failed to create signed URL", placeholder: true },
        { status: 503 }
      )
    }

    return NextResponse.json({ url: data?.signedUrl || null })
  } catch (error) {
    console.error("Error in signed-url route:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

