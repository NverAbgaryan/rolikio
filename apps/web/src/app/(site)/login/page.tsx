import { Container } from "@/components/site/Container";
import { LoginForm } from "@/app/(site)/login/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <section className="border-b border-zinc-200/70 py-14 dark:border-zinc-800/70">
        <Container>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Sign in
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Access your client portal and order status via magic link.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container className="max-w-xl">
          <LoginForm />
        </Container>
      </section>
    </div>
  );
}

