"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ef/ui"
import { ProfileSection } from "./profile-section"
import { toast } from "sonner"
import { X } from "lucide-react"

const musicalInfoSchema = z.object({
  primary_genre: z.string().min(1, "Primary genre is required"),
  sub_genres: z.array(z.string()).max(3, "Maximum 3 sub-genres allowed").optional(),
  influences: z.array(z.string()).optional(),
})

type MusicalInfoFormData = z.infer<typeof musicalInfoSchema>

interface MusicalInfoFormProps {
  initialData?: {
    primary_genre?: string | null
    sub_genres?: string[] | null
    influences?: string[] | null
  }
  onUpdate?: () => void
}

const COMMON_GENRES = [
  "Rock", "Pop", "Jazz", "Blues", "Country", "Folk", "Electronic", "Hip-Hop",
  "R&B", "Classical", "Reggae", "Metal", "Punk", "Indie", "Alternative",
  "Soul", "Funk", "Latin", "World", "Ambient", "Experimental",
]

export function MusicalInfoForm({ initialData, onUpdate }: MusicalInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subGenreInput, setSubGenreInput] = useState("")
  const [influenceInput, setInfluenceInput] = useState("")

  const form = useForm<MusicalInfoFormData>({
    resolver: zodResolver(musicalInfoSchema),
    defaultValues: {
      primary_genre: initialData?.primary_genre || "",
      sub_genres: initialData?.sub_genres || [],
      influences: initialData?.influences || [],
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        primary_genre: initialData.primary_genre || "",
        sub_genres: initialData.sub_genres || [],
        influences: initialData.influences || [],
      })
    }
  }, [initialData, form])

  const subGenres = form.watch("sub_genres") || []
  const influences = form.watch("influences") || []

  const addSubGenre = () => {
    if (subGenreInput.trim() && subGenres.length < 3) {
      const newSubGenres = [...subGenres, subGenreInput.trim()]
      form.setValue("sub_genres", newSubGenres)
      setSubGenreInput("")
    }
  }

  const removeSubGenre = (index: number) => {
    const newSubGenres = subGenres.filter((_, i) => i !== index)
    form.setValue("sub_genres", newSubGenres)
  }

  const addInfluence = () => {
    if (influenceInput.trim()) {
      const newInfluences = [...influences, influenceInput.trim()]
      form.setValue("influences", newInfluences)
      setInfluenceInput("")
    }
  }

  const removeInfluence = (index: number) => {
    const newInfluences = influences.filter((_, i) => i !== index)
    form.setValue("influences", newInfluences)
  }

  const onSubmit = async (data: MusicalInfoFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/profile/musical-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update musical info")
      }

      toast.success("Musical information updated successfully")
      onUpdate?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update musical info")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProfileSection
      title="Musical Information"
      description="Describe your musical style and influences"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="primary_genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Genre</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COMMON_GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sub_genres"
            render={() => (
              <FormItem>
                <FormLabel>Sub-genres (max 3)</FormLabel>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a sub-genre"
                      value={subGenreInput}
                      onChange={(e) => setSubGenreInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addSubGenre()
                        }
                      }}
                      disabled={subGenres.length >= 3}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSubGenre}
                      disabled={subGenres.length >= 3 || !subGenreInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {subGenres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subGenres.map((genre, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                        >
                          <span>{genre}</span>
                          <button
                            type="button"
                            onClick={() => removeSubGenre(index)}
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
            name="influences"
            render={() => (
              <FormItem>
                <FormLabel>Musical Influences</FormLabel>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an influence (artist, band, etc.)"
                      value={influenceInput}
                      onChange={(e) => setInfluenceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addInfluence()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addInfluence} disabled={!influenceInput.trim()}>
                      Add
                    </Button>
                  </div>
                  {influences.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {influences.map((influence, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                        >
                          <span>{influence}</span>
                          <button
                            type="button"
                            onClick={() => removeInfluence(index)}
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </ProfileSection>
  )
}

