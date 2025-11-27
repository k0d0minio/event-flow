import { redirect } from "next/navigation"
import { createClient } from "@ef/db/server"
import { Button, Card } from "@ef/ui"
import { LogOut, User } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"

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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Artist Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/profile">
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/profile">
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
      </div>
    </div>
  )
}

