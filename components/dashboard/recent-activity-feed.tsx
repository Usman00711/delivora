import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListItemBox } from "@/components/ui/list-item-box";
import { timeAgo } from "@/lib/data";

type ActivityItem = {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  project?: {
    name: string;
  } | null;
};

export function RecentActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {items.length ? (
          items.map((item) => (
            <ListItemBox key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.project?.name ?? item.type.replaceAll("_", " ").toLowerCase()}
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
