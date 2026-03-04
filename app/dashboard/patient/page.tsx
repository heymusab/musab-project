'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Doctor = {
  id: string;
  name: string;
  image?: string | null;
  specialization: string;
  experience: number;
  fee: number;
  bio: string | null;
  rating: number;
  reviewCount: number;
};

export default function PatientDashboardPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const [search, setSearch] = useState('');
  const [minFee, setMinFee] = useState('');
  const [maxFee, setMaxFee] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (specialization) params.set('specialization', specialization);
    if (search) params.set('search', search);
    if (minFee) params.set('minFee', minFee);
    if (maxFee) params.set('maxFee', maxFee);
    fetch('/api/doctors?' + params.toString())
      .then((res) => res.json())
      .then((data) => { setDoctors(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [specialization, search, minFee, maxFee]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Find Specialists</h1>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl flex-1 min-w-[200px] focus:ring-2 focus:ring-cyan-500 transition-all"
        />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl w-48 focus:ring-2 focus:ring-cyan-500 transition-all"
        />
        <input
          type="number"
          placeholder="Min fee"
          value={minFee}
          onChange={(e) => setMinFee(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl w-32 focus:ring-2 focus:ring-cyan-500 transition-all"
        />
        <input
          type="number"
          placeholder="Max fee"
          value={maxFee}
          onChange={(e) => setMaxFee(e.target.value)}
          className="px-5 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl w-32 focus:ring-2 focus:ring-cyan-500 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
          <p className="text-cyan-400 font-medium">Loading specialists...</p>
        </div>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {doctors.map((d) => (
            <motion.div
              key={d.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 hover:border-cyan-500/30 transition-all duration-300 group shadow-lg"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {d.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">{d.name}</h3>
                  <p className="text-sm text-cyan-500/80 font-medium">{d.specialization}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 font-medium mb-2">{d.experience} years experience</p>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2">{d.bio || 'No bio available'}</p>

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐ {d.rating}</span>
                  <span className="text-gray-500 text-sm">({d.reviewCount})</span>
                </div>
                <span className="font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">${d.fee}</span>
              </div>

              <Link
                href={`/dashboard/patient/doctors/${d.id}`}
                className="block w-full text-center py-3 bg-white/5 text-cyan-400 font-semibold rounded-xl border border-cyan-500/30 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                View Profile & Book
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && doctors.length === 0 && (
        <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/5">
          <p className="text-gray-400 text-lg">No specialists found matching your search criteria.</p>
        </div>
      )}
    </motion.div>
  );
}
