"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@ef/db/client"
import { Button } from "@ef/ui"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}

