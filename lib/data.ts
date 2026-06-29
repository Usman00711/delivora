import { prisma } from "@/lib/prisma";

export function formatCurrency(amount: number | { toNumber(): number }) {
  const value = typeof amount === "number" ? amount : amount.toNumber();

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const healthTrendWindowWeeks = 12;
export const turnaroundWindowDays = 90;
export const deliveryProgressProjectLimit = 10;

export type AnalyticsHealthTrendPoint = {
  weekStart: string;
  label: string;
  avgHealth: number;
  projectCount: number;
};

export type AnalyticsTurnaroundPoint = {
  weekStart: string;
  label: string;
  avgHours: number;
  sampleSize: number;
};

export type AnalyticsInvoiceStatusPoint = {
  status: string;
  label: string;
  count: number;
};

export type AnalyticsDeliveryProgressPoint = {
  projectId: string;
  projectName: string;
  projectStatus: string;
  progress: number;
  totalMilestones: number;
  completedMilestones: number;
  hasMilestones: boolean;
};

export type AgencyDashboardAnalytics = {
  healthTrend: AnalyticsHealthTrendPoint[];
  approvalTurnaround: AnalyticsTurnaroundPoint[];
  invoiceStatusBreakdown: AnalyticsInvoiceStatusPoint[];
  deliveryProgress: AnalyticsDeliveryProgressPoint[];
};

export type ClientDashboardAnalytics = AgencyDashboardAnalytics;

function startOfWeek(date: Date) {
  const clone = new Date(date);
  const day = clone.getDay();
  const diffToMonday = (day + 6) % 7;
  clone.setDate(clone.getDate() - diffToMonday);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function weekLabel(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function buildHealthTrendBuckets(start: Date, weeks: number) {
  const buckets: {
    [key: string]: {
      weekStart: Date;
      label: string;
      total: number;
      count: number;
    };
  } = {};

  for (let i = 0; i < weeks; i++) {
    const week = new Date(start);
    week.setDate(week.getDate() + i * 7);
    const key = week.toISOString().slice(0, 10);
    buckets[key] = {
      weekStart: week,
      label: weekLabel(week),
      total: 0,
      count: 0,
    };
  }

  return buckets;
}

export async function getAgencyDashboardData(agencyId: string) {
  const [projects, pendingApprovals, scopeChanges, overdueMilestones, pendingInvoices, activity] =
    await Promise.all([
      prisma.project.findMany({
        where: { agencyId },
        include: { clientCompany: true },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
      prisma.approvalRequest.findMany({
        where: {
          project: { agencyId },
          status: "PENDING",
        },
        include: { project: true },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
      prisma.scopeChangeRequest.count({
        where: {
          project: { agencyId },
          status: { in: ["REQUESTED", "QUOTED"] },
        },
      }),
      prisma.milestone.count({
        where: {
          project: { agencyId },
          status: "OVERDUE",
        },
      }),
      prisma.invoice.count({
        where: {
          project: { agencyId },
          status: { in: ["SENT", "OVERDUE"] },
        },
      }),
      prisma.activityLog.findMany({
        where: { agencyId },
        include: { project: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const activeProjects = projects.filter((project) =>
    ["PLANNING", "ACTIVE", "REVIEW", "HANDOVER"].includes(project.status)
  );

  const averageHealth = projects.length
    ? Math.round(
        projects.reduce((total, project) => total + project.healthScore, 0) /
          projects.length
      )
    : 0;

  return {
    stats: {
      activeProjects: activeProjects.length,
      pendingApprovals: pendingApprovals.length,
      openScopeChanges: scopeChanges,
      overdueMilestones,
      pendingInvoices,
      averageHealth,
    },
    projects,
    pendingApprovals,
    activity,
  };
}

export async function getAgencyProjects(agencyId: string) {
  return prisma.project.findMany({
    where: { agencyId },
    include: {
      clientCompany: true,
      milestones: true,
      approvals: true,
      invoices: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAgencyProject(agencyId: string, projectId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, agencyId },
    include: {
      clientCompany: true,
      milestones: { orderBy: { dueDate: "asc" } },
      deliverables: { include: { milestone: true }, orderBy: { createdAt: "desc" } },
      approvals: { include: { deliverable: true }, orderBy: { dueDate: "asc" } },
      scopeChanges: { include: { requestedBy: true }, orderBy: { createdAt: "desc" } },
      weeklyReports: { orderBy: { weekEnd: "desc" } },
      handoverItems: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { dueDate: "asc" } },
      activityLogs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function getClients(agencyId: string) {
  return prisma.clientCompany.findMany({
    where: { agencyId },
    include: {
      users: true,
      projects: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getClientDashboardData(clientCompanyId: string) {
  const [projects, approvals, scopeChanges, invoices, reports, handoverItems, milestones] =
    await Promise.all([
      prisma.project.findMany({
        where: { clientCompanyId },
        include: { clientCompany: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.approvalRequest.findMany({
        where: { project: { clientCompanyId }, status: "PENDING" },
        include: { project: true },
        orderBy: { dueDate: "asc" },
      }),
      prisma.scopeChangeRequest.findMany({
        where: {
          project: { clientCompanyId },
          status: "QUOTED",
        },
        include: { project: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.invoice.findMany({
        where: {
          project: { clientCompanyId },
          status: { in: ["SENT", "OVERDUE"] },
        },
        include: { project: true },
        orderBy: { dueDate: "asc" },
      }),
      prisma.weeklyReport.findMany({
        where: {
          project: { clientCompanyId },
          publishedAt: { not: null },
        },
        include: { project: true },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
      prisma.handoverItem.findMany({
        where: {
          project: { clientCompanyId },
          isVisibleToClient: true,
        },
        include: { project: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.milestone.findMany({
        where: {
          project: { clientCompanyId },
          status: { in: ["IN_PROGRESS", "OVERDUE"] },
        },
        include: { project: true },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
    ]);

  return {
    projects,
    actionCounts: {
      pendingApprovals: approvals.length,
      pendingInvoices: invoices.length,
      recentReports: reports.length,
      pendingScopeDecisions: scopeChanges.length,
      handoverItemsReady: handoverItems.length,
    },
    actionItems: [
      ...approvals.map((item) => ({
        id: item.id,
        type: "Approval",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/approvals/${item.id}`,
        urgency: item.dueDate < new Date() ? 1 : 2,
      })),
      ...scopeChanges.map((item) => ({
        id: item.id,
        type: "Scope",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/scope-changes/${item.id}`,
        urgency: 3,
      })),
      ...invoices.map((item) => ({
        id: item.id,
        type: "Invoice",
        title: `${item.invoiceNumber} ${formatCurrency(item.amount)}`,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/invoices/${item.id}`,
        urgency: item.status === "OVERDUE" ? 1 : 4,
      })),
      ...reports.map((item) => ({
        id: item.id,
        type: "Report",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/reports/${item.id}`,
        urgency: 5,
      })),
      ...handoverItems.map((item) => ({
        id: item.id,
        type: "Handover",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/handover/${item.id}`,
        urgency: 6,
      })),
      ...milestones.map((item) => ({
        id: item.id,
        type: "Milestone",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/milestones/${item.id}`,
        urgency: item.status === "OVERDUE" ? 1 : 7,
      })),
    ].sort((a, b) => a.urgency - b.urgency),
  };
}

export async function getClientProject(clientCompanyId: string, projectId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, clientCompanyId },
    include: {
      clientCompany: true,
      milestones: { orderBy: { dueDate: "asc" } },
      deliverables: { include: { milestone: true }, orderBy: { createdAt: "desc" } },
      approvals: { include: { deliverable: true }, orderBy: { dueDate: "asc" } },
      scopeChanges: { include: { requestedBy: true }, orderBy: { createdAt: "desc" } },
      weeklyReports: {
        where: { publishedAt: { not: null } },
        orderBy: { weekEnd: "desc" },
      },
      handoverItems: {
        where: { isVisibleToClient: true },
        orderBy: { createdAt: "desc" },
      },
      invoices: { orderBy: { dueDate: "asc" } },
      activityLogs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function getAgencyDashboardAnalytics(
  agencyId: string
): Promise<AgencyDashboardAnalytics> {
  const now = new Date();
  const healthWindowStart = startOfWeek(new Date(now));
  healthWindowStart.setDate(healthWindowStart.getDate() - (healthTrendWindowWeeks - 1) * 7);

  const turnaroundWindowStart = new Date(now);
  turnaroundWindowStart.setDate(now.getDate() - turnaroundWindowDays);

  const turnaroundWindowWeeks = Math.ceil(turnaroundWindowDays / 7);
  const turnaroundWindowStartWeek = startOfWeek(turnaroundWindowStart);

  const milestoneProgressWhere = { agencyId };

  const [healthProjects, turnaroundApprovals, invoiceRows, progressProjects] =
    await Promise.all([
      prisma.project.findMany({
        where: {
          agencyId,
          updatedAt: { gte: healthWindowStart },
        },
        select: {
          healthScore: true,
          updatedAt: true,
        },
      }),
      prisma.approvalRequest.findMany({
        where: {
          project: { agencyId },
          decidedAt: { gte: turnaroundWindowStart },
          status: { in: ["APPROVED", "CHANGES_REQUESTED", "REJECTED"] },
        },
        select: {
          createdAt: true,
          decidedAt: true,
        },
      }),
      prisma.invoice.groupBy({
        by: ["status"],
        where: {
          project: { agencyId },
        },
        _count: { _all: true },
      }),
      prisma.project.findMany({
        where: milestoneProgressWhere,
        select: {
          id: true,
          name: true,
          status: true,
          updatedAt: true,
          milestones: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: deliveryProgressProjectLimit,
      }),
    ]);

  const healthBuckets = buildHealthTrendBuckets(
    healthWindowStart,
    healthTrendWindowWeeks
  );

  for (const project of healthProjects) {
    const bucketDate = startOfWeek(new Date(project.updatedAt));
    const key = bucketDate.toISOString().slice(0, 10);
    if (!healthBuckets[key]) continue;

    healthBuckets[key].total += project.healthScore;
    healthBuckets[key].count += 1;
  }

  const healthTrend = Object.values(healthBuckets)
    .map((bucket) => ({
      weekStart: bucket.weekStart.toISOString(),
      label: bucket.label,
      avgHealth:
        bucket.count > 0
          ? Math.round((bucket.total / bucket.count) * 10) / 10
          : 0,
      projectCount: bucket.count,
    }))
    .filter((point) => point.projectCount > 0);

  const turnaroundBuckets = buildHealthTrendBuckets(
    turnaroundWindowStartWeek,
    turnaroundWindowWeeks
  );

  for (const approval of turnaroundApprovals) {
    if (!approval.decidedAt) continue;
    const bucketDate = startOfWeek(new Date(approval.decidedAt));
    const key = bucketDate.toISOString().slice(0, 10);
    if (!turnaroundBuckets[key]) continue;

    const hours = (new Date(approval.decidedAt).getTime() - approval.createdAt.getTime()) / 3600000;
    turnaroundBuckets[key].total += hours;
    turnaroundBuckets[key].count += 1;
  }

  const approvalTurnaround = Object.values(turnaroundBuckets)
    .map((bucket) => ({
      weekStart: bucket.weekStart.toISOString(),
      label: bucket.label,
      avgHours:
        bucket.count > 0 ? Math.round((bucket.total / bucket.count) * 10) / 10 : 0,
      sampleSize: bucket.count,
    }))
    .filter((point) => point.sampleSize > 0);

  const invoiceStatusBreakdown = invoiceRows
    .filter((row) => row._count._all > 0)
    .map((row) => ({
      status: row.status,
      label: row.status.replace(/_/g, " "),
      count: row._count._all,
    }));

  const baselineByStatus = {
    PLANNING: 12,
    ACTIVE: 35,
    REVIEW: 68,
    HANDOVER: 88,
    COMPLETED: 100,
    PAUSED: 55,
  };

  const deliveryProgress = progressProjects.map((project) => {
    const milestones = project.milestones;
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(
      (milestone) => milestone.status === "COMPLETED"
    ).length;

    const hasMilestones = totalMilestones > 0;
    const progress = hasMilestones
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : baselineByStatus[project.status as keyof typeof baselineByStatus] ??
        10;

    return {
      projectId: project.id,
      projectName: project.name,
      projectStatus: project.status,
      progress,
      totalMilestones,
      completedMilestones,
      hasMilestones,
    };
  });

  return {
    healthTrend,
    approvalTurnaround,
    invoiceStatusBreakdown,
    deliveryProgress,
  };
}

export async function getClientDashboardAnalytics(
  clientCompanyId: string
): Promise<ClientDashboardAnalytics> {
  const now = new Date();
  const healthWindowStart = startOfWeek(new Date(now));
  healthWindowStart.setDate(healthWindowStart.getDate() - (healthTrendWindowWeeks - 1) * 7);

  const turnaroundWindowStart = new Date(now);
  turnaroundWindowStart.setDate(now.getDate() - turnaroundWindowDays);

  const turnaroundWindowWeeks = Math.ceil(turnaroundWindowDays / 7);
  const turnaroundWindowStartWeek = startOfWeek(turnaroundWindowStart);

  const milestoneProgressWhere = { clientCompanyId };

  const [healthProjects, turnaroundApprovals, invoiceRows, progressProjects] =
    await Promise.all([
      prisma.project.findMany({
        where: {
          clientCompanyId,
          updatedAt: { gte: healthWindowStart },
        },
        select: {
          healthScore: true,
          updatedAt: true,
        },
      }),
      prisma.approvalRequest.findMany({
        where: {
          project: { clientCompanyId },
          decidedAt: { gte: turnaroundWindowStart },
          status: { in: ["APPROVED", "CHANGES_REQUESTED", "REJECTED"] },
        },
        select: {
          createdAt: true,
          decidedAt: true,
        },
      }),
      prisma.invoice.groupBy({
        by: ["status"],
        where: {
          project: { clientCompanyId },
        },
        _count: { _all: true },
      }),
      prisma.project.findMany({
        where: milestoneProgressWhere,
        select: {
          id: true,
          name: true,
          status: true,
          updatedAt: true,
          milestones: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: deliveryProgressProjectLimit,
      }),
    ]);

  const healthBuckets = buildHealthTrendBuckets(
    healthWindowStart,
    healthTrendWindowWeeks
  );

  for (const project of healthProjects) {
    const bucketDate = startOfWeek(new Date(project.updatedAt));
    const key = bucketDate.toISOString().slice(0, 10);
    if (!healthBuckets[key]) continue;

    healthBuckets[key].total += project.healthScore;
    healthBuckets[key].count += 1;
  }

  const healthTrend = Object.values(healthBuckets)
    .map((bucket) => ({
      weekStart: bucket.weekStart.toISOString(),
      label: bucket.label,
      avgHealth:
        bucket.count > 0
          ? Math.round((bucket.total / bucket.count) * 10) / 10
          : 0,
      projectCount: bucket.count,
    }))
    .filter((point) => point.projectCount > 0);

  const turnaroundBuckets = buildHealthTrendBuckets(
    turnaroundWindowStartWeek,
    turnaroundWindowWeeks
  );

  for (const approval of turnaroundApprovals) {
    if (!approval.decidedAt) continue;
    const bucketDate = startOfWeek(new Date(approval.decidedAt));
    const key = bucketDate.toISOString().slice(0, 10);
    if (!turnaroundBuckets[key]) continue;

    const hours = (new Date(approval.decidedAt).getTime() - approval.createdAt.getTime()) / 3600000;
    turnaroundBuckets[key].total += hours;
    turnaroundBuckets[key].count += 1;
  }

  const approvalTurnaround = Object.values(turnaroundBuckets)
    .map((bucket) => ({
      weekStart: bucket.weekStart.toISOString(),
      label: bucket.label,
      avgHours:
        bucket.count > 0 ? Math.round((bucket.total / bucket.count) * 10) / 10 : 0,
      sampleSize: bucket.count,
    }))
    .filter((point) => point.sampleSize > 0);

  const invoiceStatusBreakdown = invoiceRows
    .filter((row) => row._count._all > 0)
    .map((row) => ({
      status: row.status,
      label: row.status.replace(/_/g, " "),
      count: row._count._all,
    }));

  const baselineByStatus = {
    PLANNING: 12,
    ACTIVE: 35,
    REVIEW: 68,
    HANDOVER: 88,
    COMPLETED: 100,
    PAUSED: 55,
  };

  const deliveryProgress = progressProjects.map((project) => {
    const milestones = project.milestones;
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(
      (milestone) => milestone.status === "COMPLETED"
    ).length;

    const hasMilestones = totalMilestones > 0;
    const progress = hasMilestones
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : baselineByStatus[project.status as keyof typeof baselineByStatus] ??
        10;

    return {
      projectId: project.id,
      projectName: project.name,
      projectStatus: project.status,
      progress,
      totalMilestones,
      completedMilestones,
      hasMilestones,
    };
  });

  return {
    healthTrend,
    approvalTurnaround,
    invoiceStatusBreakdown,
    deliveryProgress,
  };
}
