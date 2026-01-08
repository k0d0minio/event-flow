import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@ef/db/server"
import { Card, Button } from "@ef/ui"
import { Music } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ArtistsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Verify user is venue
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "venue") {
    redirect("/")
  }

  // Fetch all active artists
  const { data: artists, error } = await supabase
    .from("artists")
    .select("id, profile_id, stage_name, primary_genre, bio_short")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching artists:", error)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Discover Artists</h1>
          <p className="text-muted-foreground mt-2">
            Browse and discover artists for your venue
          </p>
        </div>

        {artists && artists.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => {
              const stageName = artist.stage_name || "Unknown Artist"
              const primaryGenre = artist.primary_genre || "Unknown Genre"
              const bioShort = artist.bio_short || ""

              return (
                <Link key={artist.id} href={`/artists/${artist.profile_id}`}>
                  <Card className="p-6 hover:bg-accent transition-colors cursor-pointer h-full">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Music className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{stageName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{primaryGenre}</p>
                        {bioShort && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {bioShort.length > 100 ? `${bioShort.substring(0, 100)}...` : bioShort}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">No artists found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
