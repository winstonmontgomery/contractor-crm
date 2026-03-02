'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contractor {
  id: number;
  name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  services: string | null;
  service_categories: string | null;
  location: string | null;
  verification_level: string;
  membership_tier: string;
  avg_rating: number;
  total_reviews: number;
  recommendation_count: number;
  logo_url: string | null;
  website: string | null;
  active: number;
  created_at: string;
}

interface Trade {
  trade: string;
  count: number;
}

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasPhoneOnly, setHasPhoneOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [showTradeDropdown, setShowTradeDropdown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchTrades();
  }, []);

  useEffect(() => {
    fetchContractors();
  }, [selectedTrades, verifiedOnly, hasPhoneOnly, sortBy, sortOrder]);

  const fetchTrades = async () => {
    try {
      const res = await fetch('/api/trades');
      const data = await res.json();
      setAllTrades(data.trades || []);
    } catch (err) {
      console.error('Failed to fetch trades:', err);
    }
  };

  const fetchContractors = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTrades.length > 0) params.set('trades', selectedTrades.join(','));
      if (verifiedOnly) params.set('verified', 'true');
      if (hasPhoneOnly) params.set('hasPhone', 'true');
      params.set('sort', sortBy);
      params.set('order', sortOrder);

      const res = await fetch(`/api/contractors?${params}`);
      const data = await res.json();
      setContractors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch contractors:', err);
      setContractors([]);
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
    showToast('📋 Copied to clipboard!');
  };

  const toggleTrade = (trade: string) => {
    setSelectedTrades(prev => 
      prev.includes(trade) 
        ? prev.filter(t => t !== trade)
        : [...prev, trade]
    );
  };

  const clearTrades = () => {
    setSelectedTrades([]);
  };

  const filteredContractors = contractors.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(s) ||
      c.company_name?.toLowerCase().includes(s) ||
      c.phone?.includes(s) ||
      c.service_categories?.toLowerCase().includes(s) ||
      c.location?.toLowerCase().includes(s)
    );
  });

  const stats = {
    total: contractors.length,
    verified: contractors.filter(c => ['verified', 'pro', 'elite'].includes(c.verification_level)).length,
    withPhone: contractors.filter(c => c.phone && c.phone.length > 0).length,
  };

  const getTradesArray = (categories: string | null): string[] => {
    if (!categories) return [];
    return categories.split(',').map(t => t.trim()).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading contractors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">← Back to Dashboard</Link>
              <h1 className="text-3xl md:text-4xl font-black">👷 Contractor Network</h1>
              <p className="text-gray-300 mt-1">{stats.total} contractors • {stats.withPhone} with phone</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-black">{stats.total}</p>
              <p className="text-sm text-gray-300">Total</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-green-400">{stats.verified}</p>
              <p className="text-sm text-gray-300">Verified</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-blue-400">{stats.withPhone}</p>
              <p className="text-sm text-gray-300">With Phone</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by name, phone, trade, location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Trade Multi-Select Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTradeDropdown(!showTradeDropdown)}
                className={`px-4 py-3 rounded-xl border-2 font-bold flex items-center gap-2 min-w-[200px] justify-between ${
                  selectedTrades.length > 0 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>
                  {selectedTrades.length === 0 
                    ? '🔧 All Trades' 
                    : `🔧 ${selectedTrades.length} Trade${selectedTrades.length > 1 ? 's' : ''}`}
                </span>
                <span className="text-gray-400">▼</span>
              </button>

              {showTradeDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  <div className="sticky top-0 bg-white p-3 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Select Trades</span>
                      {selectedTrades.length > 0 && (
                        <button onClick={clearTrades} className="text-sm text-red-600 hover:underline">
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-2">
                    {allTrades.map(({ trade, count }) => (
                      <label
                        key={trade}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedTrades.includes(trade) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTrades.includes(trade)}
                          onChange={() => toggleTrade(trade)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex-1 font-medium">{trade}</span>
                        <span className="text-sm text-gray-400">{count}</span>
                      </label>
                    ))}
                  </div>
                  <div className="sticky bottom-0 bg-white p-3 border-t border-gray-100">
                    <button
                      onClick={() => setShowTradeDropdown(false)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={e => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 font-bold bg-white min-w-[180px]"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="trades-asc">Trade A-Z</option>
              <option value="trades-desc">Trade Z-A</option>
              <option value="recent-desc">Newest First</option>
              <option value="recent-asc">Oldest First</option>
            </select>

            {/* Toggle Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`px-4 py-3 rounded-xl font-bold border-2 transition ${
                  verifiedOnly 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ✓ Verified
              </button>
              <button
                onClick={() => setHasPhoneOnly(!hasPhoneOnly)}
                className={`px-4 py-3 rounded-xl font-bold border-2 transition ${
                  hasPhoneOnly 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                📞 Phone
              </button>
            </div>
          </div>

          {/* Selected Trades Chips */}
          {selectedTrades.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 py-1">Filtering by:</span>
              {selectedTrades.map(trade => (
                <span
                  key={trade}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold flex items-center gap-2"
                >
                  {trade}
                  <button
                    onClick={() => toggleTrade(trade)}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={clearTrades}
                className="px-3 py-1 text-red-600 text-sm font-bold hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing <span className="font-bold text-gray-900">{filteredContractors.length}</span> contractor{filteredContractors.length !== 1 ? 's' : ''}
        </div>

        {/* Contractors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContractors.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-500">
              <p className="text-xl mb-4">No contractors found</p>
              {(selectedTrades.length > 0 || verifiedOnly || hasPhoneOnly || search) && (
                <button
                  onClick={() => { clearTrades(); setVerifiedOnly(false); setHasPhoneOnly(false); setSearch(''); }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filteredContractors.map(contractor => (
              <div
                key={contractor.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer border border-gray-100"
                onClick={() => setSelectedContractor(contractor)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    {contractor.logo_url ? (
                      <img
                        src={contractor.logo_url}
                        alt={contractor.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">👷</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-black text-gray-900 truncate">{contractor.name}</h3>
                        {['verified', 'pro', 'elite'].includes(contractor.verification_level) && (
                          <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      
                      {contractor.location && (
                        <p className="text-sm text-gray-500 truncate">📍 {contractor.location}</p>
                      )}
                    </div>
                  </div>

                  {/* Trade Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {getTradesArray(contractor.service_categories).slice(0, 4).map(trade => (
                      <span
                        key={trade}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                      >
                        {trade}
                      </span>
                    ))}
                    {getTradesArray(contractor.service_categories).length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">
                        +{getTradesArray(contractor.service_categories).length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  {contractor.phone && (
                    <div
                      onClick={e => { e.stopPropagation(); copyToClipboard(contractor.phone!); }}
                      className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center justify-between hover:bg-blue-100 transition"
                    >
                      <span className="font-bold text-blue-700">📞 {contractor.phone}</span>
                      <span className="text-sm text-blue-500">Copy</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showTradeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTradeDropdown(false)}
        />
      )}

      {/* Contractor Detail Modal */}
      {selectedContractor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedContractor(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start gap-4">
                {selectedContractor.logo_url ? (
                  <img src={selectedContractor.logo_url} alt={selectedContractor.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-3xl">👷</span>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-black">{selectedContractor.name}</h2>
                  {selectedContractor.location && (
                    <p className="text-gray-500">📍 {selectedContractor.location}</p>
                  )}
                  {['verified', 'pro', 'elite'].includes(selectedContractor.verification_level) && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                      ✓ Verified Contractor
                    </span>
                  )}
                </div>
                <button onClick={() => setSelectedContractor(null)} className="text-gray-400 hover:text-gray-600 text-3xl">×</button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Trades */}
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2">Trades & Services</p>
                <div className="flex flex-wrap gap-2">
                  {getTradesArray(selectedContractor.service_categories).map(trade => (
                    <span key={trade} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold">
                      {trade}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phone */}
              {selectedContractor.phone && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <p className="font-black text-2xl text-blue-600">{selectedContractor.phone}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedContractor.phone!)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg"
                  >
                    📋 Copy
                  </button>
                </div>
              )}

              {/* Website */}
              {selectedContractor.website && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium">Website</p>
                  <a
                    href={selectedContractor.website.startsWith('http') ? selectedContractor.website : `https://${selectedContractor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 hover:underline"
                  >
                    🌐 {selectedContractor.website}
                  </a>
                </div>
              )}

              {/* Email */}
              {selectedContractor.email && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="font-bold text-gray-900 truncate">{selectedContractor.email}</p>
                  </div>
                  <button onClick={() => copyToClipboard(selectedContractor.email!)} className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 ml-3">
                    Copy
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              {selectedContractor.phone && (
                <a
                  href={`tel:${selectedContractor.phone}`}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 text-center shadow-lg"
                >
                  📞 Call Now
                </a>
              )}
              <button
                onClick={() => setSelectedContractor(null)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
