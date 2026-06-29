import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  FolderKanban,
  GitPullRequest,
  Receipt,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListItemBox } from "@/components/ui/list-item-box";
import { HealthScoreCard } from "@/components/dashboard/health-score-card";
import { PendingActionsCard } from "@/components/dashboard/pending-actions-card";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeader } from "@/components/layout/section-header";
import { ProjectHealthBadge } from "@/components/dashboard/health-score-card";
import { HealthTrendChart } from "@/components/analytics/health-trend-chart";
import { ApprovalTurnaroundChart } from "@/components/analytics/approval-turnaround-chart";
import { InvoiceStatusChart } from "@/components/analytics/invoice-status-chart";
import { DeliveryProgressChart } from "@/components/analytics/delivery-progress-chart";
import { getAgencyDashboardAnalytics, getAgencyDashboardData } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAgencyUser();
  const [{ stats, projects, pendingApprovals, activity }, analytics] = await Promise.all([
    getAgencyDashboardData(user.agencyId),
    getAgencyDashboardAnalytics(user.agencyId),
  ]);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Agency Overview"
        description="Track client delivery, pending approvals, and project health across your workspace."
        action={
          <Button nativeButton={false} render={<Link href="/dashboard/projects/new" />}>
            New project
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={FolderKanban}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          description="Awaiting client response"
        />
        <StatCard
          title="Open Scope Changes"
          value={stats.openScopeChanges}
          icon={GitPullRequest}
        />
        <StatCard
          title="Overdue Milestones"
          value={stats.overdueMilestones}
          icon={AlertTriangle}
          description="Needs attention"
        />
        <StatCard title="Pending Invoices" value={stats.pendingInvoices} icon={Receipt} />
        <HealthScoreCard score={stats.averageHealth} label="Stable" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HealthTrendChart points={analytics.healthTrend} />
        <ApprovalTurnaroundChart points={analytics.approvalTurnaround} />
        <InvoiceStatusChart points={analytics.invoiceStatusBreakdown} />
        <DeliveryProgressChart points={analytics.deliveryProgress} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {projects.length ? (
              projects.map((project) => (
                <ListItemBox key={project.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-medium">{project.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {project.clientCompany.name}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Badge variant="outline">{project.status}</Badge>
                      <ProjectHealthBadge
                        score={project.healthScore}
                        label={project.healthLabel}
                      />
                    </div>
                  </div>
                </ListItemBox>
              ))
            ) : (
              <EmptyState
                title="No recent projects"
                description="Create your first project from the dashboard or start in the projects section."
                actions={
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/dashboard/projects/new" />}
                  >
                    Create first project
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
        <PendingActionsCard approvals={pendingApprovals} />
      </div>

      <RecentActivityFeed items={activity} />
    </div>
  );
}
