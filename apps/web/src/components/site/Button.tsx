import Link from "next/link";
import { cn } from "@/lib/cn";

type CommonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<NonNullable<CommonProps["variant"]>, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
  ghost:
    "bg-transparent text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900",
};

const sizeClasses: Record<NonNullable<CommonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps &
  (
    | React.ButtonHTMLAttributes<HTMLButtonElement>
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
  )) {
  const base = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-950",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in props) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={base} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={base} {...props}>
      {children}
    </button>
  );
}

