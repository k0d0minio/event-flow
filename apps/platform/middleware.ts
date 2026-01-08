import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Allow access to root (login) and auth callback routes
  if (pathname === "/" || pathname.startsWith("/auth/")) {
    if (user) {
      // If user is logged in, fetch their role and redirect to appropriate dashboard
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role === "artist") {
        return NextResponse.redirect(new URL("/artist/dashboard", request.url))
      } else if (profile?.role === "venue") {
        // Default to venue dashboard (booker can be handled separately if needed)
        return NextResponse.redirect(new URL("/venue/dashboard", request.url))
      } else if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
    }
    return response
  }

  // Protect all other routes
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Verify role matches route prefix
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const userRole = profile.role

  // Check if route requires specific role
  if (pathname.startsWith("/artist/")) {
    if (userRole !== "artist") {
      // Redirect to appropriate dashboard based on role
      if (userRole === "venue") {
        return NextResponse.redirect(new URL("/venue/dashboard", request.url))
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
  } else if (pathname.startsWith("/booker/") || pathname.startsWith("/venue/")) {
    if (userRole !== "venue") {
      // Redirect to appropriate dashboard based on role
      if (userRole === "artist") {
        return NextResponse.redirect(new URL("/artist/dashboard", request.url))
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
  } else if (pathname.startsWith("/api/artist/")) {
    if (userRole !== "artist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else if (pathname.startsWith("/api/booker/") || pathname.startsWith("/api/venue/")) {
    if (userRole !== "venue") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

