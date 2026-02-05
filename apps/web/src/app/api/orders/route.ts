import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseRlsOrPermission, isSupabaseSchemaCacheMiss } from "@/lib/api/supabaseErrors";

const createOrderSchema = z.object({
  email: z.string().email().optional(),
  tier: z.enum(["A", "B", "C"]),
  platform: z.enum(["instagram", "tiktok", "youtube"]),
  vibe: z.string().min(1).max(64),
  editingLevel: z.enum(["basic", "enhanced", "pro"]).default("basic"),
  addOns: z
    .object({
      subtitles: z.boolean().default(false),
      rush: z.boolean().default(false),
    })
    .default({ subtitles: false, rush: false }),
});

function computeTierRules(tier: "A" | "B" | "C") {
  if (tier === "A") return { rawLimitSeconds: 2 * 60, revisionsIncluded: 1 };
  if (tier === "B") return { rawLimitSeconds: 5 * 60, revisionsIncluded: 1 };
  return { rawLimitSeconds: 10 * 60, revisionsIncluded: 2 };
}

export async function POST(request: Request) {
  const parsed = createOrderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (e) {
    return NextResponse.json(
      {
        error: "missing_env",
        message:
          e instanceof Error
            ? e.message
            : "Missing Supabase configuration.",
      },
      { status: 500 },
    );
  }

  // Prefer signed-in user email if present.
  let userId: string | null = null;
  let email = parsed.data.email ?? null;

  try {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      userId = data.user.id;
      email = email ?? data.user.email ?? null;
    }
  } catch {
    // Auth not configured yet; allow guest flow for now.
  }

  if (!email) {
    return NextResponse.json(
      { error: "email_required", message: "Provide email or sign in." },
      { status: 400 },
    );
  }

  const { rawLimitSeconds, revisionsIncluded } = computeTierRules(parsed.data.tier);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      email,
      tier: parsed.data.tier,
      platform: parsed.data.platform,
      vibe: parsed.data.vibe,
      editing_level: parsed.data.editingLevel,
      add_ons: parsed.data.addOns,
      status: "DRAFT",
      raw_limit_seconds: rawLimitSeconds,
      revisions_included: revisionsIncluded,
      quote_requested_at: null,
    })
    .select("id,status")
    .single();

  if (error) {
    if (isSupabaseSchemaCacheMiss(error.message)) {
      return NextResponse.json(
        {
          error: "db_not_initialized",
          message:
            "Supabase tables are missing. Run migrations `supabase/migrations/0001_init.sql` then `0002_brief_and_refs.sql` in the Supabase SQL Editor.",
        },
        { status: 500 },
      );
    }
    if (isSupabaseRlsOrPermission(error.message)) {
      return NextResponse.json(
        {
          error: "db_permission_denied",
          message:
            "Supabase denied access (RLS/permissions). For MVP, use `SUPABASE_SERVICE_ROLE_KEY` on server routes or add appropriate RLS policies.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: order.id, status: order.status });
}

