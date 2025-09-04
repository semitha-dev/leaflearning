'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import NavBar from '../components/Navbar'
import { Calendar } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Announcement = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('announcements')
        .select('id, slug, title, excerpt, cover_image_url, published_at')
        .order('published_at', { ascending: false })
      setItems(data || [])
      setLoading(false)
    })()
  }, [])

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      <NavBar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Announcements</h1>
          <p className="text-stone-700 mt-2">News, release notes, and updates from LeafLearning.</p>
        </div>

        {loading ? (
          <div className="bg-white/90 rounded-xl border border-amber-200 p-8 text-center shadow-sm">
            Loading…
          </div>
        ) : items.length ? (
          <div className="space-y-6">
            {items.map((a) => (
              <Link key={a.id} href={`/announcements/${a.slug}`} className="block group">
                <article className="flex flex-col sm:flex-row items-stretch bg-white/90 border border-amber-200 rounded-xl hover:shadow-md transition overflow-hidden">
                  {/* Left: Image */}
                 

                  {/* Right: Content */}
                  <div className="flex-1 p-5 flex flex-col justify-center">
                    <h2 className="text-lg md:text-xl font-semibold text-stone-900 group-hover:underline">
                      {a.title}
                    </h2>
                    {a.excerpt ? (
                      <p className="text-stone-700 mt-2 line-clamp-2">{a.excerpt}</p>
                    ) : null}
                    <div className="mt-3 text-sm text-stone-600 inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-700" />
                      {a.published_at ? new Date(a.published_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 rounded-xl border border-amber-200 p-8 text-center shadow-sm">
            No announcements yet.
          </div>
        )}
      </section>
    </main>
  )
}
