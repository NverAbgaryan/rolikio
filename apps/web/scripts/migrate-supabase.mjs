import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd(); // apps/web
const ENV_PATH = path.join(ROOT, ".env.local");

function parseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;
    out[key] = value;
  }
  return out;
}

function req(env, key) {
  const v = env[key] || process.env[key];
  if (!v) throw new Error(`Missing ${key}. Add it to apps/web/.env.local (do not commit).`);
  return v;
}

function projectRefFromSupabaseUrl(url) {
  // https://<ref>.supabase.co
  const m = url.match(/^https?:\/\/([a-z0-9-]+)\.supabase\.co/i);
  if (!m) throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL");
  return m[1];
}

function runPsql({ databaseUrl, password, args }) {
  const res = spawnSync("psql", ["-v", "ON_ERROR_STOP=1", databaseUrl, ...args], {
    stdio: "inherit",
    env: { ...process.env, PGPASSWORD: password },
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

const env = parseEnvFile(ENV_PATH);
const supabaseUrl = req(env, "NEXT_PUBLIC_SUPABASE_URL");
const projectRef = projectRefFromSupabaseUrl(supabaseUrl);

const databaseUrl =
  env.SUPABASE_DATABASE_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  `postgresql://postgres@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`;

const password = env.SUPABASE_DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD;
if (!password) {
  console.error(
    "Missing SUPABASE_DB_PASSWORD. Add it to apps/web/.env.local (do NOT commit it), then rerun: npm run db:migrate",
  );
  process.exit(1);
}

const migrations = [
  path.join(ROOT, "supabase", "migrations", "0001_init.sql"),
  path.join(ROOT, "supabase", "migrations", "0002_brief_and_refs.sql"),
];

if (process.argv.includes("--check")) {
  runPsql({ databaseUrl, password, args: ["-c", "select to_regclass('public.orders') as orders_table;"] });
  process.exit(0);
}

for (const file of migrations) {
  if (!fs.existsSync(file)) {
    console.error(`Missing migration file: ${file}`);
    process.exit(1);
  }
  console.log(`\n==> Applying ${path.basename(file)}\n`);
  runPsql({ databaseUrl, password, args: ["-f", file] });
}

console.log("\n==> Done. Checking tables...\n");
runPsql({ databaseUrl, password, args: ["-c", "select to_regclass('public.orders') as orders_table;"] });

