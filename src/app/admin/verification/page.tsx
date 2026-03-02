'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Document {
  id: number;
  contractor_id: number;
  contractor_name: string;
  contractor_phone: string;
  doc_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
  expires_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
  status: string;
  rejection_reason: string | null;
  notes: string | null;
}

export default function VerificationDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState<string>('pending');
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [expiringSoon, setExpiringSoon] = useState<Document[]>([]);

  useEffect(() => {
    fetchDocuments();
    fetchExpiringSoon();
  }, [filter]);

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/documents?${params}`);
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiringSoon = async () => {
    try {
      const res = await fetch('/api/documents?expiring_soon=30');
      const data = await res.json();
      setExpiringSoon(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (doc: Document) => {
    try {
      await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: doc.id, status: 'approved', verified_by: 'Admin' })
      });
      showToast('✅ Document approved');
      fetchDocuments();
      setSelectedDoc(null);
    } catch (err) {
      showToast('Failed to approve');
    }
  };

  const handleReject = async (doc: Document) => {
    if (!rejectionReason) {
      showToast('Please provide a rejection reason');
      return;
    }
    try {
      await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: doc.id, status: 'rejected', rejection_reason: rejectionReason, verified_by: 'Admin' })
      });
      showToast('❌ Document rejected');
      fetchDocuments();
      setSelectedDoc(null);
      setRejectionReason('');
    } catch (err) {
      showToast('Failed to reject');
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      insurance: '🛡️ Insurance',
      license: '📜 License',
      certification: '🎖️ Certification',
      w9: '📋 W-9',
      bond: '🔐 Bond'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    expiring: expiringSoon.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="text-purple-300 hover:text-white text-sm mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="text-3xl font-black">📋 Document Verification</h1>
          <p className="text-purple-200 mt-1">Review and approve contractor documents</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-yellow-400">{stats.pending}</p>
              <p className="text-sm text-purple-200">Pending Review</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-green-400">{stats.approved}</p>
              <p className="text-sm text-purple-200">Approved</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-red-400">{stats.rejected}</p>
              <p className="text-sm text-purple-200">Rejected</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-orange-400">{stats.expiring}</p>
              <p className="text-sm text-purple-200">Expiring Soon</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Expiring Soon Alert */}
        {expiringSoon.length > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-xl">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-bold text-orange-800">Documents Expiring Within 30 Days</h3>
                <p className="text-orange-700 text-sm mt-1">
                  {expiringSoon.map(d => d.contractor_name).slice(0, 3).join(', ')}
                  {expiringSoon.length > 3 && ` and ${expiringSoon.length - 3} more`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f === 'pending' ? '⏳ Pending' :
               f === 'approved' ? '✅ Approved' :
               f === 'rejected' ? '❌ Rejected' : '📁 All'}
            </button>
          ))}
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            <p className="text-xl mb-2">No documents to review</p>
            <p>Upload documents from contractor profiles to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                      {doc.doc_type === 'insurance' ? '🛡️' :
                       doc.doc_type === 'license' ? '📜' :
                       doc.doc_type === 'certification' ? '🎖️' : '📄'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{doc.contractor_name}</h3>
                      <p className="text-sm text-gray-500">
                        {getDocTypeLabel(doc.doc_type)} • {doc.file_name} • {formatFileSize(doc.file_size)}
                      </p>
                      {doc.expires_at && (
                        <p className="text-sm text-orange-600">Expires: {formatDate(doc.expires_at)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusBadge(doc.status)}`}>
                      {doc.status.toUpperCase()}
                    </span>
                    
                    {doc.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(doc)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}

                    <a
                      href={doc.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
                    >
                      👁️ View
                    </a>
                  </div>
                </div>

                {doc.status === 'rejected' && doc.rejection_reason && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                    <strong>Rejection reason:</strong> {doc.rejection_reason}
                  </div>
                )}

                {doc.status === 'approved' && doc.verified_at && (
                  <div className="mt-3 text-sm text-gray-500">
                    Verified by {doc.verified_by} on {formatDate(doc.verified_at)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h2 className="text-xl font-black">Reject Document</h2>
              <p className="text-gray-500">{selectedDoc.contractor_name} - {getDocTypeLabel(selectedDoc.doc_type)}</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Explain why this document is being rejected..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none"
                rows={4}
              />
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => { setSelectedDoc(null); setRejectionReason(''); }}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedDoc)}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Reject Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
