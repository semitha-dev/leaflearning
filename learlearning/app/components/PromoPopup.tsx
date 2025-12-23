"use client";

import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Sparkles,
  Brain,
  Zap,
  BookOpen,
  FileText,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* ================= Types ================= */
type PromoPopupProps = {
  version: string; // bump this when you want to show again
};

/* ================= Component ================= */
export default function PromoPopup({ version }: PromoPopupProps) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const STORAGE_KEY = `ll_promo_seen_v${version}`;

  React.useEffect(() => {
    setMounted(true);
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [STORAGE_KEY]);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const handleCheckout = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.open("https://www.leaflearning.app/", "_blank");
    setOpen(false);
  };

  if (!mounted || !open) return null;

  const features = [
    {
      icon: <FileText className="h-5 w-5 text-emerald-500" />,
      title: "AI Summarizer",
      desc: "Summarize papers with citations",
    },
    {
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      title: "Flashcard Generator",
      desc: "Auto-generate from PDFs",
    },
    {
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      title: "Exam Planner",
      desc: "Smart scheduling with spaced repetition",
    },
    {
      icon: <Brain className="h-5 w-5 text-pink-500" />,
      title: "Quiz Maker",
      desc: "Create quizzes with instant feedback",
    },
  ];

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-2xl border border-emerald-100 animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-200/40 rounded-full blur-3xl" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-stone-500" />
        </button>

        {/* Content */}
        <div className="relative p-6 sm:p-8">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              NEW LAUNCH
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 flex items-center gap-2">
              <span className="text-emerald-600">🍃</span> LeafLearning AI
            </h2>
            <p className="text-stone-600 text-lg">
              Study smarter with AI. Learn <span className="font-semibold text-emerald-600">10X faster</span>.
            </p>
          </div>

          {/* Description */}
          <p className="text-stone-600 mb-6">
            Your AI-powered study companion. Summarize papers, generate flashcards, create quizzes, 
            and build smart study schedules — all in one place.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-stone-100 hover:border-emerald-200 transition-colors"
              >
                <div className="shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <p className="font-medium text-stone-800 text-sm">{f.title}</p>
                  <p className="text-xs text-stone-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 mb-6">
            <Zap className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Free Forever Plan</span> — Get 500 free tokens on signup. All features unlocked!
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["AI-Powered", "Privacy-First", "Fast UI", "Mobile Friendly"].map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {b}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCheckout}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02] transition-all"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
            >
              Maybe later
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-stone-400 mt-4">
            From the makers of Leaf Learning Tools
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
