'use client';

import { useState, useEffect } from 'react';

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  patient: { name: string; email: string };
};

export default function DoctorAppointmentsPage() {
  const [list, setList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => { setList(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointment Management</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div>
                <p className="font-medium">{a.patient.name}</p>
                <p className="text-sm text-gray-500">{a.date} at {a.time} — {a.status}</p>
              </div>
              <div className="flex gap-2">
                {a.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => updateStatus(a.id, 'CONFIRMED')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(a.id, 'CANCELLED')}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                {a.status === 'CONFIRMED' && (
                  <button
                    onClick={() => updateStatus(a.id, 'COMPLETED')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Mark completed
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && list.length === 0 && <p className="text-gray-500">No appointments.</p>}
    </div>
  );
}
