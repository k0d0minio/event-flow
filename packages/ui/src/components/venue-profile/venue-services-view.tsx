import { Badge } from "../badge.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card.js"

interface VenueServicesViewProps {
  services?: {
    accommodation?: { available?: boolean; capacity?: number }
    catering?: { available?: boolean; type?: string }
    ticketing?: string
  } | null
}

export function VenueServicesView({ services }: VenueServicesViewProps) {
  if (!services) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
          <CardDescription>Additional services and amenities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No services information available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Offered</CardTitle>
        <CardDescription>Additional services and amenities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.accommodation && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Accommodation</p>
            {services.accommodation.available ? (
              <div className="space-y-1">
                <Badge variant="default">Available</Badge>
                {services.accommodation.capacity && (
                  <p className="text-sm">Capacity: {services.accommodation.capacity} people</p>
                )}
              </div>
            ) : (
              <Badge variant="outline">Not Available</Badge>
            )}
          </div>
        )}

        {services.catering && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Catering</p>
            {services.catering.available ? (
              <div className="space-y-1">
                <Badge variant="default">Available</Badge>
                {services.catering.type && <p className="text-sm">{services.catering.type}</p>}
              </div>
            ) : (
              <Badge variant="outline">Not Available</Badge>
            )}
          </div>
        )}

        {services.ticketing && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ticketing</p>
            <p>{services.ticketing}</p>
          </div>
        )}

        {!services.accommodation &&
          !services.catering &&
          !services.ticketing && (
            <p className="text-muted-foreground">No services information available</p>
          )}
      </CardContent>
    </Card>
  )
}

