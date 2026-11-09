"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleButton() {
  async function signIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <button
      onClick={signIn}
      className="min-h-11 w-full rounded-lg bg-emerald-700 px-4 py-3 text-base font-semibold text-white"
    >
      구글로 로그인
    </button>
  );
}
