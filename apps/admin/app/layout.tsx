import type { Metadata } from "next"
import "./globals.css"
import { Nav } from "@/components/nav"

export const metadata: Metadata = {
  title: "Flow Stage - Admin Dashboard",
  description: "Admin dashboard for Flow Stage",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}

