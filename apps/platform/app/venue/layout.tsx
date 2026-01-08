import { AppNav } from "@ef/ui"
import { LogoutButton } from "@/components/logout-button"

const navItems = [
  {
    title: "Dashboard",
    href: "/venue/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Artists",
    href: "/venue/artists",
    icon: "Users",
  },
  {
    title: "Profile",
    href: "/venue/profile",
    icon: "Building2",
  },
]

export default function VenueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppNav title="Flow Stage Venue" items={navItems} actions={<LogoutButton />} />
      {children}
    </>
  )
}

