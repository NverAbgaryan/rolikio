import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const revisionSchema = z.object({
  notes: z.string().min(1).max(5000),
  categories: z.array(z.string()).optional().default([]),
});

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const parsed = revisionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", details: parsed.error.flatten() }, { status: 400 });
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "missing_env" }, { status: 500 });
  }

  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id,status,revisions_included,revisions_used")
    .eq("id", id)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (order.status !== "DELIVERED") {
    return NextResponse.json(
      { error: "invalid_transition", message: "Order must be in DELIVERED status to request revision." },
      { status: 400 },
    );
  }

  if (order.revisions_used >= order.revisions_included) {
    return NextResponse.json(
      { error: "revision_quota_exceeded", message: "All included revisions have been used." },
      { status: 400 },
    );
  }

  const { error: updErr } = await supabase
    .from("orders")
    .update({
      status: "REVISION_REQUESTED",
      revisions_used: order.revisions_used + 1,
    })
    .eq("id", id);

  if (updErr) {
    return NextResponse.json({ error: "db_error", message: updErr.message }, { status: 500 });
  }

  await supabase.from("status_history").insert({
    order_id: id,
    from_status: "DELIVERED",
    to_status: "REVISION_REQUESTED",
    actor: "client",
  });

  // Store revision notes as a message
  await supabase.from("messages").insert({
    order_id: id,
    sender: "client",
    body: `[Revision request]\nCategories: ${parsed.data.categories.join(", ") || "none"}\n\n${parsed.data.notes}`,
  });

  return NextResponse.json({ ok: true, status: "REVISION_REQUESTED" });
}
