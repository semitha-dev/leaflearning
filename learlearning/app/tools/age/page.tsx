"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ---------- Helpers ---------- */
function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function diffYMD(from: Date, to: Date) {
  // Calculates calendar years, months, days between two dates (from <= to)
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();

  if (d < 0) {
    // borrow days from previous month
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0); // last day of previous month
    d += prevMonth.getDate();
    m -= 1;
  }
  if (m < 0) {
    m += 12;
    y -= 1;
  }
  return { years: y, months: m, days: d };
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function nextBirthday(birth: Date, now = new Date()) {
  const thisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (thisYear >= startOfDay(now)) return thisYear;
  return new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function sunSign(d: Date) {
  // Simple zodiac by month/day (Western)
  const m = d.getMonth() + 1;
  const day = d.getDate();
  // boundaries (inclusive of start date)
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return "Aries ♈";
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return "Taurus ♉";
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return "Gemini ♊";
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return "Cancer ♋";
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return "Leo ♌";
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return "Virgo ♍";
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return "Libra ♎";
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return "Scorpio ♏";
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return "Sagittarius ♐";
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return "Capricorn ♑";
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return "Aquarius ♒";
  return "Pisces ♓";
}

type Snap = { date: string; at: number };

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [history, setHistory] = useState<Snap[]>([]);
  const [now, setNow] = useState<Date>(new Date());

  // Tick "now" every 1s for live counters (subtle but nice)
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load persisted
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("age_calc_state") || "{}");
      if (saved.birthDate) setBirthDate(saved.birthDate);
      if (Array.isArray(saved.history)) setHistory(saved.history);
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("age_calc_state", JSON.stringify({ birthDate, history }));
    } catch {}
  }, [birthDate, history]);

  const birth = useMemo(() => {
    const d = new Date(birthDate);
    return isNaN(d.getTime()) ? null : d;
  }, [birthDate]);

  const breakdown = useMemo(() => {
    if (!birth) return null;
    const a = startOfDay(birth);
    const b = startOfDay(now);
    if (a > b) return null;
    return diffYMD(a, b);
  }, [birth, now]);

  const totals = useMemo(() => {
    if (!birth) return null;
    const ms = now.getTime() - birth.getTime();
    if (ms < 0) return null;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(ms / 3600000);
    const days = Math.floor(ms / 86400000);
    const weeks = Math.floor(days / 7);
    const monthsApprox = Math.floor(days / 30.4375);
    return { seconds, minutes, hours, days, weeks, monthsApprox };
  }, [birth, now]);

  const nextBdayInfo = useMemo(() => {
    if (!birth) return null;
    const nx = nextBirthday(birth, now);
    const daysLeft = Math.ceil((startOfDay(nx).getTime() - startOfDay(now).getTime()) / 86400000);
    return { date: nx, daysLeft };
  }, [birth, now]);

  const bornWeekday = useMemo(() => (birth ? WEEKDAYS[birth.getDay()] : ""), [birth]);
  const sign = useMemo(() => (birth ? sunSign(birth) : ""), [birth]);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    if (!birth) return;
    // update recent checks (unique & last 6)
    const filtered = history.filter((h) => h.date !== birthDate);
    setHistory([{ date: birthDate, at: Date.now() }, ...filtered].slice(0, 6));
  }

  async function copySummary() {
    if (!birth || !breakdown || !totals) return;
    const nx = nextBdayInfo!.date;
    const text = `🎂 Age summary
Born: ${birth.toDateString()} (${bornWeekday})
Zodiac: ${sign}
Age: ${breakdown.years}y ${breakdown.months}m ${breakdown.days}d
Total: ${totals.days.toLocaleString()} days (${totals.hours.toLocaleString()} hours)
Next birthday: ${nx.toDateString()} (${nextBdayInfo!.daysLeft} days)
— generated by LeafLearning Age Calculator`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied summary!");
    } catch {
      alert("Could not copy, sorry!");
    }
  }

  const progressToNext = useMemo(() => {
    if (!birth) return 0;
    const lastBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    const nextBday = nextBirthday(birth, now);
    const span = nextBday.getTime() - lastBday.getTime();
    const done = now.getTime() - lastBday.getTime();
    const pct = Math.min(100, Math.max(0, (done / span) * 100));
    return pct;
  }, [birth, now]);

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
            Private & local-only • No data leaves your browser
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calculator */}
          <section
            className="rounded-2xl border border-amber-200 bg-white/80 backdrop-blur
                       shadow-[0_2px_20px_rgba(253,230,138,0.25)] p-5"
          >
            <h1 className="text-3xl font-extrabold text-stone-900">Age Calculator</h1>
            <p className="mt-1 text-stone-600">
              Get your exact age, next birthday, and a playful snapshot of your time on Earth.
            </p>

            <form onSubmit={calculate} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm text-stone-700 mb-1">Birth date</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-lg border border-amber-200 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300 text-stone-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white bg-rose-500 hover:bg-rose-400"
                  disabled={!birthDate}
                >
                  Calculate
                </button>
                <button
                  type="button"
                  onClick={() => setBirthDate("")}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 text-stone-700 hover:bg-amber-50"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Results */}
            {birth && breakdown && totals && (
              <div className="mt-6 space-y-4">
                {/* Headline */}
                <div className="rounded-xl border border-amber-200 bg-white/70 p-4">
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="text-4xl font-extrabold text-stone-900">
                      {breakdown.years}
                      <span className="text-stone-500 text-2xl align-super">y</span>{" "}
                      {pad(breakdown.months)}
                      <span className="text-stone-500 text-2xl align-super">m</span>{" "}
                      {pad(breakdown.days)}
                      <span className="text-stone-500 text-2xl align-super">d</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {WEEKDAYS[birth.getDay()]} • {sunSign(birth)}
                    </span>
                  </div>

                  {/* Progress to next birthday */}
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-stone-200/70 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 via-rose-400 to-amber-400"
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-stone-600">
                      Next birthday in{" "}
                      <span className="font-medium text-stone-800">
                        {nextBdayInfo?.daysLeft ?? "--"} days
                      </span>{" "}
                      • {nextBdayInfo?.date.toDateString()}
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <InfoCard label="Days lived" value={totals.days.toLocaleString()} />
                  <InfoCard label="Hours lived" value={totals.hours.toLocaleString()} />
                  <InfoCard label="Weeks lived" value={totals.weeks.toLocaleString()} />
                </div>

                {/* Copy & recent */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={copySummary}
                    className="px-3 py-1.5 rounded-lg text-sm text-stone-700 border border-amber-200 hover:bg-amber-50"
                  >
                    Copy summary
                  </button>
                  <span className="text-xs text-stone-500">
                    Tip: times update live using your device clock
                  </span>
                </div>
              </div>
            )}

            {/* Recent checks */}
            {history.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-semibold text-stone-800 mb-2">Recent dates</div>
                <div className="space-y-2">
                  {history.map((h) => (
                    <button
                      key={`${h.date}-${h.at}`}
                      onClick={() => setBirthDate(h.date)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-amber-200 bg-white/60 hover:bg-amber-50/60"
                    >
                      <div className="text-sm text-stone-800">{h.date}</div>
                      <div className="text-xs text-stone-500">
                        Checked {new Date(h.at).toLocaleString()}
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
            <h2 className="text-xl font-semibold text-stone-900">Helpful Tips</h2>
            <ul className="mt-3 space-y-3 text-stone-700 text-sm leading-relaxed">
              <li className="rounded-lg border border-blue-200/60 bg-blue-50/50 p-3">
                📅 Leap years and different month lengths are handled using calendar math for the Y/M/D breakdown.
              </li>
              <li className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-3">
                🕒 Times are based on your device&apos;s local timezone, updating every second.
              </li>
              <li className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 p-3">
                🔒 Everything runs in your browser—no servers, no tracking.
              </li>
              <li className="rounded-lg border border-rose-200/60 bg-rose-50/50 p-3">
                🎉 Planning ahead? Use the next-birthday counter to set reminders.
              </li>
            </ul>

            <div className="mt-5 text-xs text-stone-500">
              Psst—curious about milestones? You hit 10,000 days at around age 27y 4m; 20,000 days at ~54y 9m.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ---------- Subcomponents ---------- */
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-white/60 p-4">
      <div className="text-xs text-stone-600">{label}</div>
      <div className="mt-0.5 text-lg font-semibold text-stone-900 tabular-nums">{value}</div>
    </div>
  );
}
