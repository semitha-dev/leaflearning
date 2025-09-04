"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      router.replace(session ? redirect : `/login?error=session`);
    })();
  }, [router, redirect]);

  return (
    <p className="grid place-items-center min-h-screen">
      Finishing sign-in…
    </p>
  );
}
