import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../base/card.js"

interface ArtistIdentityViewProps {
  stageName?: string | null
  formationType?: string | null
  bioShort?: string | null
  bioLong?: string | null
  yearsActive?: number | null
  professionalLevel?: string | null
}

const formationTypeLabels: Record<string, string> = {
  solo: "Solo",
  duo: "Duo",
  group: "Group",
  orchestra: "Orchestra",
  hybrid: "Hybrid",
}

const professionalLevelLabels: Record<string, string> = {
  amateur: "Amateur",
  "semi-pro": "Semi-Pro",
  professional: "Professional",
}

export function ArtistIdentityView({
  stageName,
  formationType,
  bioShort,
  bioLong,
  yearsActive,
  professionalLevel,
}: ArtistIdentityViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>Artist identity and background information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stageName && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Stage Name</p>
            <p className="text-lg">{stageName}</p>
          </div>
        )}

        {formationType && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Formation Type</p>
            <p>{formationTypeLabels[formationType] || formationType}</p>
          </div>
        )}

        {bioShort && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Bio</p>
            <p className="whitespace-pre-wrap">{bioShort}</p>
          </div>
        )}

        {bioLong && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Bio</p>
            <p className="whitespace-pre-wrap">{bioLong}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {yearsActive !== null && yearsActive !== undefined && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Years Active</p>
              <p>{yearsActive} {yearsActive === 1 ? "year" : "years"}</p>
            </div>
          )}

          {professionalLevel && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Professional Level</p>
              <p>{professionalLevelLabels[professionalLevel] || professionalLevel}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

