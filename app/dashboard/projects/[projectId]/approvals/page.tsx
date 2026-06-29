import { notFound } from "next/navigation";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { ApprovalRequestCreateForm } from "@/components/projects/delivery-forms";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";

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
      <div className="grid gap-4">
        {project.approvals.map((approval) => (
          <ApprovalCard key={approval.id} approval={approval} />
        ))}
      </div>
    </div>
  );
}
