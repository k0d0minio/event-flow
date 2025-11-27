import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@ef/db/server"
import { Button } from "@ef/ui"
import type { SupabaseClient } from "@supabase/supabase-js"
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

  // Fetch artist profile data
  const { data: artistProfile } = await supabase
    .from("profiles")
    .select("id, role, artist_data, created_at, updated_at")
    .eq("id", id)
    .eq("role", "artist")
    .single()

  if (!artistProfile) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <p>Artist not found</p>
        </div>
      </div>
    )
  }

  const { data: artist } = await supabase.from("artists").select("*").eq("id", id).single()

  const { data: media } = await supabase
    .from("artist_media")
    .select("*")
    .eq("artist_id", id)
    .order("created_at", { ascending: false })

  // Calculate completion
  const artistData = (artistProfile.artist_data as Record<string, unknown>) || {}
  const fields = {
    stage_name: artistData.stage_name,
    formation_type: artistData.formation_type,
    bio_short: artistData.bio_short,
    years_active: artistData.years_active,
    professional_level: artistData.professional_level,
    primary_genre: artistData.primary_genre,
    sub_genres: artistData.sub_genres,
    influences: artistData.influences,
  }

  let filledCount = 0
  const totalFields = 8

  for (const value of Object.values(fields)) {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        if (value.length > 0) filledCount++
      } else if (typeof value === "string") {
        if (value.trim().length > 0) filledCount++
      } else {
        filledCount++
      }
    }
  }

  const hasAudio = media?.some((m) => m.type === "audio")
  const hasPhoto = media?.some((m) => m.type === "photo")
  const hasVideo = media?.some((m) => m.type === "video")
  const hasDocument = media?.some((m) => m.type === "document")

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
          stageName={artistData.stage_name as string | null | undefined}
          formationType={artistData.formation_type as string | null | undefined}
          professionalLevel={artistData.professional_level as string | null | undefined}
          completionPercentage={completionPercentage}
        />

        <ArtistContactActions artistId={id} userRole="venue" />

        <div className="grid gap-6 md:grid-cols-2">
          <ArtistIdentityView
            stageName={artistData.stage_name as string | null | undefined}
            formationType={artistData.formation_type as string | null | undefined}
            bioShort={artistData.bio_short as string | null | undefined}
            bioLong={artistData.bio_long as string | null | undefined}
            yearsActive={artistData.years_active as number | null | undefined}
            professionalLevel={artistData.professional_level as string | null | undefined}
          />

          <ArtistMusicalInfoView
            primaryGenre={artistData.primary_genre as string | null | undefined}
            subGenres={artistData.sub_genres as string[] | null | undefined}
            influences={artistData.influences as string[] | null | undefined}
          />
        </div>

        <ArtistMediaView 
          media={(media || []) as Array<{
            id: string
            type: "audio" | "photo" | "video" | "document"
            title: string | null
            storage_path: string
            metadata: Record<string, unknown> | null
          }>}
        />
      </div>
    </div>
  )
}

