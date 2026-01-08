import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@ef/db/server"
import { Button } from "@ef/ui"
import {
  ArtistProfileHeader,
  ArtistIdentityView,
  ArtistMusicalInfoView,
  ArtistMediaView,
  ArtistContactActions,
} from "@ef/ui"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ArtistViewPage({
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

  // Verify user is venue
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "venue") {
    redirect("/")
  }

  // Fetch artist record
  const { data: artist } = await supabase
    .from("artists")
    .select("*")
    .eq("profile_id", id)
    .single()

  if (!artist) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <p>Artist not found</p>
        </div>
      </div>
    )
  }

  // Fetch genres and influences
  const { data: genres } = await supabase
    .from("artist_genres")
    .select("genre")
    .eq("artist_id", artist.id)

  const { data: influences } = await supabase
    .from("artist_influences")
    .select("influence")
    .eq("artist_id", artist.id)

  // Fetch media
  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("entity_type", "artist")
    .eq("entity_id", artist.id)
    .order("created_at", { ascending: false })

  // Calculate completion
  const fields = {
    stage_name: artist.stage_name,
    formation_type: artist.formation_type,
    bio_short: artist.bio_short,
    years_active: artist.years_active,
    professional_level: artist.professional_level,
    primary_genre: artist.primary_genre,
    sub_genres: genres && genres.length > 0,
    influences: influences && influences.length > 0,
  }

  let filledCount = 0
  const totalFields = 8

  for (const value of Object.values(fields)) {
    if (value !== null && value !== undefined) {
      if (typeof value === "boolean") {
        if (value) filledCount++
      } else if (typeof value === "string") {
        if (value.trim().length > 0) filledCount++
      } else {
        filledCount++
      }
    }
  }

  const hasAudio = media?.some((m) => m.media_type === "audio")
  const hasPhoto = media?.some((m) => m.media_type === "photo")
  const hasVideo = media?.some((m) => m.media_type === "video")
  const hasDocument = media?.some((m) => m.media_type === "document")

  if (hasAudio) filledCount++
  if (hasPhoto) filledCount++
  if (hasVideo) filledCount++
  if (hasDocument) filledCount++

  const totalFieldsWithMedia = totalFields + 4
  const completionPercentage = Math.round((filledCount / totalFieldsWithMedia) * 100)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link href="/artists">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Artists
          </Button>
        </Link>

        <ArtistProfileHeader
          stageName={artist.stage_name}
          formationType={artist.formation_type}
          professionalLevel={artist.professional_level}
          completionPercentage={completionPercentage}
        />

        <ArtistContactActions artistId={id} userRole="venue" />

        <div className="grid gap-6 md:grid-cols-2">
          <ArtistIdentityView
            stageName={artist.stage_name}
            formationType={artist.formation_type}
            bioShort={artist.bio_short}
            bioLong={artist.bio_long}
            yearsActive={artist.years_active}
            professionalLevel={artist.professional_level}
          />

          <ArtistMusicalInfoView
            primaryGenre={artist.primary_genre}
            subGenres={genres?.map((g) => g.genre) || []}
            influences={influences?.map((i) => i.influence) || []}
          />
        </div>

        <ArtistMediaView 
          media={(media || []) as Array<{
            id: string
            media_type: "audio" | "photo" | "video" | "document"
            title: string | null
            storage_path: string
            metadata: Record<string, unknown> | null
          }>}
        />
      </div>
    </div>
  )
}
