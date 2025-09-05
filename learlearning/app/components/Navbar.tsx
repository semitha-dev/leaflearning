'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

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

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-amber-50/80 bg-amber-50/90 border-b border-amber-200/80">
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
          <NavLink href="/"        label="Home"    current={pathname === '/'} />
          <NavLink href="/about"   label="About"   current={pathname === '/about'} />
          <NavLink href="/contact" label="Contact" current={pathname === '/contact'} />
          <NavLink href="/donation" label="Donations" current={pathname === '/donation'} />
          <NavLink href="/vote"    label="Vote"    current={pathname === '/vote'} />
          <NavLink href="/announcements"    label="Announcements"    current={pathname === '/announcements'} />

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
                onClick={signOut}
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
