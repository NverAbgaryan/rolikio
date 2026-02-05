import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
        r
      </span>
      <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        rolik.io
      </span>
    </Link>
  );
}

