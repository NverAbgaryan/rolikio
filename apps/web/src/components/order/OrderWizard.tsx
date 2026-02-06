"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/site/Button";
import { cn } from "@/lib/cn";

type Platform = "instagram" | "tiktok" | "youtube";
type Tier = "A" | "B" | "C";
type EditingLevel = "basic" | "enhanced" | "pro";

type AddOns = {
  subtitles: boolean;
  rush: boolean;
};

type OrderDraft = {
  platform: Platform;
  tier: Tier;
  vibe: string;
  editingLevel: EditingLevel;
  addOns: AddOns;
  files: File[];
  logo?: File;
  voiceNote?: File;
  brief: {
    want: string;
    avoid: string;
    mustInclude: string;
    references: string[];
  };
};

type Step = "choose" | "upload" | "brief" | "review";

type UploadKind = "video" | "image" | "voice" | "logo";
type UploadItem = {
  file: File;
  kind: UploadKind;
  status: "queued" | "uploading" | "done" | "error";
  progress: number; // 0..100
  storageKey?: string;
  error?: string;
};

const tierMeta: Record<
  Tier,
  {
    label: string;
    finalLength: string;
    rawLimitMinutes: number;
    includedRevisions: number;
    basePriceCents: number;
  }
> = {
  A: {
    label: "Tier A",
    finalLength: "15–30s",
    rawLimitMinutes: 2,
    includedRevisions: 1,
    basePriceCents: 5900,
  },
  B: {
    label: "Tier B",
    finalLength: "30–60s",
    rawLimitMinutes: 5,
    includedRevisions: 1,
    basePriceCents: 8900,
  },
  C: {
    label: "Tier C",
    finalLength: "60–120s",
    rawLimitMinutes: 10,
    includedRevisions: 2,
    basePriceCents: 15900,
  },
};

const vibes = [
  "Clean",
  "Cinematic",
  "Energetic",
  "Minimal",
  "Bold text",
  "Warm",
  "Luxury",
  "Playful",
] as const;

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function StepPill({
  active,
  done,
  children,
}: {
  active: boolean;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        done
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : active
            ? "border-zinc-300 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            : "border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500",
      )}
    >
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
          done
            ? "bg-white/20"
            : active
              ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500",
        )}
      >
        {done ? "✓" : "•"}
      </span>
      {children}
    </div>
  );
}

export function OrderWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [draft, setDraft] = useState<OrderDraft>({
    platform: "instagram",
    tier: "B",
    vibe: vibes[0],
    editingLevel: "basic",
    addOns: { subtitles: false, rush: false },
    files: [],
    brief: { want: "", avoid: "", mustInclude: "", references: [""] },
  });
  const [createState, setCreateState] = useState<
    | { type: "idle" }
    | { type: "creating" }
    | { type: "created"; id: string; status: string }
    | { type: "error"; message: string }
  >({ type: "idle" });
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [briefState, setBriefState] = useState<
    | { type: "idle" }
    | { type: "saving" }
    | { type: "saved"; status: string }
    | { type: "error"; message: string }
  >({ type: "idle" });

  const meta = tierMeta[draft.tier];
  const enhancedUpchargeCents = 3000;
  const subtitlesUpchargeCents = 1500;
  const rushUpchargeCents = 2500;

  const price = useMemo(() => {
    if (draft.editingLevel === "pro") return null;
    let total = meta.basePriceCents;
    if (draft.editingLevel === "enhanced") total += enhancedUpchargeCents;
    if (draft.addOns.subtitles) total += subtitlesUpchargeCents;
    if (draft.addOns.rush) total += rushUpchargeCents;
    return total;
  }, [draft, meta.basePriceCents]);

  const canContinueChoose = Boolean(draft.platform && draft.tier && draft.vibe);
  const canContinueUpload = uploads.length > 0 && uploads.every((u) => u.status === "done");
  const canContinueBrief = draft.brief.want.trim().length > 0;

  const steps: Step[] = ["choose", "upload", "brief", "review"];
  const stepIndex = steps.indexOf(step);

  function goNext() {
    setStep(steps[Math.min(stepIndex + 1, steps.length - 1)]!);
  }

  function goBack() {
    setStep(steps[Math.max(stepIndex - 1, 0)]!);
  }

  function ensureUploadItems(newFiles: File[]) {
    const items: UploadItem[] = newFiles.map((file) => ({
      file,
      kind: file.type.startsWith("image/") ? "image" : "video",
      status: "queued" as const,
      progress: 0,
    }));
    setUploads(items);
    // Auto-start uploads immediately
    void uploadItems(items);
  }

  async function uploadItems(items: UploadItem[]) {
    for (let idx = 0; idx < items.length; idx++) {
      const current = items[idx]!;
      if (current.status === "done") continue;

      setUploads((prev) =>
        prev.map((u, i) =>
          i === idx ? { ...u, status: "uploading", progress: 0, error: undefined } : u,
        ),
      );

      try {
        const { key, url } = await presign(sessionId, current);
        setUploads((prev) =>
          prev.map((u, i) => (i === idx ? { ...u, storageKey: key } : u)),
        );
        await uploadViaXhr(url, current.file, (pct) => {
          setUploads((prev) => prev.map((u, i) => (i === idx ? { ...u, progress: pct } : u)));
        });
        setUploads((prev) =>
          prev.map((u, i) => (i === idx ? { ...u, status: "done", progress: 100 } : u)),
        );
      } catch (e) {
        setUploads((prev) =>
          prev.map((u, i) =>
            i === idx
              ? {
                  ...u,
                  status: "error",
                  error: e instanceof Error ? e.message : "Upload failed",
                }
              : u,
          ),
        );
        return;
      }
    }
  }

  async function createDraftOrderAndReturnId() {
    setCreateState({ type: "creating" });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tier: draft.tier,
          platform: draft.platform,
          vibe: draft.vibe,
          editingLevel: draft.editingLevel,
          addOns: draft.addOns,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { id: string; status: string }
        | { error: string; message?: string }
        | null;

      if (!res.ok || !data || "error" in data) {
        setCreateState({
          type: "error",
          message:
            (data && "error" in data && (data.message || data.error)) ||
            `Request failed (${res.status})`,
        });
        return null;
      }

      setCreateState({ type: "created", id: data.id, status: data.status });
      return data.id;
    } catch (e) {
      setCreateState({
        type: "error",
        message: e instanceof Error ? e.message : "Request failed",
      });
      return null;
    }
  }

  async function presign(orderId: string, item: UploadItem) {
    const res = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        orderId,
        kind: item.kind,
        filename: item.file.name,
        mimeType: item.file.type || "application/octet-stream",
        sizeBytes: item.file.size,
      }),
    });
    const data = (await res.json().catch(() => null)) as
      | { key: string; url: string }
      | { error: string; message?: string }
      | null;
    if (!res.ok || !data || "error" in data) {
      throw new Error(
        (data && "error" in data && (data.message || data.error)) ||
          `Presign failed (${res.status})`,
      );
    }
    return data;
  }

  function uploadViaXhr(url: string, file: File, onProgress: (pct: number) => void) {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      if (file.type) xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (evt) => {
        if (!evt.lengthComputable) return;
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed (${xhr.status})`));
      };
      xhr.onerror = () => reject(new Error("Upload failed (network error)"));
      xhr.send(file);
    });
  }

  async function registerAsset(orderId: string, item: UploadItem) {
    if (!item.storageKey) throw new Error("Missing storage key");
    const res = await fetch(`/api/orders/${orderId}/assets`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: item.kind,
        storageKey: item.storageKey,
        filename: item.file.name,
        mimeType: item.file.type || "application/octet-stream",
        sizeBytes: item.file.size,
      }),
    });
    const data = (await res.json().catch(() => null)) as
      | { ok: true }
      | { error: string; message?: string }
      | null;
    if (!res.ok || !data || ("error" in data && data.error)) {
      throw new Error(
        (data && "error" in data && (data.message || data.error)) ||
          `Asset register failed (${res.status})`,
      );
    }
  }

  function retryUploads() {
    const items = uploads.map((u) =>
      u.status === "error" ? { ...u, status: "queued" as const, error: undefined, progress: 0 } : u,
    );
    setUploads(items);
    void uploadItems(items);
  }

  async function submitOrder() {
    setBriefState({ type: "saving" });
    try {
      // 1. Create order
      let orderId = createState.type === "created" ? createState.id : null;
      if (!orderId) {
        orderId = await createDraftOrderAndReturnId();
        if (!orderId) {
          setBriefState({ type: "error", message: createState.type === "error" ? createState.message : "Failed to create order." });
          return;
        }
      }

      // 2. Register uploaded assets on the real order
      for (const upload of uploads) {
        if (upload.status === "done" && upload.storageKey) {
          try {
            await registerAsset(orderId, upload);
          } catch {
            // Asset may already be registered if user retries; continue
          }
        }
      }

      // 3. Save brief + references
      const refs = draft.brief.references
        .map((u) => u.trim())
        .filter(Boolean)
        .slice(0, 5);

      const res = await fetch(`/api/orders/${orderId}/brief`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          want: draft.brief.want,
          avoid: draft.brief.avoid,
          mustInclude: draft.brief.mustInclude,
          references: refs,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; status: string }
        | { error: string; message?: string }
        | null;
      if (!res.ok || !data || "error" in data) {
        setBriefState({
          type: "error",
          message:
            (data && "error" in data && (data.message || data.error)) ||
            `Request failed (${res.status})`,
        });
        return;
      }
      setBriefState({ type: "saved", status: data.status });
      // Redirect to order detail page
      router.push(`/orders/${orderId}`);
    } catch (e) {
      setBriefState({
        type: "error",
        message: e instanceof Error ? e.message : "Request failed",
      });
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap gap-2">
          <StepPill active={step === "choose"} done={stepIndex > 0}>
            Choose
          </StepPill>
          <StepPill active={step === "upload"} done={stepIndex > 1}>
            Upload
          </StepPill>
          <StepPill active={step === "brief"} done={stepIndex > 2}>
            Brief
          </StepPill>
          <StepPill active={step === "review"} done={false}>
            Review
          </StepPill>
        </div>

        <div className="mt-8">
          {step === "choose" ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Step 1 — Choose
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Pick a platform, length tier, vibe, add-ons, and editing level.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Platform</span>
                  <select
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    value={draft.platform}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        platform: e.target.value as Platform,
                      }))
                    }
                  >
                    <option value="instagram">Instagram Reels</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube Shorts</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium">Editing level</span>
                  <select
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    value={draft.editingLevel}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        editingLevel: e.target.value as EditingLevel,
                      }))
                    }
                  >
                    <option value="basic">Basic (standard edit)</option>
                    <option value="enhanced">Enhanced (more polish)</option>
                    <option value="pro">Pro/Complex (quote required)</option>
                  </select>
                </label>
              </div>


              <div className="grid gap-3 sm:grid-cols-3">
                {(["A", "B", "C"] as const).map((t) => {
                  const tMeta = tierMeta[t];
                  const selected = draft.tier === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, tier: t }))}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-colors",
                        selected
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                          : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/40",
                      )}
                    >
                      <div className="text-sm font-semibold">{tMeta.label}</div>
                      <div
                        className={cn(
                          "mt-1 text-xs",
                          selected
                            ? "text-white/80 dark:text-zinc-700"
                            : "text-zinc-500 dark:text-zinc-500",
                        )}
                      >
                        {tMeta.finalLength} final
                      </div>
                      <div
                        className={cn(
                          "mt-3 text-sm font-semibold",
                          selected
                            ? "text-white dark:text-zinc-900"
                            : "text-zinc-900 dark:text-zinc-100",
                        )}
                      >
                        {formatMoney(tMeta.basePriceCents)}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <p className="text-sm font-medium">Vibe</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {vibes.map((v) => {
                    const selected = draft.vibe === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, vibe: v }))}
                        className={cn(
                          "rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                          selected
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900/40",
                        )}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={draft.addOns.subtitles}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        addOns: { ...d.addOns, subtitles: e.target.checked },
                      }))
                    }
                  />
                  <span>
                    <span className="block text-sm font-medium">Subtitles</span>
                    <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                      Burned-in captions for readability.
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={draft.addOns.rush}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        addOns: { ...d.addOns, rush: e.target.checked },
                      }))
                    }
                  />
                  <span>
                    <span className="block text-sm font-medium">Rush (24h)</span>
                    <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                      Faster delivery when available.
                    </span>
                  </span>
                </label>
              </div>

              {draft.editingLevel === "pro" ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                  Pro/Complex requests require a quote. You’ll upload + brief
                  first, then we’ll confirm price + due date before payment.
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
                  Basic/Enhanced cover standard editing (no heavy effects). Want
                  hard effects/advanced requests? Choose Pro/Complex.
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                  Next: upload your clips
                </div>
                <Button
                  onClick={goNext}
                  disabled={!canContinueChoose}
                  aria-disabled={!canContinueChoose}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : null}

          {step === "upload" ? (
            <div className="space-y-7">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Step 2 — Upload
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Add your clips (and optional photos). At least one file is
                  required.
                </p>
              </div>

              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium">
                    Clips (video/photo)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="video/*,image/*"
                    className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 dark:file:bg-zinc-100 dark:file:text-zinc-900 dark:hover:file:bg-white"
                    onChange={(e) => {
                      const list = Array.from(e.target.files ?? []);
                      setDraft((d) => ({ ...d, files: list }));
                      ensureUploadItems(list);
                    }}
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Raw footage limit for {meta.label}: up to{" "}
                    <span className="font-medium">
                      {meta.rawLimitMinutes} minutes
                    </span>{" "}
                    included (MVP rule).
                  </p>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium">Optional logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-zinc-200 dark:file:bg-zinc-900 dark:file:text-zinc-100 dark:hover:file:bg-zinc-800"
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, logo: e.target.files?.[0] }))
                    }
                  />
                </label>
              </div>

              {uploads.length > 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold">Uploads</p>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft((d) => ({ ...d, files: [] }));
                        setUploads([]);
                      }}
                      className="text-xs font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                    {uploads.map((u) => (
                      <li key={`${u.file.name}-${u.file.size}`} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="min-w-0">
                            <p className="truncate">{u.file.name}</p>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                              {(u.file.size / (1024 * 1024)).toFixed(1)} MB · {u.kind}
                            </p>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2 py-1 text-xs font-medium",
                                u.status === "done"
                                  ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                                  : u.status === "error"
                                    ? "bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
                                    : u.status === "uploading"
                                      ? "bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
                                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
                              )}
                            >
                              {u.status}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              u.status === "error" ? "bg-rose-500" : "bg-zinc-900 dark:bg-zinc-100",
                            )}
                            style={{ width: `${u.progress}%` }}
                          />
                        </div>
                        {u.error ? (
                          <p className="text-xs text-rose-700 dark:text-rose-300">
                            {u.error}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button variant="secondary" onClick={goBack}>
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  {uploads.some((u) => u.status === "error") ? (
                    <Button variant="secondary" onClick={retryUploads} size="sm">
                      Retry failed
                    </Button>
                  ) : null}
                  <Button onClick={goNext} disabled={!canContinueUpload}>
                    {uploads.length > 0 && uploads.some((u) => u.status === "uploading")
                      ? "Uploading..."
                      : "Continue"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {step === "brief" ? (
            <div className="space-y-7">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Step 3 — Brief
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  The better the brief, the fewer revisions.
                </p>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium">What do you want? *</span>
                <textarea
                  className="min-h-[120px] w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                  value={draft.brief.want}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      brief: { ...d.brief, want: e.target.value },
                    }))
                  }
                  placeholder="Example: make a clean cafe promo reel similar to this reference, highlight drinks + interior, add 3 on-screen phrases..."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Avoid… (optional)</span>
                  <textarea
                    className="min-h-[90px] w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                    value={draft.brief.avoid}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        brief: { ...d.brief, avoid: e.target.value },
                      }))
                    }
                    placeholder="Example: avoid fast cuts, avoid big bold fonts..."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">
                    Must include… (optional)
                  </span>
                  <textarea
                    className="min-h-[90px] w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
                    value={draft.brief.mustInclude}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        brief: { ...d.brief, mustInclude: e.target.value },
                      }))
                    }
                    placeholder="Example: show latte pour at 00:04, include logo at end..."
                  />
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-medium">Reference links</span>
                  <button
                    type="button"
                    className="text-xs font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
                    onClick={() =>
                      setDraft((d) => {
                        if (d.brief.references.length >= 5) return d;
                        return {
                          ...d,
                          brief: {
                            ...d.brief,
                            references: [...d.brief.references, ""],
                          },
                        };
                      })
                    }
                    disabled={draft.brief.references.length >= 5}
                  >
                    Add link
                  </button>
                </div>

                <div className="space-y-2">
                  {draft.brief.references.map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={url}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            brief: {
                              ...d.brief,
                              references: d.brief.references.map((u, i) =>
                                i === idx ? e.target.value : u,
                              ),
                            },
                          }))
                        }
                        placeholder="https://..."
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                      />
                      {draft.brief.references.length > 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              brief: {
                                ...d.brief,
                                references: d.brief.references.filter(
                                  (_, i) => i !== idx,
                                ),
                              },
                            }))
                          }
                          className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900/40"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Up to 5 links (TikTok/IG/YouTube are fine).
                </p>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-medium">
                  Optional voice note (audio)
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-zinc-200 dark:file:bg-zinc-900 dark:file:text-zinc-100 dark:hover:file:bg-zinc-800"
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, voiceNote: e.target.files?.[0] }))
                  }
                />
              </label>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button variant="secondary" onClick={goBack}>
                  Back
                </Button>
                <Button onClick={goNext} disabled={!canContinueBrief}>
                  Continue
                </Button>
              </div>
            </div>
          ) : null}

          {step === "review" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Review
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Review your order details and submit.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                      Selection
                    </p>
                    <p className="mt-1">
                      {meta.label} · {meta.finalLength} · {draft.vibe}
                    </p>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                      {draft.platform === "instagram"
                        ? "Instagram Reels"
                        : draft.platform === "tiktok"
                          ? "TikTok"
                          : "YouTube Shorts"}{" "}
                      ·{" "}
                      {draft.editingLevel === "basic"
                        ? "Basic"
                        : draft.editingLevel === "enhanced"
                          ? "Enhanced"
                          : "Pro/Complex"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                      Assets
                    </p>
                    <p className="mt-1">{draft.files.length} file(s)</p>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                      {draft.logo ? "Logo included" : "No logo"} ·{" "}
                      {draft.voiceNote ? "Voice note included" : "No voice note"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-zinc-200/70 pt-4 text-zinc-600 dark:border-zinc-800/70 dark:text-zinc-400">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Brief
                  </p>
                  <p className="mt-1 line-clamp-4 whitespace-pre-wrap">
                    {draft.brief.want.trim() || "(missing)"}
                  </p>
                </div>
              </div>

              {createState.type === "created" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                  Order created: <span className="font-mono">{createState.id}</span>{" "}
                  · status <span className="font-medium">{createState.status}</span>
                </div>
              ) : null}

              {briefState.type === "saved" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                  Brief saved · order status{" "}
                  <span className="font-medium">{briefState.status}</span>
                </div>
              ) : null}

              {createState.type === "error" ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
                  {createState.message}
                </div>
              ) : null}

              {briefState.type === "error" ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
                  {briefState.message}
                </div>
              ) : null}

              {draft.editingLevel === "pro" ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                  Pro/Complex editing requires a custom quote. After submitting,
                  our team will review your brief and send you a quote before payment.
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
                  After submitting, we will send you a payment link. Once
                  paid, your order enters production with delivery in 48–72h.
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="secondary" onClick={goBack}>
                  Back
                </Button>
                <Button
                  onClick={submitOrder}
                  disabled={
                    briefState.type === "saving" ||
                    briefState.type === "saved" ||
                    !draft.brief.want.trim()
                  }
                >
                  {briefState.type === "saving"
                    ? "Submitting..."
                    : briefState.type === "saved"
                      ? "Order submitted"
                      : draft.editingLevel === "pro"
                        ? "Request quote"
                        : "Submit order"}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-semibold tracking-tight">Order summary</p>
          <div className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center justify-between gap-4">
              <span>{meta.label}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatMoney(meta.basePriceCents)}
              </span>
            </div>
            {draft.editingLevel === "enhanced" ? (
              <div className="flex items-center justify-between gap-4">
                <span>Enhanced</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  +{formatMoney(enhancedUpchargeCents)}
                </span>
              </div>
            ) : null}
            {draft.addOns.subtitles ? (
              <div className="flex items-center justify-between gap-4">
                <span>Subtitles</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  +{formatMoney(subtitlesUpchargeCents)}
                </span>
              </div>
            ) : null}
            {draft.addOns.rush ? (
              <div className="flex items-center justify-between gap-4">
                <span>Rush (24h)</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  +{formatMoney(rushUpchargeCents)}
                </span>
              </div>
            ) : null}
          </div>

          <div className="mt-4 border-t border-zinc-200/70 pt-4 dark:border-zinc-800/70">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-lg font-semibold tracking-tight">
                {draft.editingLevel === "pro" || price == null
                  ? "Quote"
                  : formatMoney(price)}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              Delivery: {draft.addOns.rush ? "24h (rush)" : "48–72h (standard)"} ·{" "}
              {meta.includedRevisions} included revision
              {meta.includedRevisions === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Constraints (MVP)
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Final reel ≤ 120 seconds</li>
              <li>Raw footage limit is enforced by tier</li>
              <li>Revisions are limited by tier</li>
              <li>No copyrighted music delivered</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

