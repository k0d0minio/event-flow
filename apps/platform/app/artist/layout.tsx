import { AppNav } from "@ef/ui"
import { LogoutButton } from "@/components/logout-button"

const navItems = [
  {
    title: "Dashboard",
    href: "/artist/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Profile",
    href: "/artist/profile",
    icon: "User",
  },
]

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppNav title="Flow Stage Artist" items={navItems} actions={<LogoutButton />} />
      {children}
    </>
  )
}

