import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your rolik.io orders.",
  robots: { index: false, follow: false },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  QUOTE_REQUESTED: { label: "Quote requested", color: "bg-purple-50 text-purple-700" },
  AWAITING_PAYMENT: { label: "Awaiting payment", color: "bg-amber-50 text-amber-700" },
  PAID: { label: "Paid", color: "bg-blue-50 text-blue-700" },
  IN_REVIEW: { label: "In review", color: "bg-purple-50 text-purple-700" },
  IN_PROGRESS: { label: "In progress", color: "bg-indigo-50 text-indigo-700" },
  DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700" },
  REVISION_REQUESTED: { label: "Revision requested", color: "bg-orange-50 text-orange-700" },
  REVISION_IN_PROGRESS: { label: "Revision in progress", color: "bg-orange-50 text-orange-700" },
  COMPLETED: { label: "Completed", color: "bg-green-50 text-green-800" },
  CANCELED: { label: "Canceled", color: "bg-red-50 text-red-700" },
};

function fmtDate(v: string | null) {
  if (!v) return "\u2014";
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Order = {
  id: string;
  tier: string;
  platform: string;
  vibe: string;
  editing_level: string;
  status: string;
  payment_status: string;
  due_at: string | null;
  created_at: string;
};

export default async function MyOrdersPage() {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/login");
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.email) {
    redirect("/login");
  }

  const email = userData.user.email;

  const { data: orders } = await supabase
    .from("orders")
    .select("id,tier,platform,vibe,editing_level,status,payment_status,due_at,created_at")
    .eq("email", email)
    .order("created_at", { ascending: false });

  const orderList = (orders as Order[]) ?? [];

  return (
    <div>
      <section className="border-b border-brand-navy/10 bg-gradient-to-br from-brand-coral-light/50 via-white to-white py-14 dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-navy dark:text-white">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-brand-navy/60 dark:text-white/60">
                {orderList.length} order{orderList.length === 1 ? "" : "s"} &middot; {email}
              </p>
            </div>
            <Button href="/order" size="sm">
              New order
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          {orderList.length === 0 ? (
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-brand-navy/40 dark:text-white/40">
                No orders yet.
              </p>
              <div className="mt-4">
                <Button href="/order">Create your first order</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {orderList.map((o) => {
                const sl = statusLabels[o.status] ?? { label: o.status, color: "bg-gray-100 text-gray-700" };
                const needsAction = o.status === "DELIVERED" || o.status === "AWAITING_PAYMENT";
                return (
                  <Link
                    key={o.id}
                    href={`/orders/${o.id}`}
                    className="flex flex-col gap-3 rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${sl.color}`}>
                          {sl.label}
                        </span>
                        {needsAction ? (
                          <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-xs font-semibold text-brand-coral">
                            Action needed
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm font-medium text-brand-navy dark:text-white">
                        {o.tier} &middot; {o.platform} &middot; {o.vibe} &middot; {o.editing_level}
                      </p>
                      <p className="text-xs text-brand-navy/40 dark:text-white/40">
                        Created {fmtDate(o.created_at)}
                        {o.due_at ? ` \u00B7 Due ${fmtDate(o.due_at)}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-brand-coral">
                      View &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
