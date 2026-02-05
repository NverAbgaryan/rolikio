import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { Logo } from "@/components/site/Logo";

const nav = [
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-coral/10 bg-white/80 backdrop-blur-lg dark:bg-brand-navy/90">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo size="lg" />
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-brand-navy/70 transition-colors hover:text-brand-coral dark:text-white/70 dark:hover:text-brand-coral"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-brand-navy/70 transition-colors hover:text-brand-coral sm:block dark:text-white/70 dark:hover:text-brand-coral"
          >
            Sign in
          </Link>
          <Button size="sm" href="/subscribe">
            Subscribe
          </Button>
        </div>
      </Container>
    </header>
  );
}
