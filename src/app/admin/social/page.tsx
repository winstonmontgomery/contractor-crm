'use client';

import { useState, useEffect } from 'react';

interface Contractor {
  id: number;
  name: string;
  company: string | null;
  hasProfile: boolean;
  profileKey: string | null;
  socialConnected?: boolean;
  platforms?: string[];
}

export default function SocialAdminPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await fetch('/api/social/connect');
      const data = await res.json();
      setContractors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 5000);
  };

  const generateLinkUrl = async (contractorId: number) => {
    setGenerating(contractorId);
    try {
      const res = await fetch('/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractorId }),
      });
      const data = await res.json();
      
      if (data.linkUrl) {
        // Copy to clipboard
        navigator.clipboard.writeText(data.linkUrl);
        showToast('🔗 Social connection link copied to clipboard! Send this to the contractor.');
        // Refresh list
        fetchContractors();
      } else {
        showToast('❌ Failed to generate link: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      showToast('❌ Failed to generate link');
    } finally {
      setGenerating(null);
    }
  };

  const mineDMs = async (contractorId: number) => {
    try {
      const res = await fetch(`/api/social/messages?contractorId=${contractorId}&mineLeads=true`);
      const data = await res.json();
      
      if (data.leads) {
        showToast(`✅ Found ${data.leads.length} potential leads in DMs!`);
        // TODO: Add leads to database
      } else if (data.needsConnection) {
        showToast('⚠️ Contractor needs to connect their social accounts first');
      } else {
        showToast('❌ ' + (data.error || 'Failed to mine DMs'));
      }
    } catch (err) {
      showToast('❌ Failed to mine DMs');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {toast && (
        <div className="fixed top-20 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">🔗 Social Media Connections</h1>
          <p className="text-gray-600">Connect contractor social accounts via Ayrshare to mine DMs and post on their behalf</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-400">
            <p className="text-sm text-gray-500 font-medium">Total Contractors</p>
            <p className="text-4xl font-black">{contractors.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-500 font-medium">Connected</p>
            <p className="text-4xl font-black text-green-600">{contractors.filter(c => c.hasProfile).length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-500 font-medium">Pending</p>
            <p className="text-4xl font-black text-orange-600">{contractors.filter(c => !c.hasProfile).length}</p>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-2">⚙️ Setup Required</h3>
          <p className="text-blue-700 mb-4">To enable social connections, add your Ayrshare API key to the environment:</p>
          <code className="bg-blue-100 px-3 py-2 rounded text-sm">AYRSHARE_API_KEY=your_api_key_here</code>
          <p className="text-blue-600 text-sm mt-4">Get your API key at <a href="https://app.ayrshare.com" target="_blank" className="underline">app.ayrshare.com</a></p>
        </div>

        {/* Contractors List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-black">Contractor Social Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Contractor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Platforms</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contractors.map(contractor => (
                  <tr key={contractor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{contractor.name}</div>
                      {contractor.company && <div className="text-sm text-gray-500">{contractor.company}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {contractor.hasProfile ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                          ✓ Connected
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">
                          Not Connected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {contractor.hasProfile ? (
                        <div className="flex gap-2">
                          <span className="text-xl" title="Facebook">📘</span>
                          <span className="text-xl" title="Instagram">📸</span>
                          <span className="text-xl" title="X/Twitter">🐦</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateLinkUrl(contractor.id)}
                          disabled={generating === contractor.id}
                          className={`px-4 py-2 rounded-lg font-bold text-sm ${
                            generating === contractor.id
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {generating === contractor.id ? '...' : '🔗 Get Link'}
                        </button>
                        {contractor.hasProfile && (
                          <button
                            onClick={() => mineDMs(contractor.id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700"
                          >
                            ⛏️ Mine DMs
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-black mb-4">📖 How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-bold mb-1">Generate Link</h4>
              <p className="text-sm text-gray-600">Click "Get Link" to generate a unique social connection URL for each contractor.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-bold mb-1">Contractor Connects</h4>
              <p className="text-sm text-gray-600">Send the link to the contractor. They click it and authorize their Facebook, Instagram, and X accounts.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-bold mb-1">Mine & Post</h4>
              <p className="text-sm text-gray-600">Once connected, you can mine leads from their DMs and post on their behalf.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
