"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@ef/ui"
import { ProfileSection } from "./profile-section"
import { toast } from "sonner"
import { X } from "lucide-react"

const programmingSchema = z.object({
  programming: z
    .object({
      preferred_genres: z.array(z.string()).optional(),
      excluded_genres: z.array(z.string()).optional(),
      event_frequency: z.string().optional(),
      preferred_schedule: z.string().optional(),
      budget_range: z.string().optional(),
    })
    .optional(),
})

type ProgrammingFormData = z.infer<typeof programmingSchema>

interface VenueProgrammingFormProps {
  initialData?: {
    programming?: {
      preferred_genres?: string[]
      excluded_genres?: string[]
      event_frequency?: string
      preferred_schedule?: string
      budget_range?: string
    } | null
  }
  onUpdate?: () => void
}

const COMMON_GENRES = [
  "Rock", "Pop", "Jazz", "Blues", "Country", "Folk", "Electronic", "Hip-Hop",
  "R&B", "Classical", "Reggae", "Metal", "Punk", "Indie", "Alternative",
  "Soul", "Funk", "Latin", "World", "Ambient", "Experimental",
]

export function VenueProgrammingForm({ initialData, onUpdate }: VenueProgrammingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preferredGenreInput, setPreferredGenreInput] = useState("")
  const [excludedGenreInput, setExcludedGenreInput] = useState("")

  const form = useForm<ProgrammingFormData>({
    resolver: zodResolver(programmingSchema),
    defaultValues: {
      programming: initialData?.programming || {
        preferred_genres: [],
        excluded_genres: [],
        event_frequency: "",
        preferred_schedule: "",
        budget_range: "",
      },
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        programming: initialData.programming || {
          preferred_genres: [],
          excluded_genres: [],
          event_frequency: "",
          preferred_schedule: "",
          budget_range: "",
        },
      })
    }
  }, [initialData, form])

  const preferredGenres = form.watch("programming.preferred_genres") || []
  const excludedGenres = form.watch("programming.excluded_genres") || []

  const addPreferredGenre = () => {
    if (preferredGenreInput.trim()) {
      const current = form.getValues("programming.preferred_genres") || []
      form.setValue("programming.preferred_genres", [...current, preferredGenreInput.trim()])
      setPreferredGenreInput("")
    }
  }

  const removePreferredGenre = (index: number) => {
    const current = form.getValues("programming.preferred_genres") || []
    form.setValue("programming.preferred_genres", current.filter((_, i) => i !== index))
  }

  const addExcludedGenre = () => {
    if (excludedGenreInput.trim()) {
      const current = form.getValues("programming.excluded_genres") || []
      form.setValue("programming.excluded_genres", [...current, excludedGenreInput.trim()])
      setExcludedGenreInput("")
    }
  }

  const removeExcludedGenre = (index: number) => {
    const current = form.getValues("programming.excluded_genres") || []
    form.setValue("programming.excluded_genres", current.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProgrammingFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/profile/programming", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update programming preferences")
      }

      toast.success("Programming preferences updated successfully")
      onUpdate?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update programming preferences")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProfileSection
      title="Programming Preferences"
      description="Define your musical preferences and event scheduling"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="programming.preferred_genres"
            render={() => (
              <FormItem>
                <FormLabel>Preferred Genres</FormLabel>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a preferred genre"
                      value={preferredGenreInput}
                      onChange={(e) => setPreferredGenreInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addPreferredGenre()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addPreferredGenre} disabled={!preferredGenreInput.trim()}>
                      Add
                    </Button>
                  </div>
                  {preferredGenres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {preferredGenres.map((genre, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                        >
                          <span>{genre}</span>
                          <button
                            type="button"
                            onClick={() => removePreferredGenre(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programming.excluded_genres"
            render={() => (
              <FormItem>
                <FormLabel>Excluded Genres</FormLabel>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an excluded genre"
                      value={excludedGenreInput}
                      onChange={(e) => setExcludedGenreInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addExcludedGenre()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addExcludedGenre} disabled={!excludedGenreInput.trim()}>
                      Add
                    </Button>
                  </div>
                  {excludedGenres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {excludedGenres.map((genre, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                        >
                          <span>{genre}</span>
                          <button
                            type="button"
                            onClick={() => removeExcludedGenre(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programming.event_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Frequency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programming.preferred_schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Days/Times</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Preferred days of the week, times, seasonal preferences..."
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
            name="programming.budget_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typical Budget Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., '€500 - €2000 per event'" {...field} />
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

