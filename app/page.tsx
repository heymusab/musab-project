'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

// 3D Tilt Card Component
function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth out the spring setting
    const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20, mass: 0.1 });
    const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20, mass: 0.1 });

    // Transform coordinates into degrees (subtle tilt)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
            className={`relative perspective-1000 ${className}`}
        >
            {children}
        </motion.div>
    );
}

// Fade in up animation variant
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

export default function Page() {

    const features = [
        {
            title: "Smart Booking",
            description: "AI finds the perfect time for you and your doctor seamlessly.",
            icon: "📅"
        },
        {
            title: "Secure Records",
            description: "HIPAA-compliant platform ensuring your health data stays private.",
            icon: "🔒"
        },
        {
            title: "Live Consultations",
            description: "Instant messaging and high-quality video links to professionals.",
            icon: "💬"
        }
    ];

    const stats = [
        { number: "50K+", label: "Active Patients" },
        { number: "2K+", label: "Verified Doctors" },
        { number: "99.9%", label: "Uptime" },
        { number: "4.9★", label: "User Rating" }
    ];

    return (
        <div className="min-h-screen bg-mesh text-gray-100 overflow-hidden font-sans">
            {/* Navigation */}
            <nav className="backdrop-blur-xl bg-black/20 border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 relative">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)] group transition-all hover:rotate-12">
                                <Stethoscope className="text-white w-5 h-5" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                MediConnect
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                            <Link href="/symptoms" className="text-gray-300 hover:text-white transition-colors">Symptom Checker</Link>
                            <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link href="/register" className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-md transition-all duration-300">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 flex items-center min-h-[90vh]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col z-10"
                        >
                            <motion.div variants={fadeInUp}>
                                <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-cyan-400 text-sm font-medium mb-6">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2"></span>
                                    Now live with 50,000+ users
                                </div>
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-white drop-shadow-lg">
                                Healthcare
                                <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"> Made Simple</span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                                Connect with verified healthcare professionals, book appointments instantly,
                                and manage your health journey securely.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-14">
                                <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 text-center">
                                    Book Appointment Now
                                </Link>
                                <Link href="/symptoms" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center">
                                    Try Symptom Checker
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/10">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-left">
                                        <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                                        <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* 3D Hero Image/Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            className="relative z-10 w-full flex justify-center lg:justify-end"
                        >
                            <TiltCard className="w-full max-w-lg">
                                {/* Dashboard Card */}
                                <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8 preserve-3d">
                                    <div className="flex items-center justify-between mb-8 translate-z-20">
                                        <h3 className="text-xl font-semibold text-white">Patient Dashboard</h3>
                                        <div className="flex items-center bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                                            <span className="text-green-300 text-xs font-semibold tracking-wide">ONLINE</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 preserve-3d">
                                        {/* Card 1 */}
                                        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition duration-300 translate-z-30 shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
                                            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                SJ
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white text-lg">Dr. Sarah Johnson</div>
                                                <div className="text-sm text-cyan-300">Cardiology • Today 2:30 PM</div>
                                            </div>
                                        </div>

                                        {/* Card 2 */}
                                        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition duration-300 translate-z-40 shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                                            <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                MC
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white text-lg">Dr. Michael Chen</div>
                                                <div className="text-sm text-purple-300">Dermatology • Tomorrow 10:00 AM</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Abstract Floating Element */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/30 blur-3xl rounded-full translate-z-10 pointer-events-none"></div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Elevate Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Health Experience</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Transforming healthcare with our cutting-edge, secure, and intuitive platform designed for everyone.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <TiltCard>
                                    <div
                                        className="p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 h-full flex flex-col items-start translate-z-10 preserve-3d shadow-2xl"
                                    >
                                        <div className="text-5xl mb-6 translate-z-30 drop-shadow-lg">{feature.icon}</div>
                                        <h3 className="text-2xl font-bold text-white mb-3 translate-z-20">{feature.title}</h3>
                                        <p className="text-gray-400 leading-relaxed translate-z-10">{feature.description}</p>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden z-10 border-t border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="max-w-4xl mx-auto text-center px-6 lg:px-8 relative z-10"
                >
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 mb-8">
                        <div className="bg-black rounded-full px-6 py-2 text-white font-medium">Ready to start?</div>
                    </div>

                    <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                        Transform Your Care Today
                    </h2>
                    <p className="text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of patients taking control of their health with MediConnect.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="px-10 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Start Free Trial
                        </button>
                        <button className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold hover:bg-white/10 transition-all duration-300">
                            Schedule Demo
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-gray-400 py-16 border-t border-white/10 relative z-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center">
                                    <Stethoscope className="text-white w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <span className="text-2xl font-bold text-white">MediConnect</span>
                            </div>
                            <p className="text-gray-500 max-w-xs">
                                Revolutionizing healthcare through technology, transparency, and compassionate care.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Platform</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">For Patients</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">For Doctors</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">For Clinics</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Company</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Legal</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">HIPAA Compliance</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                        <p>&copy; 2026 MediConnect. All rights reserved.</p>
                        <div className="mt-4 md:mt-0 flex space-x-6">
                            <a href="#" className="hover:text-white transition-colors">X</a>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}