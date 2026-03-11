'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

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
        setError(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error);
        setLoading(false);
        return;
      }

      // Small delay to ensure session is updated
      await new Promise(r => setTimeout(r, 500));
      
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const role = session?.user?.role;
      
      let redirect = callbackUrl;
      if (callbackUrl === '/' || callbackUrl.startsWith('/login')) {
        if (role === 'PATIENT') redirect = '/dashboard/patient';
        else if (role === 'DOCTOR') redirect = '/dashboard/doctor';
        else if (role === 'ADMIN') redirect = '/dashboard/admin';
        else redirect = '/dashboard'; // default fallback
      }
      
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg glass-card rounded-[3.5rem] shadow-2xl border border-white/10 p-12 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-10 relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group transition-all hover:scale-105">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
            <Stethoscope className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="text-3xl font-black bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
            MediConnect
          </span>
        </Link>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
        <p className="text-slate-400 font-medium">Continue your healthcare journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center flex items-center justify-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            {error}
          </motion.div>
        )}

        {searchParams.get('registered') && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold text-center"
          >
            Account created! Please sign in.
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary/40 focus:bg-white/10 transition-all placeholder:text-slate-500 font-medium outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
            <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">Forgot?</button>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/5 text-white focus:ring-4 focus:ring-primary/20 focus:border-primary/40 focus:bg-white/10 transition-all placeholder:text-slate-500 font-medium outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-3xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
        >
          {loading ? 'Authenticating...' : 'Sign In Now'}
        </button>
      </form>

      <div className="text-center mt-10 relative z-10 flex flex-col gap-4">
        <p className="text-slate-400 text-xs font-medium">
          New to the platform?{' '}
          <Link href="/register" className="text-primary font-black uppercase tracking-widest hover:text-white transition-colors decoration-dotted underline underline-offset-4 decoration-primary/50">
            Create Account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-white">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
