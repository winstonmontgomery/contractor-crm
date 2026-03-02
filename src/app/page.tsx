'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  leads: { total: number; hot: number; new: number; matched: number };
  contractors: { total: number; verified: number; withPhone: number };
}

interface Lead {
  id: number;
  name: string;
  service_needed: string;
  lead_temperature: string;
  status: string;
  location: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, contractorsRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/contractors'),
      ]);
      const leads = await leadsRes.json();
      const contractors = await contractorsRes.json();
      
      setStats({
        leads: {
          total: leads.length,
          hot: leads.filter((l: Lead) => l.lead_temperature === 'hot').length,
          new: leads.filter((l: Lead) => l.status === 'new').length,
          matched: leads.filter((l: Lead) => l.status === 'matched').length,
        },
        contractors: {
          total: contractors.length,
          verified: contractors.filter((c: any) => c.verification_level === 'verified').length,
          withPhone: contractors.filter((c: any) => c.phone && c.phone.length > 0).length,
        },
      });
      setRecentLeads(leads.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">
                Contractor Verified <span className="text-emerald-400">ATX</span>
              </h1>
              <p className="text-xl text-gray-300">
                CRM Dashboard • Your contractor matchmaking command center
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-3">
              <Link href="/leads" className="px-6 py-3 bg-emerald-600 rounded-xl font-bold hover:bg-emerald-500 transition shadow-lg flex items-center gap-2">
                📋 View Leads
              </Link>
              <Link href="/contractors" className="px-6 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition backdrop-blur flex items-center gap-2">
                👷 Contractors
              </Link>
            </div>
          </div>

          {/* Big Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="text-gray-300 text-sm font-medium">Total Leads</p>
              <p className="text-5xl font-black mt-1">{stats?.leads.total || 0}</p>
              <p className="text-emerald-400 text-sm mt-2">📋 From Facebook group</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="text-gray-300 text-sm font-medium">🔥 Hot Leads</p>
              <p className="text-5xl font-black mt-1 text-red-400">{stats?.leads.hot || 0}</p>
              <p className="text-gray-400 text-sm mt-2">Ready to convert</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="text-gray-300 text-sm font-medium">Contractors</p>
              <p className="text-5xl font-black mt-1">{stats?.contractors.total || 0}</p>
              <p className="text-emerald-400 text-sm mt-2">👷 In network</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="text-gray-300 text-sm font-medium">📞 With Phone</p>
              <p className="text-5xl font-black mt-1 text-blue-400">{stats?.contractors.withPhone || 0}</p>
              <p className="text-gray-400 text-sm mt-2">Contact ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Hot Leads */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black">🔥 Recent Hot Leads</h2>
              <Link href="/leads?filter=hot" className="text-emerald-600 font-bold hover:underline">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentLeads.filter(l => l.lead_temperature === 'hot').slice(0, 5).map(lead => (
                <Link href="/leads" key={lead.id} className="block p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.service_needed} • {lead.location}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                      🔥 HOT
                    </span>
                  </div>
                </Link>
              ))}
              {recentLeads.filter(l => l.lead_temperature === 'hot').length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No hot leads yet. Start mining!
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-black">⚡ Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <Link href="/leads" className="block p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📋</div>
                  <div>
                    <p className="font-bold text-lg">Manage Leads</p>
                    <p className="text-emerald-100 text-sm">{stats?.leads.new || 0} new leads waiting</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/contractors" className="block p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">👷</div>
                  <div>
                    <p className="font-bold text-lg">Contractor Network</p>
                    <p className="text-blue-100 text-sm">{stats?.contractors.verified || 0} verified contractors</p>
                  </div>
                </div>
              </Link>

              <Link href="/leads" className="block p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <p className="font-bold text-lg">Match Leads</p>
                    <p className="text-purple-100 text-sm">Connect leads with contractors</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black">📊 Lead Funnel</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center p-6 bg-blue-50 rounded-xl">
                <p className="text-4xl font-black text-blue-600">{stats?.leads.new || 0}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">🆕 New</p>
              </div>
              <div className="text-gray-300 text-2xl">→</div>
              <div className="flex-1 text-center p-6 bg-yellow-50 rounded-xl">
                <p className="text-4xl font-black text-yellow-600">0</p>
                <p className="text-sm text-gray-600 font-medium mt-1">📞 Contacted</p>
              </div>
              <div className="text-gray-300 text-2xl">→</div>
              <div className="flex-1 text-center p-6 bg-purple-50 rounded-xl">
                <p className="text-4xl font-black text-purple-600">{stats?.leads.matched || 0}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">🎯 Matched</p>
              </div>
              <div className="text-gray-300 text-2xl">→</div>
              <div className="flex-1 text-center p-6 bg-green-50 rounded-xl">
                <p className="text-4xl font-black text-green-600">0</p>
                <p className="text-sm text-gray-600 font-medium mt-1">✅ Converted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Contractor Verified ATX • Built with ❤️ for Austin contractors
          </p>
          <p className="text-sm text-gray-500 mt-2">
            63,400+ Facebook group members • Austin's #1 contractor network
          </p>
        </div>
      </div>
    </div>
  );
}
