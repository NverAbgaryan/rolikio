import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";

  return (
    <Link href="/" className="inline-flex items-center">
      <span
        className={cn(
          "relative overflow-hidden rounded-2xl ring-1 ring-zinc-200 dark:ring-zinc-800",
          box,
        )}
      >
        <Image
          src="/logo.png"
          alt="rolik.io"
          fill
          sizes={size === "sm" ? "32px" : size === "lg" ? "48px" : "40px"}
          className="object-contain"
          priority
        />
      </span>
      <span className="sr-only">rolik.io</span>
    </Link>
  );
}

