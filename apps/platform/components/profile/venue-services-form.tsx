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
  Checkbox,
  Textarea,
} from "@ef/ui"
import { ProfileSection } from "./profile-section"
import { toast } from "sonner"

const servicesSchema = z.object({
  services: z
    .object({
      accommodation: z
        .object({
          available: z.boolean().optional(),
          capacity: z.number().int().min(0).optional(),
        })
        .optional(),
      catering: z
        .object({
          available: z.boolean().optional(),
          type: z.string().optional(),
        })
        .optional(),
      ticketing: z.string().optional(),
    })
    .optional(),
})

type ServicesFormData = z.infer<typeof servicesSchema>

interface VenueServicesFormProps {
  initialData?: {
    services?: {
      accommodation?: { available?: boolean; capacity?: number }
      catering?: { available?: boolean; type?: string }
      ticketing?: string
    } | null
  }
  onUpdate?: () => void
}

export function VenueServicesForm({ initialData, onUpdate }: VenueServicesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ServicesFormData>({
    resolver: zodResolver(servicesSchema),
    defaultValues: {
      services: initialData?.services || {
        accommodation: { available: false, capacity: undefined },
        catering: { available: false, type: "" },
        ticketing: "",
      },
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        services: initialData.services || {
          accommodation: { available: false, capacity: undefined },
          catering: { available: false, type: "" },
          ticketing: "",
        },
      })
    }
  }, [initialData, form])

  const accommodationAvailable = form.watch("services.accommodation.available")
  const cateringAvailable = form.watch("services.catering.available")

  const onSubmit = async (data: ServicesFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch((window.location.pathname.startsWith("/booker/") ? "/api/booker/profile/services" : "/api/venue/profile/services"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update services")
      }

      toast.success("Services updated successfully")
      onUpdate?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update services")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProfileSection
      title="Services Offered"
      description="Specify additional services and amenities you provide"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Accommodation</h3>
            <FormField
              control={form.control}
              name="services.accommodation.available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accommodation Available</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {accommodationAvailable && (
              <FormField
                control={form.control}
                name="services.accommodation.capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accommodation Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of people"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Catering</h3>
            <FormField
              control={form.control}
              name="services.catering.available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Catering Available</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {cateringAvailable && (
              <FormField
                control={form.control}
                name="services.catering.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catering Type</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe catering options (e.g., 'Full bar, snacks, full meals')"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="services.ticketing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticketing</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe ticketing system and options (e.g., 'Online only via Eventbrite', 'Box office and online')"
                    className="min-h-[80px]"
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

