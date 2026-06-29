import {
  Archive,
  CheckCircle2,
  CreditCard,
  FileText,
  GitPullRequest,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const actionItems = [
  {
    key: "pendingApprovals" as const,
    label: "Approvals waiting",
    description: "Deliverables need your review",
    icon: CheckCircle2,
    color: "text-blue-600 bg-blue-50",
  },
  {
    key: "pendingInvoices" as const,
    label: "Invoices pending",
    description: "Payment action required",
    icon: CreditCard,
    color: "text-amber-600 bg-amber-50",
  },
  {
    key: "recentReports" as const,
    label: "Reports available",
    description: "New weekly progress reports",
    icon: FileText,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "pendingScopeDecisions" as const,
    label: "Scope decisions",
    description: "Change requests awaiting decision",
    icon: GitPullRequest,
    color: "text-violet-600 bg-violet-50",
  },
  {
    key: "handoverItemsReady" as const,
    label: "Handover items ready",
    description: "Project assets available",
    icon: Archive,
    color: "text-slate-600 bg-slate-50",
  },
];

export type ClientActionCounts = {
  pendingApprovals: number;
  pendingInvoices: number;
  recentReports: number;
  pendingScopeDecisions: number;
  handoverItemsReady: number;
};

export function ClientActionCenter({ actions }: { actions: ClientActionCounts }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {actionItems.map((item) => {
        const Icon = item.icon;
        const count = actions[item.key];

        return (
          <Card key={item.key} className="transition-shadow hover:shadow-md">
            <CardHeader className="space-y-3 pb-0">
              <div className={cn("inline-flex rounded-md p-2.5", item.color)}>
                <Icon className="size-4" />
              </div>
              <CardTitle className="text-sm font-medium leading-snug">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="text-3xl font-bold tracking-tight tabular-nums">{count}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
