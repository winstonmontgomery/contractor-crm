import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ClipboardList,
  Search,
  FileCheck,
  Users,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  CheckCircle,
  Star,
  Trophy,
  ArrowRight,
  Play,
} from "lucide-react"

const steps = [
  {
    number: 1,
    icon: ClipboardList,
    title: "Describe Your Project",
    description: "Start by telling us about your project. Our simple 5-step wizard guides you through selecting your project type, property details, timeline, budget, and uploading photos.",
    details: [
      "Choose from 13+ project categories",
      "Specify property type and size",
      "Set your preferred timeline",
      "Define your budget range",
      "Upload photos for accurate quotes",
    ],
  },
  {
    number: 2,
    icon: Search,
    title: "We Match You With Contractors",
    description: "Our intelligent matching system finds the best contractors for your specific project based on their specialties, location, availability, and performance history.",
    details: [
      "AI-powered contractor matching",
      "Only verified contractors",
      "Matched by specialty & location",
      "Performance-based ranking",
      "Up to 5 qualified matches",
    ],
  },
  {
    number: 3,
    icon: FileCheck,
    title: "Review Contractor Profiles",
    description: "Browse detailed profiles of matched contractors. See their verification badges, reviews, completed projects, and credentials before making any decisions.",
    details: [
      "Verification badges displayed",
      "Real reviews from homeowners",
      "Portfolio of completed work",
      "License & insurance details",
      "Response rates & reliability scores",
    ],
  },
  {
    number: 4,
    icon: Users,
    title: "Receive Detailed Bids",
    description: "Contractors submit standardized, detailed bids that break down costs transparently. No hidden fees, no surprises—just clear, comparable quotes.",
    details: [
      "Standardized bid format",
      "Labor, materials, permits itemized",
      "Timeline estimates included",
      "Warranty terms specified",
      "All bids received within 48-72 hours",
    ],
  },
  {
    number: 5,
    icon: MessageSquare,
    title: "Compare & Communicate",
    description: "Use our side-by-side comparison tool to evaluate bids. Message contractors directly through our platform to ask questions and clarify details.",
    details: [
      "Side-by-side bid comparison",
      "Built-in secure messaging",
      "Ask questions directly",
      "Request bid modifications",
      "All communication in one place",
    ],
  },
  {
    number: 6,
    icon: ThumbsUp,
    title: "Hire With Confidence",
    description: "Select your preferred contractor knowing they're fully verified. Our platform tracks the project and facilitates reviews when complete.",
    details: [
      "Licensed & insured contractors",
      "Background-checked professionals",
      "Project milestone tracking",
      "Leave a review when done",
      "Ongoing support available",
    ],
  },
]

const faqs = [
  {
    question: "How much does it cost to use Contractor Verified?",
    answer: "It's completely free for homeowners! You can post your project, receive bids, and hire contractors at no cost. Contractors pay membership fees to be part of our verified network.",
  },
  {
    question: "How do you verify contractors?",
    answer: "We verify active contractor licenses with the state, confirm liability insurance coverage of at least $1M, check for any complaints or legal issues, and review their work history and references.",
  },
  {
    question: "How long does it take to receive bids?",
    answer: "Most homeowners receive their first bids within 24 hours. You'll typically have all bids (up to 5) within 48-72 hours of posting your project.",
  },
  {
    question: "What if I'm not satisfied with the bids I receive?",
    answer: "If you're not satisfied with the bids, you can request additional contractors be matched to your project, or adjust your project details to attract different contractors.",
  },
  {
    question: "Can I contact contractors directly?",
    answer: "Yes! Once matched, you can message contractors directly through our secure platform. All communication is tracked for your protection.",
  },
  {
    question: "What types of projects can I post?",
    answer: "We support all residential renovation and construction projects including kitchen/bath remodels, additions, roofing, plumbing, electrical, HVAC, painting, flooring, and more.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How Contractor Verified Works
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            From describing your project to hiring a verified contractor, we make the process
            simple, transparent, and stress-free.
          </p>
          <Button size="lg" className="bg-gold hover:bg-gold-light text-navy font-semibold" asChild>
            <Link href="/start-project">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Steps Detail */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="mb-16 last:mb-0">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-navy text-white font-bold text-2xl">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <step.icon className="h-6 w-6 text-gold" />
                      <h2 className="text-2xl font-bold text-navy">{step.title}</h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block ml-8 mt-8 h-16 w-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Badges */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Our Verification Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Contractors earn badges based on verification level and performance
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-emerald-200">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Verified ✓</h3>
                <p className="text-emerald-600 font-medium mb-4">Base Level</p>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Active state license verified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    $1M+ liability insurance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Background check passed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    No unresolved complaints
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 mb-4">
                  <Star className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Verified Pro ⭐</h3>
                <p className="text-amber-600 font-medium mb-4">Performance Level</p>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    All Verified requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    10+ completed projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    4.5+ star average rating
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    90%+ response rate
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-violet-200">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-violet-100 mb-4">
                  <Trophy className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Verified Elite 🏆</h3>
                <p className="text-violet-600 font-medium mb-4">Top Tier</p>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    All Verified Pro requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    25+ completed projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    4.8+ star average rating
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-violet-500" />
                    Featured status on platform
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-navy mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Post your project in 5 minutes and start receiving quotes from verified contractors.
          </p>
          <Button size="lg" className="bg-gold hover:bg-gold-light text-navy font-semibold" asChild>
            <Link href="/start-project">
              Start Your Project Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
