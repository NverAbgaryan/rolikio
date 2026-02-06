import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function isAdmin(): Promise<{ admin: true; email: string } | { admin: false }> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user?.email) return { admin: false };

    const allowlist = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (allowlist.length === 0) return { admin: false };

    if (allowlist.includes(data.user.email.toLowerCase())) {
      return { admin: true, email: data.user.email };
    }

    return { admin: false };
  } catch {
    return { admin: false };
  }
}
