import type {
  ApprovalRequest,
  Invoice,
  Milestone,
  WeeklyReport,
} from "@prisma/client";

type HealthInput = {
  milestones: Pick<Milestone, "status" | "dueDate">[];
  approvals: Pick<ApprovalRequest, "status" | "dueDate" | "createdAt">[];
  invoices: Pick<Invoice, "status" | "dueDate">[];
  latestReport?: Pick<WeeklyReport, "blockers" | "clientActions"> | null;
};

export function getHealthLabel(score: number) {
  if (score >= 85) return "Healthy";
  if (score >= 70) return "Stable";
  if (score >= 50) return "At Risk";
  return "Critical";
}

export function calculateProjectHealth(input: HealthInput, now = new Date()) {
  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(now.getDate() - 5);

  const overdueMilestones = input.milestones.filter(
    (milestone) =>
      milestone.status === "OVERDUE" ||
      (milestone.status !== "COMPLETED" && milestone.dueDate < now)
  ).length;

  const staleApprovals = input.approvals.filter(
    (approval) =>
      approval.status === "PENDING" &&
      (approval.dueDate < now || approval.createdAt < fiveDaysAgo)
  ).length;

  const overdueInvoices = input.invoices.filter(
    (invoice) =>
      invoice.status === "OVERDUE" ||
      (invoice.status === "SENT" && invoice.dueDate < now)
  ).length;

  const latestReportHasBlocker = Boolean(
    input.latestReport?.blockers &&
      !["none", "n/a", "no blockers"].includes(
        input.latestReport.blockers.trim().toLowerCase()
      )
  );

  const clientActionsCleared = Boolean(
    input.latestReport?.clientActions &&
      ["none", "n/a", "no actions"].includes(
        input.latestReport.clientActions.trim().toLowerCase()
      )
  );

  let score = 100;
  score -= Math.min(overdueMilestones * 10, 30);
  score -= Math.min(staleApprovals * 8, 24);
  score -= Math.min(overdueInvoices * 10, 20);
  score -= latestReportHasBlocker ? 8 : 0;
  score += clientActionsCleared ? 5 : 0;

  const normalizedScore = Math.max(0, Math.min(100, score));

  return {
    score: normalizedScore,
    label: getHealthLabel(normalizedScore),
  };
}
