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
  Checkbox,
  LocationMap,
} from "@ef/ui"
import { ProfileSection } from "./profile-section"
import { toast } from "sonner"
import { X } from "lucide-react"

const identitySchema = z.object({
  venue_name: z.string().min(1, "Venue name is required").max(200),
  commercial_name: z.string().max(200).optional(),
  venue_type: z.enum(["club", "theater", "festival", "bar", "concert_hall", "outdoor"]),
  capacity: z
    .object({
      min: z.number().int().min(0).optional(),
      max: z.number().int().min(0).optional(),
      configurations: z.array(z.string()).optional(),
    })
    .optional(),
  location: z
    .object({
      address: z.string().optional(),
      coordinates: z
        .object({
          lat: z.number().optional(),
          lng: z.number().optional(),
        })
        .optional(),
      public_transport: z.array(z.string()).optional(),
      parking: z.string().optional(),
      pmr_access: z.boolean().optional(),
    })
    .optional(),
  history: z.string().optional(),
  ambiance: z.array(z.string()).optional(),
})

type IdentityFormData = z.infer<typeof identitySchema>

interface VenueIdentityFormProps {
  initialData?: {
    venue_name?: string | null
    commercial_name?: string | null
    venue_type?: string | null
    capacity?: { min?: number; max?: number; configurations?: string[] } | null
    location?: {
      address?: string
      coordinates?: { lat?: number; lng?: number }
      public_transport?: string[]
      parking?: string
      pmr_access?: boolean
    } | null
    history?: string | null
    ambiance?: string[] | null
  }
  onUpdate?: () => void
}

export function VenueIdentityForm({ initialData, onUpdate }: VenueIdentityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [configInput, setConfigInput] = useState("")
  const [transportInput, setTransportInput] = useState("")
  const [ambianceInput, setAmbianceInput] = useState("")

  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      venue_name: initialData?.venue_name || "",
      commercial_name: initialData?.commercial_name || "",
      venue_type: (initialData?.venue_type as IdentityFormData["venue_type"]) || "club",
      capacity: initialData?.capacity || { min: undefined, max: undefined, configurations: [] },
      location: initialData?.location || {
        address: "",
        coordinates: { lat: undefined, lng: undefined },
        public_transport: [],
        parking: "",
        pmr_access: false,
      },
      history: initialData?.history || "",
      ambiance: initialData?.ambiance || [],
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        venue_name: initialData.venue_name || "",
        commercial_name: initialData.commercial_name || "",
        venue_type: (initialData.venue_type as IdentityFormData["venue_type"]) || "club",
        capacity: initialData.capacity || { min: undefined, max: undefined, configurations: [] },
        location: initialData.location || {
          address: "",
          coordinates: { lat: undefined, lng: undefined },
          public_transport: [],
          parking: "",
          pmr_access: false,
        },
        history: initialData.history || "",
        ambiance: initialData.ambiance || [],
      })
    }
  }, [initialData, form])

  const configurations = form.watch("capacity.configurations") || []
  const transport = form.watch("location.public_transport") || []
  const ambiance = form.watch("ambiance") || []

  const addConfig = () => {
    if (configInput.trim()) {
      const current = form.getValues("capacity.configurations") || []
      form.setValue("capacity.configurations", [...current, configInput.trim()])
      setConfigInput("")
    }
  }

  const removeConfig = (index: number) => {
    const current = form.getValues("capacity.configurations") || []
    form.setValue("capacity.configurations", current.filter((_, i) => i !== index))
  }

  const addTransport = () => {
    if (transportInput.trim()) {
      const current = form.getValues("location.public_transport") || []
      form.setValue("location.public_transport", [...current, transportInput.trim()])
      setTransportInput("")
    }
  }

  const removeTransport = (index: number) => {
    const current = form.getValues("location.public_transport") || []
    form.setValue("location.public_transport", current.filter((_, i) => i !== index))
  }

  const addAmbiance = () => {
    if (ambianceInput.trim()) {
      const current = form.getValues("ambiance") || []
      form.setValue("ambiance", [...current, ambianceInput.trim()])
      setAmbianceInput("")
    }
  }

  const removeAmbiance = (index: number) => {
    const current = form.getValues("ambiance") || []
    form.setValue("ambiance", current.filter((_, i) => i !== index))
  }

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

      toast.success("Venue identity updated successfully")
      onUpdate?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProfileSection
      title="Venue Identity & Location"
      description="Tell us about your venue and its location"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="venue_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Official Venue Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter official venue name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commercial_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commercial Name (if different)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter commercial name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venue_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="club">Club</SelectItem>
                    <SelectItem value="theater">Theater</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="concert_hall">Concert Hall</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Capacity</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity.min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Capacity</FormLabel>
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
                name="capacity.max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Capacity</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="capacity.configurations"
              render={() => (
                <FormItem>
                  <FormLabel>Capacity Configurations</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a configuration (e.g., 'Standing: 500')"
                        value={configInput}
                        onChange={(e) => setConfigInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addConfig()
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addConfig} disabled={!configInput.trim()}>
                        Add
                      </Button>
                    </div>
                    {configurations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {configurations.map((config, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                          >
                            <span>{config}</span>
                            <button
                              type="button"
                              onClick={() => removeConfig(index)}
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
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Location</h3>
            <FormField
              control={form.control}
              name="location"
              render={() => (
                <FormItem>
                  <FormLabel>Venue Location</FormLabel>
                  <FormControl>
                    <LocationMap
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                      address={form.watch("location.address")}
                      coordinates={form.watch("location.coordinates")}
                      onAddressChange={(address) => {
                        form.setValue("location.address", address)
                      }}
                      onCoordinatesChange={(coordinates) => {
                        form.setValue("location.coordinates", coordinates)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location.public_transport"
              render={() => (
                <FormItem>
                  <FormLabel>Public Transport</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add transport option (e.g., 'Metro Line 1')"
                        value={transportInput}
                        onChange={(e) => setTransportInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTransport()
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addTransport} disabled={!transportInput.trim()}>
                        Add
                      </Button>
                    </div>
                    {transport.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {transport.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => removeTransport(index)}
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
              name="location.parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking Information</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe parking availability" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location.pmr_access"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>PMR (Persons with Reduced Mobility) Access</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="history"
            render={({ field }) => (
              <FormItem>
                <FormLabel>History</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Years of existence, renovations, notable events..."
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
            name="ambiance"
            render={() => (
              <FormItem>
                <FormLabel>Ambiance/Style Tags</FormLabel>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add ambiance tag (e.g., 'Intimate', 'Industrial')"
                      value={ambianceInput}
                      onChange={(e) => setAmbianceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addAmbiance()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addAmbiance} disabled={!ambianceInput.trim()}>
                      Add
                    </Button>
                  </div>
                  {ambiance.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {ambiance.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeAmbiance(index)}
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

