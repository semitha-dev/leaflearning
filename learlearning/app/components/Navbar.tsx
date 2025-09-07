'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ChevronDown } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function NavLink({
  href,
  label,
  current,
}: {
  href: string
  label: string
  current: boolean
}) {
  return current ? (
    <span className="px-3 py-1.5 rounded-full bg-amber-600 text-white">{label}</span>
  ) : (
    <Link
      href={href}
      className="text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-full"
    >
      {label}
    </Link>
  )
}

type Me = { id: string; name: string } | null

// Map your folders to nice labels
const TOOLS: Array<{ slug: string; label: string }> = [
  { slug: 'age',                label: 'Age Calculator' },
  { slug: 'bmi',                label: 'BMI Calculator' },
  { slug: 'color-picker',       label: 'Color Picker' },
  { slug: 'epoch-converter',    label: 'Epoch Converter' },
  { slug: 'ip-finder',          label: 'IP Address Finder' },
  { slug: 'json-formatter',     label: 'JSON Formatter' },
  { slug: 'list',               label: 'List (Maker/Sorter)' },
  { slug: 'lorem-ipsum',        label: 'Lorem Ipsum Generator' },
  { slug: 'love',               label: 'Love Calculator' },
  { slug: 'markdown-previewer', label: 'Markdown Previewer' },
  { slug: 'name',               label: 'Random Name Generator' },
  { slug: 'password',           label: 'Password Generator' },
  { slug: 'qrcode',             label: 'QR Code Generator' },
  { slug: 'stopwatch',          label: 'Online Stopwatch' },
  { slug: 'text-case-converter',label: 'Text Case Converter' },
  { slug: 'text-to-speech',     label: 'Text to Speech' },
  { slug: 'unit-converter',     label: 'Unit Converter' },
  { slug: 'word-counter',       label: 'Word Counter' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [me, setMe] = useState<Me>(null)

  useEffect(() => {
    let mounted = true

    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!mounted) return
      if (user) {
        const name =
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          (user.user_metadata?.username as string) ||
          (user.email?.split('@')[0] ?? 'User')
        setMe({ id: user.id, name })
      } else {
        setMe(null)
      }
    }

    fetchUser()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const user = session?.user
      if (user) {
        const name =
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          (user.user_metadata?.username as string) ||
          (user.email?.split('@')[0] ?? 'User')
        setMe({ id: user.id, name })
      } else {
        setMe(null)
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error.message)
    setMe(null)
  }

  const onTools = pathname.startsWith('/tools')

  return (
    // scrolls away with the page (no sticky/fixed)
    <header className="relative z-40 backdrop-blur supports-[backdrop-filter]:bg-amber-50/80 bg-amber-50/90 border-b border-amber-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/cover2.png"
            alt="LeafLearning logo"
            className="h-10 w-auto object-contain rounded-md ring-1 ring-amber-200/60"
          />
          <span className="font-semibold tracking-tight text-stone-900">
            LeafLearning
          </span>
        </Link>

        {/* Left nav (pills) */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink href="/"        label="Home"          current={pathname === '/'} />
          <NavLink href="/about"   label="About"         current={pathname === '/about'} />
          <NavLink href="/contact" label="Contact"       current={pathname === '/contact'} />

          {/* Tools dropdown */}
          <div className="relative group">
            <button
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${
                onTools ? 'bg-amber-600 text-white' : 'text-stone-700 hover:text-stone-900'
              }`}
              aria-haspopup="menu"
              aria-expanded="false"
            >
              Tools
              <ChevronDown className="h-4 w-4 opacity-80" />
            </button>

            {/* Dropdown panel */}
            <div
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition
                         absolute left-1/2 -translate-x-1/2 mt-2 z-50
                         w-[640px] max-w-[90vw] rounded-2xl border border-amber-200
                         bg-white/95 backdrop-blur shadow-lg p-4"
              role="menu"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TOOLS.map(t => {
                  const href = `/tools/${t.slug}`
                  const active = pathname === href
                  return (
                    <Link
                      key={t.slug}
                      href={href}
                      className={`rounded-lg px-3 py-2 text-sm ring-1 ring-transparent hover:ring-amber-200
                        ${active
                          ? 'bg-amber-100 text-stone-900'
                          : 'text-stone-700 hover:bg-amber-50'
                        }`}
                      role="menuitem"
                    >
                      {t.label}
                    </Link>
                  )
                })}
              </div>

              {/* Quick link to /tools root, if you have an index page */}
              <div className="mt-3 text-right">
                <Link
                  href="/tools"
                  className="text-xs text-amber-700 hover:text-amber-800 underline"
                >
                  View all tools →
                </Link>
              </div>
            </div>
          </div>

          <NavLink href="/donation"       label="Donations"     current={pathname === '/donation'} />
          <NavLink href="/vote"           label="Vote"          current={pathname === '/vote'} />
          <NavLink href="/announcements"  label="Announcements" current={pathname === '/announcements'} />
        </nav>

        {/* Right side: auth */}
        <div className="flex items-center gap-3">
          {!me ? (
            <>
              <Link
                href="/login"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ring-1 ring-amber-200
                  ${pathname === '/login'
                    ? 'bg-amber-600 text-white ring-amber-600'
                    : 'bg-white/80 hover:bg-amber-50 text-stone-800'}`}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                  ${pathname === '/signup'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-white'}`}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-sm text-stone-700">
                Welcome, <span className="font-medium text-stone-900">{me.name}</span>
              </span>
              <button
                onClick={async () => {
                  await signOut()
                }}
                className="inline-flex items-center gap-2 bg-white/80 ring-1 ring-amber-200 hover:bg-amber-50 text-stone-800 px-3 py-2 rounded-lg text-sm"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
