import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSignedDownloadUrl } from "@/lib/r2/signed-url";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your rolik.io orders.",
  robots: { index: false, follow: false },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },
  QUOTE_REQUESTED: { label: "Quote requested", color: "text-purple-700", bg: "bg-purple-50" },
  AWAITING_PAYMENT: { label: "Awaiting payment", color: "text-amber-700", bg: "bg-amber-50" },
  PAID: { label: "Paid", color: "text-blue-700", bg: "bg-blue-50" },
  IN_REVIEW: { label: "In review", color: "text-purple-700", bg: "bg-purple-50" },
  IN_PROGRESS: { label: "In progress", color: "text-indigo-700", bg: "bg-indigo-50" },
  DELIVERED: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-50" },
  REVISION_REQUESTED: { label: "Revision requested", color: "text-orange-700", bg: "bg-orange-50" },
  REVISION_IN_PROGRESS: { label: "Revision in progress", color: "text-orange-700", bg: "bg-orange-50" },
  COMPLETED: { label: "Completed", color: "text-green-800", bg: "bg-green-50" },
  CANCELED: { label: "Canceled", color: "text-red-700", bg: "bg-red-50" },
};

const platformIcons: Record<string, string> = {
  instagram: "IG",
  tiktok: "TT",
  youtube: "YT",
};

const tierLabels: Record<string, string> = {
  A: "Quick Reel",
  B: "Standard Reel",
  C: "Full Reel",
};

function fmtDate(v: string | null) {
  if (!v) return null;
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function timeAgo(v: string) {
  const diff = Date.now() - new Date(v).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return fmtDate(v) ?? "";
}

type OrderAsset = {
  id: string;
  kind: string;
  filename: string;
  mime_type: string;
  storage_key: string;
};

type OrderDelivery = {
  id: string;
  version_number: number;
  filename: string;
};

type Order = {
  id: string;
  tier: string;
  platform: string;
  vibe: string;
  editing_level: string;
  status: string;
  payment_status: string;
  brief_want: string | null;
  due_at: string | null;
  created_at: string;
  order_assets: OrderAsset[];
  deliveries: OrderDelivery[];
};

export default async function MyOrdersPage() {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/login");
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const userId = userData.user.id;
  const email = userData.user.email ?? "";

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id,tier,platform,vibe,editing_level,status,payment_status,brief_want,due_at,created_at,order_assets(id,kind,filename,mime_type,storage_key),deliveries(id,version_number,filename)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const orderList = (orders as Order[]) ?? [];

  // Generate signed URLs for the first image asset of each order (for thumbnails)
  const thumbnailUrls: Record<string, string> = {};
  await Promise.all(
    orderList.map(async (o) => {
      const imageAsset = o.order_assets?.find(
        (a) => a.kind === "image" || a.mime_type?.startsWith("image/"),
      );
      if (imageAsset?.storage_key) {
        const url = await getSignedDownloadUrl(imageAsset.storage_key, 3600);
        if (url) thumbnailUrls[o.id] = url;
      }
    }),
  );

  return (
    <div>
      <section className="border-b border-brand-navy/10 bg-gradient-to-br from-brand-coral-light/50 via-white to-white py-10 dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy">
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

      <section className="py-10">
        <Container>
          {orderList.length === 0 ? (
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-coral/10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-brand-coral">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-brand-navy dark:text-white">
                No orders yet
              </p>
              <p className="mt-1 text-sm text-brand-navy/50 dark:text-white/50">
                Create your first order and we&apos;ll handle the editing.
              </p>
              <div className="mt-6">
                <Button href="/order">Create your first order</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {orderList.map((o) => {
                const sc = statusConfig[o.status] ?? { label: o.status, color: "text-gray-600", bg: "bg-gray-100" };
                const needsAction = o.status === "DELIVERED" || o.status === "AWAITING_PAYMENT";
                const imageAssets = o.order_assets?.filter((a) => a.kind === "image" || a.mime_type?.startsWith("image/")) ?? [];
                const videoAssets = o.order_assets?.filter((a) => a.kind === "video" || a.mime_type?.startsWith("video/")) ?? [];
                const totalAssets = o.order_assets?.length ?? 0;
                const hasDelivery = (o.deliveries?.length ?? 0) > 0;
                const briefPreview = o.brief_want ? (o.brief_want.length > 120 ? o.brief_want.slice(0, 120) + "..." : o.brief_want) : null;

                return (
                  <Link
                    key={o.id}
                    href={`/orders/${o.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-sm transition-all hover:shadow-lg hover:border-brand-coral/30 dark:border-white/10 dark:bg-white/5"
                  >
                    {/* Media thumbnail area */}
                    <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-navy/5 to-brand-coral/5 dark:from-brand-navy dark:to-brand-navy">
                      {/* Actual image preview */}
                      {thumbnailUrls[o.id] ? (
                        <Image
                          src={thumbnailUrls[o.id]}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      ) : null}

                      {/* Overlay for text readability when image exists */}
                      {thumbnailUrls[o.id] ? (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30" />
                      ) : null}
                      {/* Platform badge */}
                      <div className="absolute left-3 top-3 flex items-center gap-1.5">
                        <span className="rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-brand-navy shadow-sm backdrop-blur dark:bg-brand-navy/90 dark:text-white">
                          {platformIcons[o.platform] ?? o.platform}
                        </span>
                        <span className="rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-brand-navy/70 shadow-sm backdrop-blur dark:bg-brand-navy/90 dark:text-white/70">
                          {o.vibe}
                        </span>
                      </div>

                      {/* Status badge */}
                      <div className="absolute right-3 top-3">
                        <span className={`rounded-lg px-2 py-1 text-xs font-bold shadow-sm ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>

                      {/* Center content (only when no image thumbnail) */}
                      {!thumbnailUrls[o.id] ? (
                        <div className="flex flex-col items-center gap-2 text-brand-navy/30 dark:text-white/30">
                          {hasDelivery ? (
                            <div className="flex flex-col items-center">
                              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-brand-coral">
                                <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
                              </svg>
                              <span className="mt-1 text-xs font-semibold text-brand-coral">
                                Delivery ready
                              </span>
                            </div>
                          ) : totalAssets > 0 ? (
                            <div className="flex items-center gap-3">
                              {videoAssets.length > 0 ? (
                                <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1 shadow-sm backdrop-blur">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
                                  </svg>
                                  <span className="text-xs font-semibold">{videoAssets.length} video{videoAssets.length > 1 ? "s" : ""}</span>
                                </div>
                              ) : null}
                              {imageAssets.length > 0 ? (
                                <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1 shadow-sm backdrop-blur">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                  </svg>
                                  <span className="text-xs font-semibold">{imageAssets.length} photo{imageAssets.length > 1 ? "s" : ""}</span>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-xs">No files yet</span>
                          )}
                        </div>
                      ) : (
                        // File count badge on top of image
                        totalAssets > 0 ? (
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-black/50 px-2 py-1 text-white backdrop-blur">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <span className="text-xs font-semibold">{totalAssets}</span>
                          </div>
                        ) : null
                      )}

                      {/* Action needed overlay */}
                      {needsAction ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-coral/90 to-brand-coral/0 px-4 py-3">
                          <span className="text-xs font-bold text-white">
                            {o.status === "DELIVERED" ? "Review your delivery" : "Payment required"}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-4">
                      {/* Tier + editing level */}
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-brand-navy dark:text-white">
                          {tierLabels[o.tier] ?? `Tier ${o.tier}`}
                        </h3>
                        <span className="rounded-full bg-brand-navy/5 px-2 py-0.5 text-xs font-medium text-brand-navy/60 dark:bg-white/10 dark:text-white/60">
                          {o.editing_level}
                        </span>
                      </div>

                      {/* Brief preview */}
                      {briefPreview ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-navy/50 dark:text-white/50">
                          {briefPreview}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs italic text-brand-navy/30 dark:text-white/30">
                          No brief yet
                        </p>
                      )}

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                        <span className="text-xs text-brand-navy/40 dark:text-white/40">
                          {timeAgo(o.created_at)}
                          {o.due_at ? ` \u00B7 Due ${fmtDate(o.due_at)}` : ""}
                        </span>
                        <span className="text-xs font-semibold text-brand-coral opacity-0 transition-opacity group-hover:opacity-100">
                          View &rarr;
                        </span>
                      </div>
                    </div>
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
