import type { Metadata } from "next";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How rolik.io collects, uses, and protects your data including uploaded content, personal information, and payment details.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy (MVP draft)
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            This is an MVP placeholder. Replace with final legal policy before
            launch.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container className="prose prose-zinc max-w-3xl dark:prose-invert">
          <h2>What we collect</h2>
          <ul>
            <li>Email address (for magic link access and notifications)</li>
            <li>Uploaded media (raw footage, voice notes, logo)</li>
            <li>Order brief and reference links</li>
          </ul>

          <h2>How we use it</h2>
          <p>
            We use your information to process orders, communicate status updates,
            and deliver your finished reel securely.
          </p>

          <h2>Storage and retention</h2>
          <p>
            Raw uploads are retained for a limited period after completion (e.g.
            30 days). Deliveries may be retained longer (e.g. 90 days). Exact
            policies should be finalized for launch.
          </p>

          <h2>Security</h2>
          <p>
            Uploads are stored privately. Download links are time-limited and
            expire.
          </p>
        </Container>
      </section>
    </div>
  );
}

