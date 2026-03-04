'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const role = session?.user?.role;
      let redirect = callbackUrl;
      if (callbackUrl === '/' || callbackUrl.startsWith('/login')) {
        if (role === 'PATIENT') redirect = '/dashboard/patient';
        else if (role === 'DOCTOR') redirect = '/dashboard/doctor';
        else if (role === 'ADMIN') redirect = '/dashboard/admin';
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
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
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Sign in to your dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
            {error}
          </motion.div>
        )}

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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 transition-all hover:-translate-y-0.5"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-8 text-sm relative z-10">
        New to MediConnect?{' '}
        <Link href="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh p-4 text-white">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
