import { prisma } from "@/lib/prisma";
import { calculateProjectHealth } from "@/lib/health-score";

export type ActionState = {
  error?: string;
  success?: string;
};

export function firstError(error: unknown, fallback = "Something went wrong.") {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray(error.issues)
  ) {
    return error.issues[0]?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function updateProjectHealth(projectId: string) {
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    include: {
      milestones: true,
      approvals: true,
      invoices: true,
      weeklyReports: { orderBy: { weekEnd: "desc" }, take: 1 },
    },
  });

  const health = calculateProjectHealth({
    milestones: project.milestones,
    approvals: project.approvals,
    invoices: project.invoices,
    latestReport: project.weeklyReports[0],
  });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      healthScore: health.score,
      healthLabel: health.label,
    },
  });
}

export async function getAgencyProjectForAction(agencyId: string, projectId: string) {
  return prisma.project.findFirstOrThrow({
    where: { id: projectId, agencyId },
  });
}
