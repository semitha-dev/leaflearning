'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Mail,
  Clock,
  Calendar,
  Sparkles,
  MessageSquare,
  User,
  HeartHandshake,
} from 'lucide-react'
import NavBar from '../components/Navbar'

export default function Contact() {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  // Safer fade-up that reliably triggers
  const fadeUp = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 }, // <- more reliable than negative margin
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }

  const openEmailClient = () => {
    const to = 'leaflearningoffcial@gmail.com'
    const fullSubject =
      subject.trim() || `Hello${name ? ` from ${name}` : ''} — LeafLearning`
    const body = [
      name ? `Name: ${name}` : '',
      '',
      message || '(Write your message here)',
      '',
      '— Sent from the LeafLearning contact page',
    ]
      .filter(Boolean)
      .join('\n')

    const href = `mailto:${to}?subject=${encodeURIComponent(
      fullSubject
    )}&body=${encodeURIComponent(body)}`
    window.location.href = href
  }

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      {/* Navigation */}
    <NavBar/>

      {/* Hero */}
      <section className="relative z-0 overflow-visible"> {/* new stacking context */}
        {/* Decorative glows placed *behind* content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-0 -z-10" // <- keep behind
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
            Let’s talk
          </motion.h1>
          <motion.p
            {...fadeUp}
            className="mt-4 text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto"
          >
            Questions, ideas, or feedback? We’d love to hear from you.
          </motion.p>
          <motion.div
            {...fadeUp}
            className="mt-6 inline-flex items-center gap-2 text-stone-600"
          >
            <Sparkles className="h-5 w-5 text-amber-600" />
            We reply within 24–48 hours on business days.
          </motion.div>
        </div>
      </section>

      {/* Contact content */}
      <section className="relative z-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card: direct email & hours */}
          <motion.div
            {...fadeUp}
            className="lg:col-span-1 bg-white/90 rounded-2xl border border-amber-200 p-6"
          >
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Contact details
            </h2>

            <div className="space-y-4">
              <a
                href="mailto:leaflearningoffcial@gmail.com"
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 rounded-xl bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-stone-900 group-hover:underline break-all">
                    leaflearningoffcial@gmail.com
                  </div>
                  <div className="text-sm text-stone-600">
                    Best for general questions & suggestions
                  </div>
                </div>
              </a>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-stone-900 mb-3">
                  Business hours 
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <HoursCard
                    title="Weekdays"
                    icon={<Calendar className="h-5 w-5 text-amber-700" />}
                    time="Mon–Fri · 10:00 AM – 7:00 PM"
                  />
                  <HoursCard
                    title="Weekends"
                    icon={<Calendar className="h-5 w-5 text-rose-700" />}
                    time="Sat–Sun · Closed"
                  />
                </div>
                <p className="mt-4 text-sm text-stone-600">
                  We read everything. If it’s urgent, put “Urgent” in the
                  subject line.
                </p>
              </div>

              <button
                onClick={openEmailClient}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-500 transition-colors shadow-sm"
              >
                <Mail className="h-5 w-5" />
                Write an email
              </button>
            </div>
          </motion.div>

          {/* Card: form that opens mail app */}
          <motion.div
            {...fadeUp}
            className="lg:col-span-2 bg-white/90 rounded-2xl border border-amber-200 p-6"
          >
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Send a message
            </h2>
            <p className="text-stone-700 mb-6">
              This form doesn’t upload anything—your email app opens with your
              message pre-filled so you stay in control.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Your name"
                value={name}
                onChange={setName}
                icon={<User className="h-4 w-4 text-stone-500" />}
                placeholder="e.g., Semitha"
              />
              <Field
                label="Subject"
                value={subject}
                onChange={setSubject}
                icon={<MessageSquare className="h-4 w-4 text-stone-500" />}
                placeholder="What’s this about?"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-stone-800 mb-2">
                Message
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Share your question or idea…"
                  className="w-full rounded-xl border border-amber-200 bg-white/80 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={openEmailClient}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-500 transition-colors shadow-sm"
              >
                <Mail className="h-5 w-5" />
                Open email app
              </button>
              <p className="text-sm text-stone-600">
                We’ll include your name & message automatically.
              </p>
            </div>

            {/* Helper: invisible mailto sync with current fields */}
            <a
              href={`mailto:leaflearningoffcial@gmail.com?subject=${encodeURIComponent(
                subject || (name ? `Hello from ${name}` : 'Hello from LeafLearning')
              )}&body=${encodeURIComponent(
                `${name ? `Name: ${name}\n\n` : ''}${message}\n\n— Sent from the LeafLearning contact page`
              )}`}
              className="sr-only"
            >
              hidden mailto
            </a>
          </motion.div>
        </div>

        {/* Friendly note */}
        <motion.div
          {...fadeUp}
          className="mt-10 bg-amber-50/70 rounded-2xl border border-amber-200 p-6 text-stone-800"
        >
          <div className="max-w-3xl mx-auto flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <p className="text-stone-800">
              We really do read every message. Your ideas help decide which
              tools we build next. Thanks for being here ✨
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-50/70 text-stone-800 border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2 text-stone-900">About Us</h3>
              <p className="text-stone-700">
                We build friendly, free tools to help with everyday tasks.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-stone-900">Quick Links</h3>
              <ul className="space-y-2 text-stone-700">
                <li>
                  <Link href="/about" className="hover:text-stone-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-stone-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-stone-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-stone-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-stone-900">Connect</h3>
              <div className="flex space-x-4 text-stone-700">
                <a href="#" className="hover:text-stone-900">
                  Twitter
                </a>
                <a href="#" className="hover:text-stone-900">
                  Facebook
                </a>
                <a href="#" className="hover:text-stone-900">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-amber-200 mt-8 pt-6 text-center">
            <p className="text-stone-600">
              © {new Date().getFullYear()} LeafLearningOfficial. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ===== Subcomponents ===== */

function Field({
  label,
  value,
  onChange,
  icon,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  icon: React.ReactNode
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-amber-200 bg-white/80 pl-10 pr-3 h-11 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
    </div>
  )
}

function HoursCard({
  title,
  icon,
  time,
}: {
  title: string
  icon: React.ReactNode
  time: string
}) {
  return (
    <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-lg bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">
          {icon}
        </div>
        <h4 className="text-base font-medium text-stone-900">{title}</h4>
      </div>
      <div className="flex items-center gap-2 text-stone-700">
        <Clock className="h-4 w-4 text-stone-500" />
        <p>{time}</p>
      </div>
    </div>
  )
}
