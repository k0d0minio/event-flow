import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Flow Stage - Venue Dashboard",
  description: "Venue dashboard for Flow Stage",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

