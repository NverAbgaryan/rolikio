import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rolik.io";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "rolik.io",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Professional content editing agency for small businesses. Reels, photo editing, content suggestions, and song recommendations.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English"],
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh">
      <JsonLd data={organizationSchema} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

