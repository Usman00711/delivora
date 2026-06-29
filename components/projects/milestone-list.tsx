import type { Milestone } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListItemBox } from "@/components/ui/list-item-box";
import { formatDate } from "@/lib/data";
import { MilestoneStatusForm } from "@/components/projects/delivery-forms";

export function MilestoneList({
  milestones,
  editable = true,
}: {
  milestones: Milestone[];
  editable?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Milestones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {milestones.map((milestone) => (
          <ListItemBox key={milestone.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{milestone.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {milestone.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <Badge variant={milestone.status === "OVERDUE" ? "destructive" : "outline"}>
                  {milestone.status.replace("_", " ")}
                </Badge>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(milestone.dueDate)}
                </p>
                {editable && (
                  <div className="mt-3">
                    <MilestoneStatusForm milestone={milestone} />
                  </div>
                )}
              </div>
            </div>
          </ListItemBox>
        ))}
      </CardContent>
    </Card>
  );
}
