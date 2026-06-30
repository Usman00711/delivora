import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApprovalCard } from "@/components/approvals/approval-card";
import { ApprovalDecisionForm } from "@/components/approvals/approval-decision-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientApprovalDetailPage({
  params,
}: {
  params: { projectId: string; approvalId: string };
}) {
  const user = await requireClientUser();
  const approval = await prisma.approvalRequest.findFirst({
    where: {
      id: params.approvalId,
      project: { clientCompanyId: user.clientCompanyId },
    },
    include: {
      project: { select: { id: true, name: true } },
      deliverable: true,
    },
  });

  if (!approval) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Client Action Center</p>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Approval detail</h1>
          <Badge>{approval.status.replace("_", " ")}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {approval.project.name} · {formatDate(approval.dueDate)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Context</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Project</p>
            <p className="mt-1 font-medium">{approval.project.name}</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Deliverable</p>
            <p className="mt-1 font-medium">
              {approval.deliverable?.title ?? "General approval"}
            </p>
          </div>
          <div className="rounded-md border bg-background p-3 sm:col-span-2">
            <p className="text-xs text-muted-foreground">Notes</p>
            <p className="mt-1 text-sm text-muted-foreground">{approval.notes}</p>
          </div>
        </CardContent>
      </Card>

      <ApprovalCard approval={approval}>
        {approval.status === "PENDING" ? (
          <ApprovalDecisionForm approvalId={approval.id} />
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            This approval has already been resolved.
          </p>
        )}
      </ApprovalCard>

      <Card>
        <CardContent className="pt-4">
          {approval.status === "PENDING" ? (
            <p className="text-sm text-muted-foreground">
              Please approve, request changes, or reject this request to keep the project moving.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Your decision is complete.</p>
          )}
        </CardContent>
      </Card>

      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href={`/client/projects/${approval.project.id}/approvals`}>
          <ArrowLeft className="size-3.5" />
          Back to approvals list
        </Link>}
      />
      <Button variant="secondary" nativeButton={false} render={<Link href="/client" />}>
        Back to action center
      </Button>
    </div>
  );
}
