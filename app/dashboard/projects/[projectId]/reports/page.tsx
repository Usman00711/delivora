import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { WeeklyReportCard } from "@/components/reports/weekly-report-card";
import { WeeklyReportCreateForm } from "@/components/projects/delivery-forms";
import { EmptyState } from "@/components/shared/empty-state";
import { getAgencyProject } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";
import { Button } from "@/components/ui/button";

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
      {project.weeklyReports.length ? (
        <div className="grid gap-4">
          {project.weeklyReports.map((report) => (
            <WeeklyReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reports yet"
          description="Create a weekly report to keep the client updated on progress."
          actions={
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/dashboard/projects/${project.id}/reports`} />}
            >
              Refresh
            </Button>
          }
        />
      )}
    </div>
  );
}
