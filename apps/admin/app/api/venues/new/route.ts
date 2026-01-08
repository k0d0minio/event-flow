import { createClient } from "@ef/db/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@ef/db/types"

export async function POST(request: NextRequest) {
  try {
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
    const { email, password, venue_name, address, capacity_min, capacity_max } = body

    if (!email || !password || !venue_name) {
      return NextResponse.json(
        { error: "Email, password, and venue name are required" },
        { status: 400 }
      )
    }

    // Create user using admin API (requires service role key)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error: Service role key not available" },
        { status: 500 }
      )
    }

    const supabaseAdmin = createAdminClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (signUpError || !newUser.user) {
      return NextResponse.json(
        { error: signUpError?.message || "Failed to create user" },
        { status: 400 }
      )
    }

    // Update profile to venue role
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newUser.user.id,
        role: "venue",
        email: email,
      }, {
        onConflict: "id",
      })

    if (profileError) {
      console.error("Error updating profile:", profileError)
    }

    // Create venue record
    const { error: venueError } = await supabaseAdmin.from("venues").insert({
      profile_id: newUser.user.id,
      venue_name: venue_name,
      capacity_min: capacity_min || null,
      capacity_max: capacity_max || null,
    })

    if (venueError) {
      return NextResponse.json(
        { error: venueError.message || "Failed to create venue record" },
        { status: 400 }
      )
    }

    // Create location if address provided
    if (address) {
      await supabaseAdmin.from("venue_locations").insert({
        venue_id: (await supabaseAdmin.from("venues").select("id").eq("profile_id", newUser.user.id).single()).data?.id,
        address: address,
      })
    }

    return NextResponse.json({ success: true, id: newUser.user.id })
  } catch (error) {
    console.error("Error creating venue:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
