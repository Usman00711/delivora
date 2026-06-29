import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ErrorState({
  title = "Something went wrong",
  description = "Please refresh the page and try again.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-11 items-center justify-center rounded-md bg-destructive/10">
          <AlertTriangle className="size-5 text-destructive" />
        </div>
        <p className="mt-4 font-medium">{title}</p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
