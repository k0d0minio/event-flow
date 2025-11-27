"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@ef/ui"
import { ProfileSection } from "./profile-section"
import { toast } from "sonner"

const identitySchema = z.object({
  stage_name: z.string().min(1, "Stage name is required").max(100),
  formation_type: z.enum(["solo", "duo", "group", "orchestra", "hybrid"]),
  bio_short: z.string().max(500, "Bio must be 500 characters or less").optional(),
  bio_long: z.string().optional(),
  years_active: z.number().int().min(0).max(100).optional(),
  professional_level: z.enum(["amateur", "semi-pro", "professional"]).optional(),
})

type IdentityFormData = z.infer<typeof identitySchema>

interface ArtistIdentityFormProps {
  initialData?: {
    stage_name?: string | null
    formation_type?: string | null
    bio_short?: string | null
    bio_long?: string | null
    years_active?: number | null
    professional_level?: string | null
  }
  onUpdate?: () => void
}

export function ArtistIdentityForm({ initialData, onUpdate }: ArtistIdentityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      stage_name: initialData?.stage_name || "",
      formation_type: (initialData?.formation_type as IdentityFormData["formation_type"]) || "solo",
      bio_short: initialData?.bio_short || "",
      bio_long: initialData?.bio_long || "",
      years_active: initialData?.years_active || undefined,
      professional_level: (initialData?.professional_level as IdentityFormData["professional_level"]) || undefined,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        stage_name: initialData.stage_name || "",
        formation_type: (initialData.formation_type as IdentityFormData["formation_type"]) || "solo",
        bio_short: initialData.bio_short || "",
        bio_long: initialData.bio_long || "",
        years_active: initialData.years_active || undefined,
        professional_level: (initialData.professional_level as IdentityFormData["professional_level"]) || undefined,
      })
    }
  }, [initialData, form])

  const onSubmit = async (data: IdentityFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/profile/identity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      toast.success("Profile updated successfully")
      onUpdate?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const bioShortLength = form.watch("bio_short")?.length || 0

  return (
    <ProfileSection
      title="Artist Identity"
      description="Tell us about yourself and your musical identity"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="stage_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage Name / Group Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your stage name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="formation_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formation Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select formation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="duo">Duo</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="orchestra">Orchestra</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio_short"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Short Bio <span className="text-muted-foreground">({bioShortLength}/500)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A brief description of your music (max 500 characters)"
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
            name="bio_long"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long Bio (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A more detailed description of your music and background"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="years_active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years Active</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professional_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="amateur">Amateur</SelectItem>
                      <SelectItem value="semi-pro">Semi-Pro</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </ProfileSection>
  )
}

