"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { Suspense } from "react";

function AuthCallbackInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace(redirect);
      } else {
        router.replace(`/login?error=session`);
      }
    })();
  }, [router, redirect]);

  return (
    <p className="grid place-items-center min-h-screen text-stone-700">
      Finishing sign-in…
    </p>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="grid place-items-center min-h-screen text-stone-500">Loading…</p>}>
      <AuthCallbackInner />
    </Suspense>
  );
}

// Prevent Next.js from trying to prerender this page
export const dynamic = "force-dynamic";
