import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { ScopeChangeCard } from "@/components/scope-changes/scope-change-card";
import { ScopeQuoteForm } from "@/components/projects/delivery-forms";
import { EmptyState } from "@/components/shared/empty-state";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AgencyScopeChangesPage({ params }: { params: { projectId: string } }) {
  const user = await requireAgencyUser();
  const project = await getAgencyProject(user.agencyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/dashboard/projects/${project.id}`} />
      {project.scopeChanges.length ? (
        <div className="grid gap-4">
          {project.scopeChanges.map((scopeChange) => (
            <div key={scopeChange.id}>
              <ScopeChangeCard scopeChange={scopeChange} />
              <ScopeQuoteForm scopeChange={scopeChange} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No scope changes yet"
          description="Create scope change requests when project requirements evolve."
          actions={
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/dashboard/projects/${project.id}/scope-changes`} />}
            >
              Refresh
            </Button>
          }
        />
      )}
    </div>
  );
}
