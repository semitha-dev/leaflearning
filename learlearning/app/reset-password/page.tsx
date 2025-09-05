'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import NavBar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Check } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function updatePw(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return setToast(error.message);
    setToast('Password updated. Redirecting…');
    setTimeout(() => router.push('/login'), 1000);
  }

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/90 rounded-2xl border border-amber-200 p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Set a new password</h1>
          <form onSubmit={updatePw} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-800 mb-1">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 rounded-lg border border-amber-200 bg-white/80 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 h-11 rounded-lg shadow-sm"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Update password
            </button>
          </form>

          {toast && (
            <div className="mt-4 rounded-lg bg-stone-900 text-white text-sm px-3 py-2">
              {toast}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
