import { Container } from "@/components/site/Container";
import { OrderWizard } from "@/components/order/OrderWizard";

export default function OrderPage() {
  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create your order
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Choose → Upload → Brief. Then we’ll add payments and order tracking.
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

