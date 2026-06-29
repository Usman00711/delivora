import { notFound } from "next/navigation";
import { DeliverableList } from "@/components/projects/deliverable-list";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getClientProject } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ClientDeliverablesPage({ params }: { params: { projectId: string } }) {
  const user = await requireClientUser();
  const project = await getClientProject(user.clientCompanyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/client/projects/${project.id}`} />
      {project.deliverables.length ? (
        <DeliverableList deliverables={project.deliverables} />
      ) : (
        <EmptyState
          title="No deliverables yet"
          description="The team has not uploaded deliverables for this project."
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
