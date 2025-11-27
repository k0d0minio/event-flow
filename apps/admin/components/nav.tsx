"use client"

import { useState, useMemo, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, useMobile } from "@ef/ui"
import { LayoutDashboard, Users, Building2, Menu, X } from "lucide-react"
import { LogoutButton } from "./logout-button"
import { cn } from "@ef/ui"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Artists",
    href: "/artists",
    icon: Users,
  },
  {
    title: "Venues",
    href: "/venues",
    icon: Building2,
  },
] as const

// Memoize the nav link component
const NavLink = memo(function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: typeof navItems[number]
  isActive: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground"
      )}
    >
      <Icon className="w-4 h-4 mr-2" />
      {item.title}
    </Link>
  )
})

const MobileNavLink = memo(function MobileNavLink({
  item,
  isActive,
  onClick,
}: {
  item: typeof navItems[number]
  isActive: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="w-5 h-5 mr-3" />
      {item.title}
    </Link>
  )
})

export const Nav = memo(function Nav() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  // Memoize active state calculation
  const activeStates = useMemo(
    () =>
      navItems.map((item) => ({
        item,
        isActive: pathname === item.href || pathname?.startsWith(`${item.href}/`),
      })),
    [pathname]
  )

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Flow Stage Admin</h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {activeStates.map(({ item, isActive }) => (
                <NavLink key={item.href} item={item} isActive={isActive} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <SheetContent side="left" className="w-[280px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {activeStates.map(({ item, isActive }) => (
                    <MobileNavLink
                      key={item.href}
                      item={item}
                      isActive={isActive}
                      onClick={handleLinkClick}
                    />
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <LogoutButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            {/* Desktop Logout Button */}
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
})

