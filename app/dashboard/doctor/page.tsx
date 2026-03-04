'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    earnings: 0,
    patients: 0,
  });

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((list: { date: string; status: string; doctor: { fee: number }; patientId: string }[]) => {
        const now = new Date().toISOString().slice(0, 10);
        const upcoming = list.filter((a) => a.date >= now && !['CANCELLED', 'COMPLETED'].includes(a.status));
        const completed = list.filter((a) => a.status === 'COMPLETED');
        const earnings = completed.reduce((s, a) => s + (a.doctor?.fee || 0), 0);
        const patientIds = new Set(list.map((a) => a.patientId));
        setStats({
          total: list.length,
          upcoming: upcoming.length,
          completed: completed.length,
          earnings,
          patients: patientIds.size,
        });
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Overview</h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg shadow-cyan-500/5">
          <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-1">Total Appointments</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white">{stats.total}</span>
            <span className="bg-white/5 text-cyan-400 text-xs px-2 py-1 rounded-md border border-white/10">All time</span>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl"></div>
          <p className="text-sm text-cyan-400 font-medium tracking-wide uppercase mb-1">Upcoming</p>
          <div className="flex items-center gap-3 relative z-10">
            <span className="text-3xl font-bold text-white">{stats.upcoming}</span>
            <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-md border border-cyan-500/30">Action needed</span>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg shadow-green-500/5">
          <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-1">Total Earnings</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-green-400">${stats.earnings}</span>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg shadow-purple-500/5">
          <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-1">Unique Patients</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white">{stats.patients}</span>
            <span className="text-purple-400 text-xl">👥</span>
          </div>
        </motion.div>
      </motion.div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/dashboard/doctor/appointments"
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <span>🗓️</span> Manage Appointments
        </Link>
        <Link
          href="/dashboard/doctor/profile"
          className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
        >
          <span>⚙️</span> Edit Profile
        </Link>
      </div>
    </motion.div>
  );
}
