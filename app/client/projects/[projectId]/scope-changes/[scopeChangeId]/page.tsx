import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/data";
import { ScopeChangeCard } from "@/components/scope-changes/scope-change-card";
import { requireClientUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientScopeChangeDetailPage({
  params,
}: {
  params: { projectId: string; scopeChangeId: string };
}) {
  const user = await requireClientUser();
  const scopeChange = await prisma.scopeChangeRequest.findFirst({
    where: {
      id: params.scopeChangeId,
      project: { clientCompanyId: user.clientCompanyId },
    },
    include: {
      project: { select: { id: true, name: true } },
      requestedBy: { select: { name: true } },
    },
  });

  if (!scopeChange) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Client Action Center</p>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Scope change detail</h1>
          <Badge variant="outline">{scopeChange.status.replace("_", " ")}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {scopeChange.project.name} · requested by {scopeChange.requestedBy.name}
        </p>
      </div>

      <ScopeChangeCard scopeChange={scopeChange} showDecisionForm={scopeChange.status === "QUOTED"} />

      <div className="grid gap-3 rounded-md border bg-muted/30 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Estimated cost</p>
          <p className="mt-1 font-semibold">
            {scopeChange.estimateAmount ? formatCurrency(scopeChange.estimateAmount) : "To be quoted"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Estimated timeline</p>
          <p className="mt-1 font-semibold">
            {scopeChange.estimateDays ? `${scopeChange.estimateDays} days` : "To be quoted"}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href={`/client/projects/${scopeChange.project.id}/scope-changes`}>
          <ArrowLeft className="size-3.5" />
          Back to scope changes
        </Link>}
      />
      <Button variant="secondary" nativeButton={false} render={<Link href="/client" />}>
        Back to action center
      </Button>
    </div>
  );
}

