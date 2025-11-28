import { redirect } from "next/navigation"
import { createClient } from "@ef/db/server"
import { Button, Card, DashboardLayout, PageHeader } from "@ef/ui"

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
    <DashboardLayout
      header={{
        title: "Admin Dashboard",
        description: `Welcome back, ${user?.email?.split("@")[0]}`,
      }}
    >
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
    </DashboardLayout>
  )
}

