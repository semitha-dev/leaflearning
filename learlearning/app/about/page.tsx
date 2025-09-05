'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Code, Sparkles, Globe, Calendar, Shield, Zap, HeartHandshake } from 'lucide-react'
import NavBar from '../components/Navbar'


export default function About() {
  const fadeUp = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      {/* Nav */}


      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-[-12%] top-[-12%] h-[24rem] w-[24rem] rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute right-[-10%] top-[-15%] h-[22rem] w-[22rem] rounded-full bg-amber-200/40 blur-3xl" />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900">
            About Our Mission
          </motion.h1>
          <motion.p {...fadeUp} className="mt-4 text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto">
            All the handy tools you need, in one warm and welcoming place — always free.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div {...fadeUp} className="bg-white/90 rounded-2xl border border-amber-200 p-8 shadow-[0_2px_20px_rgba(253,230,138,0.25)]">
          <h2 className="text-3xl font-bold text-stone-900 mb-6">Our Story</h2>
          <div className="space-y-5 text-stone-700 text-lg">
            <p>
              LeafLearning started with a simple idea: useful digital tools shouldn’t be scattered or paywalled. We’re gathering
              everyday utilities under one roof so you can focus on the task, not the tabs.
            </p>
            <p>
              We design for clarity and calm. That means friendly interfaces, privacy‑first choices, and performance that feels effortless.
              It also means keeping everything free: we cover costs with light, non‑intrusive ads.
            </p>
            <p>
              If our tools help you, the kindest way to support us is to keep your ad‑blocker off here or share the site with a friend.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Tools Available" value="18+" accent="text-amber-700" />
          <StatCard label="Free to Use" value="100%" accent="text-rose-700" />
          <StatCard label="Uptime" value="24/7" accent="text-emerald-700" />
        </div>
      </section>

      {/* Principles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Principle icon={<Shield className="h-6 w-6" />} title="Privacy‑first" desc="Where possible, work happens in your browser." />
          <Principle icon={<Zap className="h-6 w-6" />} title="Fast by default" desc="Snappy, accessible, and distraction‑free." />
          <Principle icon={<HeartHandshake className="h-6 w-6" />} title="People over pixels" desc="Warm tone, humane choices, clear copy." />
        </motion.div>
      </section>

      {/* Roadmap / Coming Soon */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div {...fadeUp} className="bg-white/90 rounded-2xl border border-amber-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-stone-900">Coming Soon</h2>
            <Link href="/contact" className="inline-flex items-center text-amber-700 hover:text-amber-800">
              Suggest a tool <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard icon={<Code className="h-7 w-7 text-amber-700" />} title="Code Formatter" description="Beautify and format code in many languages with smart options." />
            <FeatureCard icon={<Globe className="h-7 w-7 text-rose-700" />} title="Language Translator" description="Fast, readable translations across 50+ languages." />
            <FeatureCard icon={<Calendar className="h-7 w-7 text-emerald-700" />} title="Date Duration" description="Measure time between dates in days, weeks, months, years." />
            <FeatureCard icon={<Shield className="h-7 w-7 text-stone-700" />} title="File Encryption" description="Protect files with strong, local‑first encryption." />
            <FeatureCard icon={<Sparkles className="h-7 w-7 text-fuchsia-700" />} title="AI Summarizer" description="Condense long docs and articles into clear summaries." />
            <FeatureCard icon={<Zap className="h-7 w-7 text-indigo-700" />} title="Image Optimizer" description="Compress images for the web without visible quality loss." />
          </div>
          <p className="mt-6 text-stone-700">
            Have an idea we should build next? Visit our{' '}
            <Link href="/contact" className="text-amber-700 underline hover:text-amber-800">Contact page</Link>{' '}
            and drop a note.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-50/70 text-stone-800 border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2 text-stone-900">About Us</h3>
              <p className="text-stone-700">We build friendly, free tools to help with everyday tasks.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-stone-900">Quick Links</h3>
              <ul className="space-y-2 text-stone-700">
                <li><Link href="/about" className="hover:text-stone-900">About</Link></li>
                <li><Link href="/contact" className="hover:text-stone-900">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-stone-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-stone-900">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-stone-900">Connect</h3>
              <div className="flex space-x-4 text-stone-700">
                <a href="#" className="hover:text-stone-900">Twitter</a>
                <a href="#" className="hover:text-stone-900">Facebook</a>
                <a href="#" className="hover:text-stone-900">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-amber-200 mt-8 pt-6 text-center">
            <p className="text-stone-600">© {new Date().getFullYear()} LeafLearningOfficial. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

// ===== Components =====
function StatCard({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <div className="bg-white/90 rounded-2xl border border-amber-200 p-8 text-center shadow-sm">
      <div className={`text-4xl font-extrabold ${accent ?? 'text-amber-700'} mb-1`}>{value}</div>
      <div className="text-stone-700 text-lg">{label}</div>
    </div>
  )
}

function Principle({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white/90 rounded-2xl border border-amber-200 p-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-1">{title}</h3>
          <p className="text-stone-700">{desc}</p>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps { icon: React.ReactNode; title: string; description: string }
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/90 rounded-2xl border border-amber-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-1">{title}</h3>
          <p className="text-stone-700">{description}</p>
        </div>
      </div>
    </div>
  )
}
