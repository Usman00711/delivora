"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar, type NavItem } from "@/components/layout/app-sidebar";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  navItems: readonly NavItem[];
  sidebarSubtitle?: string;
  user: {
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

export function DashboardHeader({
  title,
  subtitle,
  navItems,
  sidebarSubtitle,
  user,
}: DashboardHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const profileHref = user.role === "CLIENT" ? "/client/profile" : "/dashboard/profile";

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar navItems={navItems} subtitle={sidebarSubtitle} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold">{title}</h1>
        {subtitle && (
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="hidden max-w-sm flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, clients..."
            className="h-9 pl-9"
            disabled
          />
        </div>
      </div>

      <Button variant="ghost" size="icon" disabled>
        <Bell className="size-4" />
        <span className="sr-only">Notifications</span>
      </Button>

      <div ref={userMenuRef} className="relative">
        <Button
          variant="ghost"
          className="relative size-9 rounded-full p-0"
          aria-expanded={isUserMenuOpen}
          aria-haspopup="menu"
          onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
        >
          <Avatar className="size-9">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>

        {isUserMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-11 z-50 w-56 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          >
            <div className="px-2 py-2">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {user.email}
              </p>
              <p className="mt-1 text-xs capitalize text-muted-foreground">
                {user.role.replace(/_/g, " ").toLowerCase()}
              </p>
            </div>
            <div className="-mx-1 my-1 h-px bg-border" />
            <Link
              href={profileHref}
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <User className="size-4" />
              Profile
            </Link>
            <div className="-mx-1 my-1 h-px bg-border" />
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
