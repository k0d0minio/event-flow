import { Badge } from "../../base/badge.js"
import { Card, CardContent } from "../../base/card.js"
import { CheckCircle2 } from "lucide-react"

interface VenueProfileHeaderProps {
  venueName?: string | null
  venueType?: string | null
  completionPercentage?: number
}

const venueTypeLabels: Record<string, string> = {
  club: "Club",
  theater: "Theater",
  festival: "Festival",
  bar: "Bar",
  concert_hall: "Concert Hall",
  outdoor: "Outdoor",
}

export function VenueProfileHeader({
  venueName,
  venueType,
  completionPercentage,
}: VenueProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{venueName || "Venue Profile"}</h1>
            <div className="flex flex-wrap gap-2">
              {venueType && (
                <Badge variant="secondary">{venueTypeLabels[venueType] || venueType}</Badge>
              )}
              {completionPercentage !== undefined && completionPercentage >= 30 && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Profile Complete
                </Badge>
              )}
            </div>
          </div>
          {completionPercentage !== undefined && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Profile Completion</p>
              <p className="text-2xl font-bold">{completionPercentage}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

