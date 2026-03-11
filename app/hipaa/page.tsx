'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export default function HipaaPage() {
    const standards = [
        { title: "Physical Safeguards", desc: "Our data centers feature 24/7 security, biometric access, and advanced disaster recovery systems." },
        { title: "Technical Safeguards", desc: "End-to-end encryption for all PHI (Protected Health Information) and unique user identification." },
        { title: "Administrative Safeguards", desc: "Strict internal policies for staff access and continuous security awareness training." }
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

            <section className="py-24 max-w-5xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                >
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-black uppercase tracking-[0.2em] mb-8">
                            <ShieldCheck className="w-5 h-5" />
                            Fully Compliant
                        </div>
                        <h1 className="text-6xl font-black text-white mb-6">HIPAA Compliance</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto italic">
                            Building trust through uncompromising security and regulatory adherence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {standards.map((s, i) => (
                            <div key={i} className="p-10 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[3rem] group hover:border-emerald-500/30 transition-all">
                                <Activity className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                                <p className="text-gray-400 leading-relaxed italic text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                            <CheckCircle2 className="text-emerald-400" />
                            Our Security Commitment
                        </h2>
                        <div className="grid md:grid-cols-2 gap-12 text-gray-400 text-lg leading-relaxed">
                            <p>
                                MediConnect takes the privacy and security of health information with the utmost seriousness. Our platform is architected from the ground up to exceed the requirements of the Health Insurance Portability and Accountability Act (HIPAA).
                            </p>
                            <p>
                                We perform regular security audits, penetration testing, and risk assessments to ensure that our technical, physical, and administrative safeguards are always ahead of evolving threats.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                &copy; 2026 MediConnect. Certified & Secure.
            </footer>
        </div>
    );
}
