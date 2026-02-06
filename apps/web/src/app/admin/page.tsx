import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

type Order = {
  id: string;
  email: string;
  tier: string;
  platform: string;
  content_type: string;
  editing_level: string;
  status: string;
  payment_status: string;
  price_cents: number | null;
  due_at: string | null;
  created_at: string;
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    AWAITING_PAYMENT: "bg-amber-50 text-amber-700",
    PAID: "bg-blue-50 text-blue-700",
    IN_REVIEW: "bg-purple-50 text-purple-700",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700",
    DELIVERED: "bg-emerald-50 text-emerald-700",
    REVISION_REQUESTED: "bg-orange-50 text-orange-700",
    REVISION_IN_PROGRESS: "bg-orange-50 text-orange-700",
    COMPLETED: "bg-green-50 text-green-800",
    CANCELED: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${colors[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    unpaid: "bg-gray-100 text-gray-600",
    pending: "bg-amber-50 text-amber-700",
    paid: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${colors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function fmtDate(v: string | null) {
  if (!v) return "\u2014";
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminOrdersPage() {
  const res = await fetch(`${SITE_URL}/api/admin/orders`, {
    cache: "no-store",
    headers: { cookie: "" },
  });

  let orders: Order[] = [];
  if (res.ok) {
    const data = (await res.json()) as { orders: Order[] };
    orders = data.orders;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy dark:text-white">
            Orders
          </h1>
          <p className="mt-1 text-sm text-brand-navy/60 dark:text-white/60">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-navy/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-navy/10 text-xs font-semibold uppercase tracking-wider text-brand-navy/40 dark:border-white/10 dark:text-white/40">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/5 dark:divide-white/5">
            {orders.map((o) => (
              <tr
                key={o.id}
                className="text-brand-navy/70 transition-colors hover:bg-brand-coral/5 dark:text-white/70"
              >
                <td className="px-4 py-3 font-medium">{o.email}</td>
                <td className="px-4 py-3">{o.content_type ?? "reel"}</td>
                <td className="px-4 py-3">{o.tier}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3">
                  <PaymentBadge status={o.payment_status ?? "unpaid"} />
                </td>
                <td className="px-4 py-3">{fmtDate(o.due_at)}</td>
                <td className="px-4 py-3">{fmtDate(o.created_at)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-xs font-semibold text-brand-coral hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-brand-navy/40 dark:text-white/40"
                >
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
