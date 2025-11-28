"use client";

import { useState, useMemo, memo } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Users,
  Building2,
  User,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../button.js";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../sheet.js";
import { useMobile } from "../use-mobile.js";
import { cn } from "../../lib/utils.js";
import { NavLink, type NavLinkProps } from "./nav-link.js";

// Icon mapping for serializable icon names
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Building2,
  User,
};

export interface NavItem {
  title: string;
  href: string;
  icon: string; // Icon name as string for Server Component compatibility
}

export interface AppNavProps {
  title: string;
  items: NavItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const AppNav = memo(function AppNav({ title, items, actions, className }: AppNavProps) {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Memoize active state calculation
  const activeStates = useMemo(
    () =>
      items.map((item) => {
        const IconComponent = iconMap[item.icon] || undefined;
        return {
          item: {
            ...item,
            icon: IconComponent,
          },
          isActive: pathname === item.href || pathname?.startsWith(`${item.href}/`),
        };
      }),
    [pathname, items],
  );

  return (
    <nav className={cn("border-b bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {activeStates.map(({ item, isActive }) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  icon={item.icon}
                  isActive={isActive}
                  variant="desktop"
                />
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
                    <NavLink
                      key={item.href}
                      href={item.href}
                      title={item.title}
                      icon={item.icon}
                      isActive={isActive}
                      onClick={handleLinkClick}
                      variant="mobile"
                    />
                  ))}
                  {actions && <div className="mt-4 pt-4 border-t">{actions}</div>}
                </nav>
              </SheetContent>
            </Sheet>
            {/* Desktop Actions */}
            {actions && <div className="hidden sm:block">{actions}</div>}
          </div>
        </div>
      </div>
    </nav>
  );
});

