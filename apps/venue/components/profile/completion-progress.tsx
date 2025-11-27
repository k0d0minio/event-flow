"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from "@ef/ui"
import { CheckCircle2 } from "lucide-react"

interface CompletionStatus {
  completion_percentage: number
  filled_fields: number
  total_fields: number
  is_basic_level: boolean
}

interface CompletionProgressProps {
  refreshTrigger?: number
}

export function CompletionProgress({ refreshTrigger }: CompletionProgressProps) {
  const [status, setStatus] = useState<CompletionStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/profile/completion-status")
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error("Error fetching completion status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [refreshTrigger])

  if (loading || !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>
              {status.filled_fields} of {status.total_fields} fields completed
            </CardDescription>
          </div>
          {status.is_basic_level && (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{status.completion_percentage}% Complete</span>
            {status.is_basic_level && (
              <span className="text-green-600 font-medium">Basic Level Achieved</span>
            )}
          </div>
          <Progress value={status.completion_percentage} className="h-2" />
          {!status.is_basic_level && (
            <p className="text-xs text-muted-foreground">
              Complete at least 30% to reach basic level
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

