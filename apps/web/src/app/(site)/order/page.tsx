import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { OrderWizard } from "@/components/order/OrderWizard";

export const metadata: Metadata = {
  title: "Order a Single Reel or Photo Edit",
  description:
    "Professional reel editing from $59. Photo editing from $15. Upload your clips, tell us what you want, and get a post-ready piece in 48-72h.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create your order
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-brand-navy/60 dark:text-white/60">
            Choose your package, upload your content, and tell us what you want. We handle the rest.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <OrderWizard />
        </Container>
      </section>
    </div>
  );
}

