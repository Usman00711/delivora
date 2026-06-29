"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsChartCard } from "@/components/analytics/analytics-chart-card";
import type { AnalyticsHealthTrendPoint } from "@/lib/data";

type HealthTrendChartProps = {
  points: AnalyticsHealthTrendPoint[];
  emptyTitle?: string;
  emptyDescription?: string;
};

function HealthTrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: AnalyticsHealthTrendPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as AnalyticsHealthTrendPoint;
  if (!point) return null;

  return (
    <div className="rounded-md border border-border bg-background p-2 text-xs shadow-sm">
      <p className="font-medium">{point.label}</p>
      <p className="text-muted-foreground">Average health: {point.avgHealth}</p>
      <p className="text-muted-foreground">Projects sampled: {point.projectCount}</p>
    </div>
  );
}

export function HealthTrendChart({
  points,
  emptyTitle = "Collecting trend data",
  emptyDescription = "New project activity is still arriving. Start updating projects and you'll see health movement by week.",
}: HealthTrendChartProps) {
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return (
    <AnalyticsChartCard
      title="Health score trend"
      description="Average project health over the last 12 weeks."
      empty={points.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyActions={null}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}`} />
          <Tooltip content={<HealthTrendTooltip />} />
          <Line
            type="monotone"
            dataKey="avgHealth"
            stroke={chartColors[0]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  );
}
