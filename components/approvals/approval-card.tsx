import type { ApprovalRequest, Deliverable } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/data";

type ApprovalWithDeliverable = ApprovalRequest & {
  deliverable?: Deliverable | null;
};

export function ApprovalCard({
  approval,
  children,
}: {
  approval: ApprovalWithDeliverable;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="space-y-3 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold">{approval.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{approval.notes}</p>
          </div>
          <Badge variant={approval.status === "PENDING" ? "secondary" : "outline"}>
            {approval.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Due date</p>
            <p className="mt-1 font-medium">{formatDate(approval.dueDate)}</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Deliverable</p>
            <p className="mt-1 font-medium">
              {approval.deliverable?.title ?? "General approval"}
            </p>
          </div>
        </div>
        {approval.decisionNote && (
          <p className="mt-4 rounded-md bg-muted p-3 text-sm">{approval.decisionNote}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}
