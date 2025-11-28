import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppNav } from "@ef/ui"
import { LogoutButton } from "@/components/logout-button"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Flow Stage - Admin Dashboard",
  description: "Admin dashboard for Flow Stage",
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Artists",
    href: "/artists",
    icon: "Users",
  },
  {
    title: "Venues",
    href: "/venues",
    icon: "Building2",
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppNav title="Flow Stage Admin" items={navItems} actions={<LogoutButton />} />
        {children}
      </body>
    </html>
  )
}

