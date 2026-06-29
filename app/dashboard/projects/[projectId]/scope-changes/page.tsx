import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { ScopeChangeCard } from "@/components/scope-changes/scope-change-card";
import { ScopeQuoteForm } from "@/components/projects/delivery-forms";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AgencyScopeChangesPage({ params }: { params: { projectId: string } }) {
  const user = await requireAgencyUser();
  const project = await getAgencyProject(user.agencyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/dashboard/projects/${project.id}`} />
      <div className="grid gap-4">
        {project.scopeChanges.map((scopeChange) => (
          <div key={scopeChange.id}>
            <ScopeChangeCard scopeChange={scopeChange} />
            <ScopeQuoteForm scopeChange={scopeChange} />
          </div>
        ))}
      </div>
    </div>
  );
}
