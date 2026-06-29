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
        href: `/client/projects/${item.projectId}/approvals`,
        urgency: item.dueDate < new Date() ? 1 : 2,
      })),
      ...scopeChanges.map((item) => ({
        id: item.id,
        type: "Scope",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/scope-changes`,
        urgency: 3,
      })),
      ...invoices.map((item) => ({
        id: item.id,
        type: "Invoice",
        title: `${item.invoiceNumber} ${formatCurrency(item.amount)}`,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/invoices`,
        urgency: item.status === "OVERDUE" ? 1 : 4,
      })),
      ...reports.map((item) => ({
        id: item.id,
        type: "Report",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/reports`,
        urgency: 5,
      })),
      ...handoverItems.map((item) => ({
        id: item.id,
        type: "Handover",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}/handover`,
        urgency: 6,
      })),
      ...milestones.map((item) => ({
        id: item.id,
        type: "Milestone",
        title: item.title,
        project: item.project.name,
        href: `/client/projects/${item.projectId}`,
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
