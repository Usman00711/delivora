import { notFound } from "next/navigation";
import Link from "next/link";
import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { Button } from "@/components/ui/button";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectHealthPanel } from "@/components/projects/project-health-panel";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";
import { RouteToasts } from "@/components/shared/route-toasts";

export const dynamic = "force-dynamic";

export default async function AgencyProjectPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams?: { created?: string; updated?: string };
}) {
  const user = await requireAgencyUser();
  const project = await getAgencyProject(user.agencyId, params.projectId);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <RouteToasts
        toasts={[
          searchParams?.created ? { message: "Project created successfully." } : null,
          searchParams?.updated ? { message: "Project updated successfully." } : null,
        ].filter(Boolean) as { message: string }[]}
      />
      <ProjectHeader project={project} />
      <div className="flex justify-end">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/dashboard/projects/${project.id}/edit`} />}
        >
          Edit project
        </Button>
      </div>
      <ProjectSubNav baseHref={`/dashboard/projects/${project.id}`} />
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
