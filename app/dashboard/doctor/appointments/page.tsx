'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  patient: { name: string; email: string };
};

export default function DoctorAppointmentsPage() {
  const [list, setList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => { setList(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Appointment Management</h1>
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
          <p className="text-cyan-400 font-medium">Loading appointments...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.length === 0 ? (
            <div className="bg-black/20 rounded-2xl border border-white/5 p-8 text-center">
              <p className="text-gray-400">No appointments found.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {list.map((a) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group shadow-lg"
                >
                  <div>
                    <p className="font-bold text-white text-lg mb-1 group-hover:text-cyan-400 transition-colors">
                      {a.patient.name}
                    </p>
                    <p className="text-sm text-gray-400 mb-3">{a.patient.email}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-4">
                      <span className="flex items-center gap-1.5">📅 {a.date}</span>
                      <span className="flex items-center gap-1.5">⏰ {a.time}</span>
                      <span className={`px-2 py-0.5 rounded-md text-xs border ${a.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          a.status === 'CONFIRMED' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                            a.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {a.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {a.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateStatus(a.id, 'CONFIRMED')}
                          className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-xl text-sm font-semibold border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all duration-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(a.id, 'CANCELLED')}
                          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-sm font-semibold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {a.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateStatus(a.id, 'COMPLETED')}
                        className="px-4 py-2 bg-green-500/10 text-green-400 rounded-xl text-sm font-semibold border border-green-500/20 hover:bg-green-500 hover:text-white transition-all duration-300"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      )}
    </motion.div>
  );
}
