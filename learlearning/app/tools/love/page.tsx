"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ---------- Helpers (deterministic hash & utilities) ---------- */
function hashStr(s: string) {
  // Simple deterministic 32-bit hash
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // 0..1
}

function scoreFromNames(a: string, b: string) {
  const key = `${a.trim().toLowerCase()}::${b.trim().toLowerCase()}`;
  return Math.round(hashStr(key) * 100); // 0..100
}

function miniTrait(a: string, b: string, salt: string) {
  const key = `${a.toLowerCase()}|${b.toLowerCase()}|${salt}`;
  return Math.round(hashStr(key) * 100);
}

function chipForScore(p: number) {
  if (p >= 85) return { label: "Soulmate vibes", className: "bg-rose-100 text-rose-800" };
  if (p >= 70) return { label: "Strong match", className: "bg-emerald-100 text-emerald-800" };
  if (p >= 50) return { label: "There’s a spark", className: "bg-amber-100 text-amber-800" };
  if (p >= 30) return { label: "Could grow", className: "bg-blue-100 text-blue-800" };
  return { label: "Better as friends", className: "bg-stone-100 text-stone-800" };
}

function messageForScore(p: number) {
  if (p >= 90) return "You two are a perfect match! ❤️";
  if (p >= 75) return "So much potential—keep fanning that flame. ✨";
  if (p >= 60) return "Definitely a spark! 🔥";
  if (p >= 40) return "There’s potential… take it slow and communicate. 🤝";
  return "Maybe just friends (or it needs time). 🌱";
}

function ideaForScore(p: number) {
  if (p >= 85) return "Plan a cozy picnic with a shared playlist and inside-joke snacks.";
  if (p >= 70) return "Cook a simple recipe together and rate the results like TV judges.";
  if (p >= 50) return "Take a sunset walk and swap favorite childhood stories.";
  if (p >= 30) return "Grab coffee & play a low-stakes board/card game.";
  return "Start with a short walk or ice-cream mini-date—light & easy.";
}

type Pair = { a: string; b: string; score: number; at: number };

/* ---------- Component ---------- */
export default function LoveCalculator() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [history, setHistory] = useState<Pair[]>([]);

  // Load persisted
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("love_calc_state") || "{}");
      if (saved.name1) setName1(saved.name1);
      if (saved.name2) setName2(saved.name2);
      if (typeof saved.score === "number") setScore(saved.score);
      if (Array.isArray(saved.history)) setHistory(saved.history);
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(
        "love_calc_state",
        JSON.stringify({ name1, name2, score, history })
      );
    } catch {}
  }, [name1, name2, score, history]);

  const computed = useMemo(() => {
    if (!name1.trim() || !name2.trim()) return null;
    const p = scoreFromNames(name1, name2);
    const comm = miniTrait(name1, name2, "COMM");
    const chem = miniTrait(name1, name2, "CHEM");
    const stab = miniTrait(name1, name2, "STAB");
    return { p, comm, chem, stab };
  }, [name1, name2]);

  function onCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!computed) return;
    setScore(computed.p);

    // update history (keep last 7 unique pairs)
    const key = `${name1.trim().toLowerCase()}::${name2.trim().toLowerCase()}`;
    const filtered = history.filter(
      (x) => `${x.a.toLowerCase()}::${x.b.toLowerCase()}` !== key
    );
    const next: Pair = { a: name1.trim(), b: name2.trim(), score: computed.p, at: Date.now() };
    setHistory([next, ...filtered].slice(0, 7));
  }

  function loadPair(p: Pair) {
    setName1(p.a);
    setName2(p.b);
    setScore(p.score);
  }

  async function copyResult() {
    try {
      const txt = `💘 ${name1} + ${name2} = ${score}% — ${messageForScore(score ?? 0)}`;
      await navigator.clipboard.writeText(txt);
      alert("Result copied!");
    } catch {
      alert("Could not copy, sorry!");
    }
  }

  const pct = score == null ? 0 : Math.min(100, Math.max(0, score));
  const chip = chipForScore(score ?? 0);

  return (
    <main
      className="min-h-screen text-stone-800
                 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm px-3 py-1.5 rounded-lg
                       bg-amber-50 text-amber-800 border border-amber-200
                       hover:bg-amber-100"
          >
            ← Back
          </Link>

          <div className="text-sm text-stone-600">
            Fun & local-only • No data leaves your browser
          </div>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calculator Card */}
          <section
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <h1 className="text-3xl font-extrabold text-stone-900">Love Calculator</h1>
            <p className="mt-1 text-stone-600">
              A playful compatibility check—purely for fun. Results are deterministic for the same names.
            </p>

            <form onSubmit={onCalculate} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm text-stone-700 mb-1">Your name</label>
                <input
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-700 mb-1">Crush’s name</label>
                <input
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="e.g. Sam"
                  className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-stone-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white bg-rose-500 hover:bg-rose-400"
                >
                  Calculate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName1("");
                    setName2("");
                    setScore(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 text-stone-700 hover:bg-amber-50"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Result */}
            <div className="mt-6 rounded-xl border border-amber-200 bg-white/70 p-4">
              <div className="flex items-end gap-3 flex-wrap">
                <div className="text-4xl font-extrabold text-stone-900 tabular-nums">
                  {score ?? "--"}%
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${chip.className}`}
                >
                  {score == null ? "—" : chip.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-stone-200/70 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 via-rose-400 to-amber-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-stone-500">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              {/* Message & idea */}
              {score != null && (
                <>
                  <p className="mt-3 text-stone-800">{messageForScore(score)}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Date idea: <span className="text-stone-900">{ideaForScore(score)}</span>
                  </p>
                </>
              )}

              {/* Traits */}
              {computed && (
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  <MiniMeter label="Communication" value={computed.comm} />
                  <MiniMeter label="Chemistry" value={computed.chem} />
                  <MiniMeter label="Stability" value={computed.stab} />
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={copyResult}
                  className="px-3 py-1.5 rounded-lg text-sm text-stone-700 border border-amber-200 hover:bg-amber-50"
                >
                  Copy result
                </button>
                {score != null && (
                  <span className="text-xs text-stone-500">
                    Saved to recent below · only on this device
                  </span>
                )}
              </div>
            </div>

            {/* Recent pairs */}
            {history.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-semibold text-stone-800 mb-2">Recent pairs</div>
                <div className="space-y-2">
                  {history.map((h) => (
                    <button
                      key={`${h.a}-${h.b}-${h.at}`}
                      onClick={() => loadPair(h)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-amber-200 bg-white/60 hover:bg-amber-50/60"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-stone-800">
                          {h.a} <span className="opacity-60">+</span> {h.b}
                        </div>
                        <div className="text-sm font-medium text-stone-900">{h.score}%</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Tips / Extras */}
          <aside
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <h2 className="text-xl font-semibold text-stone-900">Sweet Tips</h2>
            <ul className="mt-3 space-y-3 text-stone-700 text-sm leading-relaxed">
              <li className="rounded-lg border border-rose-200/60 bg-rose-50/50 p-3">
                💬 Great couples practice curious listening—ask a follow-up question.
              </li>
              <li className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-3">
                🎯 Pick one tiny ritual (good-morning text, mid-day meme) and be consistent.
              </li>
              <li className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-3">
                😂 Shared humor is glue—collect inside jokes and silly photos.
              </li>
              <li className="rounded-lg border border-blue-200/60 bg-blue-50/50 p-3">
                🧭 Healthy boundaries = more comfort, not less. Talk about them early.
              </li>
            </ul>

            <div className="mt-5 text-xs text-stone-500">
              This tool is for fun. Real compatibility grows with time, communication, and care.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ---------- Subcomponent: Mini meter ---------- */
function MiniMeter({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="rounded-lg border border-amber-200 bg-white/60 p-3">
      <div className="text-xs text-stone-600 mb-1">{label}</div>
      <div className="h-1.5 w-full rounded-full bg-stone-200/70 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-stone-600">{pct}%</div>
    </div>
  );
}
