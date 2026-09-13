'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FolkArtBanner from '@/components/homepage/FolkArtBanner';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  Users, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2,
  XCircle, RefreshCw, Settings, Package, MessageSquare
} from 'lucide-react';

interface Metrics {
  totalUsers?: number;
  totalProducts?: number;
  pendingModeration?: number;
  activeArtisans?: number;
}

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({});
  const [users, setUsers] = useState<User[]>([]);
  const [moderationQueue, setModerationQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'users' | 'moderation'>('overview');
  const [searchEmail, setSearchEmail] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    async function loadData() {
      try {
        const [metricsRes, usersRes, modRes] = await Promise.allSettled([
          fetch('/api/v1/admin/metrics', { headers }),
          fetch('/api/v1/admin/users', { headers }),
          fetch('/api/v1/admin/moderation-queue', { headers }),
        ]);

        if (metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
          setMetrics(await metricsRes.value.json());
        }
        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
          const d = await usersRes.value.json();
          setUsers(Array.isArray(d) ? d : d.users || []);
        }
        if (modRes.status === 'fulfilled' && modRes.value.ok) {
          const d = await modRes.value.json();
          setModerationQueue(Array.isArray(d) ? d : d.items || []);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function changeUserRole(userId: string, newRole: string) {
    await fetch(`/api/v1/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ role: newRole, reason: 'Admin role update' }),
    });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  }

  async function changeUserStatus(userId: string, newStatus: string) {
    await fetch(`/api/v1/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: newStatus }),
    });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  }

  async function recalcTrustScore(userId: string) {
    await fetch(`/api/v1/admin/trust-scores/${userId}/recalculate`, {
      method: 'POST',
      headers,
    });
    alert('Trust score recalculation queued.');
  }

  const filteredUsers = users.filter(u =>
    !searchEmail || u.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const ROLE_COLORS: Record<string, string> = {
    ARTISAN: 'bg-amber-900/60 text-amber-300',
    BUYER: 'bg-blue-900/60 text-blue-300',
    CONSUMER: 'bg-emerald-900/60 text-emerald-300',
    ADMIN: 'bg-purple-900/60 text-purple-300',
    MODERATOR: 'bg-pink-900/60 text-pink-300',
  };

  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'text-emerald-400',
    UNVERIFIED: 'text-amber-400',
    LOCKED: 'text-red-400',
    DISABLED: 'text-stone-400',
  };

  return (
    <>
      <Navbar />
      <section
        className="relative min-h-[30vh] flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(135deg, #0D0620 0%, #1A0D40 60%, #0D0620 100%)' }}
      >
        <div className="container relative z-10 py-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs text-purple-200">
              <ShieldCheck size={14} className="text-purple-400" />
              <span>ALMS Admin & Moderation Panel</span>
            </div>
            <h1 className="font-serif text-white font-light text-4xl">Admin Dashboard</h1>
            <p className="text-stone-300 text-sm">Platform management, user administration, and content moderation.</p>
          </div>
        </div>
      </section>

      <FolkArtBanner height={50} variant="border-2" alt="Heritage border" />

      <main className="bg-[#0D0620] text-white font-sans min-h-screen pb-16">
        <div className="container max-w-7xl py-10 space-y-8">

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-4">
            {(['overview', 'users', 'moderation'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer ${
                  tab === t ? 'bg-purple-600 text-white' : 'bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-stone-400">Loading admin data...</div>
          ) : (
            <>
              {/* ── OVERVIEW TAB ─────────────────────────────────── */}
              {tab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Users', value: metrics.totalUsers ?? users.length, icon: Users, color: 'text-purple-300' },
                      { label: 'Total Products', value: metrics.totalProducts ?? '—', icon: Package, color: 'text-amber-300' },
                      { label: 'Pending Moderation', value: metrics.pendingModeration ?? moderationQueue.length, icon: AlertTriangle, color: 'text-red-300' },
                      { label: 'Active Artisans', value: metrics.activeArtisans ?? users.filter(u => u.role === 'ARTISAN').length, icon: TrendingUp, color: 'text-emerald-300' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <ScrollReveal key={label}>
                        <div className="bg-[#1A0D40] border border-white/10 p-5 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className={color} />
                            <p className="text-[10px] uppercase font-bold text-stone-400">{label}</p>
                          </div>
                          <p className={`font-serif text-3xl font-light ${color}`}>{value}</p>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>

                  {/* Role breakdown */}
                  <ScrollReveal className="bg-[#1A0D40] border border-white/10 p-6 rounded-2xl">
                    <h2 className="font-serif text-xl text-white mb-4">User Role Distribution</h2>
                    <div className="flex flex-wrap gap-3">
                      {(['ARTISAN', 'BUYER', 'CONSUMER', 'ADMIN', 'MODERATOR'] as const).map(role => {
                        const count = users.filter(u => u.role === role).length;
                        return (
                          <div key={role} className={`px-4 py-2 rounded-xl text-xs font-semibold ${ROLE_COLORS[role] || 'bg-stone-800 text-stone-300'}`}>
                            {role}: {count}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollReveal>
                </div>
              )}

              {/* ── USERS TAB ────────────────────────────────────── */}
              {tab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={searchEmail}
                      onChange={e => setSearchEmail(e.target.value)}
                      placeholder="Search by email..."
                      className="flex-1 max-w-sm bg-black/40 border border-white/15 px-4 py-2.5 text-xs text-white rounded-full focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-xs text-stone-400">{filteredUsers.length} users</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-stone-400 uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Joined</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredUsers.slice(0, 50).map(user => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 font-mono text-white">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ROLE_COLORS[user.role] || 'bg-stone-800 text-stone-300'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-semibold ${STATUS_COLORS[user.status] || 'text-stone-400'}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-stone-400">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <select
                                  defaultValue={user.role}
                                  onChange={e => changeUserRole(user.id, e.target.value)}
                                  className="bg-black/40 border border-white/15 text-white text-[10px] px-2 py-1 rounded-lg cursor-pointer focus:outline-none"
                                >
                                  {['ARTISAN', 'BUYER', 'CONSUMER', 'ADMIN', 'MODERATOR'].map(r => (
                                    <option key={r} value={r} className="bg-[#1A0D40]">{r}</option>
                                  ))}
                                </select>
                                {user.status === 'LOCKED' ? (
                                  <button
                                    onClick={() => changeUserStatus(user.id, 'ACTIVE')}
                                    className="p-1.5 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 rounded-lg cursor-pointer hover:bg-emerald-900/60"
                                    title="Unlock"
                                  >
                                    <CheckCircle2 size={12} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => changeUserStatus(user.id, 'DISABLED')}
                                    className="p-1.5 bg-red-900/40 border border-red-500/30 text-red-400 rounded-lg cursor-pointer hover:bg-red-900/60"
                                    title="Disable"
                                  >
                                    <XCircle size={12} />
                                  </button>
                                )}
                                <button
                                  onClick={() => recalcTrustScore(user.id)}
                                  className="p-1.5 bg-purple-900/40 border border-purple-500/30 text-purple-400 rounded-lg cursor-pointer hover:bg-purple-900/60"
                                  title="Recalculate Trust Score"
                                >
                                  <RefreshCw size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── MODERATION TAB ───────────────────────────────── */}
              {tab === 'moderation' && (
                <div className="space-y-4">
                  {moderationQueue.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
                      <p className="text-stone-400">No items pending moderation.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {moderationQueue.map((item: any, i: number) => (
                        <div key={i} className="bg-[#1A0D40] border border-white/10 p-5 rounded-2xl flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-white text-sm">{item.type || 'Content'} Review</p>
                            <p className="text-xs text-stone-300">{item.description || item.reason || 'Flagged for review'}</p>
                            {item.created_at && (
                              <p className="text-[10px] text-stone-500">{new Date(item.created_at).toLocaleDateString()}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg cursor-pointer hover:bg-emerald-900/60">
                              Approve
                            </button>
                            <button className="px-3 py-1.5 bg-red-900/40 border border-red-500/30 text-red-400 text-xs rounded-lg cursor-pointer hover:bg-red-900/60">
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <FolkArtBanner height={50} variant="border-1" alt="Heritage border" />
      <Footer />
    </>
  );
}
