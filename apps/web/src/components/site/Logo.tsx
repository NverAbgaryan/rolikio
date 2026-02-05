import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className="relative h-8 w-8 overflow-hidden rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
        <Image
          src="/logo.png"
          alt="rolik.io"
          fill
          sizes="32px"
          className="object-contain"
          priority
        />
      </span>
      <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        rolik.io
      </span>
    </Link>
  );
}

