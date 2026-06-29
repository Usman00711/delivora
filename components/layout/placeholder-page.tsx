import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  phase?: number;
}

export function PlaceholderPage({
  title,
  description,
  phase = 3,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <SectionHeader title={title} description={description} />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Construction className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">Coming in Phase {phase}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            This section will be implemented with real data and CRUD operations in
            the next build phase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
