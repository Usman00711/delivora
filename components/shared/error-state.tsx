import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ErrorAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
};

export function ErrorState({
  title = "Something went wrong",
  description = "Please refresh the page and try again.",
  actions,
}: {
  title?: string;
  description?: string;
  actions?: ErrorAction[];
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-11 items-center justify-center rounded-md bg-destructive/10">
          <AlertTriangle className="size-5 text-destructive" />
        </div>
        <p className="mt-4 font-medium">{title}</p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
        {actions && actions.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {actions.map((action) =>
              action.href ? (
                <Button
                  key={action.label}
                  variant={action.variant ?? "outline"}
                  size="sm"
                  nativeButton={false}
                  render={<Link href={action.href}>{action.label}</Link>}
                />
              ) : (
                <Button
                  key={action.label}
                  variant={action.variant ?? "outline"}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
