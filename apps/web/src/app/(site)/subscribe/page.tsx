import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

export default function SubscribePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-coral-light via-white to-brand-orange-light py-16 dark:from-brand-navy dark:via-brand-navy dark:to-brand-navy">
        <Container className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
            Subscribe
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
            Start your content subscription
          </h1>
          <p className="mt-4 text-base leading-7 text-brand-navy/60 dark:text-white/60">
            Choose your plan and let us handle your content editing. Stripe
            checkout integration coming next.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="mx-auto max-w-2xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="text-lg font-bold text-brand-navy dark:text-white">
                Starter
              </h2>
              <p className="mt-1 text-sm text-brand-navy/60 dark:text-white/60">
                8 pieces/month
              </p>
              <div className="mt-4 text-3xl font-bold text-brand-navy dark:text-white">
                $299
                <span className="text-sm font-normal text-brand-navy/40 dark:text-white/40">
                  /mo
                </span>
              </div>
              <div className="mt-6">
                <Button className="w-full" disabled>
                  Coming soon
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-coral bg-white p-6 shadow-sm ring-2 ring-brand-coral/20 dark:bg-white/5">
              <h2 className="text-lg font-bold text-brand-navy dark:text-white">
                Growth
              </h2>
              <p className="mt-1 text-sm text-brand-navy/60 dark:text-white/60">
                20 pieces/month
              </p>
              <div className="mt-4 text-3xl font-bold text-brand-navy dark:text-white">
                $599
                <span className="text-sm font-normal text-brand-navy/40 dark:text-white/40">
                  /mo
                </span>
              </div>
              <div className="mt-6">
                <Button className="w-full" disabled>
                  Coming soon
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-brand-navy/10 bg-white p-6 text-sm text-brand-navy/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <p className="font-semibold text-brand-navy dark:text-white">
              Next steps
            </p>
            <p className="mt-2">
              Stripe subscription billing is the next feature to be implemented.
              Once live, you&apos;ll be able to subscribe, onboard with your raw
              content or shared folder link, and start receiving edited content
              with song and caption suggestions.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button href="/order" variant="secondary">
              Or order a single piece now
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
