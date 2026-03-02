import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ShieldCheck,
  Star,
  Trophy,
  ClipboardList,
  Search,
  FileCheck,
  Users,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  ArrowRight,
  Quote,
  Building2,
  Clock,
  DollarSign,
  Award,
} from "lucide-react"

const processSteps = [
  {
    step: 1,
    icon: ClipboardList,
    title: "Tell Us About Your Project",
    description: "Share your project details, timeline, and budget. It only takes 5 minutes.",
  },
  {
    step: 2,
    icon: Search,
    title: "We Match You With Contractors",
    description: "Our system matches you with verified contractors who specialize in your project type.",
  },
  {
    step: 3,
    icon: FileCheck,
    title: "Review Verified Profiles",
    description: "Browse contractor profiles, credentials, reviews, and verification badges.",
  },
  {
    step: 4,
    icon: Users,
    title: "Receive Competitive Bids",
    description: "Get detailed, standardized bids from up to 5 qualified contractors.",
  },
  {
    step: 5,
    icon: MessageSquare,
    title: "Compare & Connect",
    description: "Use our side-by-side comparison tool and message contractors directly.",
  },
  {
    step: 6,
    icon: ThumbsUp,
    title: "Hire With Confidence",
    description: "Choose your contractor knowing they're licensed, insured, and verified.",
  },
]

const badges = [
  {
    icon: CheckCircle,
    title: "Verified",
    subtitle: "✓ License & Insurance",
    description: "Basic verification confirms active contractor license and valid liability insurance.",
    color: "emerald",
  },
  {
    icon: Star,
    title: "Verified Pro",
    subtitle: "⭐ 10+ Projects, 4.5+ Rating",
    description: "Proven track record with excellent ratings from Austin homeowners.",
    color: "amber",
  },
  {
    icon: Trophy,
    title: "Verified Elite",
    subtitle: "🏆 25+ Projects, Featured",
    description: "Top-tier contractors with exceptional performance and featured status.",
    color: "violet",
  },
]

const stats = [
  { value: "500+", label: "Verified Contractors" },
  { value: "2,500+", label: "Projects Completed" },
  { value: "4.8", label: "Average Rating" },
  { value: "$50M+", label: "Project Value" },
]

const testimonials = [
  {
    name: "Sarah M.",
    location: "Austin, TX",
    content: "Contractor Verified made finding a reliable contractor so easy. The verification badges gave me confidence, and the bidding process was transparent. Our kitchen remodel turned out amazing!",
    rating: 5,
    project: "Kitchen Remodel",
  },
  {
    name: "Michael R.",
    location: "Round Rock, TX",
    content: "After a bad experience with an unverified contractor, I discovered Contractor Verified. The difference is night and day. Professional, insured, and they delivered exactly what they promised.",
    rating: 5,
    project: "Bathroom Remodel",
  },
  {
    name: "Jennifer L.",
    location: "Cedar Park, TX",
    content: "The side-by-side bid comparison saved us thousands. We could clearly see what each contractor offered and make an informed decision. Highly recommend!",
    rating: 5,
    project: "Full Home Renovation",
  },
]

const benefits = [
  {
    icon: ShieldCheck,
    title: "100% Verified Contractors",
    description: "Every contractor is background-checked with verified licenses and insurance.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Standardized bids with detailed breakdowns. No hidden fees or surprises.",
  },
  {
    icon: Clock,
    title: "Fast Response Times",
    description: "Get matched with contractors and receive bids within 48 hours.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Our verification process ensures only top professionals join our network.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-navy-dark to-navy py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-gold text-sm font-medium mb-6 animate-fade-in">
              <ShieldCheck className="h-4 w-4" />
              Austin&apos;s #1 Contractor Verification Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up">
              Find Trusted, Verified
              <br />
              <span className="text-gold">Contractors in Austin</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up stagger-1">
              We verify licenses, insurance, and track records so you can hire with confidence.
              Get free quotes from pre-screened contractors today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
              <Button size="lg" className="bg-gold hover:bg-gold-light text-navy font-semibold text-lg px-8" asChild>
                <Link href="/start-project">
                  Get Free Quotes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="container mx-auto px-4 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Our Verification Badges
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every contractor earns their badge through our rigorous verification process
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {badges.map((badge, index) => (
              <Card key={index} className={`card-hover border-2 border-${badge.color}-200 bg-white`}>
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-${badge.color}-100 mb-4`}>
                    <badge.icon className={`h-8 w-8 text-${badge.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-1">{badge.title}</h3>
                  <p className={`text-sm font-medium text-${badge.color}-600 mb-3`}>{badge.subtitle}</p>
                  <p className="text-gray-600">{badge.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              How Contractor Verified Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From project description to hiring, we guide you every step of the way
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-navy text-white font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="bg-navy hover:bg-navy-light" asChild>
              <Link href="/start-project">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Contractor Verified?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We&apos;re not just a directory—we&apos;re your partner in finding the right contractor
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
                  <benefit.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              What Homeowners Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied Austin homeowners
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-gold mb-4" />
                  <p className="text-gray-700 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      {testimonial.project}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-navy-light text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Get matched with verified contractors and receive free quotes in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-gold hover:bg-gold-light text-navy font-semibold text-lg px-8" asChild>
              <Link href="/start-project">
                Get Free Quotes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/for-contractors">Join as Contractor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Contractors CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-navy">
                <Building2 className="h-10 w-10 text-gold" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-navy mb-2">
                Are You a Contractor?
              </h3>
              <p className="text-gray-600 mb-4">
                Join Austin&apos;s premier contractor network. Get verified, receive quality leads,
                and grow your business with Contractor Verified.
              </p>
              <Button className="bg-navy hover:bg-navy-light" asChild>
                <Link href="/for-contractors">
                  Learn About Membership
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
