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
        title: "Booker Dashboard",
        description: `Welcome back, ${user.email}`,
      }}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Booking Pipeline</h2>
          <p className="text-muted-foreground text-sm">
            Manage your artist bookings and events
          </p>
        </Card>

        <Link href="/booker/artists">
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Discover Artists</h2>
            <p className="text-muted-foreground text-sm">
              Find artists that match your venue style
            </p>
          </Card>
        </Link>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Insights</h2>
          <p className="text-muted-foreground text-sm">
            View analytics and optimize your programming
          </p>
        </Card>
      </div>
    </DashboardLayout>
  )
}

