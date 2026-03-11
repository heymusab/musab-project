'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, Users, Calendar, BarChart3, ShieldCheck } from 'lucide-react';

export default function DoctorsPlatformPage() {
    const perks = [
        { icon: Users, title: "Grow Practice", desc: "Connect with thousands of patients looking for your expertise." },
        { icon: Calendar, title: "Manage Schedule", desc: "Intuitive calendar to manage physical and digital appointments." },
        { icon: BarChart3, title: "Insights & Analytics", desc: "Track your practice growth and patient satisfaction with pro tools." },
        { icon: ShieldCheck, title: "Verified Identity", desc: "Build trust with a verified doctor profile and gold badge." }
    ];

    return (
        <div className="min-h-screen  text-gray-100 font-sans">
            <nav className="backdrop-blur-xl bg-black/20 border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center">
                                <Stethoscope className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-white">MediConnect</span>
                        </Link>
                        <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            <header className="py-24 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-6">
                    <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight">Practice Medicine, <br /><span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent italic">Without Hassle.</span></h1>
                    <p className="text-xl text-gray-400 italic">Digitize your clinic and focus on what matters most: saving lives.</p>
                </motion.div>
            </header>

            <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {perks.map((p, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] hover:border-purple-500/30 transition-all">
                            <p.icon className="w-10 h-10 text-purple-400 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-24 bg-white/5">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Ready to join our medical network?</h2>
                    <Link href="/register" className="inline-block px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform">
                        Join as a Doctor
                    </Link>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm italic">
                &copy; 2026 MediConnect. The future of clinical medicine.
            </footer>
        </div>
    );
}
