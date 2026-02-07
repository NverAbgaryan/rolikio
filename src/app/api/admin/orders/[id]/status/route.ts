import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin/auth";
import { canTransition } from "@/lib/orders/status";

const schema = z.object({
  status: z.string().min(1),
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

  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id,status")
    .eq("id", id)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (!canTransition(order.status, parsed.data.status)) {
    return NextResponse.json(
      { error: "invalid_transition", message: `Cannot transition from ${order.status} to ${parsed.data.status}` },
      { status: 400 },
    );
  }

  const { error: updErr } = await supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", id);

  if (updErr) {
    return NextResponse.json({ error: "db_error", message: updErr.message }, { status: 500 });
  }

  await supabase.from("status_history").insert({
    order_id: id,
    from_status: order.status,
    to_status: parsed.data.status,
    actor: "admin",
  });

  return NextResponse.json({ ok: true, status: parsed.data.status });
}
