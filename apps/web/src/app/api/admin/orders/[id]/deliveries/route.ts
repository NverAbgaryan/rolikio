import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin/auth";

const schema = z.object({
  storageKey: z.string().min(1),
  filename: z.string().min(1),
  durationSeconds: z.number().int().positive().optional(),
});

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await isAdmin();
  if (!auth.admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "missing_env" }, { status: 500 });
  }

  // Get current max version
  const { data: existing } = await supabase
    .from("deliveries")
    .select("version_number")
    .eq("order_id", id)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (existing?.[0]?.version_number ?? 0) + 1;

  const { error: insErr } = await supabase.from("deliveries").insert({
    order_id: id,
    version_number: nextVersion,
    storage_key: parsed.data.storageKey,
    filename: parsed.data.filename,
    duration_seconds: parsed.data.durationSeconds ?? null,
  });

  if (insErr) {
    return NextResponse.json({ error: "db_error", message: insErr.message }, { status: 500 });
  }

  // Transition to DELIVERED
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  if (order && ["IN_PROGRESS", "REVISION_IN_PROGRESS"].includes(order.status)) {
    await supabase
      .from("orders")
      .update({ status: "DELIVERED" })
      .eq("id", id);

    await supabase.from("status_history").insert({
      order_id: id,
      from_status: order.status,
      to_status: "DELIVERED",
      actor: "admin",
    });
  }

  return NextResponse.json({ ok: true, version: nextVersion });
}
