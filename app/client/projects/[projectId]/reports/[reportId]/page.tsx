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

export default async function ClientReportDetailPage({
  params,
}: {
  params: { projectId: string; reportId: string };
}) {
  const user = await requireClientUser();
  const report = await prisma.weeklyReport.findFirst({
    where: {
      id: params.reportId,
      project: { clientCompanyId: user.clientCompanyId },
    },
    include: {
      project: { select: { id: true, name: true } },
    },
  });

  if (!report) notFound();

  const status = report.publishedAt ? "Published" : "Draft";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Client Action Center</p>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Report detail</h1>
          <Badge variant={report.publishedAt ? "secondary" : "outline"}>{status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {report.project.name} · {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">{report.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 pt-4">
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Completed work</p>
            <p className="mt-1 text-sm">{report.completedWork}</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Next steps</p>
            <p className="mt-1 text-sm">{report.nextSteps}</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Blockers</p>
            <p className="mt-1 text-sm">{report.blockers}</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Client actions</p>
            <p className="mt-1 text-sm">{report.clientActions}</p>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href={`/client/projects/${report.project.id}/reports`}>
          <ArrowLeft className="size-3.5" />
          Back to reports
        </Link>}
      />
      <Button variant="secondary" nativeButton={false} render={<Link href="/client" />}>
        Back to action center
      </Button>
    </div>
  );
}

