'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Slot = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/doctor/availability')
      .then((res) => res.json())
      .then((data) => setSlots(Array.isArray(data) ? data : []));
  }, []);

  const add = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctor/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      });
      if (res.ok) {
        const newSlot = await res.json();
        setSlots((prev) => [...prev, newSlot]);
      }
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/doctor/availability?id=${id}`, { method: 'DELETE' });
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl"
    >
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Manage Availability</h1>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">➕</span> Add New Time Slot
        </h2>
        <div className="flex flex-wrap gap-6 items-end relative z-10">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Select Day</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full px-5 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer hover:bg-black/60"
            >
              {DAYS.map((d, i) => (
                <option key={i} value={i} className="bg-gray-900 text-white">{d}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">From</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-5 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all [&::-webkit-calendar-picker-indicator]:invert cursor-pointer hover:bg-black/60"
            />
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">To</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-5 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all [&::-webkit-calendar-picker-indicator]:invert cursor-pointer hover:bg-black/60"
            />
          </div>
          <button
            onClick={add}
            disabled={loading}
            className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] focus:outline-none transition-all disabled:opacity-50 active:scale-95 border border-white/10"
          >
            {loading ? 'Adding...' : 'Add Slot'}
          </button>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="bg-blue-500/20 p-2 rounded-lg text-blue-400">📅</span> Your Active Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {slots.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all group"
              >
                <div>
                  <p className="text-white font-bold text-lg mb-1">{DAYS[s.dayOfWeek]}</p>
                  <p className="text-sm font-medium text-cyan-400">
                    {s.startTime} — {s.endTime}
                  </p>
                </div>
                <button
                  onClick={() => remove(s.id)}
                  className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {slots.length === 0 && (
          <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5">
            <p className="text-gray-500 font-medium">No availability slots configured yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
