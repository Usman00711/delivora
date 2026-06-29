import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <BrandMark className="size-10" />
        <span className="text-xl font-semibold tracking-tight">{APP_NAME}</span>
      </Link>

      <div className={cn("w-full max-w-[420px]", className)}>{children}</div>
    </div>
  );
}
