import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShieldCheck,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  Star,
  Trophy,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Clock,
  DollarSign,
  MessageSquare,
} from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Trust Badge",
    description: "Stand out with our verification badges that show homeowners you're licensed, insured, and trustworthy.",
  },
  {
    icon: Target,
    title: "Quality Leads",
    description: "Get matched with homeowners actively looking for your services. No tire-kickers—only serious projects.",
  },
  {
    icon: BarChart3,
    title: "Performance Dashboard",
    description: "Track your bids, win rates, reviews, and business metrics in one comprehensive dashboard.",
  },
  {
    icon: Award,
    title: "Build Your Reputation",
    description: "Collect verified reviews and earn Pro and Elite badges as you complete more projects.",
  },
  {
    icon: Users,
    title: "Grow Your Network",
    description: "Connect with homeowners and build lasting relationships that lead to referrals.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Message homeowners directly through our secure platform. No middlemen.",
  },
]

const tiers = [
  {
    name: "Network Member",
    price: 35,
    period: "month",
    description: "Get verified and start building your presence",
    badge: "Verified ✓",
    badgeColor: "emerald",
    features: [
      "Verified contractor badge",
      "Profile in contractor directory",
      "Receive bid invitations",
      "Basic analytics dashboard",
      "Contractor resources library",
      "Email support",
      "Up to 10 bids/month",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Performance-Qualified",
    price: 99,
    period: "month",
    description: "For serious contractors ready to grow",
    badge: "Eligible for Pro ⭐",
    badgeColor: "amber",
    features: [
      "Everything in Network Member",
      "Curated bid invitations",
      "Priority in search results",
      "Advanced analytics & insights",
      "Side-by-side bid comparison visibility",
      "Phone & chat support",
      "Unlimited bids",
      "Featured contractor opportunities",
      "Early access to new features",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
]

const stats = [
  { value: "$50M+", label: "Project value on platform" },
  { value: "500+", label: "Verified contractors" },
  { value: "85%", label: "Average bid win rate" },
  { value: "$8,500", label: "Average project value" },
]

const faqs = [
  {
    question: "How does the verification process work?",
    answer: "Submit your contractor license, proof of insurance, and business details. Our team verifies everything within 2-3 business days. Once approved, you'll receive your Verified badge.",
  },
  {
    question: "What's the difference between Network and Performance-Qualified?",
    answer: "Network Members get basic access to bid on projects. Performance-Qualified members get priority access to curated, high-quality leads, advanced analytics, and are featured more prominently to homeowners.",
  },
  {
    question: "How do I earn Pro and Elite badges?",
    answer: "Badges are earned through performance. Complete 10+ projects with 4.5+ rating for Pro status. Reach 25+ projects with 4.8+ rating for Elite status.",
  },
  {
    question: "Can I cancel my membership?",
    answer: "Yes, you can cancel anytime. Your membership will remain active until the end of your billing period. No long-term contracts required.",
  },
  {
    question: "What types of contractors do you accept?",
    answer: "We accept all licensed residential contractors including general contractors, plumbers, electricians, HVAC technicians, roofers, painters, and more.",
  },
]

export default function ForContractorsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Join Austin's Premier Contractor Network
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Grow Your Business With
              <br />
              <span className="text-gold">Verified Quality Leads</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Get matched with homeowners actively looking for your services.
              Build your reputation with verified reviews and trust badges.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gold hover:bg-gold-light text-navy font-semibold" asChild>
                <Link href="/signup?role=CONTRACTOR">
                  Apply Now - Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Why Join Contractor Verified?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to find quality clients and grow your business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-navy/10 mb-4">
                    <benefit.icon className="h-6 w-6 text-navy" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business. Start with a 14-day free trial.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${tier.popular ? "border-2 border-gold shadow-lg" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-navy text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3 w-fit bg-${tier.badgeColor}-100 text-${tier.badgeColor}-700`}>
                    {tier.badge}
                  </div>
                  <CardTitle className="text-2xl text-navy">{tier.name}</CardTitle>
                  <p className="text-gray-600">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-navy">${tier.price}</span>
                    <span className="text-gray-500">/{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${tier.popular ? "bg-gold hover:bg-gold-light text-navy" : "bg-navy hover:bg-navy-light"}`}
                    size="lg"
                    asChild
                  >
                    <Link href="/signup?role=CONTRACTOR">{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* How Badges Work */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Earn Badges, Win More Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your performance unlocks higher-tier badges that increase visibility
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-4">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Verified ✓</h3>
              <p className="text-gray-600 mb-4">Starting badge for all members</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>License verified</li>
                <li>Insurance confirmed</li>
                <li>Background checked</li>
              </ul>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 mb-4">
                <Star className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Verified Pro ⭐</h3>
              <p className="text-gray-600 mb-4">Earned through performance</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>10+ completed projects</li>
                <li>4.5+ star rating</li>
                <li>Priority in search</li>
              </ul>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-violet-100 mb-4">
                <Trophy className="h-10 w-10 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Verified Elite 🏆</h3>
              <p className="text-gray-600 mb-4">Top-tier status</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>25+ completed projects</li>
                <li>4.8+ star rating</li>
                <li>Featured status</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
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
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 500+ verified contractors already winning quality projects.
          </p>
          <Button size="lg" className="bg-gold hover:bg-gold-light text-navy font-semibold" asChild>
            <Link href="/signup?role=CONTRACTOR">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-gray-400 text-sm mt-4">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
