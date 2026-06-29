"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { PageContainer } from "@/components/layout/page-container";
import { clientNavItems } from "@/lib/constants";

type ShellUser = {
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

export function ClientPortalShell({
  children,
  companyName,
  user,
}: {
  children: React.ReactNode;
  companyName: string;
  user: ShellUser;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar
        navItems={clientNavItems}
        subtitle={companyName}
        className="hidden lg:flex"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title="Client Portal"
          subtitle={companyName}
          navItems={clientNavItems}
          sidebarSubtitle={companyName}
          user={user}
        />
        <main className="flex-1 overflow-auto bg-muted/20">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
