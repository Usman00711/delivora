import type { Deliverable, Milestone } from "@prisma/client";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListItemBox } from "@/components/ui/list-item-box";

type DeliverableWithMilestone = Deliverable & {
  milestone: Milestone | null;
};

export function DeliverableList({
  deliverables,
}: {
  deliverables: DeliverableWithMilestone[];
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Deliverables</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {deliverables.map((deliverable) => (
          <ListItemBox key={deliverable.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{deliverable.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {deliverable.description}
                </p>
                {deliverable.milestone && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Milestone: {deliverable.milestone.title}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge variant="outline">{deliverable.status.replace("_", " ")}</Badge>
                {deliverable.externalUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={deliverable.externalUrl} target="_blank" />}
                  >
                    Open
                    <ExternalLink className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </ListItemBox>
        ))}
      </CardContent>
    </Card>
  );
}
