export const APP_NAME = "Delivora";
export const APP_TAGLINE =
  "Client Delivery, Approvals & Handover Portal for Software Agencies";

export const agencyNavItems = [
  { title: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Clients", href: "/dashboard/clients", icon: "Users" },
  { title: "Projects", href: "/dashboard/projects", icon: "FolderKanban" },
  { title: "Activity", href: "/dashboard/activity", icon: "Activity" },
  { title: "Profile", href: "/dashboard/profile", icon: "User" },
  { title: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const clientNavItems = [
  { title: "Action Center", href: "/client", icon: "Inbox" },
  { title: "My Projects", href: "/client/projects", icon: "FolderOpen" },
  { title: "Profile", href: "/client/profile", icon: "User" },
] as const;

export const projectSubNavItems = [
  { title: "Overview", segment: "" },
  { title: "Milestones", segment: "milestones" },
  { title: "Deliverables", segment: "deliverables" },
  { title: "Approvals", segment: "approvals" },
  { title: "Scope Changes", segment: "scope-changes" },
  { title: "Reports", segment: "reports" },
  { title: "Handover", segment: "handover" },
  { title: "Invoices", segment: "invoices" },
] as const;
