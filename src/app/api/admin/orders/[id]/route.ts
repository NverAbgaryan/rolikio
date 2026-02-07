import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin/auth";

export async function GET(
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

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id,email,tier,platform,content_type,vibe,editing_level,add_ons,status,payment_status,ruul_checkout_url,price_cents,currency,raw_limit_seconds,raw_used_seconds,revisions_included,revisions_used,due_at,paid_at,brief_want,brief_avoid,brief_must_include,created_at,updated_at,order_assets(id,kind,filename,mime_type,size_bytes,duration_seconds,created_at,storage_key),order_references(id,url,created_at),deliveries(id,version_number,filename,duration_seconds,created_at,storage_key),status_history(id,from_status,to_status,actor,created_at),messages(id,sender,body,created_at)" as const,
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
