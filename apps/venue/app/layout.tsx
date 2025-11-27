import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@ef/ui"
import { ThemeProvider } from "next-themes"

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

