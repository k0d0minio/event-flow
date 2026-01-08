"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@ef/db/client"
import { CompletionProgress } from "@/components/profile/completion-progress"
import { VenueIdentityForm } from "@/components/profile/venue-identity-form"
import { VenueTechnicalForm } from "@/components/profile/venue-technical-form"
import { VenueProgrammingForm } from "@/components/profile/venue-programming-form"
import { VenueServicesForm } from "@/components/profile/venue-services-form"
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

      // Load profile data from API routes
      try {
        const [identityRes, technicalRes, programmingRes, servicesRes] = await Promise.all([
          fetch("/api/venue/profile/identity"),
          fetch("/api/venue/profile/technical"),
          fetch("/api/venue/profile/programming"),
          fetch("/api/venue/profile/services"),
        ])

        const identityData = identityRes.ok ? await identityRes.json() : null
        const technicalData = technicalRes.ok ? await technicalRes.json() : null
        const programmingData = programmingRes.ok ? await programmingRes.json() : null
        const servicesData = servicesRes.ok ? await servicesRes.json() : null

        setProfileData({
          ...(identityData?.data || {}),
          ...(technicalData?.data || {}),
          ...(programmingData?.data || {}),
          ...(servicesData?.data || {}),
        })
      } catch (error) {
        console.error("Error loading profile data:", error)
      }

      setLoading(false)
    }

    loadUser()
  }, [supabase, router])

  const handleUpdate = async () => {
    setRefreshTrigger((prev) => prev + 1)
    // Reload profile data
    if (!user) return
    try {
      const [identityRes, technicalRes, programmingRes, servicesRes] = await Promise.all([
        fetch("/api/venue/profile/identity"),
        fetch("/api/venue/profile/technical"),
        fetch("/api/venue/profile/programming"),
        fetch("/api/venue/profile/services"),
      ])

      const identityData = identityRes.ok ? await identityRes.json() : null
      const technicalData = technicalRes.ok ? await technicalRes.json() : null
      const programmingData = programmingRes.ok ? await programmingRes.json() : null
      const servicesData = servicesRes.ok ? await servicesRes.json() : null

      setProfileData({
        ...(identityData?.data || {}),
        ...(technicalData?.data || {}),
        ...(programmingData?.data || {}),
        ...(servicesData?.data || {}),
      })
    } catch (error) {
      console.error("Error reloading profile data:", error)
    }
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
    venue_name: profileData?.venue_name as string | null | undefined,
    commercial_name: profileData?.commercial_name as string | null | undefined,
    venue_type: profileData?.venue_type as string | null | undefined,
    capacity: profileData?.capacity as { min?: number; max?: number; configurations?: string[] } | null | undefined,
    location: profileData?.location as {
      address?: string
      city?: string
      postal_code?: string
      country?: string
      coordinates?: { lat?: number; lng?: number }
      public_transport?: string[]
      parking?: string
      pmr_access?: boolean
    } | null | undefined,
    history: profileData?.history as string | null | undefined,
    ambiance: profileData?.ambiance as string[] | null | undefined,
    preferred_genres: profileData?.preferred_genres as string[] | null | undefined,
  }

  const technicalData = {
    technical_equipment: profileData?.technical_equipment as {
      sound_system?: string
      lighting?: string
      stage?: string
      control_room?: string
      artist_spaces?: string
    } | null | undefined,
  }

  const programmingData = {
    programming: profileData?.programming as {
      preferred_genres?: string[]
      excluded_genres?: string[]
      event_frequency?: string
      preferred_schedule?: string
      budget_range?: string
    } | null | undefined,
  }

  const servicesData = {
    services: profileData?.services as {
      accommodation?: { available?: boolean; capacity?: number }
      catering?: { available?: boolean; type?: string }
      ticketing?: string
    } | null | undefined,
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Venue Profile</h1>
          <p className="text-muted-foreground mt-2">
            Complete your profile to help artists discover your venue
          </p>
        </div>

        <CompletionProgress refreshTrigger={refreshTrigger} />

        <Tabs defaultValue="identity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="programming">Programming</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="space-y-6">
            <VenueIdentityForm initialData={identityData} onUpdate={handleUpdate} />
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <VenueTechnicalForm initialData={technicalData} onUpdate={handleUpdate} />
          </TabsContent>

          <TabsContent value="programming" className="space-y-6">
            <VenueProgrammingForm initialData={programmingData} onUpdate={handleUpdate} />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <VenueServicesForm initialData={servicesData} onUpdate={handleUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

