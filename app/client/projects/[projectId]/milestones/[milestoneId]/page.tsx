import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientMilestoneDetailPage({
  params,
}: {
  params: { projectId: string; milestoneId: string };
}) {
  const user = await requireClientUser();
  const milestone = await prisma.milestone.findFirst({
    where: {
      id: params.milestoneId,
      project: { clientCompanyId: user.clientCompanyId },
    },
    include: {
      project: { select: { id: true, name: true } },
    },
  });

  if (!milestone) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Client Action Center</p>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Milestone detail</h1>
          <Badge variant={milestone.status === "OVERDUE" ? "destructive" : "outline"}>
            {milestone.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {milestone.project.name} · Due {formatDate(milestone.dueDate)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">{milestone.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4">
          <p className="text-sm text-muted-foreground">{milestone.description}</p>
          <p className="text-sm text-muted-foreground">
            Current phase: <span className="font-medium text-foreground">{milestone.status}</span>
          </p>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href={`/client/projects/${milestone.project.id}/milestones`}>
          <ArrowLeft className="size-3.5" />
          Back to milestones
        </Link>}
      />
      <Button variant="secondary" nativeButton={false} render={<Link href="/client" />}>
        Back to action center
      </Button>
    </div>
  );
}

