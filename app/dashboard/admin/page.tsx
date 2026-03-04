'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, UserCheck, Calendar, Clock, ArrowRight } from 'lucide-react';

type Stats = {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingDoctors: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.ok ? res.json() : null)
      .then(setStats);
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Verified Doctors', value: stats?.totalDoctors, icon: UserCheck, color: 'from-emerald-500 to-teal-500' },
    { title: 'Appointments', value: stats?.totalAppointments, icon: Calendar, color: 'from-purple-500 to-indigo-500' },
    { title: 'Pending Approval', value: stats?.pendingDoctors, icon: Clock, color: 'from-orange-500 to-red-500', highlight: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">System Overview</h1>
        <p className="text-gray-400">Monitor health metrics and system performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, ease: "easeOut" }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 blur-2xl -mr-12 -mt-12 group-hover:opacity-10 transition-opacity`}></div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-10 border border-white/5`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{card.title}</p>
            </div>
            <p className={`text-4xl font-black ${card.highlight ? 'text-orange-500' : 'text-white'}`}>
              {card.value ?? '–'}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link
          href="/dashboard/admin/users"
          className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">User Directory</h2>
              <p className="text-gray-400 text-sm max-w-xs">Manage patient accounts, view history, and handle permissions.</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/admin/doctors"
          className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Doctor Verification</h2>
              <p className="text-gray-400 text-sm max-w-xs">Review credentials and approve medical professionals for the platform.</p>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-lg">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
