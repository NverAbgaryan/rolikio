import { Container } from "@/components/site/Container";

function EnvRow({ name, ok }: { name: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <span className="font-mono text-xs">{name}</span>
      <span
        className={[
          "rounded-full px-2 py-1 text-xs font-semibold",
          ok
            ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
            : "bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200",
        ].join(" ")}
      >
        {ok ? "ok" : "missing"}
      </span>
    </div>
  );
}

export default function SetupPage() {
  const checks = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
    { name: "SUPABASE_SERVICE_ROLE_KEY", ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
    { name: "SUPABASE_DB_PASSWORD", ok: Boolean(process.env.SUPABASE_DB_PASSWORD) },
    { name: "R2_ACCOUNT_ID", ok: Boolean(process.env.R2_ACCOUNT_ID) },
    { name: "R2_ACCESS_KEY_ID", ok: Boolean(process.env.R2_ACCESS_KEY_ID) },
    { name: "R2_SECRET_ACCESS_KEY", ok: Boolean(process.env.R2_SECRET_ACCESS_KEY) },
    { name: "R2_BUCKET", ok: Boolean(process.env.R2_BUCKET) },
  ];

  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Setup
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Environment check (doesn’t display secret values).
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container className="max-w-2xl space-y-3">
          {checks.map((c) => (
            <EnvRow key={c.name} name={c.name} ok={c.ok} />
          ))}

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
            If something is missing, add it to <span className="font-mono">apps/web/.env.local</span>{" "}
            (see <span className="font-mono">apps/web/.env.example</span>), then restart the dev server.
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            <p className="font-semibold">DB migrations required</p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              In Supabase SQL Editor, run:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
              <li><span className="font-mono">supabase/migrations/0001_init.sql</span></li>
              <li><span className="font-mono">supabase/migrations/0002_brief_and_refs.sql</span></li>
            </ul>
          </div>
        </Container>
      </section>
    </div>
  );
}

