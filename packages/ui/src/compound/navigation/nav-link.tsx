"use client";

import Link from "next/link";
import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";

export interface NavLinkProps {
  href: string;
  title: string;
  icon?: LucideIcon | string; // Accept both for flexibility
  isActive?: boolean;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}

export const NavLink = React.memo(function NavLink({
  href,
  title,
  icon,
  isActive = false,
  onClick,
  variant = "desktop",
}: NavLinkProps) {
  // Handle both string and component icons
  const Icon = typeof icon === "string" ? undefined : icon;
  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        {Icon && <Icon className="w-5 h-5 mr-3" />}
        {title}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground",
      )}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {title}
    </Link>
  );
});

