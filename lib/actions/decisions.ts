"use server";

import { revalidatePath } from "next/cache";
import { requireClientUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activity";
import {
  approvalDecisionSchema,
  scopeDecisionSchema,
} from "@/lib/validations/project";

export async function decideApproval(formData: FormData) {
  const user = await requireClientUser();
  const parsed = approvalDecisionSchema.safeParse({
    approvalId: formData.get("approvalId"),
    status: formData.get("status"),
    decisionNote: formData.get("decisionNote") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid approval decision.");
  }

  const approval = await prisma.approvalRequest.findFirstOrThrow({
    where: {
      id: parsed.data.approvalId,
      project: { clientCompanyId: user.clientCompanyId },
    },
    include: { project: true },
  });

  await prisma.approvalRequest.update({
    where: { id: approval.id },
    data: {
      status: parsed.data.status,
      decisionNote: parsed.data.decisionNote,
      decidedAt: new Date(),
    },
  });

  await createActivityLog({
    agencyId: approval.project.agencyId,
    projectId: approval.projectId,
    actorId: user.id,
    type: "APPROVAL_DECIDED",
    title: `${approval.title} was ${parsed.data.status.toLowerCase().replace("_", " ")}`,
  });

  revalidatePath(`/client/projects/${approval.projectId}/approvals`);
  revalidatePath(`/dashboard/projects/${approval.projectId}/approvals`);
}

export async function decideScopeChange(formData: FormData) {
  const user = await requireClientUser();
  const parsed = scopeDecisionSchema.safeParse({
    scopeChangeId: formData.get("scopeChangeId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error("Invalid scope change decision.");
  }

  const scopeChange = await prisma.scopeChangeRequest.findFirstOrThrow({
    where: {
      id: parsed.data.scopeChangeId,
      project: { clientCompanyId: user.clientCompanyId },
    },
    include: { project: true },
  });

  await prisma.scopeChangeRequest.update({
    where: { id: scopeChange.id },
    data: {
      status: parsed.data.status,
      decidedAt: new Date(),
    },
  });

  await createActivityLog({
    agencyId: scopeChange.project.agencyId,
    projectId: scopeChange.projectId,
    actorId: user.id,
    type: "SCOPE_CHANGE_REQUESTED",
    title: `${scopeChange.title} was ${parsed.data.status.toLowerCase()}`,
  });

  revalidatePath(`/client/projects/${scopeChange.projectId}/scope-changes`);
  revalidatePath(`/dashboard/projects/${scopeChange.projectId}/scope-changes`);
}
