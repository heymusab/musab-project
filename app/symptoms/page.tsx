'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-blue-100/50 p-8">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          ← Back to MediConnect
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Symptom Checker</h1>
        <p className="text-gray-600 mb-6">
          Describe your symptoms and we&apos;ll suggest which type of doctor you should see.
        </p>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g. fever and cough, chest pain, skin rash..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4"
          rows={4}
        />
        <button
          onClick={check}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-70"
        >
          {loading ? 'Analyzing...' : 'Get suggestion'}
        </button>
        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="font-semibold text-gray-800">Suggested: {result.suggestion}</p>
            <p className="text-gray-700 mt-2">{result.message}</p>
            {result.alternatives?.length ? (
              <p className="text-sm text-gray-500 mt-2">Also consider: {result.alternatives.join(', ')}</p>
            ) : null}
            <Link href="/register" className="inline-block mt-4 text-blue-600 hover:underline">
              Register to book with a {result.suggestion} →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
