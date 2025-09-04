'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../components/Navbar';
import { supabase } from '@/app/lib/supabaseClient';
import { Loader2, Check, Sparkles } from 'lucide-react';

const ADMIN_EMAILS = ['semithaadmin@gmail.com'];

type MiniUser = { id: string; email: string | null; name: string | null };

export default function AdminPage() {
  const router = useRouter();

  const [meMail, setMeMail] = useState<string | null>(null);
  const [meId, setMeId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // forms
  const [aTitle, setATitle] = useState('');
  const [aBody, setABody] = useState('');
  const [fTitle, setFTitle] = useState('');
  const [fDetail, setFDetail] = useState('');

  // users
  const [users, setUsers] = useState<MiniUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email?.toLowerCase() ?? null;
      if (mounted) {
        setMeMail(email);
        setMeId(user?.id ?? null);
        setAuthReady(true);
      }
      if (!email || !ADMIN_EMAILS.includes(email)) {
        router.replace('/admin/login?redirect=/admin');
        return;
      }
      // load users list
      setLoadingUsers(true);
      try {
        const res = await fetch('/api/admin/users');
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || 'Failed to load users');
        setUsers(j.users as MiniUser[]);
      } catch (e: any) {
        setToast(e.message || 'Error loading users');
      } finally {
        setLoadingUsers(false);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  async function addAnnouncement() {
  if (!aTitle.trim() || !aBody.trim()) {
    setToast('Please fill title & body');
    return;
  }
  if (!meId) {
    setToast('No admin session');
    return;
  }

  setBusy(true);

  const slug = slugify(`${aTitle}-${Date.now()}`);

  const { error } = await supabase.from('announcements').insert({
    slug,
    title: aTitle.trim(),
    excerpt: aBody.trim().slice(0, 180),   // optional small summary
    content: aBody.trim(),                 // <-- column is 'content'
    created_by: meId,                      // <-- column is 'created_by'
    published_at: new Date().toISOString() // optional: publish immediately
  });

  setBusy(false);

  if (error) {
    setToast(`Error: ${error.message}`);
    return;
  }

  setATitle('');
  setABody('');
  setToast('Announcement published.');
}


  async function addFeatureIdea() {
    if (!fTitle.trim() || !fDetail.trim()) {
      setToast('Please fill feature title & details');
      return;
    }
    if (!meId) {
      setToast('No admin session');
      return;
    }
    setBusy(true);
    const { error } = await supabase.from('voteinfo').insert({
      title: fTitle.trim(),
      desc: fDetail.trim(),
      yes: 1,
      userid: meId
    });
    setBusy(false);
    if (error) return setToast(`Error: ${error.message}`);
    setFTitle(''); setFDetail('');
    setToast('Feature idea created with 1 upvote.');
  }

  if (!authReady) {
    return (
      <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
        <NavBar />
        <div className="max-w-5xl mx-auto px-4 py-10 text-stone-700">Checking session…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      <NavBar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Admin dashboard</h1>
        <p className="text-stone-700">Signed in as <span className="font-medium">{meMail}</span></p>

        {/* Create Announcement */}
        <div className="mt-8 bg-white/90 rounded-2xl border border-amber-200 p-6">
          <h2 className="text-xl font-semibold text-stone-900">New announcement</h2>
          <div className="mt-4 grid gap-3">
            <input
              value={aTitle}
              onChange={(e) => setATitle(e.target.value)}
              placeholder="Title"
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400 bg-white/80"
            />
            <textarea
              value={aBody}
              onChange={(e) => setABody(e.target.value)}
              placeholder="Body (markdown or plain text)"
              rows={5}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400 bg-white/80"
            />
            <div>
              <button
                onClick={addAnnouncement}
                disabled={busy}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg shadow-sm"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Publish announcement
              </button>
            </div>
          </div>
        </div>

        {/* Create Feature Idea (voteinfo) */}
        <div className="mt-8 bg-white/90 rounded-2xl border border-amber-200 p-6">
          <h2 className="text-xl font-semibold text-stone-900">New feature idea (voteinfo)</h2>
          <div className="mt-4 grid gap-3">
            <input
              value={fTitle}
              onChange={(e) => setFTitle(e.target.value)}
              placeholder="Feature title"
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400 bg-white/80"
            />
            <textarea
              value={fDetail}
              onChange={(e) => setFDetail(e.target.value)}
              placeholder="Short description"
              rows={4}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400 bg-white/80"
            />
            <div>
              <button
                onClick={addFeatureIdea}
                disabled={busy}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg shadow-sm"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Create idea (+1 upvote)
              </button>
            </div>
          </div>
        </div>

        {/* Users overview */}
        <div className="mt-8 bg-white/90 rounded-2xl border border-amber-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900">Users</h2>
            <div className="text-stone-700">
              Total: <span className="font-medium">{users.length}</span>
            </div>
          </div>
          <div className="mt-3 border-t border-amber-200/70" />
          {loadingUsers ? (
            <div className="py-6 text-stone-600">Loading users…</div>
          ) : users.length ? (
            <ul className="divide-y divide-amber-200/70">
              {users.map(u => (
                <li key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-stone-900">{u.name || u.email || 'User'}</div>
                    <div className="text-sm text-stone-600">{u.email}</div>
                  </div>
                  <div className="text-xs text-stone-500">{u.id}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-stone-600">No users found.</div>
          )}
        </div>

        {toast && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-sm px-4 py-2 rounded-lg shadow">
            {toast}
          </div>
        )}
      </section>
    </main>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}
