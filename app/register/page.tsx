'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [error, setError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError({});
    if (!isValidEmail) {
      setError({ email: ['Invalid email format'] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || { general: ['Registration failed'] });
        setLoading(false);
        return;
      }
      router.push('/login?registered=1');
      router.refresh();
    } catch {
      setError({ general: ['Something went wrong'] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card rounded-[3.5rem] shadow-2xl border border-white/10 p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group transition-all hover:scale-105">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
              <Stethoscope className="text-white w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
              MediConnect
            </span>
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Join Platform</h1>
          <p className="text-slate-400 font-medium">Healthcare at your fingertips</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error.general && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              {error.general[0]}
            </motion.div>
          )}

          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Identify As...</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${role === 'PATIENT' ? 'bg-primary/20 border-primary/40 text-white shadow-lg shadow-primary/10' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
                <input
                  type="radio"
                  name="role"
                  checked={role === 'PATIENT'}
                  onChange={() => setRole('PATIENT')}
                  className="hidden"
                />
                <span className={`text-[10px] font-black uppercase tracking-widest ${role === 'PATIENT' ? 'text-primary' : ''}`}>Patient</span>
              </label>
              <label className={`flex items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${role === 'DOCTOR' ? 'bg-primary/20 border-primary/40 text-white shadow-lg shadow-primary/10' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
                <input
                  type="radio"
                  name="role"
                  checked={role === 'DOCTOR'}
                  onChange={() => setRole('DOCTOR')}
                  className="hidden"
                />
                <span className={`text-[10px] font-black uppercase tracking-widest ${role === 'DOCTOR' ? 'text-primary' : ''}`}>Doctor</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary/40 focus:bg-white/10 transition-all font-medium outline-none"
              placeholder="e.g. Faisal Hayat"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary/40 focus:bg-white/10 transition-all font-medium outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary/40 focus:bg-white/10 transition-all font-medium outline-none"
              placeholder="Min 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-3xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
          >
            {loading ? 'Creating Account...' : 'Get Started Now'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-10 text-xs font-medium relative z-10">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-black uppercase tracking-widest hover:text-white transition-colors decoration-dotted underline underline-offset-4 decoration-primary/50">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
