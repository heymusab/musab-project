'use client';

import { useState, useEffect } from 'react';

type Doctor = {
  id: string;
  approved: boolean;
  specialization: string;
  fee: number;
  user: { name: string; email: string };
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/doctors')
      .then((res) => res.json())
      .then((data) => { setDoctors(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const setApproved = async (doctorId: string, approved: boolean) => {
    const res = await fetch('/api/admin/doctors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, approved }),
    });
    if (res.ok) setDoctors((prev) => prev.map((d) => (d.id === doctorId ? { ...d, approved } : d)));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Approve Doctors</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Specialization</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Fee</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{d.user.name}</td>
                  <td className="px-4 py-3">{d.user.email}</td>
                  <td className="px-4 py-3">{d.specialization}</td>
                  <td className="px-4 py-3">${d.fee}</td>
                  <td className="px-4 py-3">{d.approved ? <span className="text-green-600">Approved</span> : <span className="text-orange-600">Pending</span>}</td>
                  <td className="px-4 py-3 text-right">
                    {!d.approved ? (
                      <button
                        onClick={() => setApproved(d.id, true)}
                        className="text-green-600 hover:underline"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => setApproved(d.id, false)}
                        className="text-gray-500 hover:underline"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
