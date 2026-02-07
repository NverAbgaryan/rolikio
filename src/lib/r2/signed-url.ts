import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createR2S3Client } from "@/lib/r2/s3";
import { getR2Bucket } from "@/lib/r2/env";

export async function getSignedDownloadUrl(
  key: string,
  expiresIn = 3600,
): Promise<string | null> {
  try {
    const s3 = createR2S3Client();
    const bucket = getR2Bucket();
    return await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn },
    );
  } catch {
    return null;
  }
}
