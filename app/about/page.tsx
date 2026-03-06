'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, Heart, Shield, Zap, Target, Users } from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            title: "Patient First",
            desc: "Every design and feature is built around the comfort and safety of our patients.",
            icon: Heart,
            color: "text-red-400"
        },
        {
            title: "Data Security",
            desc: "We use military-grade encryption to ensure your medical records stay private.",
            icon: Shield,
            color: "text-cyan-400"
        },
        {
            title: "Instant Access",
            desc: "Healthcare shouldn't wait. We bridge the gap between patients and doctors instantly.",
            icon: Zap,
            color: "text-yellow-400"
        }
    ];

    return (
        <div className="min-h-screen bg-mesh text-gray-100 font-sans">
            {/* Navigation (Simplified) */}
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

            {/* Hero Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl lg:text-7xl font-black mb-8 tracking-tight">
                            Providing Healthcare <br />
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent italic">Legacy for Everyone.</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            MediConnect was born from a simple idea: that everyone deserves fast, reliable, and secure access to healthcare professionals, regardless of where they are.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-24 bg-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4 text-cyan-400">
                                <Target className="w-8 h-8" />
                                <span className="text-sm font-black uppercase tracking-widest">Our Mission</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white leading-tight">
                                Modernizing the Bridge Between Doctors and Patients.
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                We&apos;ve spent thousands of hours talking to doctors and patients to understand their pain points. The result is a platform that isn&apos;t just a booking site, but a complete health ecosystem. From AI-driven symptom checking to secure video consultations, we&apos;re building the future of medicine.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173bdd9982a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50" />
                                <Users className="w-32 h-32 text-white/20" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
                        <div className="w-20 h-1.5 bg-cyan-500 mx-auto rounded-full" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all"
                            >
                                <v.icon className={`w-12 h-12 mb-6 ${v.color}`} />
                                <h3 className="text-2xl font-bold text-white mb-4">{v.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="py-24 border-t border-white/5 relative z-10 bg-black/40">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Ready to join our journey?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register" className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-bold hover:bg-cyan-600 transition-all">
                            Get Started Now
                        </Link>
                        <Link href="/careers" className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all">
                            Explore Careers
                        </Link>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                &copy; 2026 MediConnect. Empowering health through technology.
            </footer>
        </div>
    );
}
