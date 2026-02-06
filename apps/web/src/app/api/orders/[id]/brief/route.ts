import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseRlsOrPermission, isSupabaseSchemaCacheMiss } from "@/lib/api/supabaseErrors";

const briefSchema = z.object({
  want: z.string().min(1).max(5000),
  avoid: z.string().max(5000).optional().default(""),
  mustInclude: z.string().max(5000).optional().default(""),
  references: z.array(z.string().max(2000)).max(5).default([]),
});

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const parsed = briefSchema.safeParse(await request.json().catch(() => null));
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
        message: e instanceof Error ? e.message : "Missing Supabase env.",
      },
      { status: 500 },
    );
  }

  // Read editing level to decide next status.
  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id,editing_level,status")
    .eq("id", id)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json(
      { error: "not_found" },
      { status: 404 },
    );
  }

  const nextStatus = order.editing_level === "pro" ? "QUOTE_REQUESTED" : "AWAITING_PAYMENT";

  const { error: updErr } = await supabase
    .from("orders")
    .update({
      brief_want: parsed.data.want,
      brief_avoid: parsed.data.avoid,
      brief_must_include: parsed.data.mustInclude,
      status: nextStatus,
      quote_requested_at: order.editing_level === "pro" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (updErr) {
    if (isSupabaseSchemaCacheMiss(updErr.message)) {
      return NextResponse.json(
        {
          error: "db_not_initialized",
          message:
            "Supabase tables are missing. Run migrations `supabase/migrations/0001_init.sql` then `0002_brief_and_refs.sql` in the Supabase SQL Editor.",
        },
        { status: 500 },
      );
    }
    if (isSupabaseRlsOrPermission(updErr.message)) {
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
      { error: "db_error", message: updErr.message },
      { status: 500 },
    );
  }

  // Replace references (simple MVP approach).
  const refs = parsed.data.references
    .map((u) => u.trim())
    .filter(Boolean)
    .slice(0, 5);

  const { error: delErr } = await supabase
    .from("order_references")
    .delete()
    .eq("order_id", id);
  if (delErr) {
    if (isSupabaseSchemaCacheMiss(delErr.message)) {
      return NextResponse.json(
        {
          error: "db_not_initialized",
          message:
            "Supabase tables are missing. Run migrations `supabase/migrations/0001_init.sql` then `0002_brief_and_refs.sql` in the Supabase SQL Editor.",
        },
        { status: 500 },
      );
    }
    if (isSupabaseRlsOrPermission(delErr.message)) {
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
      { error: "db_error", message: delErr.message },
      { status: 500 },
    );
  }

  if (refs.length > 0) {
    const { error: insErr } = await supabase.from("order_references").insert(
      refs.map((url) => ({ order_id: id, url })),
    );
    if (insErr) {
      if (isSupabaseSchemaCacheMiss(insErr.message)) {
        return NextResponse.json(
          {
            error: "db_not_initialized",
            message:
              "Supabase tables are missing. Run migrations `supabase/migrations/0001_init.sql` then `0002_brief_and_refs.sql` in the Supabase SQL Editor.",
          },
          { status: 500 },
        );
      }
      if (isSupabaseRlsOrPermission(insErr.message)) {
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
        { error: "db_error", message: insErr.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true, status: nextStatus });
}

