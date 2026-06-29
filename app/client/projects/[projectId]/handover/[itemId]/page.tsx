import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireClientUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientHandoverDetailPage({
  params,
}: {
  params: { projectId: string; itemId: string };
}) {
  const user = await requireClientUser();
  const handoverItem = await prisma.handoverItem.findFirst({
    where: {
      id: params.itemId,
      project: { clientCompanyId: user.clientCompanyId },
    },
    include: {
      project: { select: { id: true, name: true } },
    },
  });

  if (!handoverItem) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Client Action Center</p>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Handover detail</h1>
          <Badge variant={handoverItem.isVisibleToClient ? "secondary" : "outline"}>
            {handoverItem.isVisibleToClient ? "Visible" : "Hidden"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {handoverItem.project.name} · {handoverItem.type.replace("_", " ")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">{handoverItem.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">{handoverItem.description}</p>
          {handoverItem.url && (
            <Button nativeButton={false} render={<Link href={handoverItem.url} target="_blank" />}>
              Open resource
              <ArrowUpRight className="size-3.5" />
            </Button>
          )}
        </CardContent>
      </Card>

      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href={`/client/projects/${handoverItem.project.id}/handover`}>
          <ArrowLeft className="size-3.5" />
          Back to handover vault
        </Link>}
      />
      <Button variant="secondary" nativeButton={false} render={<Link href="/client" />}>
        Back to action center
      </Button>
    </div>
  );
}

