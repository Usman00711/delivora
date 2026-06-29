"use client";

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsChartCard } from "@/components/analytics/analytics-chart-card";
import type { AnalyticsTurnaroundPoint } from "@/lib/data";

type ApprovalTurnaroundChartProps = {
  points: AnalyticsTurnaroundPoint[];
  emptyTitle?: string;
  emptyDescription?: string;
};

function ApprovalTurnaroundTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: AnalyticsTurnaroundPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as AnalyticsTurnaroundPoint;
  if (!point) return null;

  return (
    <div className="rounded-md border border-border bg-background p-2 text-xs shadow-sm">
      <p className="font-medium">{point.label}</p>
      <p className="text-muted-foreground">
        Avg. turnaround: {point.avgHours.toFixed(1)} hours
      </p>
      <p className="text-muted-foreground">Resolved approvals: {point.sampleSize}</p>
    </div>
  );
}

export function ApprovalTurnaroundChart({
  points,
  emptyTitle = "No completed approvals yet",
  emptyDescription = "Resolved approvals will populate this chart over the last 90 days.",
}: ApprovalTurnaroundChartProps) {
  const color = "var(--chart-2)";

  return (
    <AnalyticsChartCard
      title="Approval turnaround time"
      description="Average hours from request to decision (90-day window)."
      empty={points.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyActions={null}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={(value) => `${value}h`} />
          <Tooltip content={<ApprovalTurnaroundTooltip />} />
          <Line
            type="monotone"
            dataKey="avgHours"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 4 }}
          >
            <LabelList
              dataKey="avgHours"
              position="top"
              formatter={(value: number) => `${value}h`}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  );
}
