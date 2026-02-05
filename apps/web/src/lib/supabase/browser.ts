import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/keys";

export function createSupabaseBrowserClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}

