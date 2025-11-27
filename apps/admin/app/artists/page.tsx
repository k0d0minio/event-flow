import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@ef/db/server"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ef/ui"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { DeleteArtistButton } from "./delete-artist-button"

export const dynamic = "force-dynamic"

export default async function ArtistsPage() {
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

  // Fetch all artists
  const { data: artists, error } = await supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching artists:", error)
  }

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return "-"
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Artists</h1>
            <p className="text-muted-foreground mt-2">Manage all artists in the system</p>
          </div>
          <Link href="/artists/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Artist</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>

        {artists && artists.length > 0 ? (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Display Name</TableHead>
                  <TableHead className="min-w-[100px]">Genre</TableHead>
                  <TableHead className="min-w-[200px]">Bio</TableHead>
                  <TableHead className="whitespace-nowrap">Created At</TableHead>
                  <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artists.map((artist) => (
                  <TableRow key={artist.id}>
                    <TableCell className="font-medium">
                      {artist.display_name || "-"}
                    </TableCell>
                    <TableCell>{artist.genre || "-"}</TableCell>
                    <TableCell className="max-w-md">
                      {truncateText(artist.bio)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(artist.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Link href={`/artists/${artist.id}/edit`}>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <Pencil className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </Link>
                        <div className="w-full sm:w-auto">
                          <DeleteArtistButton artistId={artist.id} artistName={artist.display_name || "Unknown"} />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">No artists found.</p>
            <Link href="/artists/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Artist
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

