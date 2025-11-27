import { redirect } from "next/navigation"
import { createClient } from "@ef/db/server"
import { Button, Card } from "@ef/ui"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Verify user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, <span className="font-bold capitalize ">
                 {user?.email?.split("@")[0]}
                </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Manage Artists</h2>
            <p className="text-muted-foreground text-sm mb-4">
              View, create, edit, and delete artist profiles
            </p>
            <a href="/artists">
              <Button variant="outline">Go to Artists</Button>
            </a>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Manage Venues</h2>
            <p className="text-muted-foreground text-sm mb-4">
              View, create, edit, and delete venue profiles
            </p>
            <a href="/venues">
              <Button variant="outline">Go to Venues</Button>
            </a>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">System Overview</h2>
            <p className="text-muted-foreground text-sm">
              Admin dashboard for Flow Stage platform management
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

