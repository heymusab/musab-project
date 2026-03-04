'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    if (!confirm('Cancel this appointment?')) return;
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
    if (res.ok) setList((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)));
  };

  const now = new Date().toISOString().slice(0, 10);
  const upcoming = list.filter((a) => a.date >= now && a.status !== 'CANCELLED');
  const past = list.filter((a) => a.date < now || a.status === 'CANCELLED');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">My Appointments</h1>
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
          <p className="text-cyan-400 font-medium">Loading appointments...</p>
        </div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white/90 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
              Upcoming
            </h2>
            {upcoming.length === 0 ? (
              <div className="bg-black/20 rounded-2xl border border-white/5 p-8 text-center">
                <p className="text-gray-400">No upcoming appointments.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {upcoming.map((a) => (
                  <motion.li
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group shadow-lg"
                  >
                    <div>
                      <p className="font-bold text-white text-lg mb-1 group-hover:text-cyan-400 transition-colors">
                        {a.doctor.user.name}
                      </p>
                      <p className="text-sm text-cyan-500/80 font-medium mb-3">{a.doctor.specialization}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          📅 {a.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          ⏰ {a.time}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                          {a.status}
                        </span>
                      </p>
                    </div>
                    {a.status === 'PENDING' && (
                      <button
                        onClick={() => cancel(a.id)}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-semibold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                      >
                        Cancel
                      </button>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/90 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-600"></span>
              Past
            </h2>
            {past.length === 0 ? (
              <div className="bg-black/20 rounded-2xl border border-white/5 p-8 text-center">
                <p className="text-gray-400">No past appointments.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {past.map((a) => (
                  <motion.li
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 opacity-80 hover:opacity-100"
                  >
                    <div>
                      <p className="font-bold text-white text-lg mb-1">{a.doctor.user.name}</p>
                      <p className="text-sm text-cyan-500/60 font-medium mb-3">{a.doctor.specialization}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-4">
                        <span>📅 {a.date}</span>
                        <span>⏰ {a.time}</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs border ${a.status === 'CANCELLED'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-green-500/10 text-green-400 border-green-500/20'
                          }`}>
                          {a.status}
                        </span>
                      </p>
                    </div>
                    {a.status === 'COMPLETED' && (
                      <Link
                        href={`/dashboard/patient/review?appointmentId=${a.id}&doctorId=${a.doctorId}`}
                        className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm font-semibold border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                      >
                        Leave review
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </motion.div>
  );
}
