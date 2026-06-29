import { notFound } from "next/navigation";
import { MilestoneList } from "@/components/projects/milestone-list";
import { MilestoneCreateForm } from "@/components/projects/delivery-forms";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AgencyMilestonesPage({ params }: { params: { projectId: string } }) {
  const user = await requireAgencyUser();
  const project = await getAgencyProject(user.agencyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/dashboard/projects/${project.id}`} />
      <MilestoneCreateForm projectId={project.id} />
      <MilestoneList milestones={project.milestones} />
    </div>
  );
}
