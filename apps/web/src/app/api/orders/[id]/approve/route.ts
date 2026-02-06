import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "missing_env" }, { status: 500 });
  }

  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id,status,email")
    .eq("id", id)
    .single();

  if (fetchErr || !order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (order.status !== "DELIVERED") {
    return NextResponse.json(
      { error: "invalid_transition", message: "Order must be in DELIVERED status to approve." },
      { status: 400 },
    );
  }

  const { error: updErr } = await supabase
    .from("orders")
    .update({ status: "COMPLETED" })
    .eq("id", id);

  if (updErr) {
    return NextResponse.json({ error: "db_error", message: updErr.message }, { status: 500 });
  }

  await supabase.from("status_history").insert({
    order_id: id,
    from_status: "DELIVERED",
    to_status: "COMPLETED",
    actor: "client",
  });

  return NextResponse.json({ ok: true, status: "COMPLETED" });
}
