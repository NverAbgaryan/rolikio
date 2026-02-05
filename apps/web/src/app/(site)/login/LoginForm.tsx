"use client";

import { useState } from "react";
import { Button } from "@/components/site/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "sending" }
    | { type: "sent" }
    | { type: "error"; message: string }
  >({ type: "idle" });

  async function sendLink() {
    setStatus({ type: "sending" });
    let supabase;
    try {
      supabase = createSupabaseBrowserClient();
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof Error
            ? e.message
            : "Supabase is not configured (missing env).",
      });
      return;
    }

    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }
    setStatus({ type: "sent" });
  }

  const isValidEmail = /^\S+@\S+\.\S+$/.test(email);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold tracking-tight">Magic link</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        We’ll email you a sign-in link. No password.
      </p>

      <div className="mt-6 space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        />
      </div>

      {status.type === "sent" ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
          Sent. Check your email for the sign-in link.
        </div>
      ) : null}

      {status.type === "error" ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          {status.message}
        </div>
      ) : null}

      <div className="mt-6">
        <Button
          onClick={sendLink}
          disabled={!isValidEmail || status.type === "sending"}
          aria-disabled={!isValidEmail || status.type === "sending"}
          className="w-full"
        >
          {status.type === "sending" ? "Sending..." : "Send magic link"}
        </Button>
      </div>

      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        Tip: use login later for client portal + order tracking.
      </p>
    </div>
  );
}

