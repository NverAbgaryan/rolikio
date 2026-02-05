import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

export default function HowItWorksPage() {
  return (
    <div>
      {/* --- HEADER --- */}
      <section className="bg-gradient-to-br from-brand-coral-light via-white to-brand-orange-light py-16 dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy">
        <Container className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
            How it works
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
            Two ways to get professional content
          </h1>
          <p className="mt-4 text-base leading-7 text-brand-navy/60 dark:text-white/60">
            Subscribe for ongoing content management, or order a single piece
            when you need it. Both paths get you professional results.
          </p>
        </Container>
      </section>

      {/* --- SUBSCRIPTION FLOW --- */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand-coral px-3 py-1 text-xs font-bold text-white">
              Recommended
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl dark:text-white">
              Subscription: your content, managed
            </h2>
            <p className="mt-3 text-base leading-7 text-brand-navy/60 dark:text-white/60">
              For businesses that need consistent content every week without the
              hassle of managing it themselves.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {[
              {
                n: "1",
                title: "Choose your plan",
                body: "Starter (8 pieces/mo, $299) or Growth (20 pieces/mo, $599). Subscribe through Stripe. Cancel anytime.",
              },
              {
                n: "2",
                title: "Share raw content",
                body: "Upload clips and photos in the app, or share a Google Drive / Dropbox folder link. We access your raw material and pick the best pieces.",
              },
              {
                n: "3",
                title: "We edit and suggest",
                body: "Our editors create polished reels and photo posts from your raw content. Every piece includes a suggested caption and song recommendation for reels.",
              },
              {
                n: "4",
                title: "Review, approve, post",
                body: "Preview each piece in your dashboard. Approve it, request a revision, or skip. Then post with the suggested song and caption. Repeat every week.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-coral text-sm font-bold text-white">
                  {s.n}
                </div>
                <h3 className="text-base font-bold tracking-tight text-brand-navy dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-navy/60 dark:text-white/60">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button href="/subscribe" size="lg">
              Start your subscription
            </Button>
          </div>
        </Container>
      </section>

      {/* --- ONE-OFF FLOW --- */}
      <section className="border-t border-brand-navy/10 bg-white py-20 dark:border-white/10 dark:bg-white/5">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl dark:text-white">
              One-off: order a single piece
            </h2>
            <p className="mt-3 text-base leading-7 text-brand-navy/60 dark:text-white/60">
              Need just one reel or photo edit? No subscription required.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                n: "1",
                title: "Choose and upload",
                body: "Pick reel or photo edit, select your package, and upload your raw footage or photos.",
              },
              {
                n: "2",
                title: "Brief and pay",
                body: "Tell us what you want, share references, and checkout securely via Stripe.",
              },
              {
                n: "3",
                title: "Review and approve",
                body: "We deliver in 48-72h. Preview, approve, or request a revision within your included quota.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-sm font-bold text-white">
                  {s.n}
                </div>
                <h3 className="text-base font-bold tracking-tight text-brand-navy dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-navy/60 dark:text-white/60">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button href="/order" variant="secondary" size="lg">
              Order a single piece
            </Button>
          </div>
        </Container>
      </section>

      {/* --- CTA --- */}
      <section className="bg-brand-navy py-16 text-white">
        <Container className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Not sure which option is right?
          </h2>
          <p className="mt-4 text-base leading-7 text-white/60">
            Try a single order first to see the quality. When you&apos;re ready
            for consistent content, subscribe and we&apos;ll handle everything.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/subscribe" size="lg">
              Start subscription
            </Button>
            <Button href="/order" variant="ghost" size="lg">
              Try a single order
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
