'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Stats = {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingDoctors: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.ok ? res.json() : null)
      .then(setStats);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers ?? '–'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Verified Doctors</p>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalDoctors ?? '–'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Appointments</p>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalAppointments ?? '–'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Pending Doctor Approvals</p>
          <p className="text-2xl font-bold text-orange-600">{stats?.pendingDoctors ?? '–'}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link
          href="/dashboard/admin/users"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Manage Users
        </Link>
        <Link
          href="/dashboard/admin/doctors"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Approve Doctors
        </Link>
      </div>
    </div>
  );
}
