'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, Building2, Globe, Cpu, LayoutDashboard } from 'lucide-react';

export default function ClinicsPage() {
    const systems = [
        { icon: LayoutDashboard, title: "Centralized Management", desc: "Manage multiple doctors and pharmacy units from a single dashboard." },
        { icon: Globe, title: "Online Presence", desc: "Custom booking portal for your clinic linked to the MediConnect network." },
        { icon: Cpu, title: "Smart Billing", desc: "Automated invoicing and payment collection for your patients." },
        { icon: Building2, title: "Facility Admin", desc: "Monitor entire facility operations in real-time with granular controls." }
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
                    <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight">Scale Your Clinic <br /><span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent italic">With Intelligence.</span></h1>
                    <p className="text-xl text-gray-400 italic">Advanced SaaS solutions for modern healthcare facilities.</p>
                </motion.div>
            </header>

            <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {systems.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] hover:border-emerald-500/30 transition-all">
                            <s.icon className="w-10 h-10 text-emerald-400 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-24 bg-white/5">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Want a custom demo for your facility?</h2>
                    <Link href="/#contact" className="inline-block px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform">
                        Request Clinic Demo
                    </Link>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm italic">
                &copy; 2026 MediConnect. Empowering medical facilities.
            </footer>
        </div>
    );
}
