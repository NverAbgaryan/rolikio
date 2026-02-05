import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-base font-semibold tracking-tight">{q}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {a}
      </p>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            FAQ
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Clear answers about constraints, revisions, delivery times, and what
            we do (and don’t) include.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-4 lg:grid-cols-2">
            <QA
              q="Is this a video editor like CapCut?"
              a="No. rolik is a done-for-you workflow. You upload clips + references, then we deliver a ready-to-post reel."
            />
            <QA
              q="How long are the reels?"
              a="MVP delivers reels up to 120 seconds. Pick Tier A/B/C based on your desired final length."
            />
            <QA
              q="What’s included in revisions?"
              a="Each tier includes a limited number of revisions (usually 1; Tier C may include 2). You submit one consolidated request per revision."
            />
            <QA
              q="Can I request complex effects?"
              a="Yes, but heavy effects/advanced requests are Pro/Complex and require a quote before payment so we can scope it properly."
            />
            <QA
              q="Do you include copyrighted music?"
              a="We avoid delivering copyrighted music files. We deliver without music (or safe audio), and you can add trending audio in the platform when posting."
            />
            <QA
              q="How fast is delivery?"
              a="Standard delivery is 48–72h after payment is confirmed, uploads are complete, and your brief is provided. Rush (24h) can be an add-on."
            />
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold tracking-tight">
              Ready to start?
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              You can create an order in minutes. We’ll handle the edit and keep
              constraints visible so the process stays fast.
            </p>
            <div className="mt-5">
              <Button href="/order">Create my rolik</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

