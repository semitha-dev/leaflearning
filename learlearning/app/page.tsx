'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Star,
  ChevronRight,
  Sparkles,
  Search,
  LayoutGrid,
  Rocket,
  ShieldCheck,
  RefreshCcw,
} from 'lucide-react'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

// Supabase auth (to mirror Vote nav)
import { createClient } from '@supabase/supabase-js'
import NavBar from './components/Navbar'
import Update from './components/Update'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ===== Types =====
interface Tool {
  title: string
  href: string
  popular: boolean
  description: string
}
interface GroupedTools {
  [key: string]: Tool[]
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [allTools, setAllTools] = useState<Tool[]>([])
  const [me, setMe] = useState<{ id: string } | null>(null)

  // --- auth state for matching nav ---
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (mounted) setMe(user ? { id: user.id } : null)
    })()
    return () => { mounted = false }
  }, [])
  async function signIn() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) console.error(error.message)
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error.message)
    setMe(null)
  }

  // ===== Data =====
  const tools: Tool[] = [
    { title: 'BMI Calculator', href: '/tools/bmi', popular: true, description: 'Calculate your Body Mass Index (BMI) from height and weight with instant ranges.' },
    { title: 'Love Calculator', href: '/tools/love', popular: true, description: 'Playful compatibility score based on names. Shareable for fun!' },
    { title: 'Age Calculator', href: '/tools/age', popular: true, description: 'Exact age across years, months, weeks, and days between any two dates.' },
    { title: 'Random Name Generator', href: '/tools/name', popular: false, description: 'Generate names for characters, babies, or usernames with style options.' },
    { title: 'Password Generator', href: '/tools/password', popular: false, description: 'Create strong, customizable passwords to boost your account security.' },
    { title: 'QR Code Generator', href: '/tools/qrcode', popular: true, description: 'Turn URLs or text into crisp QR codes ready for print or screens.' },
    { title: 'Unit Converter', href: '/tools/unit-converter', popular: true, description: 'Convert length, weight, volume, temperature, and more with precision.' },
    { title: 'Text to Speech', href: '/tools/text-to-speech', popular: false, description: 'Natural-sounding speech from text with multiple voices and languages.' },
    { title: 'Color Picker', href: '/tools/color-picker', popular: false, description: 'Pick and save colors with HEX, RGB, and HSL values. Generate palettes.' },
    { title: 'Word Counter', href: '/tools/word-counter', popular: false, description: 'Count words, characters, sentences, and paragraphs instantly.' },
    { title: 'Text Case Converter', href: '/tools/text-case-converter', popular: false, description: 'Toggle uppercase, lowercase, title case, sentence case, and more.' },
    { title: 'Markdown Previewer', href: '/tools/markdown-previewer', popular: false, description: 'Live preview for Markdown before you publish on GitHub or Reddit.' },
    { title: 'Todo List', href: '/tools/list', popular: true, description: 'Plan and prioritize tasks with a lightweight, minimal UI.' },
    { title: 'IP Address Finder', href: '/tools/ip-finder', popular: false, description: 'See your IP address plus basic connection/geo details.' },
    { title: 'JSON Formatter', href: '/tools/json-formatter', popular: false, description: 'Format and validate JSON to make debugging painless.' },
    { title: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum', popular: false, description: 'Generate placeholder text for designs and content mocks.' },
    { title: 'Epoch Time Converter', href: '/tools/epoch-converter', popular: false, description: 'Convert Unix timestamps to human-readable dates and times.' },
    { title: 'Online Stopwatch', href: '/tools/stopwatch', popular: false, description: 'Accurate stopwatch/timer with laps for workouts or cooking.' },
  ]
  useEffect(() => { setAllTools(tools) }, [])

  // ===== Derived state =====
  const filteredTools = useMemo(() => {
    if (!searchTerm) return allTools
    const q = searchTerm.toLowerCase()
    return allTools.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    )
  }, [allTools, searchTerm])

  const groupedTools: GroupedTools = useMemo(() => {
    return filteredTools.reduce((acc: GroupedTools, tool) => {
      const letter = tool.title[0].toUpperCase()
      acc[letter] ||= []
      acc[letter].push(tool)
      return acc
    }, {})
  }, [filteredTools])

  const popular = useMemo(() => filteredTools.filter((t) => t.popular), [filteredTools])

  // ===== Animations =====
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      {/* ===== Header (same as Vote) ===== */}
     

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-[-15%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute right-[-10%] top-[-15%] h-[22rem] w-[22rem] rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-amber-50/70 to-transparent" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200" variant="secondary">
              <Sparkles className="h-4 w-4 mr-1" /> Core tools with a cozy touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-stone-900">
              Tools that feel like <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">home</span>
            </h1>
            <p className="mt-4 text-stone-700 text-lg">
              Simple, friendly utilities with a warm touch. Built for everyday life.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tools…"
                  className="pl-10 h-12 rounded-2xl border-stone-300 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus-visible:ring-amber-500"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-700 hover:text-stone-900"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <p className="mt-2 text-xs text-stone-500">Tip: try "JSON", "age", or "QR"</p>
            </div>
          </motion.div>

          {/* Quick value props */}
          <motion.div {...fadeUp} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValueProp icon={<ShieldCheck className="h-5 w-5" />} title="Private by design" desc="Most tools run right in your browser." />
            <ValueProp icon={<Rocket className="h-5 w-5" />} title="Feels effortless" desc="Gentle motion, humane defaults, zero clutter." />
            <ValueProp icon={<RefreshCcw className="h-5 w-5" />} title="Always cared for" desc="Small improvements ship often." />
          </motion.div>
        </div>
      </section>

      {/* ===== Popular ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Popular tools</h2>
          <Button asChild variant="outline" className="rounded-full border-amber-300 bg-amber-200 text-stone hover:bg-amber-100">
            <Link href="#all-tools">
              <LayoutGrid className="h-4 w-4 mr-2" /> See all
            </Link>
          </Button>
        </div>

        {popular.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular.slice(0, 6).map((tool) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <ToolCard tool={tool} featured />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState label="No popular tools match your search." />
        )}
      </section>

      {/* ===== All tools (A–Z) ===== */}
      <section id="all-tools" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 mb-6">
          {searchTerm ? 'Search results' : 'All tools'}
        </h2>

        {Object.keys(groupedTools).length ? (
          Object.keys(groupedTools)
            .sort()
            .map((letter) => (
              <div key={letter} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-900 grid place-items-center font-semibold ring-1 ring-amber-200">
                    {letter}
                  </div>
                  <div className="h-px flex-1 bg-amber-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedTools[letter].map((tool) => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </div>
            ))
        ) : (
          <EmptyState label="No tools found. Try a different keyword." />
        )}
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-amber-50/70 text-stone-800 border-t border-amber-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">About</h3>
              <p className="mt-3 text-stone-700">
                Free, friendly utilities for everyday tasks — designed to feel welcoming.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Links</h3>
              <div className="mt-3 flex flex-col gap-2 text-stone-700">
                <Link className="hover:text-stone-900" href="/about">About</Link>
                <Link className="hover:text-stone-900" href="/contact">Contact</Link>
                <Link className="hover:text-stone-900" href="/privacy">Privacy</Link>
                <Link className="hover:text-stone-900" href="/terms">Terms</Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Support</h3>
              <p className="mt-3 text-stone-700">If you enjoy these tools, share them with a friend. ☕</p>
              <Button asChild variant="secondary" className="mt-4 bg-amber-600 text-white hover:bg-amber-500">
                <Link href="/contact">Suggest a tool</Link>
              </Button>
            </div>
          </div>
          <div className="mt-10 border-t border-amber-200 pt-6 text-center text-stone-600 text-sm">
            © {new Date().getFullYear()} LeafLearningOfficial. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ===== Components ===== */
function ToolCard({ tool, featured = false }: { tool: Tool; featured?: boolean }) {
  return (
    <Link href={tool.href} className="group">
      <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${featured ? 'border-2 border-amber-300/80' : 'border border-amber-200'} bg-white/80` }>
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-amber-100/60 to-rose-100/60" />
        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="tracking-tight text-stone-900">{tool.title}</CardTitle>
              <CardDescription className="mt-1 text-stone-600">{tool.description}</CardDescription>
            </div>
            {featured && (
              <Badge variant="secondary" className="shrink-0 bg-amber-100 text-amber-900 border border-amber-200">
                <Star className="h-4 w-4 mr-1 text-amber-600" /> Popular
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="mt-2 flex items-center justify-between text-sm text-stone-600">
            <span>Free to use</span>
            <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform text-stone-700">
              Open <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ValueProp({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border border-amber-200 bg-white/80">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-100 grid place-items-center border border-amber-200 text-amber-900">{icon}</div>
          <div>
            <div className="font-semibold text-stone-900">{title}</div>
            <div className="text-stone-600 text-sm mt-1">{desc}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-amber-300 p-10 text-center text-stone-600 bg-white/70">
      <Search className="mx-auto mb-3 h-6 w-6 text-amber-700" />
      {label}
    </div>
  )
}
