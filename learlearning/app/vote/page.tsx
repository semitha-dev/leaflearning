'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import {
  Sparkles,
  Search,
  ThumbsUp,
  Tag,
  X,
} from 'lucide-react';
import NavBar from '../components/Navbar';

/* ---------- Supabase (browser) ---------- */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ---------- Types ---------- */
type Category = 'New Tool' | 'Improvement' | 'Bugfix' | 'Integration';

interface AggregatedIdea {
  key: string;        // slug of title+desc for stable key
  title: string;
  detail: string;     // desc
  category?: Category;
  votes: number;      // sum of yes
  votedByMe: boolean; // if current user has a row for this idea
}

/* ---------- Helpers ---------- */
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

function ideaKey(title: string, desc: string) {
  return `${title}|||${desc}`;
}

/* =========================================================
   Page
========================================================= */
export default function VotePage() {
  const [ideas, setIdeas] = useState<AggregatedIdea[]>([]);
  const [query, setQuery] = useState('');
  const [me, setMe] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // small one-time hint
  const [showLocalNote, setShowLocalNote] = useState(false);

  /* ---------- Load session then ideas ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        setMe(user ? { id: user.id } : null);
        await loadIdeas(user?.id || null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // one-time note toggle
    try {
      const seen = localStorage.getItem('vote_local_note_seen');
      if (!seen) setShowLocalNote(true);
    } catch {}

    return () => { mounted = false; };
  }, []);

  async function loadIdeas(currentUserId: string | null) {
    const { data, error } = await supabase
      .from('voteinfo')
      .select('id, title, desc, yes, userid, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setToast(`Error loading votes: ${error.message}`);
      return;
    }

    const bucket = new Map<string, AggregatedIdea>();
    for (const row of data || []) {
      const title = row.title ?? '';
      const detail = row.desc ?? '';
      const key = ideaKey(title, detail);
      const up = Number(row.yes ?? 1);
      const votedByMe = currentUserId ? row.userid === currentUserId : false;

      const existing = bucket.get(key);
      if (!existing) {
        bucket.set(key, {
          key: slug(key),
          title,
          detail,
          votes: up || 0,
          votedByMe,
        });
      } else {
        existing.votes += up || 0;
        existing.votedByMe = existing.votedByMe || votedByMe;
      }
    }

    const list = [...bucket.values()].sort((a, b) => b.votes - a.votes);
    setIdeas(list);
  }

  /* ---------- Filtering ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ideas.filter(
      (f) =>
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.detail.toLowerCase().includes(q)
    );
  }, [ideas, query]);

  /* ---------- Auth helpers ---------- */
  async function requireLogin(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setToast('Please sign in to upvote.');
      return null;
    }
    setMe({ id: user.id });
    return user.id;
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    });
    if (error) setToast(error.message);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setToast(error.message);
    setMe(null);
  }

  /* ---------- Upvote ---------- */
  async function upvote(idea: AggregatedIdea) {
    const uid = await requireLogin();
    if (!uid) return;

    const { data: existing, error: checkErr } = await supabase
      .from('voteinfo')
      .select('id')
      .eq('title', idea.title)
      .eq('desc', idea.detail)
      .eq('userid', uid)
      .limit(1);

    if (checkErr) {
      setToast(`Error checking vote: ${checkErr.message}`);
      return;
    }
    if (existing?.length) {
      setToast('Already voted');
      return;
    }

    const { error: insErr } = await supabase.from('voteinfo').insert({
      title: idea.title,
      desc: idea.detail,
      yes: 1,
      userid: uid,
    });
    if (insErr) {
      setToast(`Error voting: ${insErr.message}`);
      return;
    }
    await loadIdeas(uid);
  }

  /* =========================================================
     UI
  ========================================================= */
  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">

      {/* one-time hint */}
      {showLocalNote && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="max-w-md mx-auto bg-white/95 border border-amber-200 shadow-sm rounded-xl p-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 text-stone-700">
                <div className="font-medium text-stone-900 mb-1">Heads up</div>
                You must sign in to upvote. We only store your user id to prevent duplicate votes.
              </div>
              <button
                className="ml-2 text-stone-500 hover:text-stone-800"
                onClick={() => {
                  try { localStorage.setItem('vote_local_note_seen', '1'); } catch {}
                  setShowLocalNote(false);
                }}
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ideas…"
              className="w-full pl-9 pr-3 h-11 rounded-xl border border-amber-200 bg-white/80 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Modern list (Product-Hunt vibe) */}
        {loading ? (
          <div className="p-8 text-center text-stone-600">Loading…</div>
        ) : filtered.length ? (
          <ul className="space-y-3">
            {filtered.map((f) => (
              <li key={f.key}>
                <FeatureRow f={f} onVote={() => upvote(f)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-stone-600">No ideas yet.</div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-sm px-4 py-2 rounded-lg shadow">
          {toast}
        </div>
      )}
    </main>
  );
}

/* =========================================================
   Row (modern)
========================================================= */
function FeatureRow({ f, onVote }: { f: AggregatedIdea; onVote: () => void }) {
  return (
    <div className="group relative flex items-stretch gap-4 rounded-2xl border border-amber-200/80 bg-white/85 backdrop-blur-sm px-3 py-3 hover:shadow-md transition-all">
      {/* Left upvote pill */}
      <button
        onClick={onVote}
        title={f.votedByMe ? 'Already voted' : 'Upvote'}
        className={[
          'shrink-0 flex flex-col items-center justify-center w-16 rounded-xl ring-1 transition',
          f.votedByMe
            ? 'bg-amber-600 text-white ring-amber-600'
            : 'bg-white/80 text-stone-800 ring-amber-200 hover:bg-amber-50'
        ].join(' ')}
      >
        <ThumbsUp className={f.votedByMe ? 'h-5 w-5' : 'h-5 w-5 text-amber-700'} />
        <span className="mt-1 text-sm font-semibold">{f.votes}</span>
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] sm:text-base font-semibold text-stone-900">
            {f.title}
          </h3>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2 py-0.5 bg-amber-100 text-amber-900 ring-1 ring-amber-200">
            <Tag className="h-3.5 w-3.5" />
            Idea
          </span>
        </div>

        {f.detail && (
          <p
            className="mt-1 text-sm text-stone-700 overflow-hidden text-ellipsis"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {f.detail}
          </p>
        )}

        {/* subtle bottom meta line */}
        <div className="mt-3 h-px w-full bg-gradient-to-r from-amber-200/60 via-amber-200/30 to-transparent" />
      </div>
    </div>
  );
}
