'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, FileText, Scale, AlertCircle } from 'lucide-react';

export default function TermsPage() {
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
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-12"
                >
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-black mb-4">Terms of Service</h1>
                        <p className="text-gray-400">Rules of engagement for a healthier world.</p>
                        <div className="w-24 h-1 bg-blue-500 mx-auto mt-8 rounded-full" />
                    </div>

                    <div className="grid gap-8">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <FileText className="text-blue-400" />
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-gray-400 leading-relaxed italic">
                                By accessing or using MediConnect, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Scale className="text-cyan-400" />
                                2. User Responsibilities
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <AlertCircle className="text-red-400" />
                                3. Medical Disclaimer
                            </h2>
                            <p className="text-gray-400 leading-relaxed bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
                                MediConnect is a platform to facilitate communication between patients and doctors. We do not provide medical advice directly. In case of a medical emergency, please contact your local emergency services immediately.
                            </p>
                        </div>
                    </div>

                    <div className="text-center pt-12">
                        <p className="text-gray-500 text-sm italic">These terms are subject to change. Last updated: March 2026</p>
                    </div>
                </motion.div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                &copy; 2026 MediConnect. Use responsibly.
            </footer>
        </div>
    );
}
