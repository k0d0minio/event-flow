import { Badge } from "../badge.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card.js"

interface VenueIdentityViewProps {
  venueName?: string | null
  commercialName?: string | null
  venueType?: string | null
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

const venueTypeLabels: Record<string, string> = {
  club: "Club",
  theater: "Theater",
  festival: "Festival",
  bar: "Bar",
  concert_hall: "Concert Hall",
  outdoor: "Outdoor",
}

export function VenueIdentityView({
  venueName,
  commercialName,
  venueType,
  capacity,
  location,
  history,
  ambiance,
}: VenueIdentityViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Venue Identity & Location</CardTitle>
        <CardDescription>Establishment details and location information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {venueName && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Official Name</p>
            <p className="text-lg">{venueName}</p>
          </div>
        )}

        {commercialName && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Commercial Name</p>
            <p>{commercialName}</p>
          </div>
        )}

        {venueType && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Venue Type</p>
            <Badge variant="secondary">{venueTypeLabels[venueType] || venueType}</Badge>
          </div>
        )}

        {capacity && (capacity.min || capacity.max) && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Capacity</p>
            <p>
              {capacity.min && capacity.max
                ? `${capacity.min} - ${capacity.max}`
                : capacity.min
                  ? `${capacity.min}+`
                  : `Up to ${capacity.max}`}
            </p>
            {capacity.configurations && capacity.configurations.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Configurations</p>
                <div className="flex flex-wrap gap-2">
                  {capacity.configurations.map((config, index) => (
                    <Badge key={index} variant="outline">
                      {config}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {location && (
          <div className="space-y-2">
            {location.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{location.address}</p>
              </div>
            )}

            {location.coordinates && (location.coordinates.lat || location.coordinates.lng) && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                <p>
                  {location.coordinates.lat?.toFixed(6)}, {location.coordinates.lng?.toFixed(6)}
                </p>
              </div>
            )}

            {location.public_transport && location.public_transport.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Public Transport</p>
                <div className="flex flex-wrap gap-2">
                  {location.public_transport.map((transport, index) => (
                    <Badge key={index} variant="outline">
                      {transport}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {location.parking && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parking</p>
                <p>{location.parking}</p>
              </div>
            )}

            {location.pmr_access !== undefined && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">PMR Access</p>
                <p>{location.pmr_access ? "Yes" : "No"}</p>
              </div>
            )}
          </div>
        )}

        {history && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">History</p>
            <p className="whitespace-pre-wrap">{history}</p>
          </div>
        )}

        {ambiance && ambiance.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Ambiance/Style</p>
            <div className="flex flex-wrap gap-2">
              {ambiance.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

