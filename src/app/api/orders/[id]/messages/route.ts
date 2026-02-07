import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const messageSchema = z.object({
  body: z.string().min(1).max(5000),
});

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const parsed = messageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "missing_env" }, { status: 500 });
  }

  // Determine sender type
  let sender = "client";
  try {
    const { data } = await supabase.auth.getUser();
    if (data.user?.email) {
      const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
      if (adminEmails.includes(data.user.email.toLowerCase())) {
        sender = "admin";
      }
    }
  } catch {
    // default to client
  }

  const { data: msg, error } = await supabase
    .from("messages")
    .insert({ order_id: id, sender, body: parsed.data.body })
    .select("id,sender,body,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: msg });
}

export async function GET(
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

  const { data, error } = await supabase
    .from("messages")
    .select("id,sender,body,created_at")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}
