import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseRlsOrPermission, isSupabaseSchemaCacheMiss } from "@/lib/api/supabaseErrors";

const createOrderSchema = z.object({
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
        message: e instanceof Error ? e.message : "Missing Supabase configuration.",
      },
      { status: 500 },
    );
  }

  // Require authentication
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user || !userData.user.email) {
    return NextResponse.json(
      { error: "unauthorized", message: "You must be signed in to create an order." },
      { status: 401 },
    );
  }

  const userId = userData.user.id;
  const email = userData.user.email;
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
    })
    .select("id,status")
    .single();

  if (error) {
    if (isSupabaseSchemaCacheMiss(error.message)) {
      return NextResponse.json(
        { error: "db_not_initialized", message: "Database tables are missing. Run migrations." },
        { status: 500 },
      );
    }
    if (isSupabaseRlsOrPermission(error.message)) {
      return NextResponse.json(
        { error: "db_permission_denied", message: "Database permission denied." },
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
