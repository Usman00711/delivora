import { notFound } from "next/navigation";
import Link from "next/link";
import { DeliverableList } from "@/components/projects/deliverable-list";
import { DeliverableCreateForm } from "@/components/projects/delivery-forms";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AgencyDeliverablesPage({ params }: { params: { projectId: string } }) {
  const user = await requireAgencyUser();
  const project = await getAgencyProject(user.agencyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/dashboard/projects/${project.id}`} />
      <DeliverableCreateForm
        projectId={project.id}
        milestones={project.milestones}
      />
      {project.deliverables.length ? (
        <DeliverableList deliverables={project.deliverables} />
      ) : (
        <EmptyState
          title="No deliverables yet"
          description="Start by adding a deliverable and attach work for the client to review."
          actions={
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/dashboard/projects/${project.id}`} />}
            >
              Back to project
            </Button>
          }
        />
      )}
    </div>
  );
}
