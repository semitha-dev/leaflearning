'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import NavBar from '../../components/Navbar'
import { ArrowLeft, MessageCircle, ThumbsUp } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Announcement = {
  id: string
  slug: string
  title: string
  content: string
  cover_image_url: string | null
  published_at: string | null
}

type Comment = {
  id: string
  body: string
  created_at: string
  user_id: string
  parent_comment_id: string | null
  likes_count: number
  profile_name: string | null  // derived from auth.user metadata (we’ll fetch on client)
}

export default function AnnouncementDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Announcement | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [me, setMe] = useState<{ id: string; name: string } | null>(null)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
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
      await loadPostAndComments()
      setLoading(false)
    })()
  }, [slug])

  async function loadPostAndComments() {
    const { data: posts } = await supabase
      .from('announcements')
      .select('id, slug, title, content, cover_image_url, published_at')
      .eq('slug', slug)
      .limit(1)
    const thePost = posts?.[0] ?? null
    setPost(thePost)

    if (thePost) {
      const { data: raw } = await supabase
        .from('announcement_comments')
        .select('id, announcement_id, user_id, body, parent_comment_id, likes_count, created_at')
        .eq('announcement_id', thePost.id)
        .order('created_at', { ascending: true })

      // decorate with profile-ish display
      const withNames: Comment[] = await Promise.all(
        (raw || []).map(async (c) => {
          let profile_name: string | null = null
          try {
            // pull minimal info via auth admin functions are not available on client.
            // So we’ll just show a masked user id or cached "me" name for own comments.
            if (me && me.id === c.user_id) profile_name = me.name
            else profile_name = `User-${c.user_id.slice(0, 6)}`
          } catch {}
          return { ...c, profile_name }
        })
      )
      setComments(withNames)
    }
  }

  const topLevel = useMemo(() => comments.filter(c => !c.parent_comment_id), [comments])
  const repliesMap = useMemo(() => {
    const m = new Map<string, Comment[]>()
    comments.forEach(c => {
      if (c.parent_comment_id) {
        const arr = m.get(c.parent_comment_id) || []
        arr.push(c)
        m.set(c.parent_comment_id, arr)
      }
    })
    return m
  }, [comments])

  async function requireLogin(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setToast('Please sign in to comment.')
      return null
    }
    const name =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      (user.user_metadata?.username as string) ||
      (user.email?.split('@')[0] ?? 'User')
    setMe({ id: user.id, name })
    return user.id
  }

  async function submitComment(parentId: string | null = null) {
    const uid = await requireLogin()
    if (!uid || !post || !newComment.trim()) return

    const { error } = await supabase.from('announcement_comments').insert({
      announcement_id: post.id,
      user_id: uid,
      body: newComment.trim(),
      parent_comment_id: parentId,
    })
    if (error) {
      setToast(error.message)
      return
    }
    setNewComment('')
    await loadPostAndComments()
  }

  async function likeComment(commentId: string) {
    const uid = await requireLogin()
    if (!uid) return

    // try insert; if constraint fails, you may add a delete to toggle
    const { error } = await supabase.from('announcement_comment_likes').insert({
      comment_id: commentId,
      user_id: uid,
    })
    if (error) {
      // optional: toggle off if already liked
      return
    }
    // bump likes_count (denormalized)
    try {
      await supabase.rpc('increment_comment_like', { c_id: commentId })
    } catch {}
    await loadPostAndComments()
  }

  return (
    <main className="min-h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      <NavBar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/announcements" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to announcements
        </Link>

        {loading ? (
          <div className="bg-white/90 rounded-2xl border border-amber-200 p-6">Loading…</div>
        ) : post ? (
          <>
            {post.cover_image_url ? (
              <img
                src={post.cover_image_url}
                alt=""
                className="w-full h-56 object-cover rounded-2xl ring-1 ring-amber-200/60 mb-4"
              />
            ) : null}
            <h1 className="text-3xl font-extrabold text-stone-900 mb-4">{post.title}</h1>
            <article className="prose prose-stone max-w-none bg-white/90 rounded-2xl border border-amber-200 p-6">
              {/* If your content is markdown, render with a markdown component. For now plain text */}
              <div className="whitespace-pre-wrap">{post.content}</div>
            </article>

            {/* Comments */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-stone-900 mb-3 inline-flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-amber-700" /> Comments
              </h2>

              {/* Add comment (top-level) */}
              <div className="bg-white/90 rounded-2xl border border-amber-200 p-4 mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder={me ? 'Write a comment…' : 'Sign in to write a comment…'}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
                />
                <div className="mt-2 text-right">
                  <button
                    onClick={() => submitComment(null)}
                    disabled={!newComment.trim()}
                    className={`px-4 py-2 rounded-lg text-white ${newComment.trim() ? 'bg-amber-600 hover:bg-amber-500' : 'bg-amber-300 cursor-not-allowed'}`}
                  >
                    Comment
                  </button>
                </div>
              </div>

              {/* Comment list */}
              <div className="space-y-4">
                {topLevel.map(c => (
                  <CommentItem
                    key={c.id}
                    c={c}
                    replies={repliesMap.get(c.id) || []}
                    onLike={() => likeComment(c.id)}
                  />
                ))}
                {!topLevel.length && (
                  <div className="text-stone-600">Be the first to comment.</div>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="bg-white/90 rounded-2xl border border-amber-200 p-6">Not found.</div>
        )}
      </section>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-sm px-4 py-2 rounded-lg shadow">
          {toast}
        </div>
      )}
    </main>
  )
}

function CommentItem({
  c,
  replies,
  onLike,
}: {
  c: Comment
  replies: Comment[]
  onLike: () => void
}) {
  return (
    <div className="bg-white/90 rounded-2xl border border-amber-200 p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-amber-100 ring-1 ring-amber-200 flex items-center justify-center text-stone-800">
          {(c.profile_name ?? 'U')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-stone-700">
            <span className="font-medium text-stone-900">{c.profile_name ?? 'User'}</span>{' '}
            <span className="text-stone-500">· {new Date(c.created_at).toLocaleString()}</span>
          </div>
          <div className="mt-1 text-stone-800 whitespace-pre-wrap">{c.body}</div>
          <div className="mt-2 flex items-center gap-3 text-sm text-stone-600">
            <button onClick={onLike} className="inline-flex items-center gap-1 hover:text-stone-800">
              <ThumbsUp className="h-4 w-4 text-amber-700" /> {c.likes_count}
            </button>
            {/* (Optional) Add "Reply" UX if you want threaded replies here */}
          </div>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-3 pl-6 border-l-2 border-amber-200 space-y-3">
              {replies.map(rc => (
                <div key={rc.id}>
                  <div className="text-sm text-stone-700">
                    <span className="font-medium text-stone-900">{rc.profile_name ?? 'User'}</span>{' '}
                    <span className="text-stone-500">· {new Date(rc.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 text-stone-800 whitespace-pre-wrap">{rc.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
