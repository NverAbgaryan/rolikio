import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-zinc-50 via-white to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-zinc-200/40 via-zinc-100/10 to-zinc-200/40 blur-3xl dark:from-zinc-800/35 dark:via-zinc-900/5 dark:to-zinc-800/35" />

        <Container className="py-16 sm:py-24">
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-wrap gap-2">
              <Pill>≤120s final</Pill>
              <Pill>48–72h delivery</Pill>
              <Pill>Strict revisions</Pill>
              <Pill>Private uploads</Pill>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              Reels, done for you.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Upload your clips, share a reference, and we’ll deliver a post‑ready
              reel in 48–72h. No editing software. No learning curve.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/order" size="lg">
                Create my rolik
              </Button>
              <Button href="/pricing" variant="secondary" size="lg">
                See pricing
              </Button>
            </div>

            <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-500">
              We don’t deliver copyrighted music files. Add trending audio in
              IG/TikTok when you post.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <SectionTitle
            eyebrow="How it works"
            title="Three steps. That’s it."
            description="A simple flow that takes under 2 minutes. After payment, you can track your order, review the delivery, and request changes (within your revision quota)."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Choose",
                body: "Pick platform, length tier, vibe, and any add-ons like subtitles or rush.",
              },
              {
                title: "Upload",
                body: "Upload clips + optional logo/voice note. You’ll see your raw limit as you go.",
              },
              {
                title: "Brief + Pay",
                body: "Tell us what you want and add up to 5 reference links. Then checkout securely.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="text-base font-semibold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {c.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Typical delivery: <span className="font-medium">48–72 hours</span>
            </span>
            <span>
              Included revisions are limited by tier. Extra revisions are paid.
            </span>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionTitle
            eyebrow="Why rolik"
            title="Productized editing that protects your time (and ours)."
            description="We’re not a timeline editor. We’re a done-for-you workflow with clear constraints so your reel gets finished fast."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Clear constraints",
                body: "Raw footage limits and revision quotas keep the process predictable and affordable.",
              },
              {
                title: "Private & secure",
                body: "Uploads are private. Downloads are time-limited with expiring links.",
              },
              {
                title: "Not a “viral guarantee”",
                body: "You get a post-ready reel aligned to your references—no hype.",
              },
              {
                title: "Complex edits are quoted",
                body: "If you want heavy effects / advanced requests, we quote it so you don’t get under-delivered.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="text-base font-semibold tracking-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to get your next reel done?
            </h2>
            <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Start an order in minutes. We’ll handle the edit.
            </p>
          </div>
          <Button href="/order" size="lg">
            Create my rolik
          </Button>
        </Container>
      </section>
    </div>
  );
}

