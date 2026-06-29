"use server";

import { revalidatePath } from "next/cache";
import { requireAgencyUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activity";
import {
  approvalRequestSchema,
  deliverableSchema,
  handoverItemSchema,
  invoiceSchema,
  invoiceStatusSchema,
  milestoneSchema,
  milestoneStatusSchema,
  scopeQuoteSchema,
  weeklyReportSchema,
} from "@/lib/validations/project";
import {
  type ActionState,
  firstError,
  getAgencyProjectForAction,
  updateProjectHealth,
} from "@/lib/actions/action-utils";

function revalidateProjectPaths(projectId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/client/projects/${projectId}`);
  revalidatePath("/client");
}

export async function createMilestoneAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = milestoneSchema.safeParse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    status: formData.get("status") || "UPCOMING",
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid milestone details.") };
  }

  const project = await getAgencyProjectForAction(user.agencyId, parsed.data.projectId);

  await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: new Date(parsed.data.dueDate),
      status: parsed.data.status,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
    },
  });

  await createActivityLog({
    agencyId: user.agencyId,
    projectId: project.id,
    actorId: user.id,
    type: "MILESTONE_UPDATED",
    title: `${parsed.data.title} milestone was added`,
  });

  await updateProjectHealth(project.id);
  revalidateProjectPaths(project.id);
  revalidatePath(`/dashboard/projects/${project.id}/milestones`);

  return { success: "Milestone added." };
}

export async function updateMilestoneStatusAction(formData: FormData) {
  const user = await requireAgencyUser();
  const parsed = milestoneStatusSchema.safeParse({
    milestoneId: formData.get("milestoneId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error(firstError(parsed.error, "Invalid milestone status."));
  }

  const milestone = await prisma.milestone.findFirstOrThrow({
    where: { id: parsed.data.milestoneId, project: { agencyId: user.agencyId } },
    include: { project: true },
  });

  await prisma.milestone.update({
    where: { id: milestone.id },
    data: {
      status: parsed.data.status,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
    },
  });

  await createActivityLog({
    agencyId: user.agencyId,
    projectId: milestone.projectId,
    actorId: user.id,
    type: "MILESTONE_UPDATED",
    title: `${milestone.title} marked ${parsed.data.status.toLowerCase().replace("_", " ")}`,
  });

  await updateProjectHealth(milestone.projectId);
  revalidateProjectPaths(milestone.projectId);
  revalidatePath(`/dashboard/projects/${milestone.projectId}/milestones`);
}

export async function createDeliverableAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = deliverableSchema.safeParse({
    projectId: formData.get("projectId"),
    milestoneId: formData.get("milestoneId") || undefined,
    title: formData.get("title"),
    description: formData.get("description"),
    fileUrl: formData.get("fileUrl") || "",
    externalUrl: formData.get("externalUrl") || "",
    status: formData.get("status") || "SUBMITTED",
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid deliverable details.") };
  }

  const project = await getAgencyProjectForAction(user.agencyId, parsed.data.projectId);

  if (parsed.data.milestoneId) {
    const milestone = await prisma.milestone.findFirst({
      where: { id: parsed.data.milestoneId, projectId: project.id },
    });

    if (!milestone) return { error: "Milestone does not belong to this project." };
  }

  await prisma.deliverable.create({
    data: {
      projectId: project.id,
      milestoneId: parsed.data.milestoneId || null,
      title: parsed.data.title,
      description: parsed.data.description,
      fileUrl: parsed.data.fileUrl || null,
      externalUrl: parsed.data.externalUrl || null,
      status: parsed.data.status,
      submittedAt: parsed.data.status === "DRAFT" ? null : new Date(),
    },
  });

  await createActivityLog({
    agencyId: user.agencyId,
    projectId: project.id,
    actorId: user.id,
    type: "DELIVERABLE_UPLOADED",
    title: `${parsed.data.title} deliverable was added`,
  });

  revalidateProjectPaths(project.id);
  revalidatePath(`/dashboard/projects/${project.id}/deliverables`);

  return { success: "Deliverable added." };
}

export async function createApprovalRequestAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = approvalRequestSchema.safeParse({
    projectId: formData.get("projectId"),
    deliverableId: formData.get("deliverableId") || undefined,
    title: formData.get("title"),
    notes: formData.get("notes"),
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid approval request.") };
  }

  const project = await getAgencyProjectForAction(user.agencyId, parsed.data.projectId);

  await prisma.approvalRequest.create({
    data: {
      projectId: project.id,
      deliverableId: parsed.data.deliverableId || null,
      title: parsed.data.title,
      notes: parsed.data.notes,
      dueDate: new Date(parsed.data.dueDate),
      status: "PENDING",
    },
  });

  await createActivityLog({
    agencyId: user.agencyId,
    projectId: project.id,
    actorId: user.id,
    type: "APPROVAL_REQUESTED",
    title: `${parsed.data.title} approval was requested`,
  });

  await updateProjectHealth(project.id);
  revalidateProjectPaths(project.id);
  revalidatePath(`/dashboard/projects/${project.id}/approvals`);
  revalidatePath(`/client/projects/${project.id}/approvals`);

  return { success: "Approval requested." };
}

export async function createWeeklyReportAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = weeklyReportSchema.safeParse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    weekStart: formData.get("weekStart"),
    weekEnd: formData.get("weekEnd"),
    completedWork: formData.get("completedWork"),
    nextSteps: formData.get("nextSteps"),
    blockers: formData.get("blockers"),
    clientActions: formData.get("clientActions"),
    publish: formData.get("publish") === "on",
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid weekly report.") };
  }

  const project = await getAgencyProjectForAction(user.agencyId, parsed.data.projectId);

  await prisma.weeklyReport.create({
    data: {
      projectId: project.id,
      title: parsed.data.title,
      weekStart: new Date(parsed.data.weekStart),
      weekEnd: new Date(parsed.data.weekEnd),
      completedWork: parsed.data.completedWork,
      nextSteps: parsed.data.nextSteps,
      blockers: parsed.data.blockers,
      clientActions: parsed.data.clientActions,
      publishedAt: parsed.data.publish ? new Date() : null,
    },
  });

  if (parsed.data.publish) {
    await createActivityLog({
      agencyId: user.agencyId,
      projectId: project.id,
      actorId: user.id,
      type: "REPORT_PUBLISHED",
      title: `${parsed.data.title} was published`,
    });
  }

  await updateProjectHealth(project.id);
  revalidateProjectPaths(project.id);
  revalidatePath(`/dashboard/projects/${project.id}/reports`);
  revalidatePath(`/client/projects/${project.id}/reports`);

  return { success: parsed.data.publish ? "Report published." : "Report draft created." };
}

export async function quoteScopeChangeAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = scopeQuoteSchema.safeParse({
    scopeChangeId: formData.get("scopeChangeId"),
    estimateAmount: formData.get("estimateAmount"),
    estimateDays: formData.get("estimateDays"),
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid scope quote.") };
  }

  const scopeChange = await prisma.scopeChangeRequest.findFirstOrThrow({
    where: { id: parsed.data.scopeChangeId, project: { agencyId: user.agencyId } },
    include: { project: true },
  });

  await prisma.scopeChangeRequest.update({
    where: { id: scopeChange.id },
    data: {
      estimateAmount: parsed.data.estimateAmount,
      estimateDays: parsed.data.estimateDays,
      status: "QUOTED",
    },
  });

  await createActivityLog({
    agencyId: user.agencyId,
    projectId: scopeChange.projectId,
    actorId: user.id,
    type: "SCOPE_CHANGE_REQUESTED",
    title: `${scopeChange.title} was quoted`,
  });

  revalidateProjectPaths(scopeChange.projectId);
  revalidatePath(`/dashboard/projects/${scopeChange.projectId}/scope-changes`);
  revalidatePath(`/client/projects/${scopeChange.projectId}/scope-changes`);

  return { success: "Scope change quoted." };
}

export async function createInvoiceAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = invoiceSchema.safeParse({
    projectId: formData.get("projectId"),
    invoiceNumber: formData.get("invoiceNumber"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
    status: formData.get("status") || "DRAFT",
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid invoice.") };
  }

  const project = await getAgencyProjectForAction(user.agencyId, parsed.data.projectId);

  await prisma.invoice.create({
    data: {
      projectId: project.id,
      invoiceNumber: parsed.data.invoiceNumber,
      amount: parsed.data.amount,
      dueDate: new Date(parsed.data.dueDate),
      status: parsed.data.status,
      paidAt: parsed.data.status === "PAID" ? new Date() : null,
    },
  });

  if (parsed.data.status === "SENT") {
    await createActivityLog({
      agencyId: user.agencyId,
      projectId: project.id,
      actorId: user.id,
      type: "INVOICE_SENT",
      title: `${parsed.data.invoiceNumber} was sent`,
    });
  }

  await updateProjectHealth(project.id);
  revalidateProjectPaths(project.id);
  revalidatePath(`/dashboard/projects/${project.id}/invoices`);
  revalidatePath(`/client/projects/${project.id}/invoices`);

  return { success: "Invoice added." };
}

export async function updateInvoiceStatusAction(formData: FormData) {
  const user = await requireAgencyUser();
  const parsed = invoiceStatusSchema.safeParse({
    invoiceId: formData.get("invoiceId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error(firstError(parsed.error, "Invalid invoice status."));
  }

  const invoice = await prisma.invoice.findFirstOrThrow({
    where: { id: parsed.data.invoiceId, project: { agencyId: user.agencyId } },
    include: { project: true },
  });

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: parsed.data.status,
      paidAt: parsed.data.status === "PAID" ? new Date() : null,
    },
  });

  if (parsed.data.status === "SENT") {
    await createActivityLog({
      agencyId: user.agencyId,
      projectId: invoice.projectId,
      actorId: user.id,
      type: "INVOICE_SENT",
      title: `${invoice.invoiceNumber} was sent`,
    });
  }

  await updateProjectHealth(invoice.projectId);
  revalidateProjectPaths(invoice.projectId);
  revalidatePath(`/dashboard/projects/${invoice.projectId}/invoices`);
}

export async function createHandoverItemAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = handoverItemSchema.safeParse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    type: formData.get("type") || "OTHER",
    description: formData.get("description"),
    url: formData.get("url") || "",
    isVisibleToClient: formData.get("isVisibleToClient") === "on",
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid handover item.") };
  }

  const project = await getAgencyProjectForAction(user.agencyId, parsed.data.projectId);

  await prisma.handoverItem.create({
    data: {
      projectId: project.id,
      title: parsed.data.title,
      type: parsed.data.type,
      description: parsed.data.description,
      url: parsed.data.url || null,
      isVisibleToClient: Boolean(parsed.data.isVisibleToClient),
    },
  });

  await createActivityLog({
    agencyId: user.agencyId,
    projectId: project.id,
    actorId: user.id,
    type: "HANDOVER_ITEM_ADDED",
    title: `${parsed.data.title} was added to handover`,
  });

  revalidateProjectPaths(project.id);
  revalidatePath(`/dashboard/projects/${project.id}/handover`);
  revalidatePath(`/client/projects/${project.id}/handover`);

  return { success: "Handover item added." };
}
