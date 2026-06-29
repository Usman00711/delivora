"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AnalyticsChartCard } from "@/components/analytics/analytics-chart-card";
import type { AnalyticsInvoiceStatusPoint } from "@/lib/data";

type InvoiceStatusChartProps = {
  points: AnalyticsInvoiceStatusPoint[];
  emptyTitle?: string;
  emptyDescription?: string;
};

function InvoiceStatusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: AnalyticsInvoiceStatusPoint & { total: number };
    value?: number;
  }>;
}) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as AnalyticsInvoiceStatusPoint;
  if (!datum) return null;
  const total = payload[0]?.payload?.total ?? 1;

  return (
    <div className="rounded-md border border-border bg-background p-2 text-xs shadow-sm">
      <p className="font-medium">{datum.label}</p>
      <p className="text-muted-foreground">{datum.count} invoice(s)</p>
      <p className="text-muted-foreground">Share: {Math.round((datum.count / total) * 100)}%</p>
    </div>
  );
}

export function InvoiceStatusChart({
  points,
  emptyTitle = "No invoices yet",
  emptyDescription = "Issue invoices to start seeing a breakdown by status.",
}: InvoiceStatusChartProps) {
  const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  const total = points.reduce((sum, point) => sum + point.count, 0);
  const normalized = points.map((point) => ({ ...point, total }));

  return (
    <AnalyticsChartCard
      title="Invoice status breakdown"
      description="Current status mix for all scoped invoices."
      empty={points.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyActions={null}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={normalized}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ percent, name }) =>
              `${name} ${(percent ? Math.round(percent * 100) : 0)}%`
            }
          >
            {normalized.map((entry, index) => (
              <Cell key={entry.status} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip content={<InvoiceStatusTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </AnalyticsChartCard>
  );
}
