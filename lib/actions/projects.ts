"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgencyUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activity";
import { projectSchema, updateProjectSchema } from "@/lib/validations/project";
import { type ActionState, firstError } from "@/lib/actions/action-utils";

export async function createProjectAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    clientCompanyId: formData.get("clientCompanyId"),
    startDate: formData.get("startDate"),
    dueDate: formData.get("dueDate"),
    budget: formData.get("budget"),
    status: formData.get("status") || "PLANNING",
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid project details.") };
  }

  const client = await prisma.clientCompany.findFirst({
    where: { id: parsed.data.clientCompanyId, agencyId: user.agencyId },
  });

  if (!client) {
    return { error: "Choose a client that belongs to your agency." };
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      status: parsed.data.status ?? "PLANNING",
      startDate: new Date(parsed.data.startDate),
      dueDate: new Date(parsed.data.dueDate),
      budget: parsed.data.budget,
      agencyId: user.agencyId,
      clientCompanyId: client.id,
      healthScore: 100,
      healthLabel: "Healthy",
    },
  });

  await createActivityLog({
    agencyId: user.agencyId,
    projectId: project.id,
    actorId: user.id,
    type: "PROJECT_CREATED",
    title: `${project.name} was created`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  redirect(`/dashboard/projects/${project.id}`);
}

export async function updateProjectAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = updateProjectSchema.safeParse({
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    description: formData.get("description"),
    clientCompanyId: formData.get("clientCompanyId"),
    startDate: formData.get("startDate"),
    dueDate: formData.get("dueDate"),
    budget: formData.get("budget"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid project details.") };
  }

  const [project, client] = await Promise.all([
    prisma.project.findFirst({
      where: { id: parsed.data.projectId, agencyId: user.agencyId },
    }),
    prisma.clientCompany.findFirst({
      where: { id: parsed.data.clientCompanyId, agencyId: user.agencyId },
    }),
  ]);

  if (!project || !client) {
    return { error: "Project or client was not found for your agency." };
  }

  await prisma.project.update({
    where: { id: project.id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      status: parsed.data.status ?? project.status,
      startDate: new Date(parsed.data.startDate),
      dueDate: new Date(parsed.data.dueDate),
      budget: parsed.data.budget,
      clientCompanyId: client.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${project.id}`);
  revalidatePath(`/client/projects/${project.id}`);
  redirect(`/dashboard/projects/${project.id}`);
}
