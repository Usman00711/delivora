import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/layout/brand-mark";
import { RoleBasedNav } from "@/components/layout/role-based-nav";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="font-semibold">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login" />}>
            Log in
          </Button>
          <Button size="sm" nativeButton={false} render={<Link href="/register" />}>
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <BrandMark className="size-7" />
            <span className="font-semibold">{APP_NAME}</span>
          </div>
          <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
          <RoleBasedNav />
        </div>
      </div>
    </footer>
  );
}
