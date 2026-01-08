import { Badge } from "../../base/badge.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../base/card.js"

interface VenueProgrammingViewProps {
  programming?: {
    preferred_genres?: string[]
    excluded_genres?: string[]
    event_frequency?: string
    preferred_schedule?: string
    budget_range?: string
  } | null
}

const eventFrequencyLabels: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  seasonal: "Seasonal",
}

export function VenueProgrammingView({ programming }: VenueProgrammingViewProps) {
  if (!programming) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Programming Preferences</CardTitle>
          <CardDescription>Musical preferences and event scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No programming information available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programming Preferences</CardTitle>
        <CardDescription>Musical preferences and event scheduling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {programming.preferred_genres && programming.preferred_genres.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Preferred Genres</p>
            <div className="flex flex-wrap gap-2">
              {programming.preferred_genres.map((genre, index) => (
                <Badge key={index} variant="default">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {programming.excluded_genres && programming.excluded_genres.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Excluded Genres</p>
            <div className="flex flex-wrap gap-2">
              {programming.excluded_genres.map((genre, index) => (
                <Badge key={index} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {programming.event_frequency && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Event Frequency</p>
            <p>{eventFrequencyLabels[programming.event_frequency] || programming.event_frequency}</p>
          </div>
        )}

        {programming.preferred_schedule && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Preferred Schedule</p>
            <p className="whitespace-pre-wrap">{programming.preferred_schedule}</p>
          </div>
        )}

        {programming.budget_range && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Typical Budget Range</p>
            <p>{programming.budget_range}</p>
          </div>
        )}

        {!programming.preferred_genres?.length &&
          !programming.excluded_genres?.length &&
          !programming.event_frequency &&
          !programming.preferred_schedule &&
          !programming.budget_range && (
            <p className="text-muted-foreground">No programming information available</p>
          )}
      </CardContent>
    </Card>
  )
}

