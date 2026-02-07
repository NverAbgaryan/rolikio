import { redirect } from "next/navigation";
import { Container } from "@/components/site/Container";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OrderActions } from "./OrderActions";

type PageProps = {
  params: Promise<{ id: string }>;
};

function fmtDate(value: string | null | undefined) {
  if (!value) return "\u2014";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "\u2014";
  return d.toLocaleString();
}

type OrderDto = {
  id: string;
  user_id: string;
  email: string;
  tier: string;
  platform: string;
  vibe: string;
  editing_level: string;
  status: string;
  payment_status: string;
  ruul_checkout_url: string | null;
  revisions_included: number;
  revisions_used: number;
  due_at: string | null;
  brief_want: string | null;
  created_at: string;
  order_assets: { id: string; kind: string; filename: string; size_bytes: number }[];
  order_references: { id: string; url: string }[];
  deliveries: { id: string; version_number: number; filename: string; storage_key: string; created_at: string; duration_seconds: number | null }[];
  status_history: { id: string; from_status: string | null; to_status: string; actor: string; created_at: string }[];
  messages: { id: string; sender: string; body: string; created_at: string }[];
};

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  QUOTE_REQUESTED: { label: "Quote requested", color: "bg-purple-50 text-purple-700" },
  QUOTED: { label: "Quoted", color: "bg-purple-50 text-purple-700" },
  AWAITING_PAYMENT: { label: "Awaiting payment", color: "bg-amber-50 text-amber-700" },
  PAID: { label: "Paid", color: "bg-blue-50 text-blue-700" },
  IN_REVIEW: { label: "In review", color: "bg-purple-50 text-purple-700" },
  IN_PROGRESS: { label: "In progress", color: "bg-indigo-50 text-indigo-700" },
  DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700" },
  REVISION_REQUESTED: { label: "Revision requested", color: "bg-orange-50 text-orange-700" },
  REVISION_IN_PROGRESS: { label: "Revision in progress", color: "bg-orange-50 text-orange-700" },
  COMPLETED: { label: "Completed", color: "bg-green-50 text-green-800" },
  CANCELED: { label: "Canceled", color: "bg-red-50 text-red-700" },
  REFUNDED: { label: "Refunded", color: "bg-red-50 text-red-700" },
};

function ErrorPage({ message }: { message: string }) {
  return (
    <div>
      <section className="border-b border-brand-navy/10 py-14">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy dark:text-white">Order</h1>
        </Container>
      </section>
      <section className="py-14">
        <Container className="max-w-2xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
            <p className="font-semibold">Error</p>
            <p className="mt-2">{message}</p>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return <ErrorPage message="Service unavailable. Please try again." />;
  }

  // Require authentication
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const currentUserId = userData.user.id;

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id,user_id,email,tier,platform,vibe,editing_level,status,payment_status,ruul_checkout_url,revisions_included,revisions_used,due_at,brief_want,created_at,order_assets(id,kind,filename,size_bytes),order_references(id,url),deliveries(id,version_number,filename,storage_key,created_at,duration_seconds),status_history(id,from_status,to_status,actor,created_at),messages(id,sender,body,created_at)" as const,
    )
    .eq("id", id)
    .single();

  if (error || !order) {
    return <ErrorPage message="Order not found." />;
  }

  // Authorization: must be the order owner
  if (order.user_id !== currentUserId) {
    // Also check admin
    const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const isAdmin = userData.user.email && adminEmails.includes(userData.user.email.toLowerCase());
    if (!isAdmin) {
      return <ErrorPage message="You don\u2019t have access to this order." />;
    }
  }

  const o = order as unknown as OrderDto;
  const sl = statusLabels[o.status] ?? { label: o.status, color: "bg-gray-100 text-gray-700" };

  return (
    <div>
      <section className="border-b border-brand-navy/10 bg-gradient-to-br from-brand-coral-light/50 via-white to-white py-14 dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-brand-navy dark:text-white">
                  Order status
                </h1>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${sl.color}`}>
                  {sl.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-brand-navy/60 dark:text-white/60">
                {o.tier} &middot; {o.platform} &middot; {o.editing_level} &middot; Created {fmtDate(o.created_at)}
              </p>
            </div>
            {o.due_at ? (
              <div className="text-sm text-brand-navy/60 dark:text-white/60">
                Due: <span className="font-semibold text-brand-navy dark:text-white">{fmtDate(o.due_at)}</span>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <OrderActions
            orderId={o.id}
            status={o.status}
            paymentStatus={o.payment_status ?? "unpaid"}
            ruulCheckoutUrl={o.ruul_checkout_url ?? null}
            revisionsIncluded={o.revisions_included}
            revisionsUsed={o.revisions_used}
            deliveries={o.deliveries ?? []}
            messages={o.messages ?? []}
          />

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="text-sm font-bold text-brand-navy dark:text-white">Summary</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-brand-navy/50 dark:text-white/50">Tier</dt><dd className="font-medium text-brand-navy dark:text-white">{o.tier}</dd></div>
                <div className="flex justify-between"><dt className="text-brand-navy/50 dark:text-white/50">Platform</dt><dd className="font-medium text-brand-navy dark:text-white">{o.platform}</dd></div>
                <div className="flex justify-between"><dt className="text-brand-navy/50 dark:text-white/50">Editing</dt><dd className="font-medium text-brand-navy dark:text-white">{o.editing_level}</dd></div>
                <div className="flex justify-between"><dt className="text-brand-navy/50 dark:text-white/50">Revisions</dt><dd className="font-medium text-brand-navy dark:text-white">{o.revisions_used}/{o.revisions_included}</dd></div>
              </dl>
            </div>

            <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="text-sm font-bold text-brand-navy dark:text-white">Brief</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-brand-navy/60 dark:text-white/60">{o.brief_want || "\u2014"}</p>
            </div>

            <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="text-sm font-bold text-brand-navy dark:text-white">Assets ({o.order_assets?.length ?? 0})</h2>
              <ul className="mt-2 space-y-1 text-sm text-brand-navy/60 dark:text-white/60">
                {(o.order_assets ?? []).map((a) => (<li key={a.id}>{a.filename} &middot; {a.kind}</li>))}
                {(o.order_assets ?? []).length === 0 ? <li>None</li> : null}
              </ul>
            </div>

            {(o.order_references ?? []).length > 0 ? (
              <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <h2 className="text-sm font-bold text-brand-navy dark:text-white">References</h2>
                <ul className="mt-2 space-y-1 text-sm">
                  {o.order_references.map((r) => (<li key={r.id} className="truncate text-brand-coral">{r.url}</li>))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="text-sm font-bold text-brand-navy dark:text-white">Timeline</h2>
              <div className="mt-3 space-y-2 text-sm">
                {(o.status_history ?? []).sort((a, b) => (a.created_at > b.created_at ? -1 : 1)).slice(0, 10).map((h) => (
                  <div key={h.id} className="flex items-start justify-between gap-3">
                    <span className="font-medium text-brand-navy/70 dark:text-white/70">{h.to_status}</span>
                    <span className="text-xs text-brand-navy/30 dark:text-white/30">{fmtDate(h.created_at)}</span>
                  </div>
                ))}
                {(o.status_history ?? []).length === 0 ? <p className="text-brand-navy/40 dark:text-white/40">{"\u2014"}</p> : null}
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </div>
  );
}
