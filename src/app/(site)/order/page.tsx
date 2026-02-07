import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/site/Container";
import { OrderWizard } from "@/components/order/OrderWizard";
import { getCurrentUser } from "@/lib/supabase/user";

export const metadata: Metadata = {
  title: "Order a Single Reel or Photo Edit",
  description:
    "Professional reel editing from $59. Photo editing from $15. Upload your clips, tell us what you want, and get a post-ready piece in 48-72h.",
  alternates: { canonical: "/order" },
};

export default async function OrderPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <section className="border-b border-brand-navy/10 py-14 dark:border-white/10">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
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
