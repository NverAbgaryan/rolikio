import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { Logo } from "@/components/site/Logo";

const nav = [
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/login", label: "Sign in" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" href="/order">
            Create my rolik
          </Button>
        </div>
      </Container>
    </header>
  );
}

