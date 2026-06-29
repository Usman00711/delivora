import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { ScopeChangeCard } from "@/components/scope-changes/scope-change-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getClientProject } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ClientScopeChangesPage({ params }: { params: { projectId: string } }) {
  const user = await requireClientUser();
  const project = await getClientProject(user.clientCompanyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/client/projects/${project.id}`} />
      {project.scopeChanges.length ? (
        <div className="grid gap-4">
          {project.scopeChanges.map((scopeChange) => (
            <ScopeChangeCard
              key={scopeChange.id}
              scopeChange={scopeChange}
              showDecisionForm
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No scope changes yet"
          description="The team has not requested any scope updates."
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
