import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/site/Container";
import { Logo } from "@/components/site/Logo";
import { isAdmin } from "@/lib/admin/auth";

const adminNav = [
  { href: "/admin", label: "Orders" },
  { href: "/admin/subscribers", label: "Subscribers" },
] as const;

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await isAdmin();
  if (!auth.admin) {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-brand-navy">
      <header className="border-b border-brand-navy/10 bg-white dark:border-white/10 dark:bg-brand-navy">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-xs font-bold text-brand-coral">
              Admin
            </span>
            <nav className="flex items-center gap-4">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-brand-navy/60 transition-colors hover:text-brand-coral dark:text-white/60 dark:hover:text-brand-coral"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-navy/40 dark:text-white/40">
              {auth.email}
            </span>
            <Link
              href="/"
              className="text-xs font-medium text-brand-navy/50 hover:text-brand-coral dark:text-white/50"
            >
              Back to site
            </Link>
          </div>
        </Container>
      </header>
      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
