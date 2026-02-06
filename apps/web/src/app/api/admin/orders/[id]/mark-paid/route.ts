import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin/auth";
import { computeDueAt } from "@/lib/orders/status";

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await isAdmin();
  if (!auth.admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "missing_env" }, { status: 500 });
  }

  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id,status,add_ons")
    .eq("id", id)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const addOns = (order.add_ons ?? {}) as { rush?: boolean };
  const dueAt = computeDueAt(addOns);

  const { error: updErr } = await supabase
    .from("orders")
    .update({
      status: "PAID",
      payment_status: "paid",
      paid_at: new Date().toISOString(),
      due_at: dueAt.toISOString(),
    })
    .eq("id", id);

  if (updErr) {
    return NextResponse.json({ error: "db_error", message: updErr.message }, { status: 500 });
  }

  await supabase.from("status_history").insert({
    order_id: id,
    from_status: order.status,
    to_status: "PAID",
    actor: "admin",
  });

  return NextResponse.json({ ok: true, status: "PAID", due_at: dueAt.toISOString() });
}
