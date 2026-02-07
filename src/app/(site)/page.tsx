import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

export const metadata: Metadata = {
  title: "Professional Video & Photo Editing for Businesses",
  description:
    "We edit your reels, photos, and stories so you can focus on your business. Song suggestions, caption ideas, and 48h delivery. Subscribe from $299/mo or order a single piece.",
  alternates: { canonical: "/" },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-coral/20 bg-brand-coral-light px-3 py-1 text-xs font-semibold text-brand-coral-dark">
      {children}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold tracking-tight text-brand-coral sm:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-sm text-brand-navy/60 dark:text-white/60">
        {label}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* --- HERO --- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-coral-light via-white to-brand-orange-light dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy" />
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-coral/20 via-brand-orange/10 to-brand-coral/20 blur-3xl" />

        <Container className="py-20 sm:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              <Pill>Reels + Photo Editing</Pill>
              <Pill>Subscriptions from $299/mo</Pill>
              <Pill>One-off from $59</Pill>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl md:text-6xl dark:text-white">
              We edit your content{" "}
              <span className="text-brand-coral">so you don&apos;t have to.</span>
            </h1>

            <p className="max-w-xl text-lg leading-8 text-brand-navy/60 dark:text-white/60">
              Professional video editing service for Instagram Reels, TikTok,
              and YouTube Shorts. Subscribe for ongoing social media content
              editing or order a single piece. We edit, suggest songs, and tell
              you when to post.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/subscribe" size="lg">
                Start your subscription
              </Button>
              <Button href="/order" variant="secondary" size="lg">
                Order a single piece
              </Button>
            </div>

            <p className="text-xs text-brand-navy/40 dark:text-white/40">
              No long-term contracts. Cancel your subscription anytime.
            </p>
          </div>
        </Container>
      </section>

      {/* --- STATS --- */}
      <section className="border-y border-brand-navy/10 bg-white py-12 dark:border-white/10 dark:bg-white/5">
        <Container>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <Stat value="48h" label="Avg turnaround" />
            <Stat value="20+" label="Pieces per month" />
            <Stat value="$299" label="Starter plan" />
            <Stat value="100%" label="Song suggestions" />
          </div>
        </Container>
      </section>

      {/* --- HOW IT WORKS (SUBSCRIPTION) --- */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
              Your content editing service, on autopilot
            </h2>
            <p className="mt-4 text-base leading-7 text-brand-navy/60 dark:text-white/60">
              Subscribe to a monthly reel editing and photo editing plan. Share
              your raw footage, and we deliver post-ready content for Instagram,
              TikTok, and YouTube Shorts every week.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-4">
            {[
              {
                n: "1",
                title: "Subscribe",
                body: "Pick Starter (8 pieces/mo) or Growth (20 pieces/mo). Pay monthly via Stripe. Cancel anytime.",
              },
              {
                n: "2",
                title: "Share your content",
                body: "Upload raw clips and photos in the app, or share a Google Drive / Dropbox folder. We pull the best material.",
              },
              {
                n: "3",
                title: "We edit and suggest",
                body: "Our editors create polished reels and photo posts. Each piece comes with a suggested caption and song recommendation.",
              },
              {
                n: "4",
                title: "Approve and post",
                body: "Review in your dashboard. Approve, request changes, or skip. Then post with the suggested song and caption.",
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
        </Container>
      </section>

      {/* --- WHAT WE DO --- */}
      <section className="bg-brand-navy py-20 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
              Our services
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Reels, photos, carousels, stories
            </h2>
            <p className="mt-4 text-base leading-7 text-white/60">
              We handle every type of content your social media needs. You focus
              on running your business.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Short-form reels",
                body: "Scroll-stopping reels for Instagram, TikTok, and YouTube Shorts. 15-120 seconds, professionally edited.",
              },
              {
                title: "Photo editing",
                body: "Color correction, retouching, text overlays, and styled compositions for feed posts.",
              },
              {
                title: "Carousel posts",
                body: "Multi-slide educational or promotional carousels designed for engagement and saves.",
              },
              {
                title: "Story content",
                body: "On-brand story templates, behind-the-scenes edits, and announcement graphics.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <h3 className="text-sm font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* --- WHY SUBSCRIBE --- */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
              Why subscribe
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
              Stop thinking about what to post
            </h2>
            <p className="mt-4 text-base leading-7 text-brand-navy/60 dark:text-white/60">
              We don&apos;t just edit — we suggest what to post, when, and with
              which trending song. Your content pipeline, fully managed.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Song recommendations",
                body: "Every reel comes with a suggested trending song. Just add it when you post — no copyright headaches.",
              },
              {
                title: "Caption suggestions",
                body: "We write suggested captions for every piece. Copy, customize, and post.",
              },
              {
                title: "Consistent brand style",
                body: "Growth plan subscribers get a dedicated editor who learns your brand aesthetic.",
              },
              {
                title: "Flexible input",
                body: "Upload in the app or share a Google Drive / Dropbox folder. We pull the best clips and photos.",
              },
              {
                title: "Revision included",
                body: "Every piece includes revisions. Not happy? We fix it before you post.",
              },
              {
                title: "Predictable cost",
                body: "One monthly price. No per-piece surprises. Cancel anytime.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-base font-bold tracking-tight text-brand-navy dark:text-white">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-navy/60 dark:text-white/60">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* --- USE CASES --- */}
      <section className="border-t border-brand-navy/10 bg-white py-20 dark:border-white/10 dark:bg-white/5">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
              Built for
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
              Businesses that need content without the hassle
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Restaurants and cafes", body: "Menu highlights, ambiance shots, and food reels that make people hungry." },
              { title: "Salons and beauty", body: "Before/after transformations, service showcases, and styled stories." },
              { title: "Gyms and fitness", body: "Workout clips, trainer intros, and motivational reels with trending audio." },
              { title: "Clinics and wellness", body: "Professional service presentations, team intros, and patient-friendly content." },
              { title: "Retail and e-commerce", body: "Product launches, unboxing reels, and lifestyle photo edits that sell." },
              { title: "Creators and influencers", body: "Polished content at scale without spending hours in editing apps." },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-sm font-bold tracking-tight text-brand-navy dark:text-white">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-navy/60 dark:text-white/60">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="bg-gradient-to-br from-brand-coral-light via-white to-brand-orange-light py-20 dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy">
        <Container className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
            Ready to stop worrying about content?
          </h2>
          <p className="mt-4 text-base leading-7 text-brand-navy/60 dark:text-white/60">
            Subscribe and let us handle your reels, photos, and posting
            suggestions. Or start with a single order to see the quality first.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/subscribe" size="lg">
              Start your subscription
            </Button>
            <Button href="/order" variant="secondary" size="lg">
              Order a single piece
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
