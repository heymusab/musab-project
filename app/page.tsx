'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, Variants, AnimatePresence } from 'framer-motion';
import { Stethoscope, Menu, X } from 'lucide-react';

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

// Isolated Contact Form Component to prevent re-rendering the whole page on keystrokes
function ContactForm({ t, lang }: { t: any, lang: string }) {
    const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className={`text-sm font-medium text-gray-300 ${lang === 'ur' ? 'mr-1' : 'ml-1'}`}>{t.contact.name}</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className={`text-sm font-medium text-gray-300 ${lang === 'ur' ? 'mr-1' : 'ml-1'}`}>{t.contact.email}</label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className={`text-sm font-medium text-gray-300 ${lang === 'ur' ? 'mr-1' : 'ml-1'}`}>{t.contact.msg}</label>
                <textarea
                    rows={4}
                    placeholder="I'd like to schedule a demo for my clinic..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none ${lang === 'ur' ? 'text-right' : 'text-left'}`}
                    required
                />
            </div>

            <button
                disabled={isSubmitting}
                className={`w-full py-5 rounded-2xl font-bold shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/20'
                    }`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t.contact.sending}</span>
                    </>
                ) : (
                    <span>{t.contact.btn}</span>
                )}
            </button>

            {submitStatus === 'success' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-green-400 text-center font-medium">
                    {t.contact.success}
                </motion.p>
            )}
            {submitStatus === 'error' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-center font-medium">
                    {t.contact.error}
                </motion.p>
            )}
        </form>
    );
}

export default function Page() {

    const [lang, setLang] = React.useState<'en' | 'ur'>('en');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const translations = {
        en: {
            nav: { features: "Features", contact: "Contact", ai: "AI Health Assistant", signIn: "Sign In", getStarted: "Get Started" },
            hero: {
                badge: "Users Growing Weekly",
                title1: "Healthcare",
                title2: "Made Simple",
                desc: "Connect with verified healthcare professionals, book appointments instantly, and manage your health journey securely.",
                btn1: "Book Appointment Now",
                btn2: "Talk to AI Assistant"
            },
            stats: { p: "Active Patients", d: "Verified Doctors", u: "Uptime", r: "User Rating" },
            features: {
                title: "Elevate Your",
                titleColor: "Health Experience",
                desc: "Transforming healthcare with our cutting-edge, secure, and intuitive platform designed for everyone.",
                f1: { t: "Smart Booking", d: "AI finds the perfect time for you and your doctor seamlessly." },
                f2: { t: "Secure Records", d: "HIPAA-compliant platform ensuring your health data stays private." },
                f3: { t: "Live Consultations", d: "Instant messaging and high-quality video links to professionals." }
            },
            cta: {
                ready: "Ready to start?",
                title: "Transform Your Care Today",
                desc: "Join thousands of patients taking control of their health with MediConnect.",
                btn1: "Start Free Trial",
                btn2: "Schedule Demo"
            },
            contact: {
                title: "Contact Our Team",
                desc: "Have questions about MediConnect? We're here to help you get started.",
                name: "Full Name",
                email: "Email Address",
                msg: "Message",
                btn: "Send Message",
                sending: "Sending...",
                success: "✨ Message sent successfully! We'll be in touch soon.",
                error: "❌ Failed to send message. Please try again."
            }
        },
        ur: {
            nav: { features: "خصوصیات", contact: "رابطہ", ai: "اے آئی اسسٹنٹ", signIn: "سائن ان", getStarted: "شروع کریں" },
            hero: {
                badge: "صارفین ہر ہفتے بڑھ رہے ہیں",
                title1: "صحت کا حصول",
                title2: "اب ہوا آسان",
                desc: "تصدیق شدہ طبی ماہرین سے جڑیں، فوری اپائنٹمنٹ بک کریں، اور اپنی صحت کا سفر محفوظ طریقے سے مینیج کریں۔",
                btn1: "ابھی اپائنٹمنٹ بک کریں",
                btn2: "اے آئی اسسٹنٹ سے بات کریں"
            },
            stats: { p: "فعال مریض", d: "تصدیق شدہ ڈاکٹرز", u: "اپ ٹائم", r: "صارف کی درجہ بندی" },
            features: {
                title: "اپنی صحت کے",
                titleColor: "تجربے کو بہتر بنائیں",
                desc: "ہر ایک کے لیے ڈیزائن کیے گئے ہمارے جدید، محفوظ اور آسان پلیٹ فارم کے ساتھ صحت کی دیکھ بھال کو تبدیل کرنا۔",
                f1: { t: "سمارٹ بکنگ", d: "اے آئی آپ کے اور آپ کے ڈاکٹر کے لیے بہترین وقت آسانی سے تلاش کرتا ہے۔" },
                f2: { t: "محفوظ ریکارڈز", d: "آپ کے صحت کا ڈیٹا نجی رکھنے والا محفوظ پلیٹ فارم۔" },
                f3: { t: "براہ راست مشاورت", d: "ماہرین کے ساتھ فوری پیغام رسانی اور اعلیٰ معیار کے ویڈیو لنکس۔" }
            },
            cta: {
                ready: "شروع کرنے کے لیے تیار ہیں؟",
                title: "آج ہی اپنی دیکھ بھال کو بدلیں",
                desc: "MediConnect کے ساتھ اپنی صحت کو کنٹرول کرنے والے ہزاروں مریضوں میں شامل ہوں۔",
                btn1: "مفت ٹرائل شروع کریں",
                btn2: "ڈیمو شیڈول کریں"
            },
            contact: {
                title: "ہماری ٹیم سے رابطہ کریں",
                desc: "MediConnect کے بارے میں سوالات ہیں؟ ہم آپ کی مدد کے لیے حاضر ہیں۔",
                name: "پورا نام",
                email: "ای میل ایڈریس",
                msg: "پیغام",
                btn: "پیغام بھیجیں",
                sending: "بھیجا جا رہا ہے...",
                success: "✨ پیغام کامیابی سے بھیج دیا گیا! ہم جلد آپ سے رابطہ کریں گے۔",
                error: "❌ پیغام بھیجنے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں۔"
            }
        }
    };

    const t = translations[lang];

    const features = [
        {
            title: t.features.f1.t,
            description: t.features.f1.d,
            icon: "📅"
        },
        {
            title: t.features.f2.t,
            description: t.features.f2.d,
            icon: "🔒"
        },
        {
            title: t.features.f3.t,
            description: t.features.f3.d,
            icon: "💬"
        }
    ];

    const stats = [
        { number: "50K+", label: t.stats.p },
        { number: "2K+", label: t.stats.d },
        { number: "99.9%", label: t.stats.u },
        { number: "4.9★", label: t.stats.r }
    ];

    return (
        <div className={`min-h-screen bg-mesh text-gray-100 overflow-hidden font-sans ${lang === 'ur' ? 'text-right' : 'text-left'}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
            {/* Navigation */}
            <nav className="backdrop-blur-md lg:backdrop-blur-xl bg-black/20 border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)] group transition-all hover:rotate-12">
                                <Stethoscope className="text-white w-5 h-5" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                MediConnect
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-10">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors">{t.nav.features}</a>
                            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">{t.nav.contact}</a>
                            <Link href="/symptoms" className="text-gray-300 hover:text-white transition-colors">{t.nav.ai}</Link>

                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                <button
                                    onClick={() => setLang('en')}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${lang === 'en' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => setLang('ur')}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${lang === 'ur' ? 'bg-cyan-500 text-white shadow-lg font-urdu' : 'text-gray-500 hover:text-white'}`}
                                >
                                    اردو
                                </button>
                            </div>

                            <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                {t.nav.signIn}
                            </Link>
                            <Link href="/register" className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-md transition-all duration-300 whitespace-nowrap">
                                {t.nav.getStarted}
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-4">
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                <button
                                    onClick={() => setLang('en')}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${lang === 'en' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => setLang('ur')}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${lang === 'ur' ? 'bg-cyan-500 text-white shadow-lg font-urdu' : 'text-gray-500 hover:text-white'}`}
                                >
                                    اردو
                                </button>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-300 hover:text-white focus:outline-none p-2 border border-white/10 rounded-lg bg-white/5"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10 overflow-hidden absolute w-full left-0 top-full"
                        >
                            <div className="flex flex-col px-6 py-6 space-y-4">
                                <a
                                    href="#features"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-300 hover:text-white py-3 transition-colors border-b border-white/5 text-lg font-medium"
                                >
                                    {t.nav.features}
                                </a>
                                <a
                                    href="#contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-300 hover:text-white py-3 transition-colors border-b border-white/5 text-lg font-medium"
                                >
                                    {t.nav.contact}
                                </a>
                                <Link
                                    href="/symptoms"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-300 hover:text-white py-3 transition-colors border-b border-white/5 text-lg font-medium"
                                >
                                    {t.nav.ai}
                                </Link>
                                <div className="pt-4 flex flex-col gap-4">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-center py-4 text-gray-300 hover:text-white border border-white/10 rounded-xl transition-colors font-medium"
                                    >
                                        {t.nav.signIn}
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-center py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg"
                                    >
                                        {t.nav.getStarted}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                                <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white text-xs font-bold mb-6 tracking-widest uppercase gap-3">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                    <span className="text-cyan-400 font-black">50,000+</span> {t.hero.badge}
                                </div>
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className={`text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-white drop-shadow-lg ${lang === 'ur' ? 'font-urdu leading-[1.3]' : ''}`}>
                                {t.hero.title1}
                                <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"> {t.hero.title2}</span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                                {t.hero.desc}
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-14">
                                <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 text-center">
                                    {t.hero.btn1}
                                </Link>
                                <Link href="/symptoms" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center">
                                    {t.hero.btn2}
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/10">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-left group cursor-default">
                                        <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1 tracking-tighter transition-all group-hover:scale-110 origin-left duration-300">
                                            {stat.number}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.25em] opacity-70 group-hover:opacity-100 transition-opacity">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* 3D Hero Image/Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            className={`relative z-10 w-full flex justify-center ${lang === 'ur' ? 'lg:justify-start' : 'lg:justify-end'}`}
                        >
                            <TiltCard className="w-full max-w-lg">
                                {/* Dashboard Card */}
                                <div className={`bg-black/40 backdrop-blur-md lg:backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8 preserve-3d ${lang === 'ur' ? 'text-right' : 'text-left'}`}>
                                    <div className="flex items-center justify-between mb-8 translate-z-20">
                                        <h3 className="text-xl font-semibold text-white">{lang === 'ur' ? 'پیشنٹ ڈیش بورڈ' : 'Patient Dashboard'}</h3>
                                        <div className="flex items-center bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-300 text-xs font-semibold tracking-wide uppercase">{lang === 'ur' ? 'آن لائن' : 'ONLINE'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 preserve-3d">
                                        {/* Card 1 */}
                                        <div className={`flex items-center ${lang === 'ur' ? 'space-x-reverse' : ''} gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition duration-300 translate-z-30 shadow-[0_5px_15px_rgba(0,0,0,0.2)]`}>
                                            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                AK
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white text-lg">{lang === 'ur' ? 'ڈاکٹر عائشہ خان' : 'Dr. Ayesha Khan'}</div>
                                                <div className="text-sm text-cyan-300">{lang === 'ur' ? 'کارڈیالوجی • آج 2:30 بجے' : 'Cardiology • Today 2:30 PM'}</div>
                                            </div>
                                        </div>

                                        {/* Card 2 */}
                                        <div className={`flex items-center ${lang === 'ur' ? 'space-x-reverse' : ''} gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition duration-300 translate-z-40 shadow-[0_10px_20px_rgba(0,0,0,0.3)]`}>
                                            <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                FQ
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white text-lg">{lang === 'ur' ? 'ڈاکٹر فیصل قریشی' : 'Dr. Faisal Qureshi'}</div>
                                                <div className="text-sm text-purple-300">{lang === 'ur' ? 'ڈرماٹولوجی • کل 10:00 بجے' : 'Dermatology • Tomorrow 10:00 AM'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Abstract Floating Element */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/30 blur-2xl lg:blur-3xl rounded-full translate-z-10 pointer-events-none"></div>
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
                        <h2 className={`text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight ${lang === 'ur' ? 'font-urdu' : ''}`}>
                            {t.features.title} <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{t.features.titleColor}</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                            {t.features.desc}
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
                                    <div className={`p-8 bg-black/40 backdrop-blur-md lg:backdrop-blur-xl rounded-3xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 h-full flex flex-col translate-z-10 preserve-3d shadow-2xl ${lang === 'ur' ? 'items-end text-right' : 'items-start text-left'}`}>
                                        <div className="text-4xl md:text-5xl mb-6 translate-z-30 drop-shadow-lg">{feature.icon}</div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 translate-z-20">{feature.title}</h3>
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
                        <div className="bg-black rounded-full px-6 py-2 text-white font-medium">{t.cta.ready}</div>
                    </div>

                    <h2 className={`text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight ${lang === 'ur' ? 'font-urdu' : ''}`}>
                        {t.cta.title}
                    </h2>
                    <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        {t.cta.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/register" className="px-10 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] text-center cursor-pointer">
                            {t.cta.btn1}
                        </Link>
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 text-center"
                        >
                            {t.cta.btn2}
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 relative z-10">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-black/40 backdrop-blur-lg lg:backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 md:p-16 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-2xl lg:blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 blur-2xl lg:blur-[100px] pointer-events-none" />

                        <div className="text-center mb-12">
                            <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${lang === 'ur' ? 'font-urdu' : ''}`}>{t.contact.title}</h2>
                            <p className="text-gray-400">{t.contact.desc}</p>
                        </div>

                        <ContactForm t={t} lang={lang} />
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-gray-400 py-16 border-t border-white/10 relative z-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
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
                                <li><Link href="/for/patients" className="hover:text-cyan-400 transition-colors">For Patients</Link></li>
                                <li><Link href="/for/doctors" className="hover:text-cyan-400 transition-colors">For Doctors</Link></li>
                                <li><Link href="/for/clinics" className="hover:text-cyan-400 transition-colors">For Clinics</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Company</h4>
                            <ul className="space-y-3">
                                <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                                <li><Link href="/careers" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                                <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Legal</h4>
                            <ul className="space-y-3">
                                <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                                <li><Link href="/hipaa" className="hover:text-cyan-400 transition-colors">HIPAA Compliance</Link></li>
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