import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

function Card({
  title,
  price,
  subtitle,
  bullets,
  highlight,
}: {
  title: string;
  price: string;
  subtitle: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white p-6 shadow-sm dark:bg-zinc-950",
        highlight
          ? "border-zinc-900 dark:border-zinc-100"
          : "border-zinc-200 dark:border-zinc-800",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>
        {highlight ? (
          <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
            Most popular
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="text-3xl font-semibold tracking-tight">{price}</div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          One-time. No subscription required.
        </p>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              ✓
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button href="/order" className="w-full" variant={highlight ? "primary" : "secondary"}>
          Create my rolik
        </Button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Pricing
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Simple tiers by final length. Clear limits on raw footage and revisions
            so your order stays fast and affordable.
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            Prices shown are placeholders for MVP (we’ll finalize before launch).
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <Card
              title="Tier A"
              price="$59"
              subtitle="15–30s final"
              bullets={[
                "Up to 2 minutes raw footage included",
                "1 included revision",
                "Standard delivery 48–72h",
                "Vertical 9:16, 1080×1920",
              ]}
            />
            <Card
              title="Tier B"
              price="$89"
              subtitle="30–60s final"
              bullets={[
                "Up to 5 minutes raw footage included",
                "1 included revision",
                "Standard delivery 48–72h",
                "Great for promos + recaps",
              ]}
              highlight
            />
            <Card
              title="Tier C"
              price="$159"
              subtitle="60–120s final"
              bullets={[
                "Up to 10 minutes raw footage included",
                "2 included revisions (or 1 if we tighten economics)",
                "Standard delivery 48–72h",
                "Best for story-style edits",
              ]}
            />
          </div>

          <div className="mt-10 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="font-semibold">Add-ons (MVP)</p>
                <ul className="mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
                  <li>Subtitles</li>
                  <li>Rush delivery (24h)</li>
                  <li>Extra raw footage</li>
                  <li>Extra revision</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Music policy</p>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  We avoid delivering copyrighted music files. We’ll deliver without
                  music (or safe audio) and you can add trending audio in the
                  platform when posting.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200/70 pt-4 dark:border-zinc-800/70">
              <p className="font-semibold">Editing Levels</p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Basic and Enhanced cover standard editing (no heavy effects). If you
                want hard effects / advanced editing requests, choose Pro/Complex —
                we’ll quote it before payment.
              </p>
            </div>
          </div>

          <p className="mt-8 text-xs text-zinc-500 dark:text-zinc-500">
            By ordering you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </Container>
      </section>
    </div>
  );
}

