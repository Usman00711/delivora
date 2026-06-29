import { Inbox } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

type AnalyticsChartCardProps = {
  title: string;
  description?: string;
  empty?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyActions?: React.ReactNode;
  children: React.ReactNode;
};

export function AnalyticsChartCard({
  title,
  description,
  empty,
  emptyTitle,
  emptyDescription,
  emptyActions,
  children,
}: AnalyticsChartCardProps) {
  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={Inbox}
        actions={emptyActions}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-64">{children}</div>
      </CardContent>
    </Card>
  );
}
