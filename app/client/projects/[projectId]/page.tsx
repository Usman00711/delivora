import { notFound } from "next/navigation";
import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectHealthPanel } from "@/components/projects/project-health-panel";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { getClientProject } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ClientProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const user = await requireClientUser();
  const project = await getClientProject(user.clientCompanyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/client/projects/${project.id}`} />
      <ProjectHealthPanel
        score={project.healthScore}
        label={project.healthLabel}
        overdueMilestones={
          project.milestones.filter((item) => item.status === "OVERDUE").length
        }
        pendingApprovals={
          project.approvals.filter((item) => item.status === "PENDING").length
        }
        openInvoices={
          project.invoices.filter((item) => ["SENT", "OVERDUE"].includes(item.status))
            .length
        }
      />
      <ActivityTimeline items={project.activityLogs} />
    </div>
  );
}
