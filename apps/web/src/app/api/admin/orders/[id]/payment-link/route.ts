import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin/auth";

const schema = z.object({
  ruulCheckoutUrl: z.string().url(),
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

  const { error } = await supabase
    .from("orders")
    .update({
      ruul_checkout_url: parsed.data.ruulCheckoutUrl,
      status: "AWAITING_PAYMENT",
      payment_status: "pending",
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }

  await supabase.from("status_history").insert({
    order_id: id,
    from_status: "DRAFT",
    to_status: "AWAITING_PAYMENT",
    actor: "admin",
  });

  return NextResponse.json({ ok: true });
}
