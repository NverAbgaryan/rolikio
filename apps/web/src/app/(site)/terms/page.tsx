import type { Metadata } from "next";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing the use of rolik.io content editing services, subscriptions, and one-off orders.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Terms (MVP draft)
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            This is an MVP placeholder. Replace with final legal terms before
            taking paid traffic.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container className="prose prose-zinc max-w-3xl dark:prose-invert">
          <h2>Service</h2>
          <p>
            rolik.io provides a done-for-you reel editing service. We are not a
            video editor tool and do not provide a guarantee of virality or
            performance outcomes.
          </p>

          <h2>Constraints</h2>
          <ul>
            <li>Final delivered reel length is limited (≤120 seconds in MVP).</li>
            <li>
              Raw footage limits and included revisions are determined by the tier
              you purchase.
            </li>
            <li>
              Pro/Complex requests (heavy effects/advanced editing) may require a
              custom quote before payment.
            </li>
          </ul>

          <h2>Music</h2>
          <p>
            We avoid delivering copyrighted music files. You may add platform
            audio (e.g. trending sounds) when posting.
          </p>

          <h2>Refunds</h2>
          <p>
            Refund policy is to be finalized. In MVP, summarize your refund rules
            clearly on the pricing page and in confirmation emails.
          </p>
        </Container>
      </section>
    </div>
  );
}

