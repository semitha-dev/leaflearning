"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/app/lib/supabaseClient";
import NavBar from "../components/Navbar";
import { UserPlus, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      {/* Wrap the part that uses useSearchParams in Suspense (required for prerender) */}
      <Suspense fallback={<div className="p-6 text-sm text-stone-600">Loading sign up…</div>}>
        <SignupInner />
      </Suspense>
    </main>
  );
}

function SignupInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${location.origin}/login`,
      },
    });
    setLoading(false);
    if (error) return setToast(error.message);
    setToast("Check your inbox to confirm your email, then log in.");
  }

  async function signUpWithGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/login` },
    });
    setLoading(false);
    if (error) setToast(error.message);
  }

  return (
    <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/90 rounded-2xl border border-amber-200 p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Create account</h1>
        <p className="text-stone-700 mt-1">It’s quick and free.</p>

        <form onSubmit={signUp} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-800 mb-1">Full name</label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 h-11 rounded-lg border border-amber-200 bg-white/80 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your name"
                required
              />
            </div>
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 h-11 rounded-lg shadow-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Sign up
          </button>
        </form>

        <div className="my-4 h-px bg-amber-200" />

        <button
          onClick={signUpWithGoogle}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-white/80 ring-1 ring-amber-200 hover:bg-amber-50 text-stone-800 px-4 h-11 rounded-lg"
        >
          <Image src="/google.svg" alt="Google" width={16} height={16} />
          Continue with Google
        </button>

        <p className="mt-4 text-sm text-stone-700">
          Already have an account{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
          >
            Log in <ArrowRight className="h-4 w-4" />
          </Link>
        </p>

        {toast && <div className="mt-4 rounded-lg bg-stone-900 text-white text-sm px-3 py-2">{toast}</div>}
      </div>
    </section>
  );
}
