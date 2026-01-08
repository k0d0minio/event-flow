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
    const { email, password, stage_name, bio_short, primary_genre } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    // Update profile to artist role (trigger creates it with 'artist' by default, but let's ensure it's set)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newUser.user.id,
        role: "artist",
        email: email,
      }, {
        onConflict: "id",
      })

    if (profileError) {
      console.error("Error updating profile:", profileError)
      // Continue anyway, the trigger should have created it
    }

    // Create artist record
    const { error: artistError } = await supabaseAdmin.from("artists").insert({
      profile_id: newUser.user.id,
      stage_name: stage_name || null,
      bio_short: bio_short || null,
      primary_genre: primary_genre || null,
    })

    if (artistError) {
      return NextResponse.json(
        { error: artistError.message || "Failed to create artist record" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, id: newUser.user.id })
  } catch (error) {
    console.error("Error creating artist:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
