import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ef/ui"
import type { ReactNode } from "react"

interface ProfileSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function ProfileSection({ title, description, children }: ProfileSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

