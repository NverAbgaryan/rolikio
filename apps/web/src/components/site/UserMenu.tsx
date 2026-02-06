"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function UserMenu({ email }: { email: string }) {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.refresh();
  }

  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-coral text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[140px] truncate text-sm font-medium text-brand-navy/70 sm:block dark:text-white/70">
          {email}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        className="text-sm font-medium text-brand-navy/50 transition-colors hover:text-brand-coral dark:text-white/50 dark:hover:text-brand-coral"
      >
        Sign out
      </button>
    </div>
  );
}
