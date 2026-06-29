"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Archive,
  CheckCircle2,
  FileText,
  FolderKanban,
  FolderOpen,
  GitPullRequest,
  HeartPulse,
  Inbox,
  LayoutDashboard,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandMark } from "@/components/layout/brand-mark";
import { APP_NAME } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  FolderKanban,
  Activity,
  Settings,
  Inbox,
  FolderOpen,
  User,
};

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

interface AppSidebarProps {
  navItems: readonly NavItem[];
  subtitle?: string;
  className?: string;
}

export function AppSidebar({ navItems, subtitle, className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <Link
        href="/"
        className="flex h-16 items-center gap-2.5 border-b px-6 transition-colors hover:bg-sidebar-accent/50"
      >
        <BrandMark />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none">{APP_NAME}</p>
          {subtitle && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </Link>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] ?? LayoutDashboard;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/client" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          Client delivery portal
        </p>
      </div>
    </aside>
  );
}

export function FeatureIcon({ name }: { name: string }) {
  const icons: Record<string, LucideIcon> = {
    Inbox,
    CheckCircle2,
    GitPullRequest,
    FileText,
    Archive,
    HeartPulse,
  };
  const Icon = icons[name] ?? Inbox;
  return <Icon className="size-5" />;
}
