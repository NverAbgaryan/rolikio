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
    "bg-brand-coral text-white hover:bg-brand-coral-dark shadow-sm shadow-brand-coral/20",
  secondary:
    "bg-brand-navy text-white hover:bg-brand-navy-light shadow-sm",
  ghost:
    "bg-transparent text-brand-navy hover:bg-brand-coral-light dark:text-white dark:hover:bg-white/10",
};

const sizeClasses: Record<NonNullable<CommonProps["size"]>, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
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
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
