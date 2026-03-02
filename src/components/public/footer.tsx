import Link from "next/link"
import { ShieldCheck, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

const footerLinks = {
  homeowners: [
    { href: "/start-project", label: "Start a Project" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/find-contractors", label: "Find Contractors" },
    { href: "/reviews", label: "Reviews" },
  ],
  contractors: [
    { href: "/for-contractors", label: "Join Our Network" },
    { href: "/pricing", label: "Membership Pricing" },
    { href: "/contractor-resources", label: "Resources" },
    { href: "/login", label: "Contractor Login" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
}

const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
]

export function PublicFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10">
                <ShieldCheck className="h-6 w-6 text-gold" />
              </div>
              <div>
                <span className="font-bold text-lg">Contractor Verified</span>
                <span className="text-xs text-gold font-semibold ml-1">ATX</span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              Austin&apos;s trusted contractor verification and directory service.
              Connecting homeowners with licensed, insured professionals.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Homeowners */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">For Homeowners</h3>
            <ul className="space-y-2">
              {footerLinks.homeowners.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contractors */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">For Contractors</h3>
            <ul className="space-y-2">
              {footerLinks.contractors.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Contractor Verified ATX. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Serving Austin, TX and surrounding areas</span>
              <span className="hidden md:inline">•</span>
              <a href="tel:+15125551234" className="hover:text-white">
                (512) 555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
