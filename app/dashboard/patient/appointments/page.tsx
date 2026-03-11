'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/Skeleton';
import { toast } from 'sonner';

function AppointmentSkeleton() {
  return (
    <div className="flex items-center justify-between bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-lg">
      <div className="space-y-4 w-full">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-10 w-24 rounded-xl" />
    </div>
  );
}

type Appointment = {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  status: string;
  doctor: { id: string; user: { name: string }; specialization: string };
};

export default function PatientAppointmentsPage() {
  const [list, setList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => { setList(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cancel = async (id: string) => {
    const promise = fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    }).then(async (res) => {
        if (!res.ok) throw new Error("Failed to cancel");
        setList((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)));
        return res;
    });

    toast.promise(promise, {
        loading: 'Cancelling appointment...',
        success: 'Appointment cancelled successfully.',
        error: 'Failed to cancel appointment.',
    });
  };

  const now = new Date().toISOString().slice(0, 10);
  const upcoming = list.filter((a) => a.date >= now && a.status !== 'CANCELLED');
  const past = list.filter((a) => a.date < now || a.status === 'CANCELLED');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">My Appointments</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your health journey and consultations</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <AppointmentSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          <section>
            <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
              Upcoming Sessions
              <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
            </h2>
            {upcoming.length === 0 ? (
              <div className="bg-slate-900/20 rounded-[2.5rem] border border-dashed border-white/10 p-16 text-center">
                <p className="text-slate-500 font-bold">No upcoming appointments scheduled.</p>
                <Link href="/dashboard/patient" className="text-blue-500 hover:underline mt-2 inline-block font-black text-xs uppercase tracking-widest">Book Now</Link>
              </div>
            ) : (
              <ul className="space-y-6">
                {upcoming.map((a) => (
                  <motion.li
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between glass-card rounded-[3rem] p-10 hover:bg-white/[0.05] transition-all duration-500 group shadow-lg hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    <div>
                      <h3 className="font-black text-white text-2xl mb-1 group-hover:text-blue-400 transition-colors tracking-tighter uppercase leading-none">
                        {a.doctor.user.name}
                      </h3>
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-8 leading-none mt-2">{a.doctor.specialization}</p>
                      
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-slate-400">
                          <span className="text-lg">📅</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{a.date}</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-slate-400">
                          <span className="text-lg">⏰</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{a.time}</span>
                        </div>
                        <span className="px-5 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/10 active:scale-95 cursor-default shadow-lg shadow-blue-500/5">
                          {a.status}
                        </span>
                      </div>
                    </div>
                    {a.status === 'PENDING' && (
                        <div className="mt-10 sm:mt-0 flex flex-wrap gap-4">
                            <button
                                onClick={() => cancel(a.id)}
                                className="px-8 py-4 rounded-2xl bg-white/[0.03] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-500 active:scale-95"
                            >
                                Cancel Session
                            </button>
                            <Link
                                href={`/dashboard/patient/doctors/${a.doctorId}`}
                                className="px-8 py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95 glow-blue"
                            >
                                Re-schedule
                            </Link>
                        </div>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-sm font-black text-slate-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
              Past History
              <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-600/20 to-transparent"></div>
            </h2>
            {past.length === 0 ? (
              <div className="bg-slate-900/20 rounded-[2.5rem] border border-white/5 p-10 text-center">
                <p className="text-slate-600 text-sm font-medium">No history recorded yet.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {past.map((a) => (
                  <motion.li
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/20 border border-white/5 rounded-[2rem] p-6 hover:bg-slate-900/40 transition-all duration-300 opacity-60 hover:opacity-100"
                  >
                    <div>
                      <p className="font-bold text-slate-100 text-lg mb-1 tracking-tight">{a.doctor.user.name}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{a.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${a.status === 'CANCELLED'
                            ? 'bg-red-500/10 text-red-500/60 border-red-500/10'
                            : 'bg-slate-800 text-slate-400 border-white/5'
                          }`}>
                          {a.status}
                        </span>
                      </div>
                    </div>
                    {a.status === 'COMPLETED' && (
                      <Link
                        href={`/dashboard/patient/review?appointmentId=${a.id}&doctorId=${a.doctorId}`}
                        className="mt-4 sm:mt-0 px-5 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-600/20 text-center"
                      >
                        Write Review
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </motion.div>
  );
}
