import bcrypt from "bcryptjs";
import {
  ActivityType,
  HandoverItemType,
  PrismaClient,
  ProjectStatus,
} from "@prisma/client";
import { calculateProjectHealth } from "../lib/health-score";

const prisma = new PrismaClient();

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.handoverItem.deleteMany();
  await prisma.weeklyReport.deleteMany();
  await prisma.scopeChangeRequest.deleteMany();
  await prisma.approvalRequest.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clientCompany.deleteMany();
  await prisma.agency.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  const agency = await prisma.agency.create({
    data: {
      name: "Nova Digital Studio",
      website: "https://novadigital.example",
      contactEmail: "hello@novadigital.example",
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "owner@clouddesk.dev",
      passwordHash,
      role: "AGENCY_OWNER",
      agencyId: agency.id,
    },
  });

  await prisma.user.create({
    data: {
      name: "Maya Patel",
      email: "member@clouddesk.dev",
      passwordHash,
      role: "AGENCY_MEMBER",
      agencyId: agency.id,
    },
  });

  const orbit = await prisma.clientCompany.create({
    data: {
      name: "Orbit CRM Solutions",
      contactEmail: "sarah@orbitcrm.example",
      agencyId: agency.id,
    },
  });

  const healthBridge = await prisma.clientCompany.create({
    data: {
      name: "HealthBridge Clinics",
      contactEmail: "ops@healthbridge.example",
      agencyId: agency.id,
    },
  });

  const eduSpark = await prisma.clientCompany.create({
    data: {
      name: "EduSpark Academy",
      contactEmail: "team@eduspark.example",
      agencyId: agency.id,
    },
  });

  const client = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "client@clouddesk.dev",
      passwordHash,
      role: "CLIENT",
      clientCompanyId: orbit.id,
    },
  });

  const projectSeeds = [
    {
      name: "CRM Client Portal Redesign",
      description:
        "A client-facing CRM portal refresh with approvals, onboarding, and reporting workflows.",
      status: ProjectStatus.ACTIVE,
      clientCompanyId: orbit.id,
      budget: 28000,
      startDate: daysFromNow(-35),
      dueDate: daysFromNow(42),
    },
    {
      name: "Appointment Booking Platform",
      description:
        "A scheduling platform for clinic appointments, intake forms, and admin coordination.",
      status: ProjectStatus.REVIEW,
      clientCompanyId: healthBridge.id,
      budget: 36000,
      startDate: daysFromNow(-70),
      dueDate: daysFromNow(12),
    },
    {
      name: "Learning Dashboard MVP",
      description:
        "An MVP dashboard for student progress, course analytics, and handover documentation.",
      status: ProjectStatus.HANDOVER,
      clientCompanyId: eduSpark.id,
      budget: 22000,
      startDate: daysFromNow(-95),
      dueDate: daysFromNow(8),
    },
  ];

  for (const seed of projectSeeds) {
    const project = await prisma.project.create({
      data: {
        ...seed,
        agencyId: agency.id,
        healthScore: 100,
        healthLabel: "Healthy",
      },
    });

    const discovery = await prisma.milestone.create({
      data: {
        projectId: project.id,
        title: "Discovery and architecture",
        description: "Confirm workflows, portal structure, and delivery roadmap.",
        dueDate: daysFromNow(-25),
        completedAt: daysFromNow(-24),
        status: "COMPLETED",
      },
    });

    const implementation = await prisma.milestone.create({
      data: {
        projectId: project.id,
        title: "Client review build",
        description: "Prepare a polished build for client acceptance and feedback.",
        dueDate:
          project.status === ProjectStatus.REVIEW ? daysFromNow(-2) : daysFromNow(10),
        status:
          project.status === ProjectStatus.REVIEW ? "OVERDUE" : "IN_PROGRESS",
      },
    });

    const deliverable = await prisma.deliverable.create({
      data: {
        projectId: project.id,
        milestoneId: implementation.id,
        title: "Client dashboard review package",
        description: "Preview build, design notes, and acceptance checklist.",
        externalUrl: "https://preview.clouddesk.example",
        status: "SUBMITTED",
        submittedAt: daysFromNow(-3),
      },
    });

    await prisma.deliverable.create({
      data: {
        projectId: project.id,
        milestoneId: discovery.id,
        title: "Architecture brief",
        description: "Finalized workflow map and delivery scope.",
        externalUrl: "https://docs.clouddesk.example/architecture",
        status: "APPROVED",
        submittedAt: daysFromNow(-22),
      },
    });

    await prisma.approvalRequest.create({
      data: {
        projectId: project.id,
        deliverableId: deliverable.id,
        title: "Approve dashboard review package",
        notes: "Please review the latest build and choose an approval outcome.",
        dueDate:
          project.status === ProjectStatus.REVIEW ? daysFromNow(-1) : daysFromNow(3),
        status: "PENDING",
      },
    });

    await prisma.approvalRequest.create({
      data: {
        projectId: project.id,
        title: "Discovery sign-off",
        notes: "Scope and technical direction approved.",
        dueDate: daysFromNow(-20),
        decidedAt: daysFromNow(-19),
        decisionNote: "Approved with no changes.",
        status: "APPROVED",
      },
    });

    await prisma.scopeChangeRequest.create({
      data: {
        projectId: project.id,
        title: "Add CSV export to client reports",
        description:
          "Client requested CSV export for weekly report summaries and invoice snapshots.",
        estimateAmount: 1800,
        estimateDays: 3,
        status: project.clientCompanyId === orbit.id ? "QUOTED" : "REQUESTED",
        requestedById: client.id,
      },
    });

    await prisma.weeklyReport.create({
      data: {
        projectId: project.id,
        title: "Week 12 delivery report",
        weekStart: daysFromNow(-7),
        weekEnd: daysFromNow(-1),
        completedWork:
          "Completed portal navigation, client review states, and reporting polish.",
        nextSteps:
          "Resolve final client comments, package handover items, and close approval loop.",
        blockers:
          project.status === ProjectStatus.REVIEW
            ? "Awaiting client decision on the submitted review package."
            : "None",
        clientActions:
          project.clientCompanyId === orbit.id
            ? "Approve review package and scope quote."
            : "None",
        publishedAt: daysFromNow(-1),
      },
    });

    await prisma.handoverItem.create({
      data: {
        projectId: project.id,
        title: "Production repository",
        type: HandoverItemType.REPOSITORY,
        description: "Repository access and deployment notes for the client team.",
        url: "https://github.com/example/clouddesk-demo",
        isVisibleToClient: project.status === ProjectStatus.HANDOVER,
      },
    });

    await prisma.handoverItem.create({
      data: {
        projectId: project.id,
        title: "Admin training notes",
        type: HandoverItemType.TRAINING,
        description: "Short training document for client admins.",
        url: "https://docs.clouddesk.example/training",
        isVisibleToClient: true,
      },
    });

    await prisma.invoice.create({
      data: {
        projectId: project.id,
        invoiceNumber: `INV-${project.name.slice(0, 3).toUpperCase()}-1024`,
        amount: 6400,
        status: project.clientCompanyId === orbit.id ? "SENT" : "PAID",
        dueDate: project.clientCompanyId === orbit.id ? daysFromNow(5) : daysFromNow(-12),
        paidAt: project.clientCompanyId === orbit.id ? null : daysFromNow(-10),
      },
    });

    await prisma.activityLog.createMany({
      data: [
        {
          agencyId: agency.id,
          projectId: project.id,
          actorId: owner.id,
          type: ActivityType.PROJECT_CREATED,
          title: `${project.name} was created`,
          createdAt: daysFromNow(-30),
        },
        {
          agencyId: agency.id,
          projectId: project.id,
          actorId: owner.id,
          type: ActivityType.APPROVAL_REQUESTED,
          title: "Approval requested for dashboard review package",
          createdAt: daysFromNow(-3),
        },
        {
          agencyId: agency.id,
          projectId: project.id,
          actorId: owner.id,
          type: ActivityType.REPORT_PUBLISHED,
          title: "Week 12 delivery report published",
          createdAt: daysFromNow(-1),
        },
      ],
    });

    const freshProject = await prisma.project.findUniqueOrThrow({
      where: { id: project.id },
      include: {
        milestones: true,
        approvals: true,
        invoices: true,
        weeklyReports: { orderBy: { weekEnd: "desc" }, take: 1 },
      },
    });

    const health = calculateProjectHealth({
      milestones: freshProject.milestones,
      approvals: freshProject.approvals,
      invoices: freshProject.invoices,
      latestReport: freshProject.weeklyReports[0],
    });

    await prisma.project.update({
      where: { id: project.id },
      data: {
        healthScore: health.score,
        healthLabel: health.label,
      },
    });
  }

  console.log("Seeded Delivora demo data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
