import type React from "react"
// <CHANGE> Updated metadata for Flow Stage landing page
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flow Stage | AI-Powered Music Booking Platform | The Netflix of Creative Talents",
  description:
    "Transform your music booking process with AI-powered matching. 95% of independent musicians waste 100+ hours on failed bookings. Flow Stage connects artists with perfect venues using 47+ matching criteria, 90% accuracy predictions, and automated contracts. Join the €20B live entertainment revolution.",
  keywords: [
    "music booking",
    "AI matching",
    "independent artists",
    "venue booking",
    "live entertainment",
    "music industry platform",
    "artist venue matching",
    "music booking platform",
    "SACEM compliant",
    "music contracts",
    "tour booking",
    "event booking",
  ],
  authors: [{ name: "Flow Stage" }],
  creator: "Flow Stage",
  publisher: "Flow Stage",
  generator: "Next.js",
  applicationName: "Flow Stage",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ef-marketing.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/en",
      "fr": "/fr",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Flow Stage",
    title: "Flow Stage | AI-Powered Music Booking Platform | The Netflix of Creative Talents",
    description:
      "Transform your music booking process with AI-powered matching. Connect independent artists with perfect venues using 47+ matching criteria and 90% accuracy predictions.",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Flow Stage - AI-Powered Music Booking Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow Stage | AI-Powered Music Booking Platform",
    description:
      "Transform your music booking process with AI-powered matching. Connect independent artists with perfect venues using 47+ matching criteria.",
    images: ["/placeholder.jpg"],
    creator: "@flowstage",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#818cf8" },
  ],
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Flow Stage",
    description:
      "AI-powered music booking platform connecting independent artists with perfect venues through intelligent matching algorithms.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ef-marketing.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ef-marketing.vercel.app"}/icon.svg`,
    sameAs: [
      "https://twitter.com/flowstage",
      "https://linkedin.com/company/flowstage",
      "https://instagram.com/flowstage",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "contact@flowstage.com",
    },
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "Jamie",
        jobTitle: "CEO",
      },
    ],
    slogan: "Where passion meets performance",
    knowsAbout: [
      "Music Booking",
      "AI Matching",
      "Live Entertainment",
      "Venue Management",
      "Artist Management",
    ],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
