import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectHealthBadge } from "@/components/dashboard/health-score-card";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientDashboardData } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function ClientProjectsPage() {
  const user = await requireClientUser();
  const { projects } = await getClientDashboardData(user.clientCompanyId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Projects"
        description="View all projects shared with you by your agency."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.length ? (
          projects.map((project) => (
            <Card key={project.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-base font-semibold">{project.name}</CardTitle>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <ProjectHealthBadge
                    score={project.healthScore}
                    label={project.healthLabel}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/client/projects/${project.id}`} />}
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
            title="No projects to show"
            description="Your agency has not shared any active projects yet."
            actions={
              <Button
                nativeButton={false}
                render={<Link href="/client">Back to action center</Link>}
              />
            }
          />
        )}
      </div>
    </div>
  );
}
