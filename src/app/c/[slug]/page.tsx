'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Contractor {
  id: number;
  name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  services: string | null;
  location: string | null;
  verification_level: string;
  avg_rating: number;
  total_reviews: number;
  recommendation_count: number;
  created_at: string;
  // Extended profile fields
  bio?: string;
  website?: string;
  years_in_business?: number;
  license_number?: string;
  insurance_verified?: boolean;
  portfolio_images?: string[];
  social_facebook?: string;
  social_instagram?: string;
  social_tiktok?: string;
}

export default function ContractorProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchContractor();
  }, [slug]);

  const fetchContractor = async () => {
    try {
      // Fetch by slug (company name slugified or ID)
      const res = await fetch(`/api/contractors/profile/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setContractor(data);
      }
    } catch (err) {
      console.error('Failed to fetch contractor:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('📋 Copied!');
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // In real implementation, this would send a lead to the contractor
    showToast('Message sent! The contractor will reach out soon.');
    setShowContactForm(false);
    form.reset();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Contractor Not Found</h1>
          <p className="text-gray-600">This profile doesn't exist or has been removed.</p>
          <a href="/" className="mt-6 inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-emerald-600 rounded-2xl flex items-center justify-center text-5xl font-black shadow-xl">
              {contractor.name.charAt(0)}
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  contractor.verification_level === 'elite' ? 'bg-purple-500' :
                  contractor.verification_level === 'pro' ? 'bg-blue-500' :
                  contractor.verification_level === 'verified' ? 'bg-green-500' :
                  'bg-gray-500'
                }`}>
                  {contractor.verification_level === 'elite' ? '🏆 ELITE' :
                   contractor.verification_level === 'pro' ? '⭐ PRO' :
                   contractor.verification_level === 'verified' ? '✓ VERIFIED' : 'MEMBER'}
                </span>
                {contractor.insurance_verified && (
                  <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-bold">
                    🛡️ INSURED
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-2">{contractor.name}</h1>
              {contractor.company_name && (
                <p className="text-xl text-gray-300 mb-4">{contractor.company_name}</p>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-300">
                {contractor.location && (
                  <span>📍 {contractor.location}</span>
                )}
                {contractor.services && (
                  <span>🔧 {contractor.services}</span>
                )}
              </div>

              {/* Rating */}
              {contractor.avg_rating > 0 && (
                <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
                  <span className="text-2xl font-black text-yellow-400">
                    {'★'.repeat(Math.round(contractor.avg_rating))}{'☆'.repeat(5 - Math.round(contractor.avg_rating))}
                  </span>
                  <span className="text-gray-300">
                    {contractor.avg_rating.toFixed(1)} ({contractor.total_reviews} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Contact & Social */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-black mb-4">📞 Contact</h3>
              
              {contractor.phone && (
                <div 
                  onClick={() => copyToClipboard(contractor.phone!)}
                  className="p-4 bg-blue-50 rounded-xl mb-3 cursor-pointer hover:bg-blue-100 transition"
                >
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-xl font-bold text-blue-600">{contractor.phone}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to copy</p>
                </div>
              )}
              
              {contractor.email && (
                <div 
                  onClick={() => copyToClipboard(contractor.email!)}
                  className="p-4 bg-gray-50 rounded-xl mb-3 cursor-pointer hover:bg-gray-100 transition"
                >
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-bold text-gray-900 truncate">{contractor.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to copy</p>
                </div>
              )}

              <button
                onClick={() => setShowContactForm(true)}
                className="w-full px-6 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg text-lg"
              >
                📩 Request Quote
              </button>
            </div>

            {/* Recommendations */}
            {contractor.recommendation_count > 0 && (
              <div className="bg-yellow-50 rounded-2xl p-6">
                <div className="text-center">
                  <p className="text-4xl font-black text-yellow-600">{contractor.recommendation_count}</p>
                  <p className="text-gray-600 font-medium">Group Recommendations</p>
                  <p className="text-xs text-gray-500 mt-2">from Contractor Verified Austin</p>
                </div>
              </div>
            )}

            {/* Social Links */}
            {(contractor.social_facebook || contractor.social_instagram || contractor.social_tiktok) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-black mb-4">🔗 Social</h3>
                <div className="space-y-3">
                  {contractor.social_facebook && (
                    <a href={contractor.social_facebook} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                      <span className="text-2xl">📘</span>
                      <span className="font-medium">Facebook</span>
                    </a>
                  )}
                  {contractor.social_instagram && (
                    <a href={contractor.social_instagram} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition">
                      <span className="text-2xl">📸</span>
                      <span className="font-medium">Instagram</span>
                    </a>
                  )}
                  {contractor.social_tiktok && (
                    <a href={contractor.social_tiktok} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <span className="text-2xl">🎵</span>
                      <span className="font-medium">TikTok</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - About & Services */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-black mb-4">About</h3>
              <p className="text-gray-700 leading-relaxed">
                {contractor.bio || `${contractor.name} is a ${contractor.verification_level} contractor serving the ${contractor.location || 'Austin'} area. Specializing in ${contractor.services || 'construction services'}.`}
              </p>
              
              {contractor.years_in_business && (
                <div className="mt-4 flex items-center gap-2 text-gray-600">
                  <span className="text-2xl">🏗️</span>
                  <span>{contractor.years_in_business} years in business</span>
                </div>
              )}
              
              {contractor.license_number && (
                <div className="mt-2 flex items-center gap-2 text-gray-600">
                  <span className="text-2xl">📋</span>
                  <span>License: {contractor.license_number}</span>
                </div>
              )}
            </div>

            {/* Services */}
            {contractor.services && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-black mb-4">🔧 Services</h3>
                <div className="flex flex-wrap gap-2">
                  {contractor.services.split(',').map((service, i) => (
                    <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                      {service.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-black mb-2">Ready to get started?</h3>
              <p className="text-emerald-100 mb-6">Get a free quote for your project today.</p>
              <button
                onClick={() => setShowContactForm(true)}
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg text-lg"
              >
                📩 Request Free Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            This contractor is a verified member of <span className="text-emerald-400 font-bold">Contractor Verified ATX</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Austin's #1 trusted contractor network • 63,400+ members
          </p>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowContactForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-black">📩 Request Quote from {contractor.name}</h2>
            </div>
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                  <input name="name" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone *</label>
                  <input name="phone" type="tel" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input name="email" type="email" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Project Type</label>
                <select name="service" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl">
                  <option value="">Select a service...</option>
                  {contractor.services?.split(',').map((s, i) => (
                    <option key={i} value={s.trim()}>{s.trim()}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Project Details *</label>
                <textarea name="details" required rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none resize-none" placeholder="Describe your project..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowContactForm(false)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
