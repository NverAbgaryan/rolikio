"use client";

import { useEffect, useRef, useState } from "react";
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
  const [deliveryFile, setDeliveryFile] = useState<File | null>(null);
  const [deliveryUploading, setDeliveryUploading] = useState(false);
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const deliveryInputRef = useRef<HTMLInputElement>(null);
  const [msgBody, setMsgBody] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

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

  async function uploadDelivery() {
    if (!deliveryFile) return;
    setDeliveryUploading(true);
    setDeliveryProgress(0);
    try {
      // 1. Get presigned URL
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          kind: "video",
          filename: deliveryFile.name,
          mimeType: deliveryFile.type || "application/octet-stream",
          sizeBytes: deliveryFile.size,
        }),
      });
      const presignData = (await presignRes.json()) as { key: string; url: string };

      // 2. Upload to R2
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignData.url);
        if (deliveryFile.type) xhr.setRequestHeader("Content-Type", deliveryFile.type);
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) setDeliveryProgress(Math.round((evt.loaded / evt.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(deliveryFile);
      });

      // 3. Register delivery
      const res = await fetch(`/api/admin/orders/${id}/deliveries`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          storageKey: presignData.key,
          filename: deliveryFile.name,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; version?: number; error?: string };
      if (data.ok) {
        setActionMsg(`Delivery v${data.version} uploaded`);
        setDeliveryFile(null);
        if (deliveryInputRef.current) deliveryInputRef.current.value = "";
        loadOrder();
      } else {
        setActionMsg(data.error || "Delivery registration failed");
      }
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Upload failed");
    }
    setDeliveryUploading(false);
  }

  async function sendAdminMessage() {
    if (!msgBody.trim()) return;
    setSendingMsg(true);
    await fetch(`/api/orders/${id}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: msgBody }),
    });
    setMsgBody("");
    setSendingMsg(false);
    loadOrder();
  }

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

        {/* Upload delivery form */}
        <div className="mt-4 border-t border-brand-navy/10 pt-4 dark:border-white/10">
          <p className="text-xs font-semibold text-brand-navy/60 dark:text-white/60">Upload delivery</p>
          <div className="mt-2 flex items-end gap-2">
            <input
              ref={deliveryInputRef}
              type="file"
              accept="video/*,image/*"
              onChange={(e) => setDeliveryFile(e.target.files?.[0] ?? null)}
              className="flex-1 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-coral file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-coral-dark"
            />
            <Button
              size="sm"
              onClick={uploadDelivery}
              disabled={!deliveryFile || deliveryUploading}
            >
              {deliveryUploading ? `${deliveryProgress}%` : "Upload"}
            </Button>
          </div>
          {deliveryUploading ? (
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-brand-coral" style={{ width: `${deliveryProgress}%` }} />
            </div>
          ) : null}
        </div>
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
        <div className="mt-4 flex gap-2 border-t border-brand-navy/10 pt-4 dark:border-white/10">
          <input
            value={msgBody}
            onChange={(e) => setMsgBody(e.target.value)}
            placeholder="Reply as admin..."
            className="h-9 flex-1 rounded-lg border border-brand-navy/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/5"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendAdminMessage();
              }
            }}
          />
          <Button size="sm" variant="secondary" onClick={sendAdminMessage} disabled={sendingMsg || !msgBody.trim()}>
            Send
          </Button>
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
