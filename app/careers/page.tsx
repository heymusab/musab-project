'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, Rocket, Globe, Coffee, Monitor, Code, Palette, Search } from 'lucide-react';

export default function CareersPage() {
    const jobs = [
        { title: "Senior Frontend Engineer", dept: "Engineering", type: "Remote", color: "from-cyan-400 to-blue-500" },
        { title: "Product Designer (UI/UX)", dept: "Design", type: "Full-time", color: "from-purple-400 to-pink-500" },
        { title: "AI Specialist", dept: "Data Science", type: "Remote", color: "from-emerald-400 to-teal-500" },
        { title: "Medical Operations Lead", dept: "Operations", type: "Hybrid", color: "from-orange-400 to-red-500" }
    ];

    const perks = [
        { title: "Work from Anywhere", icon: Globe, desc: "Our team is distributed across 15+ countries." },
        { title: "Top-tier Equipment", icon: Monitor, desc: "We provide the latest tech setup for your home office." },
        { title: "Learning Budget", icon: Rocket, desc: "$2,000 yearly for courses and conferences." },
        { title: "Free Health Care", icon: Heart, desc: "Premium health coverage for you and your family." }
    ];

    return (
        <div className="min-h-screen  text-gray-100 font-sans">
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
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-cyan-400 text-sm font-bold uppercase tracking-widest mb-6 inline-block">
                            Now Hiring
                        </span>
                        <h1 className="text-6xl lg:text-8xl font-black mb-8 tracking-tighter text-white">
                            Build the Future <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">of Health.</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Join a team of mission-driven designers, engineers, and clinical experts working to make high-quality healthcare accessible to everyone.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Perks Section */}
            <section className="py-24 bg-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tight">Why MediConnect?</h2>
                        <p className="text-gray-400">We take care of you, so you can take care of our patients.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {perks.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-all"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <p.icon className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-24 relative z-10">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-black text-white">Open Positions</h2>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 border border-white/5">
                            <Search className="w-4 h-4" />
                            <span>4 ACTIVE ROLES</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {jobs.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:px-10 lg:py-8 flex flex-col md:flex-row md:items-center justify-between hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${job.color} opacity-50`} />

                                <div className="space-y-1 mb-4 md:mb-0">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                        <span className="flex items-center gap-1.5"><Code className="w-4 h-4" /> {job.dept}</span>
                                        <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {job.type}</span>
                                    </div>
                                </div>

                                <button className="px-6 py-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl font-bold border border-white/10 transition-all text-sm uppercase tracking-widest active:scale-95">
                                    Apply Now
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-12 rounded-[3rem] border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-4">Don&apos;t see a perfect fit?</h3>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto italic">
                            We&apos;re always looking for talented people who share our mission. Send us your resume and we&apos;ll keep you in mind for future roles.
                        </p>
                        <a href="mailto:careers@mediconnect.com" className="text-cyan-400 font-bold hover:underline">careers@mediconnect.com</a>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                &copy; 2026 MediConnect. We are an equal opportunity employer.
            </footer>
        </div>
    );
}

function Heart(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}
