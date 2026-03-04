'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserX, UserCheck, Trash2, Mail, Shield, ShieldOff, Search as SearchIcon } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  blocked: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId: string, blocked: boolean) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, blocked }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, blocked } : u)));
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This will also remove any associated records like reviews or profiles. This cannot be undone.')) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">User Registry</h1>
          <p className="text-gray-400">Monitor and manage all system participants.</p>
        </div>

        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all w-80 placeholder-gray-500 shadow-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-medium">Synchronizing user data...</p>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5 text-left">User Profile</th>
                  <th className="px-8 py-5 text-left">Role</th>
                  <th className="px-8 py-5 text-left">Account Status</th>
                  <th className="px-8 py-5 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((u) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 flex items-center justify-center text-cyan-400 font-bold group-hover:scale-110 transition-transform">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">{u.name}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${u.role === 'ADMIN' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                            u.role === 'DOCTOR' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                              'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {u.blocked ? (
                            <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold leading-none">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                              Blocked
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold leading-none">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              Active
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleBlock(u.id, !u.blocked)}
                            className={`p-2.5 rounded-xl border transition-all ${u.blocked
                                ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white'
                                : 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white'
                              }`}
                            title={u.blocked ? 'Unblock User' : 'Block User'}
                          >
                            {u.blocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            disabled={deletingId === u.id}
                            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            title="Delete User"
                          >
                            {deletingId === u.id ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="mt-10 py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl text-center">
          <UserX className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No users identified</h3>
          <p className="text-gray-400 max-w-xs mx-auto">Try refining your search terms to locate specific security principals.</p>
        </div>
      )}
    </div>
  );
}
