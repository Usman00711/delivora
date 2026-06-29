import { notFound } from "next/navigation";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { ApprovalRequestCreateForm } from "@/components/projects/delivery-forms";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AgencyApprovalsPage({ params }: { params: { projectId: string } }) {
  const user = await requireAgencyUser();
  const project = await getAgencyProject(user.agencyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/dashboard/projects/${project.id}`} />
      <ApprovalRequestCreateForm
        projectId={project.id}
        deliverables={project.deliverables}
      />
      {project.approvals.length ? (
        <div className="grid gap-4">
          {project.approvals.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No approvals yet"
          description="You can create the first approval request for this project."
          actions={
            <Button nativeButton={false} render={<Link href={`/dashboard/projects/${project.id}/approvals`} />}>
              Refresh
            </Button>
          }
        />
      )}
    </div>
  );
}
