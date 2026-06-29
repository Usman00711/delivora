import { notFound } from "next/navigation";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { ApprovalDecisionForm } from "@/components/approvals/approval-decision-form";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { getClientProject } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ClientApprovalsPage({ params }: { params: { projectId: string } }) {
  const user = await requireClientUser();
  const project = await getClientProject(user.clientCompanyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/client/projects/${project.id}`} />
      <div className="grid gap-4">
        {project.approvals.map((approval) => (
          <ApprovalCard key={approval.id} approval={approval}>
            {approval.status === "PENDING" && (
              <ApprovalDecisionForm approvalId={approval.id} />
            )}
          </ApprovalCard>
        ))}
      </div>
    </div>
  );
}
