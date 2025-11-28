import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster, AppNav } from "@ef/ui"
import { ThemeProvider } from "next-themes"
import { LogoutButton } from "@/components/logout-button"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Flow Stage - Booker Dashboard",
  description: "Booker dashboard for Flow Stage",
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
    title: "Profile",
    href: "/profile",
    icon: "Building2",
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppNav title="Flow Stage Booker" items={navItems} actions={<LogoutButton />} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

