export const placeholderAgency = {
  name: "Nova Digital Studio",
  website: "https://novadigital.example",
  contactEmail: "hello@novadigital.example",
};

export const placeholderUser = {
  name: "Alex Rivera",
  email: "owner@clouddesk.dev",
  role: "AGENCY_OWNER" as const,
};

export const placeholderClientUser = {
  name: "Sarah Chen",
  email: "client@clouddesk.dev",
  role: "CLIENT" as const,
  company: "Orbit CRM Solutions",
};

export const placeholderDashboardStats = {
  activeProjects: 3,
  pendingApprovals: 4,
  openScopeChanges: 2,
  overdueMilestones: 1,
  pendingInvoices: 2,
  averageHealth: 78,
};

export const placeholderClientActions = {
  pendingApprovals: 2,
  pendingInvoices: 1,
  recentReports: 1,
  pendingScopeDecisions: 1,
  handoverItemsReady: 3,
};

export const placeholderProjects = [
  {
    id: "1",
    name: "CRM Client Portal Redesign",
    client: "Orbit CRM Solutions",
    status: "Development",
    healthScore: 82,
    healthLabel: "Stable",
  },
  {
    id: "2",
    name: "Appointment Booking Platform",
    client: "HealthBridge Clinics",
    status: "Testing",
    healthScore: 58,
    healthLabel: "At Risk",
  },
  {
    id: "3",
    name: "Learning Dashboard MVP",
    client: "EduSpark Academy",
    status: "Handover",
    healthScore: 94,
    healthLabel: "Healthy",
  },
];

export const placeholderRecentActivity = [
  {
    id: "1",
    action: "Approval sent",
    entity: "Homepage design approval",
    time: "2 hours ago",
  },
  {
    id: "2",
    action: "Milestone completed",
    entity: "Frontend Development",
    time: "5 hours ago",
  },
  {
    id: "3",
    action: "Report published",
    entity: "Week 12 Progress Report",
    time: "1 day ago",
  },
  {
    id: "4",
    action: "Scope change requested",
    entity: "Add export-to-CSV feature",
    time: "2 days ago",
  },
];

export const placeholderPendingApprovals = [
  {
    id: "1",
    title: "Homepage design approval",
    project: "CRM Client Portal Redesign",
    dueDate: "Jun 30, 2026",
    status: "Sent",
  },
  {
    id: "2",
    title: "User dashboard approval",
    project: "CRM Client Portal Redesign",
    dueDate: "Jul 2, 2026",
    status: "Sent",
  },
];

export const landingFeatures = [
  {
    title: "Client Action Center",
    description:
      "Give clients a focused dashboard showing exactly what needs their attention — approvals, invoices, reports, and more.",
    icon: "Inbox",
  },
  {
    title: "Approval Workflow",
    description:
      "Send deliverables for client sign-off with approve, reject, or request changes — full history included.",
    icon: "CheckCircle2",
  },
  {
    title: "Scope Change Management",
    description:
      "Track extra work requests with cost estimates, agency quotes, and client decisions in one place.",
    icon: "GitPullRequest",
  },
  {
    title: "Weekly Client Reports",
    description:
      "Generate structured progress reports with completed work, blockers, and client action items.",
    icon: "FileText",
  },
  {
    title: "Handover Vault",
    description:
      "Deliver repos, credentials, docs, and training materials securely at project completion.",
    icon: "Archive",
  },
  {
    title: "Project Health Score",
    description:
      "Automatic health scoring based on overdue milestones, pending approvals, and unpaid invoices.",
    icon: "HeartPulse",
  },
];
