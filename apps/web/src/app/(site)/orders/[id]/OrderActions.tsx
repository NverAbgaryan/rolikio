"use client";

import { useState } from "react";
import { Button } from "@/components/site/Button";
import { cn } from "@/lib/cn";

type Delivery = {
  id: string;
  version_number: number;
  filename: string;
  storage_key: string;
  created_at: string;
};

type Message = {
  id: string;
  sender: string;
  body: string;
  created_at: string;
};

type Props = {
  orderId: string;
  status: string;
  paymentStatus: string;
  ruulCheckoutUrl: string | null;
  revisionsIncluded: number;
  revisionsUsed: number;
  deliveries: Delivery[];
  messages: Message[];
};

function fmtDate(v: string) {
  return new Date(v).toLocaleString();
}

export function OrderActions({
  orderId,
  status,
  paymentStatus,
  ruulCheckoutUrl,
  revisionsIncluded,
  revisionsUsed,
  deliveries,
  messages: initialMessages,
}: Props) {
  const [msgs, setMsgs] = useState<Message[]>(initialMessages);
  const [msgBody, setMsgBody] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [revNotes, setRevNotes] = useState("");
  const [revCategories, setRevCategories] = useState<string[]>([]);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(status);

  const latestDelivery = deliveries.length > 0
    ? deliveries.sort((a, b) => b.version_number - a.version_number)[0]
    : null;

  async function downloadDelivery(storageKey: string, filename: string) {
    const res = await fetch(`/api/downloads?key=${encodeURIComponent(storageKey)}`);
    if (!res.ok) return;
    const data = (await res.json()) as { url: string };
    const a = document.createElement("a");
    a.href = data.url;
    a.download = filename;
    a.target = "_blank";
    a.click();
  }

  async function approve() {
    setActionStatus(null);
    const res = await fetch(`/api/orders/${orderId}/approve`, { method: "POST" });
    const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
    if (res.ok && data.ok) {
      setCurrentStatus("COMPLETED");
      setActionStatus("Order approved and completed.");
    } else {
      setActionStatus(data.message || data.error || "Failed");
    }
  }

  async function requestRevision() {
    if (!revNotes.trim()) return;
    setActionStatus(null);
    const res = await fetch(`/api/orders/${orderId}/request-revision`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ notes: revNotes, categories: revCategories }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
    if (res.ok && data.ok) {
      setCurrentStatus("REVISION_REQUESTED");
      setRevNotes("");
      setRevCategories([]);
      setActionStatus("Revision requested.");
    } else {
      setActionStatus(data.message || data.error || "Failed");
    }
  }

  async function sendMessage() {
    if (!msgBody.trim()) return;
    setSendingMsg(true);
    const res = await fetch(`/api/orders/${orderId}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: msgBody }),
    });
    const data = (await res.json()) as { message?: Message };
    if (res.ok && data.message) {
      setMsgs((prev) => [...prev, data.message!]);
      setMsgBody("");
    }
    setSendingMsg(false);
  }

  const revisionCategories = ["Pacing", "Text/captions", "Trim/length", "Add clip", "Remove clip", "Color", "Other"];

  return (
    <div className="space-y-6">
      {/* Payment */}
      {paymentStatus !== "paid" && ruulCheckoutUrl ? (
        <div className="rounded-2xl border border-brand-coral/20 bg-brand-coral-light p-5">
          <h3 className="text-sm font-bold text-brand-navy">Payment required</h3>
          <p className="mt-1 text-sm text-brand-navy/60">
            Complete your payment to start production.
          </p>
          <div className="mt-3">
            <a
              href={ruulCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-coral-dark"
            >
              Pay now
            </a>
          </div>
        </div>
      ) : paymentStatus !== "paid" ? (
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h3 className="text-sm font-bold text-brand-navy dark:text-white">Awaiting payment link</h3>
          <p className="mt-1 text-sm text-brand-navy/60 dark:text-white/60">
            We&apos;ll send you a payment link shortly via email.
          </p>
        </div>
      ) : null}

      {/* Action feedback */}
      {actionStatus ? (
        <div className="rounded-xl bg-brand-coral/10 px-4 py-2 text-sm font-medium text-brand-coral">
          {actionStatus}
        </div>
      ) : null}

      {/* Latest delivery */}
      {latestDelivery ? (
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-brand-navy dark:text-white">
                Delivery v{latestDelivery.version_number}
              </h3>
              <p className="mt-1 text-xs text-brand-navy/40 dark:text-white/40">
                {latestDelivery.filename} &middot; {fmtDate(latestDelivery.created_at)}
              </p>
            </div>
            <button
              onClick={() => downloadDelivery(latestDelivery.storage_key, latestDelivery.filename)}
              className="rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-navy-light"
            >
              Download
            </button>
          </div>

          {/* Approve / Revise buttons */}
          {currentStatus === "DELIVERED" ? (
            <div className="mt-4 flex flex-col gap-3 border-t border-brand-navy/10 pt-4 sm:flex-row dark:border-white/10">
              <Button onClick={approve} size="sm">
                Approve
              </Button>
              <span className="text-xs text-brand-navy/40 dark:text-white/40 sm:ml-auto">
                {revisionsUsed}/{revisionsIncluded} revision{revisionsIncluded === 1 ? "" : "s"} used
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Revision form */}
      {currentStatus === "DELIVERED" && revisionsUsed < revisionsIncluded ? (
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h3 className="text-sm font-bold text-brand-navy dark:text-white">Request revision</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {revisionCategories.map((cat) => {
              const selected = revCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setRevCategories((prev) =>
                      selected ? prev.filter((c) => c !== cat) : [...prev, cat],
                    )
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    selected
                      ? "border-brand-coral bg-brand-coral text-white"
                      : "border-brand-navy/10 bg-white text-brand-navy/60 hover:bg-brand-coral/5 dark:border-white/10 dark:bg-white/5 dark:text-white/60",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <textarea
            value={revNotes}
            onChange={(e) => setRevNotes(e.target.value)}
            placeholder="Describe the changes you need..."
            className="mt-3 min-h-[100px] w-full rounded-xl border border-brand-navy/10 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-brand-coral/30 dark:border-white/10 dark:bg-white/5"
          />
          <div className="mt-3">
            <Button size="sm" variant="secondary" onClick={requestRevision} disabled={!revNotes.trim()}>
              Submit revision request
            </Button>
          </div>
        </div>
      ) : currentStatus === "DELIVERED" && revisionsUsed >= revisionsIncluded ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          All included revisions used ({revisionsUsed}/{revisionsIncluded}). Contact us for additional revisions.
        </div>
      ) : null}

      {/* All deliveries */}
      {deliveries.length > 1 ? (
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h3 className="text-sm font-bold text-brand-navy dark:text-white">All deliveries</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {deliveries
              .sort((a, b) => b.version_number - a.version_number)
              .map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4">
                  <span className="text-brand-navy/60 dark:text-white/60">
                    v{d.version_number}: {d.filename}
                  </span>
                  <button
                    onClick={() => downloadDelivery(d.storage_key, d.filename)}
                    className="text-xs font-semibold text-brand-coral hover:underline"
                  >
                    Download
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {/* Messages */}
      <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h3 className="text-sm font-bold text-brand-navy dark:text-white">
          Messages ({msgs.length})
        </h3>
        <div className="mt-3 max-h-[400px] space-y-3 overflow-y-auto">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={cn(
                "rounded-xl p-3 text-sm",
                m.sender === "client"
                  ? "ml-8 bg-brand-coral/5 text-brand-navy dark:bg-brand-coral/10 dark:text-white"
                  : "mr-8 bg-brand-navy/5 text-brand-navy dark:bg-white/5 dark:text-white",
              )}
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span>{m.sender === "client" ? "You" : m.sender}</span>
                <span className="font-normal text-brand-navy/30 dark:text-white/30">
                  {fmtDate(m.created_at)}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
            </div>
          ))}
          {msgs.length === 0 ? (
            <p className="text-sm text-brand-navy/40 dark:text-white/40">No messages yet.</p>
          ) : null}
        </div>
        <div className="mt-4 flex gap-2 border-t border-brand-navy/10 pt-4 dark:border-white/10">
          <input
            value={msgBody}
            onChange={(e) => setMsgBody(e.target.value)}
            placeholder="Type a message..."
            className="h-10 flex-1 rounded-xl border border-brand-navy/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand-coral/30 dark:border-white/10 dark:bg-white/5"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button size="sm" onClick={sendMessage} disabled={sendingMsg || !msgBody.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
