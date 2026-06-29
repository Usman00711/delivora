import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientActionCenter } from "@/components/client/client-action-center";
import { SectionHeader } from "@/components/layout/section-header";
import { ListItemBox } from "@/components/ui/list-item-box";
import { getClientDashboardData } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const user = await requireClientUser();
  const { projects, actionCounts, actionItems } = await getClientDashboardData(
    user.clientCompanyId
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Action Center"
        description="Everything that needs your attention, in one place."
      />

      <ClientActionCenter actions={actionCounts} />

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold">Priority Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {actionItems.length ? (
            actionItems.slice(0, 6).map((item) => (
              <ListItemBox key={`${item.type}-${item.id}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.type} · {item.project}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={item.href} />}
                  >
                    Open
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </ListItemBox>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              You are all caught up.
            </p>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Projects</h2>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/client/projects" />}>
            View all
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="space-y-0 pb-0">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base font-semibold leading-snug">
                    {project.name}
                  </CardTitle>
                  <Badge variant="outline" className="shrink-0">
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  {project.clientCompany.name}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-sm">
                    Health:{" "}
                    <span className="font-semibold tabular-nums">{project.healthScore}</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/client/projects/${project.id}`} />}
                  >
                    Open
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
