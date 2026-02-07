export function getR2AccountId() {
  const v = process.env.R2_ACCOUNT_ID;
  if (!v) throw new Error("Missing env: R2_ACCOUNT_ID");
  return v;
}

export function getR2AccessKeyId() {
  const v = process.env.R2_ACCESS_KEY_ID;
  if (!v) throw new Error("Missing env: R2_ACCESS_KEY_ID");
  return v;
}

export function getR2SecretAccessKey() {
  const v = process.env.R2_SECRET_ACCESS_KEY;
  if (!v) throw new Error("Missing env: R2_SECRET_ACCESS_KEY");
  return v;
}

export function getR2Bucket() {
  const v = process.env.R2_BUCKET;
  if (!v) throw new Error("Missing env: R2_BUCKET");
  return v;
}

