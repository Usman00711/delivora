"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsChartCard } from "@/components/analytics/analytics-chart-card";
import type { AnalyticsDeliveryProgressPoint } from "@/lib/data";

type DeliveryProgressChartProps = {
  points: AnalyticsDeliveryProgressPoint[];
  emptyTitle?: string;
  emptyDescription?: string;
};

function DeliveryProgressTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: AnalyticsDeliveryProgressPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as AnalyticsDeliveryProgressPoint;
  if (!point) return null;

  return (
    <div className="rounded-md border border-border bg-background p-2 text-xs shadow-sm">
      <p className="font-medium">{point.projectName}</p>
      <p className="text-muted-foreground">Progress: {point.progress}%</p>
      <p className="text-muted-foreground">
        Milestones: {point.completedMilestones}/{point.totalMilestones}
      </p>
      {!point.hasMilestones && (
        <p className="text-muted-foreground">Status baseline estimate from phase</p>
      )}
    </div>
  );
}

export function DeliveryProgressChart({
  points,
  emptyTitle = "No active projects to chart",
  emptyDescription = "Add projects and milestones to see per-project delivery progress.",
}: DeliveryProgressChartProps) {
  const color = "var(--chart-3)";

  return (
    <AnalyticsChartCard
      title="Project delivery progress"
      description="Milestone completion share for active projects."
      empty={points.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyActions={null}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={points}
          layout="vertical"
          margin={{ top: 8, right: 30, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis
            dataKey="projectName"
            type="category"
            width={130}
            tickLine={false}
          />
          <Tooltip content={<DeliveryProgressTooltip />} />
          <Bar dataKey="progress" fill={color} radius={[0, 6, 6, 0]}>
            <LabelList dataKey="progress" position="right" formatter={(value: number) => `${value}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  );
}
