'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

type DoctorDetail = {
  id: string;
  bio: string | null;
  specialization: string;
  experience: number;
  fee: number;
  user: { name: string; email: string };
  reviews: { rating: number; comment: string | null; patient: { name: string } }[];
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
  rating: number;
  reviewCount: number;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then(setDoctor);
  }, [id]);

  useEffect(() => {
    if (!date) { setSlots([]); return; }
    fetch(`/api/doctors/${id}/slots?date=${date}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []));
  }, [id, date]);

  const handleBook = async () => {
    if (!date || !time) return;
    setBooking(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: id, date, time }),
      });
      if (res.ok) router.push('/dashboard/patient/appointments');
      else alert((await res.json()).error || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (!doctor) return <p className="text-gray-500">Loading...</p>;

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl"
    >
      <Link href="/dashboard/patient" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors mb-6 flex items-center gap-2 w-fit">
        <span className="text-lg">←</span> Back to specialist directory
      </Link>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
          <div className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            {doctor.user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">{doctor.user.name}</h1>
            <p className="text-cyan-400 font-semibold mb-3">{doctor.specialization}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300">
              <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-cyan-400">🏅</span> {doctor.experience} yrs exp
              </span>
              <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-green-400">💲</span> ${doctor.fee} consultation
              </span>
              <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-yellow-400">⭐</span> {doctor.rating} ({doctor.reviewCount} reviews)
              </span>
            </div>

            {doctor.bio && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-2">About Doctor</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{doctor.bio}</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="text-cyan-400">📅</span> Weekly Schedule
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                {doctor.availability.length ? doctor.availability.map((a, i) => (
                  <span key={i} className="bg-white/5 px-3 py-1 rounded-md border border-white/5">
                    <span className="font-semibold text-white">{DAYS[a.dayOfWeek]}</span> {a.startTime}-{a.endTime}
                  </span>
                )) : <span className="text-gray-500 italic">No schedule posted</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900/20 to-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400 mr-2">🗓️</span> Book an Appointment
        </h2>

        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Date</label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => { setDate(e.target.value); setTime(''); }}
              className="w-full px-5 py-3 bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 rounded-xl outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!slots.length}
              className="w-full px-5 py-3 bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 rounded-xl outline-none disabled:opacity-50 appearance-none"
            >
              <option value="" className="bg-gray-900">{slots.length ? 'Available times...' : 'Pick a valid date first'}</option>
              {slots.map((s) => (
                <option key={s} value={s} className="bg-gray-900">{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleBook}
              disabled={!date || !time || booking}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 transition-all hover:-translate-y-0.5"
            >
              {booking ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-yellow-400">💭</span> Patient Reviews
        </h2>

        {doctor.reviews.length === 0 ? (
          <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-gray-400">No reviews yet for this specialist.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {doctor.reviews.map((r, i) => (
              <li key={i} className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{r.patient.name}</span>
                  <span className="text-yellow-400 text-sm tracking-widest">{'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}</span>
                </div>
                {r.comment && <p className="text-gray-400 text-sm leading-relaxed">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
