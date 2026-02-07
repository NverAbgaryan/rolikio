import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { createR2S3Client } from "@/lib/r2/s3";
import { getR2Bucket } from "@/lib/r2/env";

const presignSchema = z.object({
  orderId: z.string().uuid(),
  kind: z.enum(["video", "image", "voice", "logo"]),
  filename: z.string().min(1).max(256),
  mimeType: z.string().min(1).max(128),
  sizeBytes: z.number().int().positive().max(1024 * 1024 * 1024), // 1GB/file cap for now
});

function safeExt(filename: string) {
  const m = filename.toLowerCase().match(/\.(\w{1,8})$/);
  return m ? m[0] : "";
}

export async function POST(request: Request) {
  const parsed = presignSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let s3;
  let bucket;
  try {
    s3 = createR2S3Client();
    bucket = getR2Bucket();
  } catch (e) {
    return NextResponse.json(
      {
        error: "missing_env",
        message: e instanceof Error ? e.message : "Missing R2 env.",
      },
      { status: 500 },
    );
  }

  const { orderId, kind, mimeType, filename } = parsed.data;
  const key = `orders/${orderId}/${kind}/${crypto.randomUUID()}${safeExt(filename)}`;

  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
    }),
    { expiresIn: 60 * 15 },
  );

  return NextResponse.json({ key, url });
}

