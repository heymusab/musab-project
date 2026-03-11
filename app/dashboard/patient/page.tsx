'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { DoctorSkeleton } from '@/components/Skeleton';

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
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Find Specialists</h1>
          <p className="text-muted-foreground font-medium mt-1">Book your next consultation in seconds</p>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-8 flex flex-wrap gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none"></div>
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-6 py-4 bg-muted/40 border border-border text-foreground placeholder-muted-foreground rounded-2xl flex-1 min-w-[280px] focus:ring-2 focus:ring-primary/50 transition-all outline-none"
        />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="px-6 py-4 bg-muted/40 border border-border text-foreground placeholder-muted-foreground rounded-2xl w-48 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min fee"
            value={minFee}
            onChange={(e) => setMinFee(e.target.value)}
            className="px-6 py-4 bg-muted/40 border border-border text-foreground placeholder-muted-foreground rounded-2xl w-28 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
          />
          <input
            type="number"
            placeholder="Max fee"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
            className="px-6 py-4 bg-muted/40 border border-border text-foreground placeholder-muted-foreground rounded-2xl w-28 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DoctorSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
              className="glass-card rounded-3xl p-6 hover:bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 group shadow-lg hover:shadow-2xl relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors"></div>
              
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20 group-hover:rotate-6 group-hover:scale-105 transition-all">
                  {d.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg group-hover:text-primary transition-colors tracking-tight">{d.name}</h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">{d.specialization}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
                <span className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black text-slate-300 uppercase tracking-widest border border-white/5">
                  {d.experience}Y EXP
                </span>
                <span className="px-3 py-1.5 bg-primary/10 rounded-lg text-[9px] font-black text-primary uppercase tracking-widest border border-primary/20">
                  VERIFIED
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-6 leading-relaxed line-clamp-2 font-medium flex-1 relative z-10">
                {d.bio || 'Experienced healthcare professional dedicated to providing compassionate care and expert treatment.'}
              </p>

              <div className="flex items-center justify-between mb-5 pb-5 mt-auto border-b border-white/5 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Session Fee</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-secondary-foreground text-sm font-bold">$</span>
                    <span className="text-2xl font-black text-foreground tracking-tighter">{d.fee}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-yellow-500 mb-1 tracking-tighter">
                    <span className="text-sm">★</span>
                    <span className="font-black text-lg">{d.rating}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{d.reviewCount} Reviews</span>
                </div>
              </div>

              <Link
                href={`/dashboard/patient/doctors/${d.id}`}
                className="relative z-10 block w-full text-center py-3.5 bg-white/5 hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 text-foreground hover:text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl border border-white/5 hover:border-transparent transition-all duration-300 active:scale-[0.98]"
              >
                Book Consultation
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && doctors.length === 0 && (
        <div className="text-center py-24 glass-card rounded-[2rem] border-dashed">
          <div className="text-5xl mb-6 opacity-20">🔍</div>
          <p className="text-muted-foreground text-lg font-bold">No specialists found matching your search.</p>
          <button onClick={() => {setSearch(''); setSpecialization('');}} className="mt-4 text-primary font-bold hover:underline">Clear all filters</button>
        </div>
      )}
    </motion.div>
  );
}
