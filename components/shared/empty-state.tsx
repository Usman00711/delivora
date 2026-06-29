import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-11 items-center justify-center rounded-md bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
        <p className="mt-4 font-medium">{title}</p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
