import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@ef/db/server"
import { Card, DashboardLayout, PageHeader } from "@ef/ui"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <DashboardLayout
      header={{
        title: "Artist Dashboard",
        description: `Welcome back, ${user.email}`,
      }}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/artist/profile">
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
            <p className="text-muted-foreground text-sm">
              Complete your artist profile and upload media
            </p>
          </Card>
        </Link>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Your Bookings</h2>
          <p className="text-muted-foreground text-sm">
            View and manage your upcoming performances
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Discover Venues</h2>
          <p className="text-muted-foreground text-sm">
            Find perfect venues that match your style
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-muted-foreground text-sm">
            Track your performance and growth
          </p>
        </Card>
      </div>
    </DashboardLayout>
  )
}

