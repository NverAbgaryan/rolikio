import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm"
      ? { w: 120, h: 28, className: "h-7" }
      : size === "lg"
        ? { w: 220, h: 48, className: "h-10 sm:h-11" }
        : { w: 170, h: 38, className: "h-9" };

  return (
    <Link href="/" className="inline-flex items-center" aria-label="rolik.io">
      <Image
        src="/logo.png"
        alt=""
        width={dims.w}
        height={dims.h}
        priority
        className={cn(
          "w-auto select-none object-contain",
          dims.className,
        )}
      />
    </Link>
  );
}

