'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('appointmentId');
  const doctorId = searchParams.get('doctorId');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!doctorId) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, appointmentId: appointmentId || undefined, rating, comment }),
      });
      if (res.ok) router.push('/dashboard/patient/appointments');
      else alert((await res.json()).error || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctorId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <p className="text-gray-400 text-lg mb-6">Invalid review link.</p>
        <button
          onClick={() => router.push('/dashboard/patient/appointments')}
          className="px-6 py-2 bg-white/5 text-cyan-400 rounded-xl border border-cyan-500/30 hover:bg-cyan-500 hover:text-white transition-all font-medium"
        >
          Back to appointments
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl"
    >
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Leave a Review</h1>
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Rating</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`flex-1 py-3 rounded-xl border transition-all font-bold ${rating >= n
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-white/5 border-white/5 text-gray-500'
                  }`}
              >
                {n} ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-5 py-4 bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 rounded-2xl outline-none resize-none min-h-[120px] transition-all"
            placeholder="Share your experience with this specialist..."
          />
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 transition-all hover:-translate-y-0.5"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </motion.div>
  );
}
