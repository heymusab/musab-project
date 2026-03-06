'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PublicSymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<{ suggestion: string; message: string; alternatives?: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptoms.trim() }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setResult({ suggestion: 'General Physician', message: 'Could not analyze. Try describing your symptoms in words.' });
    } catch {
      setResult({ suggestion: 'General Physician', message: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -ml-64 -mb-64"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-black/40 backdrop-blur-xl rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-10 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full"></div>

        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 font-bold text-sm mb-10 hover:text-cyan-300 transition-all group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to MediConnect
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">AI Health <span className="text-cyan-500">Assistant</span></h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg">
          Share your health concerns naturally and let our AI provide instant medical guidance.
        </p>

        <div className="space-y-6">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. fever and sharp cough for 2 days..."
            className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none resize-none min-h-[160px] text-lg font-medium"
          />

          <button
            onClick={check}
            disabled={loading || !symptoms.trim()}
            className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] disabled:opacity-50 transition-all hover:-translate-y-1 active:scale-95"
          >
            {loading ? 'Analyzing with AI...' : 'Get Instant Suggestion'}
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-10 p-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 rounded-[32px] relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.2em] mb-3">AI Analysis Result</p>
            <h3 className="text-2xl font-bold text-white mb-3">Suggested: <span className="text-cyan-400">{result.suggestion}</span></h3>
            <p className="text-gray-300 leading-relaxed font-medium">{result.message}</p>

            {result.alternatives?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.alternatives.map((alt, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] text-gray-400 font-bold uppercase tracking-wider">{alt}</span>
                ))}
              </div>
            ) : null}

            <Link href="/register" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10">
              Book with a {result.suggestion} →
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
