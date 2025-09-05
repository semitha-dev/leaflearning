'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Coins } from 'lucide-react';

type DonationNoticeProps = {
  current?: number;          // default 4
  target?: number;           // default 100
  donateHref?: string;       // default '/donation'
  storageKeyPrefix?: string; // localStorage key prefix
  className?: string;        // optional extra classes
};

export default function DonationNotice({
  current = 0,
  target = 100,
  donateHref = '/donation',
  storageKeyPrefix = 'll_donate_banner',
  className = '',
}: DonationNoticeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // Per-day dismissal key (YYYY-MM-DD)
  const todayKey = useMemo(() => {
    const t = new Date();
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    return `${storageKeyPrefix}_dismissed_${y}-${m}-${d}`;
  }, [storageKeyPrefix]);

  // Show only if not dismissed today, and never on the donation page
  useEffect(() => {
    if (pathname === donateHref) {
      setVisible(false);
      return;
    }
    const dismissed = typeof window !== 'undefined' ? localStorage.getItem(todayKey) : '1';
    setVisible(!dismissed);
  }, [todayKey, pathname, donateHref]);

  const dismissToday = () => {
    try { localStorage.setItem(todayKey, '1'); } catch {}
  };

  const handleLater = () => {
    dismissToday();
    setVisible(false);
  };

  const handleSure = (e: React.MouseEvent) => {
    e.preventDefault();
    dismissToday();
    setVisible(false);       // hide immediately
    router.push(donateHref); // then navigate
  };

  if (!visible) return null;

  const pct = Math.max(0, Math.min(100, Math.round((current / Math.max(1, target)) * 100)));

  return (
    <div className={`sticky top-0 z-40 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-3 rounded-2xl border border-amber-200 bg-white/90 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
            {/* Left: message */}
            <div className="flex items-start md:items-center gap-3 text-stone-800">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100 border border-amber-200 grid place-items-center text-amber-900">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">
                  We need your help — donations keep LeafLearning free.
                </p>
                <p className="text-sm text-stone-700">
                  Chip in today and help us reach our monthly goal.
                </p>
              </div>
            </div>

            {/* Middle: progress */}
            <div className="md:min-w-[320px]">
              <div className="flex items-center justify-between text-xs text-stone-700 mb-1">
                <span>
                  Support: <span className="font-medium text-stone-900">{current}</span> / {target}
                </span>
                <span>{pct}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-amber-100 border border-amber-200 overflow-hidden">
                <div
                  className="h-full bg-amber-600"
                  style={{ width: `${pct}%` }}
                  aria-label={`Progress ${pct}%`}
                />
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <Link
                href={donateHref}
                onClick={handleSure}
                className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-white text-sm font-medium hover:bg-amber-500 transition-colors shadow-sm"
              >
                Sure
              </Link>
              <button
                onClick={handleLater}
                className="inline-flex items-center justify-center rounded-xl bg-white/80 ring-1 ring-amber-200 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-white/90 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
