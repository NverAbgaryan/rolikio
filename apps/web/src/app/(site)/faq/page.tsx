import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="text-base font-bold tracking-tight text-brand-navy dark:text-white">
        {q}
      </h2>
      <p className="mt-2 text-sm leading-6 text-brand-navy/60 dark:text-white/60">
        {a}
      </p>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-coral-light via-white to-brand-orange-light py-16 dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy">
        <Container className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
            FAQ
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
            Everything you need to know
          </h1>
          <p className="mt-4 text-base leading-7 text-brand-navy/60 dark:text-white/60">
            Answers about subscriptions, one-off orders, content types,
            revisions, and how we work.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-brand-navy/40 dark:text-white/40">
            Subscriptions
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <QA
              q="What do I get with a subscription?"
              a="A dedicated content editing team that handles your reels and photo posts every month. You share raw footage and photos, and we deliver polished, post-ready content with caption suggestions and song recommendations."
            />
            <QA
              q="How many pieces do I get per month?"
              a="Starter plan includes 8 content pieces per month. Growth plan includes 20 pieces per month. A piece can be a reel, photo edit, carousel, or story."
            />
            <QA
              q="How do I share my raw content?"
              a="Two ways: upload directly in the rolik.io app, or share a Google Drive or Dropbox folder link. We access your raw material and select the best clips and photos to edit."
            />
            <QA
              q="Do you suggest what I should post?"
              a="Yes. Every delivered piece comes with a suggested caption and, for reels, a song recommendation (name, artist, and link). Growth plan subscribers also get a weekly content calendar."
            />
            <QA
              q="Can I cancel anytime?"
              a="Yes. No long-term contracts. Cancel through your subscription dashboard or Stripe billing portal. You keep access until the end of your billing period."
            />
            <QA
              q="What if I need more than 20 pieces?"
              a="Contact us for a custom plan. We can scale to meet higher content volumes at a custom rate."
            />
          </div>

          <h3 className="mb-6 mt-12 text-sm font-bold uppercase tracking-wider text-brand-navy/40 dark:text-white/40">
            One-off orders
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <QA
              q="Can I order without subscribing?"
              a="Absolutely. One-off orders are available for anyone who needs a single reel or photo edit. No account or subscription required to start."
            />
            <QA
              q="What types of content can I order?"
              a="Reels (15-120 seconds for Instagram, TikTok, or YouTube Shorts), single photo edits, carousel packs (5 photos), and story packs (3 stories)."
            />
            <QA
              q="How fast is delivery?"
              a="Standard delivery is 48-72 hours after payment, uploads, and brief are complete. Rush delivery (24h) is available as an add-on."
            />
            <QA
              q="Can I request complex effects or motion graphics?"
              a="Yes. Choose the Pro/Complex editing level and we will review your brief and send a custom quote before any payment is taken."
            />
          </div>

          <h3 className="mb-6 mt-12 text-sm font-bold uppercase tracking-wider text-brand-navy/40 dark:text-white/40">
            General
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <QA
              q="How do revisions work?"
              a="Each piece includes 1-2 revisions depending on your plan or order tier. A revision is one consolidated request with specific changes. Extra revisions are available as a paid add-on."
            />
            <QA
              q="What about music and copyright?"
              a="We suggest songs for every reel (trending, genre-matched). We deliver reels without copyrighted audio files to protect you. Add the suggested song directly in Instagram, TikTok, or YouTube when you post."
            />
            <QA
              q="Is my content secure?"
              a="Yes. All uploads are stored privately with encrypted connections. Download links are time-limited and expire automatically. Raw content is deleted 30 days after completion."
            />
            <QA
              q="Is this a video editing tool?"
              a="No. rolik.io is a done-for-you service. You provide raw material and a brief (or just a shared folder), and our team delivers polished, post-ready content."
            />
          </div>

          <div className="mt-12 rounded-2xl bg-brand-navy p-8 text-center text-white">
            <h2 className="text-xl font-bold tracking-tight">
              Ready to get started?
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Subscribe for ongoing content management, or try a single order to
              see the quality first.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button href="/subscribe">Start subscription</Button>
              <Button href="/order" variant="ghost">
                Single order
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
