'use client';

import { useState, useEffect } from 'react';

type Profile = {
  id: string;
  bio: string | null;
  specialization: string;
  experience: number;
  fee: number;
  user: { name: string; email: string };
};

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState(0);
  const [fee, setFee] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/doctor/profile')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setProfile(data);
          setBio(data.bio || '');
          setSpecialization(data.specialization || '');
          setExperience(data.experience || 0);
          setFee(data.fee || 0);
        }
      });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/doctor/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, specialization, experience, fee }),
      });
      if (res.ok) setProfile(await res.json());
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Profile Management</h1>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
        <div className="relative z-10 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-gray-500 resize-none"
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-gray-500"
              placeholder="e.g. Cardiology"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Experience (years)</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Consultation Fee ($)</label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder-gray-500"
            />
          </div>
          <div className="pt-2">
            <button
              onClick={save}
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
