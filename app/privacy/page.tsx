'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, Shield, Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
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

            <section className="py-24 max-w-4xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-black mb-4">Privacy Policy</h1>
                        <p className="text-gray-400">Your health data is your own. We&apos;re just the keepers.</p>
                        <div className="w-24 h-1 bg-cyan-500 mx-auto mt-8 rounded-full" />
                    </div>

                    <div className="grid gap-12">
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl">
                                    <Shield className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h2 className="text-2xl font-bold">Data Protection</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                We use industry-standard encryption protocols to protect your personal and medical information. All data transmitted between your device and our servers is encrypted using SSL/TLS.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-2xl">
                                    <Lock className="w-6 h-6 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold">Your Rights</h2>
                            </div>
                            <ul className="space-y-4 text-gray-400 text-lg list-disc ml-6">
                                <li>The right to access your personal data at any time.</li>
                                <li>The right to request the correction of inaccurate information.</li>
                                <li>The right to request the deletion of your account and related data.</li>
                                <li>The right to withdraw consent for data processing.</li>
                            </ul>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                    <Eye className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold">Information We Collect</h2>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                We collect information necessary to provide our services, including contact details, medical history (with your consent), and appointment logs. We never sell your data to third parties.
                            </p>
                        </div>
                    </div>

                    <div className="text-center pt-12">
                        <p className="text-gray-500 text-sm">Last updated: March 2026</p>
                    </div>
                </motion.div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                &copy; 2026 MediConnect. All rights reserved.
            </footer>
        </div>
    );
}
