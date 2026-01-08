import { Badge } from "../../base/badge.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../base/card.js"

interface ArtistMusicalInfoViewProps {
  primaryGenre?: string | null
  subGenres?: string[] | null
  influences?: string[] | null
}

export function ArtistMusicalInfoView({
  primaryGenre,
  subGenres,
  influences,
}: ArtistMusicalInfoViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Musical Style</CardTitle>
        <CardDescription>Genre, influences, and musical identity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {primaryGenre && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Primary Genre</p>
            <Badge variant="default" className="text-base px-3 py-1">
              {primaryGenre}
            </Badge>
          </div>
        )}

        {subGenres && subGenres.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Sub-genres</p>
            <div className="flex flex-wrap gap-2">
              {subGenres.map((genre, index) => (
                <Badge key={index} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {influences && influences.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Musical Influences</p>
            <div className="flex flex-wrap gap-2">
              {influences.map((influence, index) => (
                <Badge key={index} variant="outline">
                  {influence}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!primaryGenre && (!subGenres || subGenres.length === 0) && (!influences || influences.length === 0) && (
          <p className="text-muted-foreground">No musical information available</p>
        )}
      </CardContent>
    </Card>
  )
}

