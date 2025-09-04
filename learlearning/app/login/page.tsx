"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import NavBar from '../components/Navbar';
import { Mail, Lock, Loader2, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // If already signed in, don't show login—go where the app expects
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session) router.replace(redirectTo);
    })();
    return () => { mounted = false; };
  }, [router, redirectTo]);

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setToast(error.message);
    router.push(redirectTo);
  }

  async function signInWithGoogle() {
    setLoading(true);
    setToast(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Send Google → Supabase → back to this URL
        redirectTo: `${location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
      }
    });
    setLoading(false);
    if (error) setToast(error.message);
    // No router.push here: OAuth redirects the page.
  }

  async function sendReset() {
    if (!email) return setToast('Enter your email first.');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return setToast(error.message);
    setToast('Check your inbox for a password reset link.');
  }

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      <NavBar />

      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/90 rounded-2xl border border-amber-200 p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Log in</h1>
          <p className="text-stone-700 mt-1">Welcome back! Sign in to continue.</p>

          <form onSubmit={signInWithPassword} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-800 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 rounded-lg border border-amber-200 bg-white/80 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-800 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 rounded-lg border border-amber-200 bg-white/80 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={sendReset}
                className="text-sm text-amber-700 hover:text-amber-800"
              >
                Forgot password?
              </button>
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

          <div className="my-4 h-px bg-amber-200" />

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-white/80 ring-1 ring-amber-200 hover:bg-amber-50 text-stone-800 px-4 h-11 rounded-lg"
          >
            <img src="/google.svg" alt="" className="h-4 w-4" />
            Continue with Google
          </button>

          <p className="mt-4 text-sm text-stone-700">
            New here?{' '}
            <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="text-amber-700 hover:text-amber-800 inline-flex items-center gap-1">
              Create an account <ArrowRight className="h-4 w-4" />
            </Link>
          </p>

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
