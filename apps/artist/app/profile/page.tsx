"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@ef/db/client"
import { CompletionProgress } from "@/components/profile/completion-progress"
import { ArtistIdentityForm } from "@/components/profile/artist-identity-form"
import { MusicalInfoForm } from "@/components/profile/musical-info-form"
import { AudioPlayer } from "@/components/profile/audio-player"
import { PhotoGallery } from "@/components/profile/photo-gallery"
import { VideoList } from "@/components/profile/video-list"
import { DocumentUpload } from "@/components/profile/document-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ef/ui"

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<Record<string, unknown> | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push("/")
        return
      }
      setUser(currentUser)

      // Load profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("artist_data")
        .eq("id", currentUser.id)
        .single()

      if (profile?.artist_data) {
        setProfileData(profile.artist_data as Record<string, unknown>)
      }

      setLoading(false)
    }

    loadUser()
  }, [supabase])

  const handleUpdate = () => {
    // Reload profile data after update
    const reloadData = async () => {
      if (!user) return
      const { data: profile } = await supabase
        .from("profiles")
        .select("artist_data")
        .eq("id", user.id)
        .single()

      if (profile?.artist_data) {
        setProfileData(profile.artist_data as Record<string, unknown>)
      }
      // Trigger completion status refresh
      setRefreshTrigger((prev) => prev + 1)
    }
    reloadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const identityData = {
    stage_name: profileData?.stage_name as string | null | undefined,
    formation_type: profileData?.formation_type as string | null | undefined,
    bio_short: profileData?.bio_short as string | null | undefined,
    bio_long: profileData?.bio_long as string | null | undefined,
    years_active: profileData?.years_active as number | null | undefined,
    professional_level: profileData?.professional_level as string | null | undefined,
  }

  const musicalData = {
    primary_genre: profileData?.primary_genre as string | null | undefined,
    sub_genres: profileData?.sub_genres as string[] | null | undefined,
    influences: profileData?.influences as string[] | null | undefined,
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Artist Profile</h1>
          <p className="text-muted-foreground mt-2">
            Complete your profile to help venues discover your music
          </p>
        </div>

        <CompletionProgress refreshTrigger={refreshTrigger} />

        <Tabs defaultValue="identity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="musical">Musical Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="space-y-6">
            <ArtistIdentityForm initialData={identityData} onUpdate={handleUpdate} />
          </TabsContent>

          <TabsContent value="musical" className="space-y-6">
            <MusicalInfoForm initialData={musicalData} onUpdate={handleUpdate} />
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <AudioPlayer />
            <PhotoGallery />
            <VideoList />
            <DocumentUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

