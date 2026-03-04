'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Appointment = {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  status: string;
  doctor: { id: string; user: { name: string }; specialization: string };
};

export default function PatientAppointmentsPage() {
  const [list, setList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => { setList(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return;
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
    if (res.ok) setList((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)));
  };

  const now = new Date().toISOString().slice(0, 10);
  const upcoming = list.filter((a) => a.date >= now && a.status !== 'CANCELLED');
  const past = list.filter((a) => a.date < now || a.status === 'CANCELLED');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((a) => (
                  <li key={a.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{a.doctor.user.name} — {a.doctor.specialization}</p>
                      <p className="text-sm text-gray-500">{a.date} at {a.time} — {a.status}</p>
                    </div>
                    {a.status === 'PENDING' && (
                      <button
                        onClick={() => cancel(a.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Past</h2>
            {past.length === 0 ? (
              <p className="text-gray-500">No past appointments.</p>
            ) : (
              <ul className="space-y-3">
                {past.map((a) => (
                  <li key={a.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{a.doctor.user.name} — {a.doctor.specialization}</p>
                      <p className="text-sm text-gray-500">{a.date} at {a.time} — {a.status}</p>
                    </div>
                    {a.status === 'COMPLETED' && (
                      <Link
                        href={`/dashboard/patient/review?appointmentId=${a.id}&doctorId=${a.doctorId}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Leave review
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
