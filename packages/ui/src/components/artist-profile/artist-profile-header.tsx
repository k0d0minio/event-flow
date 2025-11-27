import { Badge } from "../badge.js"
import { Card, CardContent } from "../card.js"
import { CheckCircle2 } from "lucide-react"

interface ArtistProfileHeaderProps {
  stageName?: string | null
  formationType?: string | null
  professionalLevel?: string | null
  completionPercentage?: number
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

export function ArtistProfileHeader({
  stageName,
  formationType,
  professionalLevel,
  completionPercentage,
}: ArtistProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{stageName || "Artist Profile"}</h1>
            <div className="flex flex-wrap gap-2">
              {formationType && (
                <Badge variant="secondary">{formationTypeLabels[formationType] || formationType}</Badge>
              )}
              {professionalLevel && (
                <Badge variant="outline">
                  {professionalLevelLabels[professionalLevel] || professionalLevel}
                </Badge>
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

