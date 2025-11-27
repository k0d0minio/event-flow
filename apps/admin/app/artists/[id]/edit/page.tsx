import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@ef/db/server"
import { EditArtistForm } from "./edit-artist-form"

export const dynamic = "force-dynamic"

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  // Fetch artist
  const { data: artist, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !artist) {
    redirect("/artists")
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/artists"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          ← Back to Artists
        </Link>
        <EditArtistForm artist={artist} />
      </div>
    </div>
  )
}

