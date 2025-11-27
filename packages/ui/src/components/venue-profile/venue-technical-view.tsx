import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card.js"

interface VenueTechnicalViewProps {
  technicalEquipment?: {
    sound_system?: string
    lighting?: string
    stage?: string
    control_room?: string
    artist_spaces?: string
  } | null
}

export function VenueTechnicalView({ technicalEquipment }: VenueTechnicalViewProps) {
  if (!technicalEquipment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Equipment</CardTitle>
          <CardDescription>Sound, lighting, and stage specifications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No technical information available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Equipment</CardTitle>
        <CardDescription>Sound, lighting, and stage specifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {technicalEquipment.sound_system && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Sound System</p>
            <p className="whitespace-pre-wrap">{technicalEquipment.sound_system}</p>
          </div>
        )}

        {technicalEquipment.lighting && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lighting</p>
            <p className="whitespace-pre-wrap">{technicalEquipment.lighting}</p>
          </div>
        )}

        {technicalEquipment.stage && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Stage</p>
            <p className="whitespace-pre-wrap">{technicalEquipment.stage}</p>
          </div>
        )}

        {technicalEquipment.control_room && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Control Room</p>
            <p className="whitespace-pre-wrap">{technicalEquipment.control_room}</p>
          </div>
        )}

        {technicalEquipment.artist_spaces && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Artist Spaces</p>
            <p className="whitespace-pre-wrap">{technicalEquipment.artist_spaces}</p>
          </div>
        )}

        {!technicalEquipment.sound_system &&
          !technicalEquipment.lighting &&
          !technicalEquipment.stage &&
          !technicalEquipment.control_room &&
          !technicalEquipment.artist_spaces && (
            <p className="text-muted-foreground">No technical information available</p>
          )}
      </CardContent>
    </Card>
  )
}

