"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, Music, Zap, FileText, Users, TrendingUp, MapPin, ShoppingBag, Wrench, Building2, Tent, Film, CheckCircle2, Clock, Calculator, Info, Shield } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [openFaq, setOpenFaq] = useState<string | null>("artist-journey")
  const [bookingAmount, setBookingAmount] = useState<number>(5000)
  const commissionRate = 0.08 // 8% default

  const testimonials = [
    {
      quote: "Found my perfect venue match in 30 seconds. Booked 3 shows in one week!",
      author: "Sarah Chen",
      role: "Indie Artist",
      badge: "150+ bookings",
    },
    {
      quote: "Reduced our booking process from days to minutes. 90% accuracy on crowd fit.",
      author: "Marcus Williams",
      role: "Venue Manager",
      badge: "€50k+ bookings",
    },
    {
      quote: "The contract generator alone saved me weeks of legal work. SACEM compliant out of the box.",
      author: "Emma Rodriguez",
      role: "Artist Manager",
      badge: "€500k facilitated",
    },
  ]

  const faqItems = [
    {
      id: "how-matching",
      question: "How does the AI matching work?",
      answer:
        "Our AI analyzes your audio DNA—genre, energy, tempo, audience demographics—and compares it against 1000+ venues to find the perfect match. Upload your demo and get instant compatibility scores.",
    },
    {
      id: "accuracy",
      question: "What does 90% accuracy mean?",
      answer:
        "Our predictive model analyzes historical booking data, crowd demographics, and venue specifications to predict ticket sales and audience fit with 90% accuracy before you even book.",
    },
    {
      id: "contracts",
      question: "Are the contracts legally binding?",
      answer:
        "Yes. Our contracts are SACEM compliant, legally validated by music industry experts, and ready for e-signature. Perfect for independent artists and small venues.",
    },
    {
      id: "pricing",
      question: "Why 8% commission?",
      answer:
        "Our commission is transparent and only charged on successful bookings. No hidden fees, no upfront costs. It's the fastest way to discover venues and reach audiences.",
    },
    {
      id: "data-privacy",
      question: "How is my music data protected?",
      answer:
        "All audio files are processed using encrypted channels and never stored longer than necessary for matching. Your music IP is yours—we only use metadata for matching.",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Flow Stage
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-primary transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm hover:text-primary transition">
              How It Works
            </a>
            <a href="#pricing" className="text-sm hover:text-primary transition">
              Pricing
            </a>
            <Link href="/about" className="text-sm hover:text-primary transition">
              About
            </Link>
            <a href="#faq" className="text-sm hover:text-primary transition">
              FAQ
            </a>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/20 border border-primary/40">
            <p className="text-sm font-semibold text-primary">🎵 Where Passion Meets Performance</p>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance">
            Stop Wasting 100+ Hours on Failed Bookings
          </h1>

          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Match with perfect venues in 30 seconds. AI-powered matching that predicts show success with 90% accuracy.
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="font-bold text-lg text-primary">500+</p>
              <p className="text-xs text-muted-foreground">Artists (Year 1 Target)</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="font-bold text-lg text-accent">€3M+</p>
              <p className="text-xs text-muted-foreground">Bookings (Year 1 GMV)</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="font-bold text-lg text-primary">SACEM</p>
              <p className="text-xs text-muted-foreground">Partner</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple">
              Start Free Today
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 bg-transparent">
              List Your Venue
            </Button>
            <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground">
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center overflow-hidden">
            <svg className="w-24 h-24 text-primary/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18V5l12-2v13M9 9h12M9 13h12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">The Problem We're Solving</h2>
          <p className="text-center text-muted-foreground mb-12 text-balance max-w-2xl mx-auto">
            The music industry is broken. Independent artists and venues struggle with inefficiencies that waste time, money, and opportunities.
          </p>

          {/* Statistics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <Card className="bg-background border-border p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-2">95%</p>
              <p className="text-sm text-muted-foreground">of independent musicians spend 100+ hours on booking attempts</p>
            </Card>
            <Card className="bg-background border-border p-6 text-center">
              <p className="text-3xl font-bold text-accent mb-2">70%</p>
              <p className="text-sm text-muted-foreground">failure rate on booking attempts</p>
            </Card>
            <Card className="bg-background border-border p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-2">60%</p>
              <p className="text-sm text-muted-foreground">earn less than €15K/year from music</p>
            </Card>
            <Card className="bg-background border-border p-6 text-center">
              <p className="text-3xl font-bold text-accent mb-2">€20B</p>
              <p className="text-sm text-muted-foreground">European live entertainment market</p>
            </Card>
          </div>

          {/* Pain Points Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* For Artists */}
            <Card className="bg-background border-border p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">For Artists</h3>
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
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">For Venues</h3>
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

          {/* Market Opportunity */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 p-8 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">The Opportunity</h3>
            <p className="text-muted-foreground mb-4">
              A €20B European live entertainment market with no central platform connecting all stakeholders. Flow Stage bridges this gap, creating the intelligence layer that powers the entire music industry's digital transformation.
            </p>
            <p className="font-semibold text-lg">
              Like Uber revolutionized transportation and Airbnb transformed hospitality, Flow Stage will redefine how music experiences are created, discovered, and delivered.
            </p>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Three Killer Features</h2>
          <p className="text-center text-muted-foreground mb-16 text-balance">
            Everything you need to revolutionize your booking process
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-background border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 group">
              <div className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Audio DNA Matching</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your demo, our AI analyzes your sound signature using spectral analysis and finds instant compatibility scores with 1000+ venues.
                </p>
                <p className="text-sm font-semibold text-primary mb-3">47+ Matching Criteria across 11 Categories:</p>
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  <li>• Musical compatibility (genre, BPM, energy, mood)</li>
                  <li>• Economic viability & ROI prediction</li>
                  <li>• Geographic optimization</li>
                  <li>• Audience fit & demographics</li>
                  <li>• Technical requirements</li>
                </ul>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 mt-4">
                  Try Audio DNA Matching →
                </Button>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-background border-border hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/20 group">
              <div className="p-8">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Predictive Booking Intelligence</h3>
                <p className="text-muted-foreground mb-4">
                  90% accuracy predicting ticket sales and audience fit. Our AI analyzes historical booking data, crowd demographics, and venue specifications to predict success before you book.
                </p>
                <p className="text-sm font-semibold text-accent mb-3">Key Capabilities:</p>
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  <li>• Historical performance analysis</li>
                  <li>• Crowd demographics matching</li>
                  <li>• Venue specification compatibility</li>
                  <li>• ROI prediction & pricing optimization</li>
                  <li>• Best dates & timing recommendations</li>
                </ul>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 mt-4">
                  See Predictions in Action →
                </Button>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-background border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/20 group">
              <div className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Legal Generator</h3>
                <p className="text-muted-foreground mb-4">
                  Professional contracts generated in 30 seconds. One-click legal contract creation with full compliance automation.
                </p>
                <p className="text-sm font-semibold text-primary mb-3">Features:</p>
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  <li>• SACEM compliant out of the box</li>
                  <li>• Legally validated by music industry experts</li>
                  <li>• E-signature ready integration</li>
                  <li>• Automated compliance handling</li>
                  <li>• Perfect for independent artists & small venues</li>
                </ul>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 mt-4">
                  Generate Sample Contract →
                </Button>
              </div>
            </Card>
          </div>

          {/* 47+ Matching Criteria Expandable Section */}
          <div className="mt-16">
            <Card className="bg-background border-border p-8">
              <button
                onClick={() => setOpenFaq(openFaq === "matching-criteria" ? null : "matching-criteria")}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-2">47+ Matching Criteria Across 11 Categories</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes comprehensive data points to ensure perfect artist-venue compatibility
                  </p>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform ${openFaq === "matching-criteria" ? "rotate-180" : ""}`} />
              </button>
              {openFaq === "matching-criteria" && (
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Musical Compatibility</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Genre matching</li>
                        <li>• BPM analysis</li>
                        <li>• Energy level</li>
                        <li>• Mood analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Economic Viability</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Budget alignment</li>
                        <li>• ROI prediction</li>
                        <li>• Pricing optimization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Geographic Optimization</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Tour routing</li>
                        <li>• Travel costs</li>
                        <li>• Distance optimization</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Audience Fit</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Demographics matching</li>
                        <li>• Preferences analysis</li>
                        <li>• Social data integration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Technical Requirements</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Stage specifications</li>
                        <li>• Sound system needs</li>
                        <li>• Lighting requirements</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Legal Compliance</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Contract requirements</li>
                        <li>• Insurance needs</li>
                        <li>• Regulations compliance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Performance History</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Past success metrics</li>
                        <li>• Reviews & ratings</li>
                        <li>• Track record analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Social Proof</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Streaming data</li>
                        <li>• Social media engagement</li>
                        <li>• Online presence</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Availability</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Calendar synchronization</li>
                        <li>• Conflict detection</li>
                        <li>• Date matching</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Cultural Context</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Local preferences</li>
                        <li>• Seasonal patterns</li>
                        <li>• Regional trends</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Predictive Analytics</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Success probability scoring</li>
                        <li>• Risk assessment</li>
                        <li>• Performance forecasting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Features / Roadmap */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Platform Roadmap</h2>
          <p className="text-center text-muted-foreground mb-16 text-balance max-w-2xl mx-auto">
            Seven interconnected modules covering the entire music touring value chain. More than just booking—a complete ecosystem.
          </p>

          <div className="space-y-6">
            {/* Feature 1 - Available Now */}
            <Card className="bg-background border-2 border-primary/50 p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Music className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Smart Matching</h3>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Available Now
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    AI-powered artist-venue matching with 47+ criteria. Our core MVP that revolutionizes how artists and venues connect.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 2 - Q2 2025 */}
            <Card className="bg-background border-border p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Geographic Optimization</h3>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Coming Q2 2025
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Intelligent tour routing to reduce travel costs and optimize tour schedules. Plan multi-city tours with maximum efficiency.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Request Early Access
                  </Button>
                </div>
              </div>
            </Card>

            {/* Feature 3 - Q2 2025 */}
            <Card className="bg-background border-border p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Marketplace</h3>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Coming Q2 2025
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    One-stop shop for tour logistics: accommodation, transport, equipment rental, and technical services all in one place.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Request Early Access
                  </Button>
                </div>
              </div>
            </Card>

            {/* Feature 4 - Q3 2025 */}
            <Card className="bg-background border-border p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Technical Teams</h3>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Coming Q3 2025
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Crew matching system to find sound engineers, lighting technicians, roadies, and technical support for your events.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Request Early Access
                  </Button>
                </div>
              </div>
            </Card>

            {/* Feature 5 - Q4 2025 */}
            <Card className="bg-background border-border p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Municipal Events</h3>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Coming Q4 2025
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Public sector integration providing access to city festivals, public events, and municipal programming opportunities.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Request Early Access
                  </Button>
                </div>
              </div>
            </Card>

            {/* Feature 6 - 2026 */}
            <Card className="bg-background border-border p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Tent className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Tourism & Camping</h3>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Coming 2026
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Seasonal entertainment booking for summer festivals, holiday venues, and camping site entertainment programs.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Request Early Access
                  </Button>
                </div>
              </div>
            </Card>

            {/* Feature 7 - 2026 */}
            <Card className="bg-background border-border p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Film className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">Cinema & Audiovisual</h3>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Coming 2026
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Cross-industry expansion into film scoring, sync licensing, and audiovisual production opportunities.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Request Early Access
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Dual Value Propositions */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Built for Both</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Artists */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 rounded-lg bg-primary/20 border border-primary/40">
                <p className="text-sm font-semibold text-primary">For Artists</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Find venues that love your sound</h3>
                <p className="text-muted-foreground">
                  No more cold emails into the void. Get fair pricing recommendations. Track all your bookings in one
                  place.
                </p>
              </div>

              <div className="space-y-3">
                {["Find perfect venue matches", "Fair pricing recommendations", "One-place booking hub"].map(
                  (item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Music className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="p-6 rounded-lg bg-card border border-border">
                <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-transparent rounded flex items-center justify-center">
                  <Music className="w-12 h-12 text-primary/30" />
                </div>
              </div>
            </div>

            {/* Venues */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 rounded-lg bg-accent/20 border border-accent/40">
                <p className="text-sm font-semibold text-accent">For Venues</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Discover artists your audience will love</h3>
                <p className="text-muted-foreground">
                  Fill your calendar with quality acts. Reduce booking admin by 80%. Predict show success before
                  booking.
                </p>
              </div>

              <div className="space-y-3">
                {["Discover perfect artist matches", "Reduce booking admin 80%", "Success predictions"].map(
                  (item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="p-6 rounded-lg bg-card border border-border">
                <div className="w-full h-32 bg-gradient-to-br from-accent/20 to-transparent rounded flex items-center justify-center">
                  <Users className="w-12 h-12 text-accent/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Loved by Music Professionals</h2>
          <p className="text-center text-muted-foreground mb-16">
            Join thousands already revolutionizing their booking process
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-background border-border">
                <div className="p-8">
                  <p className="text-lg mb-6 italic text-muted-foreground">"{testimonial.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-primary font-semibold mt-2">{testimonial.badge}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="p-6 rounded-lg bg-background border border-border text-center">
              <p className="text-3xl font-bold text-primary mb-2">1,000+</p>
              <p className="text-sm text-muted-foreground">Active Users (Year 1)</p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border text-center">
              <p className="text-3xl font-bold text-accent mb-2">85%</p>
              <p className="text-sm text-muted-foreground">Target Satisfaction (MVP Goal)</p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border text-center">
              <p className="text-3xl font-bold text-primary mb-2">€3M+</p>
              <p className="text-sm text-muted-foreground">GMV (Year 1 Projection)</p>
            </div>
          </div>

          {/* Growth Timeline */}
          <Card className="bg-background border-border p-8 mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Growth Timeline</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary mb-2">Year 1</p>
                <p className="text-sm text-muted-foreground mb-4">MVP Launch</p>
                <p className="text-lg font-semibold">1,000 artists</p>
                <p className="text-sm text-muted-foreground">+ 500 venues</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent mb-2">Year 2</p>
                <p className="text-sm text-muted-foreground mb-4">Growth Phase</p>
                <p className="text-lg font-semibold">10,000 artists</p>
                <p className="text-sm text-muted-foreground">+ 5,000 venues</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary mb-2">Year 3</p>
                <p className="text-sm text-muted-foreground mb-4">Scale Phase</p>
                <p className="text-lg font-semibold">50,000 artists</p>
                <p className="text-sm text-muted-foreground">+ 20,000 venues</p>
              </div>
            </div>
          </Card>

          {/* Impact Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-background border-border p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-2">+40%</p>
              <p className="text-sm text-muted-foreground">Average Artist Earnings Increase</p>
            </Card>
            <Card className="bg-background border-border p-6 text-center">
              <p className="text-3xl font-bold text-accent mb-2">+25%</p>
              <p className="text-sm text-muted-foreground">Venue Capacity Optimization</p>
            </Card>
            <Card className="bg-background border-border p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-2">-40%</p>
              <p className="text-sm text-muted-foreground">Tour Emissions via Optimization</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-16 text-balance max-w-2xl mx-auto">
            Separate journeys designed for artists and venues, each optimized for your unique needs
          </p>

          {/* Tabs for Artist vs Venue Journey */}
          <div className="mb-12">
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={openFaq === "artist-journey" || openFaq !== "venue-journey" ? "default" : "outline"}
                onClick={() => setOpenFaq("artist-journey")}
                className="bg-primary hover:bg-primary/90"
              >
                Artist Journey
              </Button>
              <Button
                variant={openFaq === "venue-journey" ? "default" : "outline"}
                onClick={() => setOpenFaq("venue-journey")}
                className={openFaq === "venue-journey" ? "bg-accent hover:bg-accent/90" : ""}
              >
                Venue Journey
              </Button>
            </div>

            {/* Artist Journey */}
            {(openFaq === "artist-journey" || openFaq !== "venue-journey") && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 mb-4">
                    <p className="text-sm font-semibold text-primary">For Artists</p>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">From Profile to Performance in 6 Steps</h3>
                </div>
                {[
                  {
                    step: 1,
                    title: "Onboarding (5 min)",
                    desc: "Smart profile creation with Spotify import. Tell us about your music style, budget, and preferences.",
                    benefit: "Quick setup, instant profile activation",
                  },
                  {
                    step: 2,
                    title: "Discovery",
                    desc: "AI suggests perfect venues matching your style and budget. Get compatibility scores instantly.",
                    benefit: "No more cold emails, targeted matches",
                  },
                  {
                    step: 3,
                    title: "Communication",
                    desc: "Integrated chat with smart negotiation tools. Discuss terms, dates, and details seamlessly.",
                    benefit: "Streamlined communication, faster responses",
                  },
                  {
                    step: 4,
                    title: "Contracting",
                    desc: "One-click legal contracts generation. SACEM compliant, legally validated, ready to sign.",
                    benefit: "Save weeks of legal work",
                  },
                  {
                    step: 5,
                    title: "Payment",
                    desc: "Automated commission handling and instant payments. Transparent pricing, no surprises.",
                    benefit: "Get paid faster, track everything",
                  },
                  {
                    step: 6,
                    title: "Analytics",
                    desc: "Performance insights and career coaching. Understand what works and grow your career.",
                    benefit: "Data-driven career decisions",
                  },
                ].map((item) => (
                  <Card key={item.step} className="bg-background border-border">
                    <div className="p-6 flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary-foreground">{item.step}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <span className="text-xs text-muted-foreground">• {item.benefit}</span>
                        </div>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Venue Journey */}
            {openFaq === "venue-journey" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 rounded-lg bg-accent/20 border border-accent/40 mb-4">
                    <p className="text-sm font-semibold text-accent">For Venues</p>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">From Setup to Success in 6 Steps</h3>
                </div>
                {[
                  {
                    step: 1,
                    title: "Setup (10 min)",
                    desc: "Venue profile creation with technical specifications. Define your space, capacity, and requirements.",
                    benefit: "Quick onboarding, detailed profile",
                  },
                  {
                    step: 2,
                    title: "Curation",
                    desc: "AI-filtered artist recommendations. Get suggestions that match your audience and venue style.",
                    benefit: "Quality over quantity, perfect fits",
                  },
                  {
                    step: 3,
                    title: "Booking Pipeline",
                    desc: "Kanban-style management interface. Track all bookings from inquiry to performance.",
                    benefit: "Organized workflow, nothing falls through",
                  },
                  {
                    step: 4,
                    title: "Risk Assessment",
                    desc: "Success prediction for each booking. Know the probability of success before committing.",
                    benefit: "Make informed decisions, reduce risk",
                  },
                  {
                    step: 5,
                    title: "Compliance",
                    desc: "Automated legal and administrative handling. Contracts, payments, and paperwork done for you.",
                    benefit: "80% reduction in admin time",
                  },
                  {
                    step: 6,
                    title: "Insights",
                    desc: "Audience analytics and programming optimization. Understand your audience and optimize your calendar.",
                    benefit: "Data-driven programming decisions",
                  },
                ].map((item) => (
                  <Card key={item.step} className="bg-background border-border">
                    <div className="p-6 flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-accent-foreground">{item.step}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <span className="text-xs text-muted-foreground">• {item.benefit}</span>
                        </div>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-16">Pay only when you succeed</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="bg-background border-border">
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">Browse & Match</h3>
                <p className="text-4xl font-bold text-primary mb-4">Free</p>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Unlimited profile browsing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    AI matching suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Success predictions
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90">Get Started Free</Button>
              </div>
            </Card>

            <Card className="bg-background border-accent border-2">
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">On Booking</h3>
                <p className="text-4xl font-bold text-accent mb-2">6-12%</p>
                <p className="text-sm text-muted-foreground mb-4">Commission on successful bookings</p>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Auto-generated contracts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Premium analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    No hidden fees
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                  Calculate Your Commission
                </Button>
              </div>
            </Card>
          </div>

          {/* Pricing Calculator */}
          <Card className="bg-background border-border p-8 max-w-2xl mx-auto mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold">Commission Calculator</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Booking Amount (€)</label>
                <input
                  type="number"
                  value={bookingAmount}
                  onChange={(e) => setBookingAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary transition-colors"
                  min="0"
                  step="100"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-4 rounded-lg bg-card border border-border">
                  <span className="text-muted-foreground">Commission (8%)</span>
                  <span className="text-xl font-bold text-accent">€{(bookingAmount * commissionRate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="font-semibold">You Receive</span>
                  <span className="text-2xl font-bold text-primary">€{(bookingAmount * (1 - commissionRate)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Example: €5,000 booking = €400 commission (8%) = €4,600 to you
              </p>
            </div>
          </Card>

          {/* Pricing Model Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-background border-border p-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Primary Model
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Transaction fees: 6-12% commission on all bookings. Volume-based pricing with transparent structure.
              </p>
              <p className="text-xs text-muted-foreground">
                €5K booking = €300-600 commission. No hidden fees, only charged on successful bookings.
              </p>
            </Card>

            <Card className="bg-background border-border p-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Premium (Coming Soon)
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                €99-599/month pro tools with advanced analytics, priority matching, and early access to new features.
              </p>
              <p className="text-xs text-muted-foreground">
                Target: 30% paid conversion for professional users.
              </p>
            </Card>

            <Card className="bg-background border-border p-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Marketplace (Coming Soon)
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                5-8% on ancillary bookings: hotels, transport, equipment, crew services.
              </p>
              <p className="text-xs text-muted-foreground">
                One-stop shop for complete tour logistics.
              </p>
            </Card>
          </div>

          {/* Why 6-12% Explanation */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 p-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-3">Why 6-12% Commission?</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong>Transparent structure:</strong> Only charged on successful bookings, no upfront costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong>Value delivered:</strong> AI matching, contracts, compliance, and payment processing included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong>Industry standard:</strong> Competitive with other booking platforms while providing superior value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong>Volume-based:</strong> Higher volume bookings may qualify for lower rates (6-8%)</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-16">Everything you need to know about Flow Stage</p>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-card/50 transition-colors"
                >
                  <h3 className="font-semibold text-lg">{item.question}</h3>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === item.id ? "rotate-180" : ""}`} />
                </button>
                {openFaq === item.id && (
                  <div className="px-6 pb-6 text-muted-foreground border-t border-border">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Revolutionize Your Booking Process?</h2>
          <p className="text-muted-foreground mb-8">Join 1,000+ music professionals already using Flow Stage</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple">
              Start Free Today
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            No credit card required • Get matched in 30 seconds • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                Flow Stage
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                The AI-powered music booking platform connecting independent artists with perfect venues. Where passion meets performance.
              </p>
              {/* Newsletter Signup */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Stay Updated</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Get product updates and industry insights</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-primary transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    API Docs
                  </a>
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
                    Press Kit
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="hover:text-primary transition">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Help Center
                  </a>
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
          </div>

          {/* Trust Badges */}
          <div className="border-t border-border pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>SACEM Partner</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>AES-256 Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Legal & Social */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-primary transition">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-primary transition">
                  Terms of Service
                </Link>
                <a href="#" className="hover:text-primary transition">
                  Cookie Policy
                </a>
                <a href="#" className="hover:text-primary transition">
                  GDPR Compliance
                </a>
                <a href="#" className="hover:text-primary transition">
                  SACEM Compliance
                </a>
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary transition" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>&copy; 2025 Flow Stage. All rights reserved.</p>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span>Language:</span>
                <select className="bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>Contact: contact@flowstage.com | Support Hours: Mon-Fri 9AM-6PM CET</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
