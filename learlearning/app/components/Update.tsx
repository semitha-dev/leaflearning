"use client";

import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Sparkles,
  CheckSquare,
  LayoutGrid,
  ArrowRight,
  Megaphone,
  Vote,
  UserPlus,
  FileText,
} from "lucide-react";

/* ================= Types ================= */
type NoteItem = {
  title: string;
  points: string[];
  ctaText?: string;
  ctaHref?: string;
  icon?: React.ReactNode;
};

type WhatsNewProps = {
  version: string; // bump this when you want to show again
  notes?: NoteItem[];
};

/* ================= Defaults ================= */
const DEFAULT_NOTES: NoteItem[] = [
  {
    title: "Home page redesign",
    icon: <LayoutGrid className="h-5 w-5 text-pink-500" />,
    points: [
      "Warm gradient background with softer edges.",
      "Cleaner hero typography and calmer card styling.",
      "Subtle borders + lighter shadows for a friendlier look.",
    ],
    ctaText: "See home",
    ctaHref: "/",
  },
  {
    title: "List page updates",
    icon: <CheckSquare className="h-5 w-5 text-emerald-500" />,
    points: [
      "Sidebar buttons & priority filters fully working (local-only).",
      "Color palette aligned with the whole site.",
      "Inline quick-add with due date & priority, plus one-click priority cycle.",
    ],
    ctaText: "Open tasks",
    ctaHref: "/tools/list",
  },
  {
    title: "About & Contact — redesigned",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
    points: [
      "New layout, copy, and cards that match the site palette.",
      "Gentle motion and focus on clarity & warmth.",
    ],
    ctaText: "Read About",
    ctaHref: "/about",
  },
  {
    title: "Vote — help choose what we build next",
    icon: <Vote className="h-5 w-5 text-violet-500" />,
    points: [
      "New ‘Vote’ in the top navbar to upvote ideas.",
      "Local duplicate-vote protection using your user id.",
    ],
    ctaText: "Cast a vote",
    ctaHref: "/vote",
  },
  {
    title: "Announcements — official updates with comments",
    icon: <Megaphone className="h-5 w-5 text-orange-500" />,
    points: [
      "Check the ‘Announcements’ tab in the top nav for new releases.",
      "Comment on each announcement to share feedback.",
    ],
    ctaText: "See announcements",
    ctaHref: "/announcements",
  },
  {
    title: "Login & Sign up",
    icon: <UserPlus className="h-5 w-5 text-gray-600" />,
    points: [
      "Added authentication so you can keep progress and participate.",
      "Google OAuth supported; email/password works too.",
    ],
    ctaText: "Sign in",
    ctaHref: "/login",
  },
];

/* ================= Component ================= */
export default function WhatsNew({ version, notes = DEFAULT_NOTES }: WhatsNewProps) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Run only on client
  React.useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    // Check if this version was already seen
    const seenKey = `whatsnew:${version}`;
    const seen = window.localStorage.getItem(seenKey);
    if (!seen) {
      setOpen(true); // open if not seen
    }
  }, [version]);

  const acknowledge = () => {
    const seenKey = `whatsnew:${version}`;
    try {
      window.localStorage.setItem(seenKey, "true");
    } catch {}
    setOpen(false);
  };

  if (!mounted || !open) return null;

  const modal = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={acknowledge}
      />

      {/* Centered modal */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="What’s new"
          className="w-[min(92vw,600px)] max-h-[75vh]
                     rounded-2xl overflow-hidden relative
                     bg-gradient-to-br from-pink-50 via-blue-50 to-emerald-50
                     shadow-2xl border border-gray-200
                     flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white/70 backdrop-blur-md">
            <div className="inline-flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-pink-100 grid place-items-center border border-pink-200 text-pink-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">What’s new</div>
                <div className="text-xs text-gray-600">Updated {version}</div>
              </div>
            </div>
            <button
              className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={acknowledge}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {notes.map((n, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  {n.icon}
                  <div className="font-medium text-gray-900">{n.title}</div>
                </div>
                <ul className="list-disc pl-6 text-[15px] leading-relaxed text-gray-700 space-y-1">
                  {n.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                {n.ctaText && n.ctaHref && (
                  <a
                    href={n.ctaHref}
                    className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {n.ctaText} <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="px-5 py-3 border-t border-gray-200 bg-white/70 backdrop-blur-md flex justify-end gap-2">
            <button
              onClick={acknowledge}
              className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Dismiss
            </button>
            <button
              onClick={acknowledge}
              className="px-3 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
