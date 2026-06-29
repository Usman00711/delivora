import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthScoreCardProps {
  score: number;
  label: string;
  className?: string;
}

function getHealthVariant(label: string) {
  switch (label.toLowerCase()) {
    case "healthy":
      return "default";
    case "stable":
      return "secondary";
    case "at risk":
      return "outline";
    default:
      return "destructive";
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export function HealthScoreCard({ score, label, className }: HealthScoreCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="space-y-0 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Project Health
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between pt-4">
        <div>
          <span className={cn("text-3xl font-bold tabular-nums", getScoreColor(score))}>
            {score}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">/ 100</span>
        </div>
        <Badge variant={getHealthVariant(label)}>{label}</Badge>
      </CardContent>
    </Card>
  );
}

export function ProjectHealthBadge({ score, label }: { score: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={cn("text-sm font-semibold tabular-nums", getScoreColor(score))}>
        {score}
      </span>
      <Badge variant={getHealthVariant(label)} className="text-xs">
        {label}
      </Badge>
    </div>
  );
}
