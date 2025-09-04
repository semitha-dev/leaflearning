import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseServer';

// Return a small, safe subset for the admin UI
export async function GET() {
  try {
    const users: { id: string; email: string | null; user_metadata?: any }[] = [];
    let page = 1;
    const perPage = 100;

    // paginate through all users
    while (true) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) throw error;

      data.users.forEach(u => {
        users.push({
          id: u.id,
          email: u.email ?? null,
          user_metadata: u.user_metadata
        });
      });

      if (data.users.length < perPage) break; // no more pages
      page += 1;
    }

    const simplified = users.map(u => ({
      id: u.id,
      email: u.email,
      name:
        (u.user_metadata?.full_name as string) ||
        (u.user_metadata?.name as string) ||
        (u.user_metadata?.username as string) ||
        (u.email?.split('@')[0] ?? null)
    }));

    return NextResponse.json({ users: simplified });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to list users' }, { status: 500 });
  }
}
