import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListItemBox } from "@/components/ui/list-item-box";
import { formatDate } from "@/lib/data";

type PendingApproval = {
  id: string;
  title: string;
  dueDate: Date;
  status: string;
  project: {
    id: string;
    name: string;
  };
};

export function PendingActionsCard({
  approvals,
}: {
  approvals: PendingApproval[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-base font-semibold">Pending Client Approvals</CardTitle>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/dashboard/projects" />}>
          View all
          <ArrowRight className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {approvals.length ? (
          approvals.map((approval) => (
            <ListItemBox key={approval.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-medium">{approval.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {approval.project.name}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge variant="secondary">{approval.status}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(approval.dueDate)}
                  </span>
                </div>
              </div>
            </ListItemBox>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No client approvals are waiting.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
