import { AlertTriangle, CheckCircle2, Clock, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthScoreCard } from "@/components/dashboard/health-score-card";

type HealthPanelProps = {
  score: number;
  label: string;
  overdueMilestones: number;
  pendingApprovals: number;
  openInvoices: number;
};

export function ProjectHealthPanel({
  score,
  label,
  overdueMilestones,
  pendingApprovals,
  openInvoices,
}: HealthPanelProps) {
  const factors = [
    { label: "Overdue milestones", value: overdueMilestones, icon: AlertTriangle },
    { label: "Pending approvals", value: pendingApprovals, icon: Clock },
    { label: "Open invoices", value: openInvoices, icon: Receipt },
    { label: "Delivery posture", value: label, icon: CheckCircle2 },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <HealthScoreCard score={score} label={label} />
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold">Health Drivers</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {factors.map((factor) => {
            const Icon = factor.icon;

            return (
              <div key={factor.label} className="rounded-md border bg-background p-3">
                <Icon className="size-4 text-muted-foreground" />
                <p className="mt-3 text-2xl font-semibold tabular-nums">
                  {factor.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{factor.label}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
