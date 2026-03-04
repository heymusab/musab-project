'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMinus, CheckCircle, XCircle, Search, Filter, ShieldAlert } from 'lucide-react';

type Doctor = {
  id: string;
  approved: boolean;
  specialization: string;
  fee: number;
  user: { name: string; email: string };
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/admin/doctors');
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const setApproved = async (doctorId: string, approved: boolean) => {
    const res = await fetch('/api/admin/doctors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, approved }),
    });
    if (res.ok) {
      setDoctors((prev) => prev.map((d) => (d.id === doctorId ? { ...d, approved } : d)));
    }
  };

  const removeDoctor = async (doctorId: string) => {
    setDeletingId(doctorId);
    try {
      const res = await fetch(`/api/admin/doctors?id=${doctorId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'approved') return matchesSearch && d.approved;
    if (filterStatus === 'pending') return matchesSearch && !d.approved;
    return matchesSearch;
  });

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Doctor Management</h1>
          <p className="text-gray-400">Review, approve, or remove medical professionals.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all w-64 placeholder-gray-500"
            />
          </div>

          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {(['all', 'approved', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filterStatus === status ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-medium">Loading medical professionals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((d) => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20 text-xl">
                      {d.user.name.charAt(0)}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${d.approved ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-orange-500/10 border-orange-500/50 text-orange-400'
                      }`}>
                      {d.approved ? 'Approved' : 'Pending'}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{d.user.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-1">{d.user.email}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Specialization</p>
                      <p className="text-sm font-semibold text-cyan-500">{d.specialization}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Consultation Fee</p>
                      <p className="text-sm font-semibold text-white">${d.fee}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setApproved(d.id, !d.approved)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${d.approved
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                        : 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400'
                        }`}
                    >
                      {d.approved ? (
                        <><XCircle className="w-4 h-4" /> Revoke</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Approve</>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${d.user.name}? This action cannot be undone.`)) {
                          removeDoctor(d.id);
                        }
                      }}
                      disabled={deletingId === d.id}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      title="Remove Doctor"
                    >
                      {deletingId === d.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <UserMinus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredDoctors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl text-center">
          <ShieldAlert className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No doctors found</h3>
          <p className="text-gray-400 max-w-xs">Try adjusting your filters or search terms to find medical professionals.</p>
        </div>
      )}
    </div>
  );
}
