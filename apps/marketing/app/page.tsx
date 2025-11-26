"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, Music, Zap, FileText, Users, TrendingUp } from "lucide-react"

export default function Home() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)

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
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Flow Stage
          </div>
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
              <p className="font-bold text-lg text-primary">150+</p>
              <p className="text-xs text-muted-foreground">Artists Matched</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="font-bold text-lg text-accent">€1M+</p>
              <p className="text-xs text-muted-foreground">In Bookings</p>
            </div>
            <div className="p-3 rounded-lg bg-card border border-border">
              <p className="font-bold text-lg text-primary">SACEM</p>
              <p className="text-xs text-muted-foreground">Partner</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple">
              I'm an Artist
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 bg-transparent">
              I'm a Venue
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
                  Upload your demo, our AI analyzes your sound signature and finds instant compatibility scores with
                  1000+ venues.
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  Instant Results
                </div>
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
                  90% accuracy predicting ticket sales and audience fit. Know your best dates, pricing, and venues
                  before booking.
                </p>
                <div className="flex items-center gap-2 text-accent text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  Data-Driven
                </div>
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
                  Professional contracts generated in 30 seconds. SACEM compliant, legally validated, e-signature ready.
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <FileText className="w-4 h-4" />
                  Compliant
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
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 rounded-lg bg-background border border-border text-center">
              <p className="text-3xl font-bold text-primary mb-2">5,000+</p>
              <p className="text-sm text-muted-foreground">Successful Matches</p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border text-center">
              <p className="text-3xl font-bold text-accent mb-2">95%</p>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border text-center">
              <p className="text-3xl font-bold text-primary mb-2">€10M+</p>
              <p className="text-sm text-muted-foreground">Bookings Facilitated</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Create Your Profile",
                desc: "Tell us who you are—artist or venue. Let our system understand your unique needs.",
              },
              {
                step: 2,
                title: "Get AI Matches",
                desc: "Our algorithm analyzes your preferences and finds your perfect partners instantly.",
              },
              {
                step: 3,
                title: "Book with Confidence",
                desc: "Connect, negotiate, and sign contracts in minutes. Start your journey today.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-16">Pay only when you succeed</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="bg-background border-border">
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">Browse & Match</h3>
                <p className="text-4xl font-bold text-primary mb-4">Free</p>
                <ul className="space-y-3 text-sm">
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
              </div>
            </Card>

            <Card className="bg-background border-accent border-2">
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2">On Booking</h3>
                <p className="text-4xl font-bold text-accent mb-4">8%</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Commission on successful bookings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Auto-generated contracts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Premium analytics
                  </li>
                </ul>
              </div>
            </Card>
          </div>
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
          <p className="text-muted-foreground mb-8">Join 500+ music professionals already using Flow Stage</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple">
              Start Free Today
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
                  <a href="#" className="hover:text-primary transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Blog
                  </a>
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
                    Docs
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
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Contact
                  </a>
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
