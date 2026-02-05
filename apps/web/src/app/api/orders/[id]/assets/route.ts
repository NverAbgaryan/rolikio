import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseRlsOrPermission, isSupabaseSchemaCacheMiss } from "@/lib/api/supabaseErrors";

const assetSchema = z.object({
  kind: z.enum(["video", "image", "voice", "logo"]),
  storageKey: z.string().min(1).max(1024),
  filename: z.string().min(1).max(256),
  mimeType: z.string().min(1).max(128),
  sizeBytes: z.number().int().positive(),
  durationSeconds: z.number().int().positive().max(60 * 60).optional(),
});

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const parsed = assetSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Basic safety: require key namespace to match the order.
  if (!parsed.data.storageKey.startsWith(`orders/${id}/`)) {
    return NextResponse.json(
      { error: "invalid_storage_key" },
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
        message: e instanceof Error ? e.message : "Missing Supabase env.",
      },
      { status: 500 },
    );
  }

  const { error } = await supabase.from("order_assets").insert({
    order_id: id,
    kind: parsed.data.kind,
    storage_key: parsed.data.storageKey,
    filename: parsed.data.filename,
    mime_type: parsed.data.mimeType,
    size_bytes: parsed.data.sizeBytes,
    duration_seconds: parsed.data.durationSeconds ?? null,
  });

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

  return NextResponse.json({ ok: true });
}

