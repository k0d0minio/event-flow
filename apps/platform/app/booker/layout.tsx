import { AppNav } from "@ef/ui"
import { LogoutButton } from "@/components/logout-button"

const navItems = [
  {
    title: "Dashboard",
    href: "/booker/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Artists",
    href: "/booker/artists",
    icon: "Users",
  },
  {
    title: "Profile",
    href: "/booker/profile",
    icon: "Building2",
  },
]

export default function BookerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppNav title="Flow Stage Booker" items={navItems} actions={<LogoutButton />} />
      {children}
    </>
  )
}

