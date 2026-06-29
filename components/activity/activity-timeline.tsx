import type { ActivityLog } from "@prisma/client";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListItemBox } from "@/components/ui/list-item-box";
import { timeAgo } from "@/lib/data";

export function ActivityTimeline({ items }: { items: ActivityLog[] }) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Activity className="size-4" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {items.length ? (
          items.map((item) => (
            <ListItemBox key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.type.replaceAll("_", " ").toLowerCase()}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {timeAgo(item.createdAt)}
                </span>
              </div>
            </ListItemBox>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
