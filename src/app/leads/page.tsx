'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: number;
  name: string;
  details: string | null;
  service_needed: string | null;
  service_category: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  lead_temperature: string;
  urgency: string;
  status: string;
  lead_score: number;
  source: string | null;
  assigned_to: number | null;
  created_at: string;
}

interface Contractor {
  id: number;
  name: string;
  company_name: string | null;
  phone: string | null;
  services: string | null;
  location: string | null;
  verification_level: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
    fetchContractors();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchContractors = async () => {
    try {
      const res = await fetch('/api/contractors');
      const data = await res.json();
      setContractors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch contractors:', err);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads(leads.filter(l => l.id !== id));
      showToast('Lead deleted');
    } catch (err) {
      showToast('Failed to delete');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      showToast(`Status: ${status}`);
    } catch (err) {
      showToast('Failed to update');
    }
  };

  const handleMatch = async (leadId: number, contractorId: number) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to: contractorId, status: 'matched' }),
      });
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: 'matched', assigned_to: contractorId } : l));
      setShowMatchModal(false);
      setSelectedLead(null);
      showToast('Lead matched!');
    } catch (err) {
      showToast('Failed to match');
    }
  };

  const handleAddLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          service_needed: formData.get('service_needed'),
          location: formData.get('location'),
          details: formData.get('details'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          lead_temperature: formData.get('lead_temperature'),
          urgency: formData.get('urgency'),
          status: 'new',
          source: 'manual',
        }),
      });
      const newLead = await res.json();
      setLeads([newLead, ...leads]);
      setShowAddModal(false);
      form.reset();
      showToast('Lead added!');
    } catch (err) {
      showToast('Failed to add');
    }
  };

  const filteredLeads = leads
    .filter(lead => {
      if (filter === 'all') return true;
      if (['hot', 'warm', 'cold'].includes(filter)) return lead.lead_temperature === filter;
      return lead.status === filter;
    })
    .filter(lead => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(s) ||
        lead.service_needed?.toLowerCase().includes(s) ||
        lead.location?.toLowerCase().includes(s) ||
        lead.details?.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0));

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.lead_temperature === 'hot').length,
    new: leads.filter(l => l.status === 'new').length,
    matched: leads.filter(l => l.status === 'matched').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {toast && (
        <div className="fixed top-20 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 Lead Pipeline</h1>
            <p className="text-gray-600">24 leads mined from Facebook • Click any row to view details</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="mt-4 md:mt-0 px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg">
            <span className="text-xl">+</span> Add Lead
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-400">
            <p className="text-sm text-gray-500 font-medium">Total Leads</p>
            <p className="text-4xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-500 font-medium">🔥 Hot</p>
            <p className="text-4xl font-black text-red-600">{stats.hot}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 font-medium">New</p>
            <p className="text-4xl font-black text-blue-600">{stats.new}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500 font-medium">Matched</p>
            <p className="text-4xl font-black text-purple-600">{stats.matched}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search leads by name, service, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-lg"
          />
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'hot', 'warm', 'new', 'matched', 'converted'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full font-bold transition whitespace-nowrap ${
                  filter === f 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                {f === 'hot' ? '🔥 ' : f === 'warm' ? '☀️ ' : ''}{f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Temp</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No leads found. {filter !== 'all' && <button onClick={() => setFilter('all')} className="text-emerald-600 font-bold hover:underline ml-2">Clear filters</button>}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-emerald-50 cursor-pointer transition" onClick={() => setSelectedLead(lead)}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-lg">{lead.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{lead.details || 'No details'}</div>
                        {lead.phone && <div className="text-sm text-blue-600 font-medium mt-1">📞 {lead.phone}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">{lead.service_needed || '—'}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{lead.location || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          lead.lead_temperature === 'hot' ? 'bg-red-500 text-white' :
                          lead.lead_temperature === 'warm' ? 'bg-orange-400 text-white' :
                          'bg-blue-300 text-white'
                        }`}>
                          {lead.lead_temperature === 'hot' ? '🔥' : lead.lead_temperature === 'warm' ? '☀️' : '❄️'} {lead.lead_temperature?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleStatusChange(lead.id, e.target.value)}
                          className="px-3 py-1 border-2 border-gray-200 rounded-lg text-sm font-medium bg-white hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="new">🆕 New</option>
                          <option value="contacted">📞 Contacted</option>
                          <option value="matched">🎯 Matched</option>
                          <option value="converted">✅ Converted</option>
                          <option value="lost">❌ Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedLead(lead); setShowMatchModal(true); }} className="px-3 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-sm shadow">
                            🎯 Match
                          </button>
                          <button onClick={() => handleDelete(lead.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 text-sm">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-black">➕ Add New Lead</h2>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                <input name="name" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-lg" placeholder="John Smith" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                  <input name="phone" type="tel" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none" placeholder="512-555-1234" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Service Needed</label>
                <input name="service_needed" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none" placeholder="HVAC, Plumbing, Roofing..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input name="location" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none" placeholder="Austin, TX" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Details</label>
                <textarea name="details" rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none resize-none" placeholder="Describe the project..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Temperature</label>
                  <select name="lead_temperature" defaultValue="warm" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl">
                    <option value="hot">🔥 Hot</option>
                    <option value="warm">☀️ Warm</option>
                    <option value="cold">❄️ Cold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Urgency</label>
                  <select name="urgency" defaultValue="normal" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl">
                    <option value="normal">Normal</option>
                    <option value="urgent">⚡ Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg">
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Match Modal */}
      {showMatchModal && selectedLead && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => { setShowMatchModal(false); setSelectedLead(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 bg-purple-50">
              <h2 className="text-xl font-black">🎯 Match: {selectedLead.name}</h2>
              <p className="text-purple-700 font-medium">{selectedLead.service_needed} • {selectedLead.location}</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <p className="text-sm text-gray-600 mb-4 font-medium">Select a contractor to assign this lead:</p>
              <div className="space-y-3">
                {contractors.filter(c => c.phone).slice(0, 20).map(c => (
                  <div key={c.id} onClick={() => handleMatch(selectedLead.id, c.id)} className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{c.name}</h4>
                        <p className="text-sm text-gray-600">{c.services}</p>
                        <p className="text-sm text-gray-500">{c.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded font-bold ${c.verification_level === 'verified' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {c.verification_level?.toUpperCase()}
                        </span>
                        {c.phone && <p className="text-blue-600 font-bold mt-2">📞 {c.phone}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <button onClick={() => { setShowMatchModal(false); setSelectedLead(null); }} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {selectedLead && !showMatchModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black">{selectedLead.name}</h2>
                <div className="flex gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    selectedLead.lead_temperature === 'hot' ? 'bg-red-500 text-white' :
                    selectedLead.lead_temperature === 'warm' ? 'bg-orange-400 text-white' :
                    'bg-blue-300 text-white'
                  }`}>
                    {selectedLead.lead_temperature?.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                    {selectedLead.status?.toUpperCase()}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600 text-3xl font-light">×</button>
            </div>
            <div className="p-6 space-y-4">
              {selectedLead.phone && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <p className="font-black text-xl text-blue-600">{selectedLead.phone}</p>
                  </div>
                  <button onClick={() => copyToClipboard(selectedLead.phone!)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow">
                    Copy
                  </button>
                </div>
              )}
              {selectedLead.email && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="font-bold text-gray-900">{selectedLead.email}</p>
                  </div>
                  <button onClick={() => copyToClipboard(selectedLead.email!)} className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700">
                    Copy
                  </button>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 font-medium">Service Needed</p>
                <p className="font-bold text-lg">{selectedLead.service_needed || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Location</p>
                <p className="font-bold text-lg">{selectedLead.location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Details</p>
                <p className="font-medium text-gray-700">{selectedLead.details || 'No details'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Source</p>
                <p className="font-medium">{selectedLead.source || 'Unknown'}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setSelectedLead(null)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50">
                Close
              </button>
              <button onClick={() => setShowMatchModal(true)} className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg">
                🎯 Match to Contractor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
