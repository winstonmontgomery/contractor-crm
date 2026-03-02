'use client';

import Link from 'next/link';
import { Search, Shield, Star, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-black">
                Contractor Verified <span className="text-emerald-500">ATX</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/contractors" className="text-gray-600 hover:text-gray-900 font-medium">
                Find Contractors
              </Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">
                How It Works
              </Link>
              <Link href="/for-contractors" className="text-gray-600 hover:text-gray-900 font-medium">
                For Contractors
              </Link>
              <Link href="/start-project" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Austin's Most Trusted
              <span className="text-emerald-400"> Contractor Network</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Every contractor verified. Every project protected. Find licensed, insured professionals backed by our 63,000+ member community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contractors" className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition shadow-lg flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Find a Contractor
              </Link>
              <Link href="/start-project" className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-xl font-bold text-lg hover:bg-white/20 transition flex items-center justify-center gap-2">
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-emerald-600">317+</div>
              <div className="text-gray-600 font-medium">Verified Contractors</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-600">63K+</div>
              <div className="text-gray-600 font-medium">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-600">57</div>
              <div className="text-gray-600 font-medium">Trade Categories</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-600">100%</div>
              <div className="text-gray-600 font-medium">Background Checked</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get matched with the perfect contractor in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Tell Us Your Project</h3>
              <p className="text-gray-600">
                Describe what you need done and we'll match you with qualified contractors in your area.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Get Verified Matches</h3>
              <p className="text-gray-600">
                Receive quotes from contractors we've verified for licensing, insurance, and quality.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Hire With Confidence</h3>
              <p className="text-gray-600">
                Choose your contractor and get your project done right, backed by our community guarantee.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/start-project" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition">
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Popular Services</h2>
            <p className="text-xl text-gray-600">Find experts for any home project</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'General Contractors', icon: '🏗️' },
              { name: 'Plumbing', icon: '🔧' },
              { name: 'Electrical', icon: '⚡' },
              { name: 'HVAC', icon: '❄️' },
              { name: 'Roofing', icon: '🏠' },
              { name: 'Painting', icon: '🎨' },
              { name: 'Landscaping', icon: '🌿' },
              { name: 'Flooring', icon: '🪵' },
            ].map((service) => (
              <Link
                key={service.name}
                href={`/contractors?trade=${encodeURIComponent(service.name)}`}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <div className="font-semibold text-gray-900">{service.name}</div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/contractors" className="text-emerald-600 font-semibold hover:underline">
              View all 57 categories →
            </Link>
          </div>
        </div>
      </section>

      {/* For Contractors CTA */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Are You a Contractor?</h2>
              <p className="text-xl text-emerald-100">
                Join Austin's largest verified contractor network. Get quality leads, build your reputation, and grow your business.
              </p>
            </div>
            <Link href="/for-contractors" className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition whitespace-nowrap">
              Join Our Network
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Why Choose Contractor Verified?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-gray-100">
              <CheckCircle className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Verified Contractors</h3>
              <p className="text-gray-600">
                Every contractor is verified for active Texas licensing, general liability insurance, and business registration.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl border border-gray-100">
              <Users className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Community Backed</h3>
              <p className="text-gray-600">
                Backed by 63,000+ Austin homeowners who share real reviews and recommendations.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl border border-gray-100">
              <Shield className="w-10 h-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Local & Trusted</h3>
              <p className="text-gray-600">
                Austin-based contractors who know local codes, suppliers, and what works in Central Texas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-2xl font-black mb-4">
                Contractor Verified <span className="text-emerald-400">ATX</span>
              </div>
              <p className="text-gray-400">
                Austin's most trusted contractor network. Every contractor verified, every project protected.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Homeowners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contractors" className="hover:text-white transition">Find a Contractor</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
                <li><Link href="/start-project" className="hover:text-white transition">Start a Project</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contractors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/for-contractors" className="hover:text-white transition">Join Our Network</Link></li>
                <li><Link href="/for-contractors#pricing" className="hover:text-white transition">Pricing & Plans</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2026 Contractor Verified ATX. All rights reserved.</p>
            <p className="mt-2">Serving Austin, Round Rock, Cedar Park, Pflugerville, Georgetown, Lakeway & surrounding areas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
