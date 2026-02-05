import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Logo } from "@/components/site/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200/70 py-10 dark:border-zinc-800/70">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6 md:justify-start">
          <Logo />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Reels, done for you.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link
            href="/privacy"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Terms
          </Link>
          <Link
            href="/faq"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            FAQ
          </Link>
          <span className="text-xs text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} rolik.io
          </span>
        </div>
      </Container>
    </footer>
  );
}

