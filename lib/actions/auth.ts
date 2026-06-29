"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

type RegisterState = {
  error?: string;
};

export async function registerAction(
  _previousState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    agencyName: formData.get("agencyName") || "My Agency",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid registration data." };
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: "An account already exists for this email." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.agency.create({
    data: {
      name: parsed.data.agencyName ?? "My Agency",
      contactEmail: email,
      users: {
        create: {
          name: parsed.data.name,
          email,
          passwordHash,
          role: "AGENCY_OWNER",
        },
      },
    },
  });

  redirect("/login?registered=1");
}
