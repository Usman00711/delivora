import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { WeeklyReportCard } from "@/components/reports/weekly-report-card";
import { WeeklyReportCreateForm } from "@/components/projects/delivery-forms";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AgencyReportsPage({ params }: { params: { projectId: string } }) {
  const user = await requireAgencyUser();
  const project = await getAgencyProject(user.agencyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/dashboard/projects/${project.id}`} />
      <WeeklyReportCreateForm projectId={project.id} />
      <div className="grid gap-4">
        {project.weeklyReports.map((report) => (
          <WeeklyReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
