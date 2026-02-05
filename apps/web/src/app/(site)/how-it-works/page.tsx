import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

export default function HowItWorksPage() {
  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Upload clips + references + a short note → get a post‑ready reel in
            48–72h.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container className="grid gap-6 lg:grid-cols-3">
          {[
            {
              step: "Step 1",
              title: "Choose",
              body: "Pick platform, length tier, vibe, and add-ons (subtitles, rush). If you need hard effects, choose Pro/Complex and request a quote.",
            },
            {
              step: "Step 2",
              title: "Upload",
              body: "Upload your clips (and optionally logo/voice note). We keep raw footage limits visible to protect cost and turnaround.",
            },
            {
              step: "Step 3",
              title: "Brief + Pay",
              body: "Tell us what you want, what to avoid, and add up to 5 reference links. Checkout securely. Then track your status in the portal.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                {s.step}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight">
                {s.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {s.body}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section className="border-t border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Track, review, and request changes
            </h2>
            <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              You’ll get a delivery preview + download link. Approve it or request
              a revision (within your included quota).
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

