import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseRlsOrPermission, isSupabaseSchemaCacheMiss } from "@/lib/api/supabaseErrors";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const emailParam = searchParams.get("email")?.trim() || null;

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

  // If signed-in, allow; else require email to match.
  let authedEmail: string | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    authedEmail = data.user?.email ?? null;
  } catch {
    // ignore
  }

  const orderSelect =
    "id,email,tier,platform,vibe,editing_level,add_ons,status,raw_limit_seconds,raw_used_seconds,revisions_included,revisions_used,due_at,brief_want,brief_avoid,brief_must_include,created_at,updated_at,order_assets(id,kind,filename,mime_type,size_bytes,duration_seconds,created_at,storage_key),order_references(id,url,created_at),deliveries(id,version_number,filename,duration_seconds,created_at,storage_key),status_history(id,from_status,to_status,actor,created_at)" as const;

  const { data: order, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("id", id)
    .single();

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
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const allowedEmail = authedEmail ?? emailParam;
  if (!allowedEmail || order.email.toLowerCase() !== allowedEmail.toLowerCase()) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order });
}

