'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Prospect {
  id: number;
  name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  source: string;
  source_url: string | null;
  service_categories: string | null;
  location: string | null;
  rating: number | null;
  review_count: number | null;
  status: string;
  outreach_count: number;
  last_contacted_at: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  interested: number;
  signed_up: number;
  from_angi: number;
  from_thumbtack: number;
}

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchProspects();
  }, [filter, sourceFilter]);

  const fetchProspects = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (sourceFilter !== 'all') params.set('source', sourceFilter);
      
      const res = await fetch(`/api/prospects?${params}`);
      const data = await res.json();
      setProspects(data.prospects || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/prospects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      showToast(`Status updated to ${status}`);
      fetchProspects();
    } catch (err) {
      showToast('Failed to update status');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('📋 Copied!');
  };

  const getSourceIcon = (source: string) => {
    const icons: Record<string, string> = {
      angi: '🅰️',
      thumbtack: '📌',
      yelp: '⭐',
      google: '🔍',
      manual: '✋'
    };
    return icons[source] || '📋';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      interested: 'bg-purple-100 text-purple-800',
      signed_up: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      unresponsive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredProspects = prospects.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(s) ||
      p.company_name?.toLowerCase().includes(s) ||
      p.phone?.includes(s) ||
      p.service_categories?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="text-emerald-300 hover:text-white text-sm mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="text-3xl font-black">🎯 Prospect Pipeline</h1>
          <p className="text-emerald-200 mt-1">Contractors to recruit for the platform</p>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-black">{stats.total}</p>
                <p className="text-sm text-emerald-200">Total Prospects</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-blue-400">{stats.new}</p>
                <p className="text-sm text-emerald-200">New</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-yellow-400">{stats.contacted}</p>
                <p className="text-sm text-emerald-200">Contacted</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-purple-400">{stats.interested}</p>
                <p className="text-sm text-emerald-200">Interested</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-green-400">{stats.signed_up}</p>
                <p className="text-sm text-emerald-200">Signed Up</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="🔍 Search prospects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none"
            />

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'new', 'contacted', 'interested', 'signed_up'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    filter === s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s === 'all' ? 'All' : s.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 font-bold"
            >
              <option value="all">All Sources</option>
              <option value="angi">🅰️ Angi</option>
              <option value="thumbtack">📌 Thumbtack</option>
              <option value="yelp">⭐ Yelp</option>
              <option value="google">🔍 Google</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          Showing <span className="font-bold text-gray-900">{filteredProspects.length}</span> prospects
        </div>

        {/* Prospects Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filteredProspects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            <p className="text-xl mb-2">No prospects found</p>
            <p>Scrape Angi or Thumbtack to add prospects</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProspects.map(prospect => (
              <div key={prospect.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getSourceIcon(prospect.source)}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{prospect.name}</h3>
                      {prospect.company_name && (
                        <p className="text-sm text-gray-500">{prospect.company_name}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(prospect.status)}`}>
                    {prospect.status.toUpperCase()}
                  </span>
                </div>

                {prospect.service_categories && (
                  <p className="text-sm text-gray-600 mb-2">🔧 {prospect.service_categories}</p>
                )}

                {prospect.rating && (
                  <p className="text-sm text-gray-600 mb-2">
                    ⭐ {prospect.rating} ({prospect.review_count} reviews)
                  </p>
                )}

                {prospect.location && (
                  <p className="text-sm text-gray-500 mb-3">📍 {prospect.location}</p>
                )}

                {prospect.phone && (
                  <div
                    onClick={() => copyToClipboard(prospect.phone!)}
                    className="p-2 bg-blue-50 rounded-lg text-blue-700 font-bold cursor-pointer hover:bg-blue-100 mb-3"
                  >
                    📞 {prospect.phone}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  {prospect.status === 'new' && (
                    <button
                      onClick={() => updateStatus(prospect.id, 'contacted')}
                      className="flex-1 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-bold hover:bg-yellow-200 text-sm"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {prospect.status === 'contacted' && (
                    <>
                      <button
                        onClick={() => updateStatus(prospect.id, 'interested')}
                        className="flex-1 py-2 bg-purple-100 text-purple-800 rounded-lg font-bold hover:bg-purple-200 text-sm"
                      >
                        Interested
                      </button>
                      <button
                        onClick={() => updateStatus(prospect.id, 'unresponsive')}
                        className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 text-sm"
                      >
                        No Response
                      </button>
                    </>
                  )}
                  {prospect.status === 'interested' && (
                    <button
                      onClick={() => updateStatus(prospect.id, 'signed_up')}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 text-sm"
                    >
                      ✓ Signed Up
                    </button>
                  )}
                  {prospect.source_url && (
                    <a
                      href={prospect.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 text-sm"
                    >
                      🔗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
