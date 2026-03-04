'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex items-center justify-center bg-mesh p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>

        <div className="text-center mb-8 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              <span className="text-white font-bold text-lg">M</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-2">Join as a Patient or Doctor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error.general && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
              {error.general[0]}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-3 rounded-xl border transition-all ${role === 'PATIENT' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                <input
                  type="radio"
                  name="role"
                  checked={role === 'PATIENT'}
                  onChange={() => setRole('PATIENT')}
                  className="hidden"
                />
                <span className="font-medium">Patient</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-3 rounded-xl border transition-all ${role === 'DOCTOR' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                <input
                  type="radio"
                  name="role"
                  checked={role === 'DOCTOR'}
                  onChange={() => setRole('DOCTOR')}
                  className="hidden"
                />
                <span className="font-medium">Doctor</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-500"
              placeholder="you@example.com"
            />
            {error.email && (
              <p className="text-red-400 text-sm mt-2">{error.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-500"
              placeholder="Min 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 transition-all hover:-translate-y-0.5"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-sm relative z-10">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
