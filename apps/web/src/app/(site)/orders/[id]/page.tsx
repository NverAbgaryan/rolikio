import { Container } from "@/components/site/Container";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string }>;
};

type StatusHistoryItem = {
  id: string;
  from_status: string | null;
  to_status: string;
  actor: string;
  created_at: string;
};

type OrderAsset = {
  id: string;
  kind: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number | null;
  created_at: string;
  storage_key: string;
};

type OrderReference = {
  id: string;
  url: string;
  created_at: string;
};

type Delivery = {
  id: string;
  version_number: number;
  filename: string;
  duration_seconds: number | null;
  created_at: string;
  storage_key: string;
};

type OrderDto = {
  id: string;
  email: string;
  tier: "A" | "B" | "C";
  platform: "instagram" | "tiktok" | "youtube";
  vibe: string;
  editing_level: "basic" | "enhanced" | "pro";
  add_ons: unknown;
  status: string;
  raw_limit_seconds: number;
  raw_used_seconds: number;
  revisions_included: number;
  revisions_used: number;
  due_at: string | null;
  brief_want: string | null;
  brief_avoid: string | null;
  brief_must_include: string | null;
  created_at: string;
  updated_at: string;
  order_assets: OrderAsset[];
  order_references: OrderReference[];
  deliveries: Delivery[];
  status_history: StatusHistoryItem[];
};

function fmtDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const email = sp.email ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/orders/${id}?email=${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string; message?: string } | null;
    return (
      <div>
        <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
          <Container>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Order</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              We couldn’t load this order.
            </p>
          </Container>
        </section>

        <section className="py-14">
          <Container className="max-w-2xl">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
              <p className="font-semibold">Error</p>
              <p className="mt-2">
                {data?.message || data?.error || `Request failed (${res.status})`}
              </p>
              <p className="mt-3 text-xs opacity-80">
                Tip: make sure you ran the Supabase migrations and provided the same email used on the order.
              </p>
            </div>
          </Container>
        </section>
      </div>
    );
  }

  const data = (await res.json()) as { order: unknown };
  const o = data.order as OrderDto;

  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Order status</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {o.status} · created {fmtDate(o.created_at)}
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-sm font-semibold tracking-tight">Summary</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">Tier</dt>
                <dd className="font-medium">{o.tier}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">Platform</dt>
                <dd className="font-medium">{o.platform}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">Vibe</dt>
                <dd className="font-medium">{o.vibe}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">Editing</dt>
                <dd className="font-medium">{o.editing_level}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">Due</dt>
                <dd className="font-medium">{fmtDate(o.due_at)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">Revisions</dt>
                <dd className="font-medium">
                  {o.revisions_used}/{o.revisions_included}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-zinc-200/70 pt-6 dark:border-zinc-800/70">
              <h2 className="text-sm font-semibold tracking-tight">Brief</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {o.brief_want || "—"}
              </p>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-sm font-semibold tracking-tight">Timeline</h2>
              <div className="mt-3 space-y-3 text-sm">
                {(o.status_history ?? [])
                  .slice()
                    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                  .slice(0, 8)
                    .map((h) => (
                    <div key={h.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{h.to_status}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                          {h.actor}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        {fmtDate(h.created_at)}
                      </p>
                    </div>
                  ))}
                {(o.status_history ?? []).length === 0 ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">—</p>
                ) : null}
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </div>
  );
}

