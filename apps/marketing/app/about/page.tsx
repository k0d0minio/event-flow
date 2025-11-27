"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Music,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Heart,
  Target,
  Zap,
  FileText,
  MapPin,
  Building2,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Flow Stage
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm hover:text-primary transition">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm hover:text-primary transition">
              How It Works
            </Link>
            <Link href="/#pricing" className="text-sm hover:text-primary transition">
              Pricing
            </Link>
            <Link href="/about" className="text-sm hover:text-primary transition font-semibold">
              About
            </Link>
            <Link href="/#faq" className="text-sm hover:text-primary transition">
              FAQ
            </Link>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance">
            Orchestrating the Future of Live Entertainment
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Where passion meets performance
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our mission is to make every musical connection perfect—the right artist, in the right venue, for the right audience, at the right moment.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">The Problem We're Solving</h2>
          <p className="text-center text-muted-foreground mb-16 text-balance max-w-2xl mx-auto">
            The music industry is broken. Independent artists and venues struggle with inefficiencies that waste time, money, and opportunities.
          </p>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* For Artists */}
            <Card className="bg-background border-border p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">For Independent Artists</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Booking Hell</p>
                    <p className="text-sm text-muted-foreground">100+ hours searching venues with a 70% rejection rate</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Financial Instability</p>
                    <p className="text-sm text-muted-foreground">60% earn less than €15K/year from music</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Administrative Nightmare</p>
                    <p className="text-sm text-muted-foreground">Complex contracts, payments, and logistics</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Geographic Limitations</p>
                    <p className="text-sm text-muted-foreground">Limited to local markets without touring infrastructure</p>
                  </div>
                </li>
              </ul>
            </Card>

            {/* For Venues */}
            <Card className="bg-background border-border p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">For Venues & Programmers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Discovery Challenge</p>
                    <p className="text-sm text-muted-foreground">Finding quality artists matching audience tastes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Risk Management</p>
                    <p className="text-sm text-muted-foreground">No predictive tools for event success</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Manual Processes</p>
                    <p className="text-sm text-muted-foreground">Excel sheets, emails, phone calls</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Compliance Issues</p>
                    <p className="text-sm text-muted-foreground">Legal complexity of artist contracts</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>

          {/* Market Inefficiencies */}
          <Card className="bg-background border-border p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Market Inefficiencies</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-2">Fragmented Ecosystem</p>
                <p className="text-sm text-muted-foreground">No central platform connecting all stakeholders</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Information Asymmetry</p>
                <p className="text-sm text-muted-foreground">Artists don't know venue needs, venues don't discover artists</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Transaction Friction</p>
                <p className="text-sm text-muted-foreground">Complex negotiations, manual contracts, payment delays</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Geographic Silos</p>
                <p className="text-sm text-muted-foreground">Local markets disconnected from broader opportunities</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Our Story</h2>
          <p className="text-center text-muted-foreground mb-16 text-balance max-w-2xl mx-auto">
            From a simple artist-venue matching service to a comprehensive super-platform revolutionizing the music industry.
          </p>

          <div className="space-y-12">
            <Card className="bg-background border-border p-8">
              <h3 className="text-2xl font-bold mb-4">The Evolution</h3>
              <p className="text-muted-foreground mb-6">
                Flow Stage began with a vision to solve the booking problem for independent artists. But we quickly realized that booking is just one piece of a much larger puzzle. Today, we're building a comprehensive ecosystem with seven interconnected modules covering the entire music touring value chain.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <p className="font-semibold mb-2">The Vision</p>
                  <p className="text-sm text-muted-foreground">
                    Seven interconnected modules: Smart Matching, Geographic Optimization, Marketplace, Technical Teams, Municipal Events, Tourism & Camping, and Cinema & Audiovisual.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">The Team</p>
                  <p className="text-sm text-muted-foreground">
                    Industry veterans with 15+ years of event management experience, deep understanding of the French music ecosystem, and a network of 2,000+ industry contacts.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Mission & Vision</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                Make every musical connection perfect—the right artist, in the right venue, for the right audience, at the right moment.
              </p>
            </Card>

            <Card className="bg-background border-border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                The Netflix of creative talents—the intelligence layer that will power the entire music industry's digital transformation.
              </p>
            </Card>

            <Card className="bg-background border-border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Values</h3>
              <p className="text-muted-foreground">
                Democratization, professionalization, and innovation—making music accessible to all while elevating industry standards.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Our Team</h2>
          <p className="text-center text-muted-foreground mb-16 text-balance max-w-2xl mx-auto">
            A unique combination of industry expertise and technical innovation.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="bg-background border-border p-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Jamie</h3>
              <p className="text-center text-primary font-semibold mb-4">CEO & Co-Founder</p>
              <p className="text-center text-muted-foreground">
                Industry insider with deep understanding of the French music ecosystem and 15+ years of event management experience. Brings 2,000+ industry contacts and insider knowledge to revolutionize music booking.
              </p>
            </Card>

            <Card className="bg-background border-border p-8">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">CTO</h3>
              <p className="text-center text-accent font-semibold mb-4">Co-Founder</p>
              <p className="text-center text-muted-foreground">
                Technical co-founder bringing cutting-edge AI and platform expertise. Ensures Flow Stage delivers on its promise of intelligent matching and seamless user experience.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Together, we combine business acumen with technical innovation—the perfect foundation for building the future of music booking.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Our Impact</h2>
          <p className="text-center text-muted-foreground mb-16 text-balance max-w-2xl mx-auto">
            Transforming the music industry while creating positive change for artists, venues, and communities.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-background border-border p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary mb-2">10,000+</p>
              <p className="text-sm text-muted-foreground">Creative Jobs Enabled</p>
            </Card>

            <Card className="bg-background border-border p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent mb-2">€500M+</p>
              <p className="text-sm text-muted-foreground">Added Sector Value</p>
            </Card>

            <Card className="bg-background border-border p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary mb-2">-40%</p>
              <p className="text-sm text-muted-foreground">Tour Emissions Reduction</p>
            </Card>

            <Card className="bg-background border-border p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent mb-2">30%</p>
              <p className="text-sm text-muted-foreground">Rural/Suburban Bookings</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-border p-6">
              <h3 className="font-bold mb-3">Industry Revolution</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Democratization of access</li>
                <li>• Professionalization of standards</li>
                <li>• Innovation catalyst</li>
                <li>• Cultural renaissance</li>
              </ul>
            </Card>

            <Card className="bg-background border-border p-6">
              <h3 className="font-bold mb-3">Societal Benefits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Employment opportunities</li>
                <li>• Cultural access for all</li>
                <li>• Economic growth</li>
                <li>• Social cohesion</li>
              </ul>
            </Card>

            <Card className="bg-background border-border p-6">
              <h3 className="font-bold mb-3">Environmental Leadership</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• AI-optimized tour routing</li>
                <li>• Resource efficiency</li>
                <li>• Sustainable practices</li>
                <li>• Circular economy</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners & Recognition */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Partners & Recognition</h2>
          <p className="text-center text-muted-foreground mb-16 text-balance max-w-2xl mx-auto">
            Trusted by industry leaders and built with key partnerships.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-border p-8 text-center">
              <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">SACEM Partnership</h3>
              <p className="text-muted-foreground">
                Official partnership ensuring full compliance with French music rights and royalties.
              </p>
            </Card>

            <Card className="bg-background border-border p-8 text-center">
              <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">CNM Partnerships</h3>
              <p className="text-muted-foreground">
                Collaboration with Centre National de la Musique for industry integration and compliance automation.
              </p>
            </Card>

            <Card className="bg-background border-border p-8 text-center">
              <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Industry Recognition</h3>
              <p className="text-muted-foreground">
                Trusted by music professionals, venues, and industry associations across Europe.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Revolution</h2>
          <p className="text-muted-foreground mb-8">
            Be part of transforming how music experiences are created, discovered, and delivered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/#features" className="hover:text-primary transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-primary transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-primary transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-primary transition">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/case-studies" className="hover:text-primary transition">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="hover:text-primary transition">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="/investors" className="hover:text-primary transition">
                    Investors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Flow Stage. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition">
                Twitter
              </a>
              <a href="#" className="hover:text-primary transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-primary transition">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

