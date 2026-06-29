"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgencyUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createClientSchema } from "@/lib/validations/client";
import { type ActionState, firstError } from "@/lib/actions/action-utils";

const DEMO_CLIENT_PASSWORD = "password123";

export async function createClientAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAgencyUser();
  const parsed = createClientSchema.safeParse({
    name: formData.get("name"),
    contactEmail: formData.get("contactEmail"),
    clientUserName: formData.get("clientUserName") || undefined,
    clientUserEmail: formData.get("clientUserEmail") || undefined,
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error, "Invalid client details.") };
  }

  const clientUserEmail = parsed.data.clientUserEmail?.toLowerCase();

  if (clientUserEmail) {
    const existingUser = await prisma.user.findUnique({
      where: { email: clientUserEmail },
    });

    if (existingUser) {
      return { error: "A user already exists with that client email." };
    }
  }

  await prisma.clientCompany.create({
    data: {
      name: parsed.data.name,
      contactEmail: parsed.data.contactEmail.toLowerCase(),
      agencyId: user.agencyId,
      users:
        clientUserEmail && parsed.data.clientUserName
          ? {
              create: {
                name: parsed.data.clientUserName,
                email: clientUserEmail,
                passwordHash: await bcrypt.hash(DEMO_CLIENT_PASSWORD, 12),
                role: "CLIENT",
              },
            }
          : undefined,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients?created=1");
}
