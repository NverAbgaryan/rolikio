import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

function Check() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-coral/10 text-brand-coral">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SubCard({
  title,
  price,
  period,
  subtitle,
  bullets,
  highlight,
}: {
  title: string;
  price: string;
  period: string;
  subtitle: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "relative rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:bg-white/5",
        highlight
          ? "border-brand-coral ring-2 ring-brand-coral/20"
          : "border-brand-navy/10 dark:border-white/10",
      ].join(" ")}
    >
      {highlight ? (
        <span className="absolute -top-3 right-6 rounded-full bg-brand-coral px-3 py-1 text-xs font-bold text-white shadow-sm">
          Best value
        </span>
      ) : null}

      <h2 className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm text-brand-navy/60 dark:text-white/60">
        {subtitle}
      </p>

      <div className="mt-6">
        <span className="text-4xl font-bold tracking-tight text-brand-navy dark:text-white">
          {price}
        </span>
        <span className="ml-1 text-sm text-brand-navy/40 dark:text-white/40">
          {period}
        </span>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-brand-navy/70 dark:text-white/70">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2.5">
            <Check />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button
          href="/subscribe"
          className="w-full"
          variant={highlight ? "primary" : "secondary"}
        >
          Start {title}
        </Button>
      </div>
    </div>
  );
}

function OneOffCard({
  title,
  price,
  bullets,
}: {
  title: string;
  price: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-bold tracking-tight text-brand-navy dark:text-white">
          {title}
        </h3>
        <span className="text-lg font-bold text-brand-coral">{price}</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-brand-navy/60 dark:text-white/60">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <Check />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Button href="/order" variant="ghost" size="sm" className="w-full">
          Order now
        </Button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div>
      {/* --- HEADER --- */}
      <section className="bg-gradient-to-br from-brand-coral-light via-white to-brand-orange-light py-16 dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy">
        <Container className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
            Pricing
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
            One team for all your content editing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-brand-navy/60 dark:text-white/60">
            Subscribe for ongoing content management, or order individual
            pieces when you need them. No long-term contracts.
          </p>
        </Container>
      </section>

      {/* --- SUBSCRIPTION PLANS --- */}
      <section className="py-16">
        <Container>
          <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-brand-coral">
            Monthly subscriptions
          </h2>
          <p className="mt-2 text-center text-2xl font-bold tracking-tight text-brand-navy dark:text-white">
            Let us manage your content pipeline
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            <SubCard
              title="Starter"
              price="$299"
              period="/month"
              subtitle="For businesses starting with consistent content"
              bullets={[
                "8 content pieces per month (reels + photos)",
                "1 revision per piece",
                "Song suggestions for every reel",
                "Caption suggestions for every piece",
                "Suggested posting schedule",
                "Upload in app or shared folder (Drive/Dropbox)",
                "48-72h turnaround per piece",
                "Cancel anytime",
              ]}
            />
            <SubCard
              title="Growth"
              price="$599"
              period="/month"
              subtitle="For businesses serious about daily content"
              bullets={[
                "20 content pieces per month (reels + photos)",
                "2 revisions per piece",
                "Song suggestions for every reel",
                "Caption suggestions for every piece",
                "Weekly content calendar",
                "Dedicated editor (style consistency)",
                "Priority 24-48h turnaround",
                "Upload in app or shared folder (Drive/Dropbox)",
                "Cancel anytime",
              ]}
              highlight
            />
          </div>
        </Container>
      </section>

      {/* --- ONE-OFF --- */}
      <section className="border-t border-brand-navy/10 bg-white py-16 dark:border-white/10 dark:bg-white/5">
        <Container>
          <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-brand-coral">
            One-off orders
          </h2>
          <p className="mt-2 text-center text-2xl font-bold tracking-tight text-brand-navy dark:text-white">
            Need just one piece? No problem.
          </p>

          <div className="mt-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-navy/40 dark:text-white/40">
              Reels
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <OneOffCard
                title="Quick Reel"
                price="$59"
                bullets={["15-30s final", "2 min raw footage", "1 revision", "48-72h delivery"]}
              />
              <OneOffCard
                title="Standard Reel"
                price="$89"
                bullets={["30-60s final", "5 min raw footage", "1 revision", "48-72h delivery"]}
              />
              <OneOffCard
                title="Full Reel"
                price="$159"
                bullets={["60-120s final", "10 min raw footage", "2 revisions", "48-72h delivery"]}
              />
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-navy/40 dark:text-white/40">
              Photo editing
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <OneOffCard
                title="Single Photo"
                price="$15"
                bullets={["Color correction", "Retouching", "Text overlay", "48-72h delivery"]}
              />
              <OneOffCard
                title="Carousel Pack"
                price="$49"
                bullets={["5 photos", "Styled and consistent", "1 revision", "48-72h delivery"]}
              />
              <OneOffCard
                title="Story Pack"
                price="$29"
                bullets={["3 stories", "On-brand templates", "1 revision", "48-72h delivery"]}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* --- ADD-ONS + POLICIES --- */}
      <section className="py-16">
        <Container>
          <div className="grid gap-6 rounded-2xl border border-brand-navy/10 bg-white p-8 text-sm sm:grid-cols-3 dark:border-white/10 dark:bg-white/5">
            <div>
              <p className="font-bold text-brand-navy dark:text-white">Add-ons</p>
              <ul className="mt-3 space-y-2 text-brand-navy/60 dark:text-white/60">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" />
                  Subtitles / captions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  Rush delivery (24h)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" />
                  Extra revision
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  Song suggestion (free with subscription)
                </li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-brand-navy dark:text-white">
                Editing levels
              </p>
              <p className="mt-3 text-brand-navy/60 dark:text-white/60">
                <strong className="text-brand-navy dark:text-white">Basic and Enhanced</strong>{" "}
                cover clean cuts, pacing, text, transitions, and color. Need
                heavy effects or motion graphics? Choose{" "}
                <strong className="text-brand-coral">Pro</strong> and we&apos;ll
                quote it before you pay.
              </p>
            </div>
            <div>
              <p className="font-bold text-brand-navy dark:text-white">
                Music policy
              </p>
              <p className="mt-3 text-brand-navy/60 dark:text-white/60">
                We suggest songs for every reel (trending audio, genre-matched).
                We deliver without copyrighted audio files. Add the suggested
                song in the platform when you post.
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-brand-navy/40 dark:text-white/40">
            By subscribing or ordering you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-brand-coral"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-brand-coral"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </Container>
      </section>
    </div>
  );
}
