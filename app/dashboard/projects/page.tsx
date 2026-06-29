import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectHealthBadge } from "@/components/dashboard/health-score-card";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAgencyProjects } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const user = await requireAgencyUser();
  const projects = await getAgencyProjects(user.agencyId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Projects"
        description="View and manage delivery-focused client projects."
        action={
          <Button nativeButton={false} render={<Link href="/dashboard/projects/new" />}>
            New project
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.length ? (
          projects.map((project) => (
            <Card key={project.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {project.name}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.clientCompany.name}
                    </p>
                  </div>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <ProjectHealthBadge
                    score={project.healthScore}
                    label={project.healthLabel}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/dashboard/projects/${project.id}`} />}
                  >
                    Open
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No projects yet"
            description="Add your first client project to start tracking delivery."
            actions={
              <Button nativeButton={false} render={<Link href="/dashboard/projects/new" />}>
                Create first project
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
