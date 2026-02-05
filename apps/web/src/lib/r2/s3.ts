import { S3Client } from "@aws-sdk/client-s3";
import {
  getR2AccessKeyId,
  getR2AccountId,
  getR2SecretAccessKey,
} from "@/lib/r2/env";

export function createR2S3Client() {
  const accountId = getR2AccountId();
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getR2AccessKeyId(),
      secretAccessKey: getR2SecretAccessKey(),
    },
  });
}

