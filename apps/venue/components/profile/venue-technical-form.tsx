"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Textarea } from "@ef/ui"
import { ProfileSection } from "./profile-section"
import { toast } from "sonner"

const technicalSchema = z.object({
  technical_equipment: z
    .object({
      sound_system: z.string().optional(),
      lighting: z.string().optional(),
      stage: z.string().optional(),
      control_room: z.string().optional(),
      artist_spaces: z.string().optional(),
    })
    .optional(),
})

type TechnicalFormData = z.infer<typeof technicalSchema>

interface VenueTechnicalFormProps {
  initialData?: {
    technical_equipment?: {
      sound_system?: string
      lighting?: string
      stage?: string
      control_room?: string
      artist_spaces?: string
    } | null
  }
  onUpdate?: () => void
}

export function VenueTechnicalForm({ initialData, onUpdate }: VenueTechnicalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TechnicalFormData>({
    resolver: zodResolver(technicalSchema),
    defaultValues: {
      technical_equipment: initialData?.technical_equipment || {
        sound_system: "",
        lighting: "",
        stage: "",
        control_room: "",
        artist_spaces: "",
      },
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        technical_equipment: initialData.technical_equipment || {
          sound_system: "",
          lighting: "",
          stage: "",
          control_room: "",
          artist_spaces: "",
        },
      })
    }
  }, [initialData, form])

  const onSubmit = async (data: TechnicalFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/profile/technical", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update technical equipment")
      }

      toast.success("Technical equipment updated successfully")
      onUpdate?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update technical equipment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProfileSection
      title="Technical Equipment"
      description="Specify your sound system, lighting, stage, and technical setup"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="technical_equipment.sound_system"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sound System</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Power, brands, configuration, number of speakers..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technical_equipment.lighting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lighting</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Types, number of fixtures, console, DMX channels..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technical_equipment.stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Dimensions, height, floor type, access..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technical_equipment.control_room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Room</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Position, equipment, accessibility..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technical_equipment.artist_spaces"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist Spaces</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Dressing rooms, storage, vehicle access..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </ProfileSection>
  )
}

