'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

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
      <div>
        <p className="text-gray-500">Invalid link.</p>
        <button onClick={() => router.push('/dashboard/patient/appointments')} className="text-blue-600 mt-4">
          Back to appointments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Leave a Review</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} ★</option>
          ))}
        </select>
        <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
          rows={3}
        />
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}
