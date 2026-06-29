"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { PageContainer } from "@/components/layout/page-container";
import { agencyNavItems } from "@/lib/constants";

type ShellUser = {
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

export function DashboardShell({
  children,
  agencyName,
  user,
}: {
  children: React.ReactNode;
  agencyName: string;
  user: ShellUser;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar
        navItems={agencyNavItems}
        subtitle={agencyName}
        className="hidden lg:flex"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title="Agency Dashboard"
          subtitle={agencyName}
          navItems={agencyNavItems}
          sidebarSubtitle={agencyName}
          user={user}
        />
        <main className="flex-1 overflow-auto bg-muted/20">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
