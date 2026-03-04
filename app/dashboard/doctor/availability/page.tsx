'use client';

import { useState, useEffect } from 'react';

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
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Manage Availability</h1>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-6">Add new slot</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Day</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all min-w-[150px]"
            >
              {DAYS.map((d, i) => (
                <option key={i} value={i} className="bg-gray-900 text-white">{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          <button
            onClick={add}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
          >
            Add Slot
          </button>
        </div>
      </div>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-6">Current slots</h2>
        <ul className="space-y-3">
          {slots.map((s) => (
            <li key={s.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-all group">
              <span className="text-gray-200 font-medium">{DAYS[s.dayOfWeek]} <span className="text-cyan-400 mx-2">{s.startTime}</span> – <span className="text-cyan-400 mx-2">{s.endTime}</span></span>
              <button
                onClick={() => remove(s.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        {slots.length === 0 && <p className="text-gray-400 bg-black/20 p-6 rounded-xl border border-white/5 text-center">No slots added yet.</p>}
      </div>
    </div>
  );
}
