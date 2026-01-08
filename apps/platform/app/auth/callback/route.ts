import { createClient } from "@ef/db/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Fetch user role to redirect appropriately
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role === "artist") {
        return NextResponse.redirect(new URL("/artist/dashboard", requestUrl.origin))
      } else if (profile?.role === "venue") {
        // Default to venue dashboard
        return NextResponse.redirect(new URL("/venue/dashboard", requestUrl.origin))
      } else if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", requestUrl.origin))
      }
    }
  }

  // Default redirect to login if role cannot be determined
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}

