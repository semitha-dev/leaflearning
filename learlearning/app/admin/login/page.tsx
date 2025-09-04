'use client';


export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabaseClient';
import NavBar from '../../components/Navbar';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';

const ADMIN_EMAILS = ['semithaadmin@gmail.com'];

export default function AdminLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToast(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return setToast(error.message);

    const signedEmail = data.user?.email?.toLowerCase();
    if (!signedEmail || !ADMIN_EMAILS.includes(signedEmail)) {
      setToast('Not authorized for admin.');
      await supabase.auth.signOut();
      return;
    }
    router.push(redirectTo);
  }

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      <NavBar />
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/90 rounded-2xl border border-amber-200 p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Admin login</h1>
          <p className="text-stone-700 mt-1">Restricted area.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-800 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 rounded-lg border border-amber-200 bg-white/80 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  type="email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-800 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 rounded-lg border border-amber-200 bg-white/80 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  type="password"
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Log in
            </button>
          </form>

          {toast && <div className="mt-4 rounded-lg bg-stone-900 text-white text-sm px-3 py-2">{toast}</div>}

          <p className="mt-4 text-sm text-stone-600">
            <Link href="/" className="text-amber-700 hover:text-amber-800">Back to site</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
