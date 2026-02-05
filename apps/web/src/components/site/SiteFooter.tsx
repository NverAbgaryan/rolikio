import Link from "next/link";
import { Container } from "@/components/site/Container";
import { Logo } from "@/components/site/Logo";

const footerLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-navy/10 bg-brand-navy py-12 text-white dark:bg-brand-navy">
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <p className="text-sm text-white/60">
            Reels, done for you.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-brand-coral"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} rolik.io
        </p>
      </Container>
    </footer>
  );
}
