'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Coffee,
  ExternalLink,
  Heart,
  ShieldCheck,
  Sparkles,
  Share2,
  Coins,
  Mail,
} from 'lucide-react'
import NavBar from '../components/Navbar'

const BMC_URL = 'https://buymeacoffee.com/leaflearning'

export default function DonatePage() {
  const [copied, setCopied] = useState(false)

  // Same animation feel as your Contact page
  const fadeUp = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(BMC_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  // Optional: simple goal (edit these numbers anytime)
  const goal = { current: 4, target: 100 } // e.g., “100 coffees” goal
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
     <NavBar/>
      {/* Hero */}
      <section className="relative z-0 overflow-visible">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-[-12%] top-[-12%] h-[24rem] w-[24rem] rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute right-[-10%] top-[-15%] h-[22rem] w-[22rem] rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-amber-50/70 to-transparent" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <motion.h1
            {...fadeUp}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900"
          >
            Support LeafLearning
          </motion.h1>
          <motion.p
            {...fadeUp}
            className="mt-4 text-lg md:text-xl text-stone-700 max-w-3xl mx-auto"
          >
            All the handy tools you need, in one warm and welcoming place — always free.
            If our tools help you, a coffee keeps the lights on ☕
          </motion.p>

          <motion.div {...fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={BMC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-500 transition-colors shadow-sm"
            >
              <Coffee className="h-5 w-5" />
              Buy me a coffee
              <ExternalLink className="h-4 w-4 opacity-90" />
            </a>
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/80 ring-1 ring-amber-200 text-stone-800 font-medium hover:bg-amber-50 transition-colors shadow-sm"
            >
              <Share2 className="h-5 w-5" />
              {copied ? 'Link copied!' : 'Copy donation link'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card: Why donate */}
          <motion.div
            {...fadeUp}
            className="lg:col-span-2 bg-white/90 rounded-2xl border border-amber-200 p-6"
          >
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Why your coffee matters
            </h2>
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Keep it fast & friendly</p>
                  <p>We design for clarity and calm — your support helps us ship polished, ad-light tools.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Privacy-first choices</p>
                  <p>No shady trackers. Your help lets us keep things respectful and lightweight.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Free forever</p>
                  <p>Our core tools stay free. Donations cover hosting, maintenance, and new feature development.</p>
                </div>
              </li>
            </ul>

            {/* Little goal tracker */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-stone-700 mb-2">
                <span>Monthly Support goal</span>
                <span>
                  <strong className="text-stone-900">{goal.current}</strong> / {goal.target}
                </span>
              </div>
              <div className="h-3 rounded-full bg-amber-100 border border-amber-200 overflow-hidden">
                <div
                  className="h-full bg-amber-600"
                  style={{ width: `${pct}%` }}
                  aria-label={`Progress ${pct}%`}
                />
              </div>
              <p className="mt-2 text-sm text-stone-600">
                Every coffee helps us build the next tool faster.
              </p>
            </div>
          </motion.div>

          {/* Card: Direct support / contact */}
          <motion.div
            {...fadeUp}
            className="bg-white/90 rounded-2xl border border-amber-200 p-6"
          >
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Prefer direct support?
            </h2>
            <p className="text-stone-700">
              You can also reach out for sponsorships, partnerships, or custom tools.
            </p>

            <div className="mt-4 space-y-3">
              <a
                href={BMC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-500 transition-colors shadow-sm"
              >
                <Coffee className="h-5 w-5" />
                Buy me a coffee
                <ExternalLink className="h-4 w-4 opacity-90" />
              </a>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/80 ring-1 ring-amber-200 text-stone-800 font-medium hover:bg-amber-50 transition-colors shadow-sm"
              >
                <Mail className="h-5 w-5" />
                Contact us
              </Link>
            </div>

            <div className="mt-6 rounded-xl bg-amber-50/70 border border-amber-200 p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
                  <Heart className="h-5 w-5" />
                </div>
                <p className="text-stone-800">
                  Thanks for keeping LeafLearning free for everyone. You’re the reason this exists ✨
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ / Transparency */}
        <motion.div
          {...fadeUp}
          className="mt-10 bg-white/90 rounded-2xl border border-amber-200 p-6"
        >
          <h2 className="text-xl font-semibold text-stone-900 mb-4">FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-stone-800">
            <div>
              <h3 className="font-medium text-stone-900">Where does the money go?</h3>
              <p className="mt-2 text-stone-700">
                Hosting (Vercel, Supabase), domain, small design/dev costs, and building new tools.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-stone-900">Is this tax-deductible?</h3>
              <p className="mt-2 text-stone-700">
                No—LeafLearning isn’t a nonprofit. Think of it as fueling indie dev work.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-stone-900">Can I sponsor a specific tool?</h3>
              <p className="mt-2 text-stone-700">
                Yes! Email us with the tool idea or improvement and we’ll chat details.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-stone-900">Other ways to help?</h3>
              <p className="mt-2 text-stone-700">
                Share the site, keep ad-blocker off here, or contribute feedback on the Contact page.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* (Optional) simple footer block to match the vibe */}
      <footer className="bg-amber-50/70 text-stone-800 border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-stone-700">
            Made with love for the internet. Thanks for supporting indie tools 🌿
          </p>
        </div>
      </footer>
    </main>
  )
}
