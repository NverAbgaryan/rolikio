"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/site/Button";

type Order = {
  id: string;
  email: string;
  tier: string;
  platform: string;
  content_type: string;
  vibe: string;
  editing_level: string;
  status: string;
  payment_status: string;
  ruul_checkout_url: string | null;
  price_cents: number | null;
  due_at: string | null;
  paid_at: string | null;
  brief_want: string | null;
  brief_avoid: string | null;
  brief_must_include: string | null;
  revisions_included: number;
  revisions_used: number;
  created_at: string;
  order_assets: { id: string; kind: string; filename: string; size_bytes: number }[];
  order_references: { id: string; url: string }[];
  deliveries: { id: string; version_number: number; filename: string; created_at: string }[];
  status_history: { id: string; from_status: string | null; to_status: string; actor: string; created_at: string }[];
  messages: { id: string; sender: string; body: string; created_at: string }[];
};

function fmtDate(v: string | null | undefined) {
  if (!v) return "\u2014";
  return new Date(v).toLocaleString();
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [ruulUrl, setRuulUrl] = useState("");

  async function loadOrder() {
    const res = await fetch(`/api/admin/orders/${id}`);
    if (!res.ok) {
      setError("Failed to load order");
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { order: Order };
    setOrder(data.order);
    setRuulUrl(data.order.ruul_checkout_url ?? "");
    setLoading(false);
  }

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function doAction(url: string, body?: object) {
    setActionMsg(null);
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
    if (res.ok && data.ok) {
      setActionMsg("Done");
      loadOrder();
    } else {
      setActionMsg(data.message || data.error || "Action failed");
    }
  }

  if (loading) {
    return <p className="text-sm text-brand-navy/40 dark:text-white/40">Loading...</p>;
  }
  if (error || !order) {
    return <p className="text-sm text-red-600">{error || "Order not found"}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy dark:text-white">
          Order {order.id.slice(0, 8)}...
        </h1>
        <p className="mt-1 text-sm text-brand-navy/60 dark:text-white/60">
          {order.email} &middot; {order.tier} &middot; {order.platform} &middot; {order.editing_level}
        </p>
      </div>

      {actionMsg ? (
        <div className="rounded-xl bg-brand-coral/10 px-4 py-2 text-sm font-medium text-brand-coral">
          {actionMsg}
        </div>
      ) : null}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-sm font-bold text-brand-navy dark:text-white">Status</h2>
          <p className="mt-2 text-lg font-bold text-brand-coral">{order.status}</p>
          <p className="mt-1 text-xs text-brand-navy/40">Payment: {order.payment_status ?? "unpaid"}</p>
          <p className="text-xs text-brand-navy/40">Due: {fmtDate(order.due_at)}</p>
          <p className="text-xs text-brand-navy/40">Paid: {fmtDate(order.paid_at)}</p>
          <p className="text-xs text-brand-navy/40">Revisions: {order.revisions_used}/{order.revisions_included}</p>
        </div>

        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-sm font-bold text-brand-navy dark:text-white">Brief</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-brand-navy/60 dark:text-white/60">
            {order.brief_want || "\u2014"}
          </p>
          {order.brief_avoid ? (
            <p className="mt-2 text-xs text-brand-navy/40">Avoid: {order.brief_avoid}</p>
          ) : null}
          {order.brief_must_include ? (
            <p className="text-xs text-brand-navy/40">Must include: {order.brief_must_include}</p>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-bold text-brand-navy dark:text-white">Actions</h2>

        <div className="mt-4 space-y-4">
          {/* Set payment link */}
          <div className="flex items-end gap-2">
            <label className="flex-1 space-y-1">
              <span className="text-xs font-medium text-brand-navy/60">Ruul.io checkout URL</span>
              <input
                value={ruulUrl}
                onChange={(e) => setRuulUrl(e.target.value)}
                placeholder="https://app.ruul.io/..."
                className="h-9 w-full rounded-lg border border-brand-navy/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/5"
              />
            </label>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                doAction(`/api/admin/orders/${id}/payment-link`, { ruulCheckoutUrl: ruulUrl })
              }
            >
              Set link
            </Button>
          </div>

          {/* Status actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => doAction(`/api/admin/orders/${id}/mark-paid`)}>
              Mark paid
            </Button>
            {["IN_REVIEW", "IN_PROGRESS", "DELIVERED"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant="secondary"
                onClick={() => doAction(`/api/admin/orders/${id}/status`, { status: s })}
              >
                Set {s}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-bold text-brand-navy dark:text-white">
          Assets ({order.order_assets.length})
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-brand-navy/60 dark:text-white/60">
          {order.order_assets.map((a) => (
            <li key={a.id}>
              {a.filename} &middot; {a.kind} &middot; {(a.size_bytes / (1024 * 1024)).toFixed(1)} MB
            </li>
          ))}
          {order.order_assets.length === 0 ? <li>No assets</li> : null}
        </ul>
      </div>

      {/* References */}
      {order.order_references.length > 0 ? (
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-sm font-bold text-brand-navy dark:text-white">References</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {order.order_references.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand-coral hover:underline">
                  {r.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Deliveries */}
      <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-bold text-brand-navy dark:text-white">
          Deliveries ({order.deliveries.length})
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-brand-navy/60 dark:text-white/60">
          {order.deliveries.map((d) => (
            <li key={d.id}>
              v{d.version_number}: {d.filename} &middot; {fmtDate(d.created_at)}
            </li>
          ))}
          {order.deliveries.length === 0 ? <li>No deliveries yet</li> : null}
        </ul>
      </div>

      {/* Messages */}
      <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-bold text-brand-navy dark:text-white">
          Messages ({order.messages.length})
        </h2>
        <div className="mt-3 space-y-3">
          {order.messages.map((m) => (
            <div key={m.id} className="text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-brand-navy dark:text-white">{m.sender}</span>
                <span className="text-xs text-brand-navy/30">{fmtDate(m.created_at)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-brand-navy/60 dark:text-white/60">{m.body}</p>
            </div>
          ))}
          {order.messages.length === 0 ? (
            <p className="text-sm text-brand-navy/40 dark:text-white/40">No messages</p>
          ) : null}
        </div>
      </div>

      {/* Status history */}
      <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-bold text-brand-navy dark:text-white">Status history</h2>
        <div className="mt-3 space-y-2 text-sm">
          {order.status_history
            .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
            .map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-4">
                <span className="text-brand-navy/60 dark:text-white/60">
                  {h.from_status ?? "\u2014"} → <span className="font-medium">{h.to_status}</span> ({h.actor})
                </span>
                <span className="text-xs text-brand-navy/30">{fmtDate(h.created_at)}</span>
              </div>
            ))}
          {order.status_history.length === 0 ? (
            <p className="text-brand-navy/40 dark:text-white/40">No history</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
