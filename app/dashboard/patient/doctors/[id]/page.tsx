'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format, isBefore, startOfToday } from 'date-fns';
import { Calendar } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import { toast } from 'sonner';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then(setDoctor);
  }, [id]);

  useEffect(() => {
    if (!selectedDate) { setSlots([]); return; }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    fetch(`/api/doctors/${id}/slots?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []));
  }, [id, selectedDate]);

  const handleBook = async () => {
    if (!selectedDate || !time) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setBooking(true);
    const promise = fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId: id, date: dateStr, time }),
    }).then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || 'Booking failed');
        router.push('/dashboard/patient/appointments');
        return res;
    });

    toast.promise(promise, {
        loading: 'Confirming your appointment...',
        success: 'Appointment booked successfully! ✨',
        error: (err) => err.message,
    });

    try {
        await promise;
    } finally {
        setBooking(false);
    }
  };

  if (!doctor) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Fetching Profile...</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl space-y-8"
    >
      <Link href="/dashboard/patient" className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-blue-500 transition-colors mb-6 flex items-center gap-3 w-fit group">
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Return to specialists
      </Link>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center md:items-center gap-10 relative z-10">
          <div className="w-32 h-32 shrink-0 rounded-[2rem] bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform">
            {doctor.user.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">{doctor.user.name}</h1>
            <p className="text-sm text-blue-500 font-black uppercase tracking-[0.2em] mb-6">{doctor.specialization}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-xs font-bold text-slate-300">
                <span className="text-blue-500">🏅</span> {doctor.experience}Y EXPERIENCE
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-xs font-bold text-slate-300">
                <span className="text-blue-500">⭐️</span> {doctor.rating} ({doctor.reviewCount} REVIEWS)
              </span>
              <span className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/10 text-xs font-bold text-blue-400">
                <span className="text-blue-500">Verified</span> 
              </span>
            </div>

            {doctor.bio && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-slate-400 leading-loose text-sm font-medium italic opacity-80">&quot;{doctor.bio}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 tracking-tighter uppercase">
            <span className="bg-blue-600/20 p-2.5 rounded-xl text-blue-400">📅</span> Smart Booking
          </h2>
          
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1 bg-white/5 p-6 rounded-3xl border border-white/5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Select Date</label>
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {setSelectedDate(d); setTime('');}}
                    disabled={{ before: startOfToday() }}
                    className="rdp-custom"
                />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-3 min-h-[200px] content-start">
                    {slots.length ? slots.map((s) => (
                        <button
                            key={s}
                            onClick={() => setTime(s)}
                            className={`px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all border ${
                                time === s 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                : 'bg-white/5 border-white/5 text-slate-400 hover:border-blue-500/50 hover:text-white'
                            }`}
                        >
                            {s}
                        </button>
                    )) : (
                        <div className="col-span-2 flex flex-col items-center justify-center py-10 opacity-30">
                            <Calendar className="w-10 h-10 mb-2" />
                            <p className="text-[10px] font-black">PICK A DATE FIRST</p>
                        </div>
                    )}
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={!selectedDate || !time || booking}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-30"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tighter">Availability Info</h3>
                <div className="space-y-3">
                    {doctor.availability.length ? doctor.availability.map((a, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 px-5 py-3 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                        <span className="font-bold text-slate-100 text-sm">{DAYS[a.dayOfWeek]}</span>
                        <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest">{a.startTime} — {a.endTime}</span>
                    </div>
                    )) : <p className="text-slate-500 italic text-sm text-center">No recurring schedule posted</p>}
                </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-full flex-1">
                <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tighter flex justify-between items-center">
                    <span>Reviews</span>
                    <span className="text-blue-400 text-sm">{doctor.reviewCount}</span>
                </h3>
                {doctor.reviews.length === 0 ? (
                    <p className="text-slate-600 text-sm italic py-4">No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {doctor.reviews.slice(0, 3).map((r, i) => (
                            <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-black text-white uppercase">{r.patient.name}</span>
                                    <span className="text-yellow-500 text-xs">{'★'.repeat(Math.round(r.rating))}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">&quot;{r.comment}&quot;</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <style jsx global>{`
        .rdp-custom {
            --rdp-cell-size: 40px;
            --rdp-accent-color: #2563eb;
            --rdp-background-color: #3b82f633;
            margin: 0;
            color: #94a3b8;
        }
        .rdp-custom .rdp-day_selected {
            background-color: var(--rdp-accent-color) !important;
            color: white !important;
            font-weight: 800;
            border-radius: 12px;
        }
        .rdp-custom .rdp-day:hover:not(.rdp-day_selected) {
            background-color: #ffffff0a;
            border-radius: 12px;
        }
        .rdp-custom .rdp-head_cell {
            font-size: 10px;
            font-weight: 900;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .rdp-custom .rdp-nav_button {
            color: white;
            background: #ffffff0a;
            border-radius: 8px;
        }
      `}</style>
    </motion.div>
  );
}
