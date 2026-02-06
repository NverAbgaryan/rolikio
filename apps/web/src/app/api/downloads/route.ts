import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createR2S3Client } from "@/lib/r2/s3";
import { getR2Bucket } from "@/lib/r2/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "missing_key" }, { status: 400 });
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
    { expiresIn: 60 * 60 }, // 1 hour
  );

  return NextResponse.json({ url });
}
