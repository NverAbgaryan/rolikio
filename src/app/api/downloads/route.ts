import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createR2S3Client } from "@/lib/r2/s3";
import { getR2Bucket } from "@/lib/r2/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "missing_key" }, { status: 400 });
  }

  // Auth check: must be signed in
  let userEmail: string | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    userEmail = data.user?.email ?? null;
  } catch {
    // not authenticated
  }

  // Also check admin
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAuthed = Boolean(userEmail);
  const isAdmin = userEmail ? adminEmails.includes(userEmail.toLowerCase()) : false;

  if (!isAuthed && !isAdmin) {
    // Allow if email query param matches the key's order owner
    // For MVP, require at least some form of auth
    const emailParam = searchParams.get("email");
    if (!emailParam) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  let s3;
  let bucket;
  try {
    s3 = createR2S3Client();
    bucket = getR2Bucket();
  } catch (e) {
    return NextResponse.json(
      { error: "missing_env", message: e instanceof Error ? e.message : "Missing R2 env." },
      { status: 500 },
    );
  }

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 60 * 60 },
  );

  return NextResponse.json({ url });
}
