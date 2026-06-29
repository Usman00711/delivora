import { notFound } from "next/navigation";
import { HandoverVaultList } from "@/components/handover/handover-vault-list";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getClientProject } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ClientHandoverPage({ params }: { params: { projectId: string } }) {
  const user = await requireClientUser();
  const project = await getClientProject(user.clientCompanyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/client/projects/${project.id}`} />
      {project.handoverItems.length ? (
        <HandoverVaultList items={project.handoverItems} />
      ) : (
        <EmptyState
          title="No handover items yet"
          description="Handover assets and notes will appear here when the team marks them visible."
          actions={
            <Button
              nativeButton={false}
              render={<Link href={`/client/projects/${project.id}`} />}
            >
              Back to project
            </Button>
          }
        />
      )}
    </div>
  );
}
