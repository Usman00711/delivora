import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";

export const agencyRoles: Role[] = ["AGENCY_OWNER", "AGENCY_MEMBER"];

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAgencyUser() {
  const user = await requireUser();

  if (!agencyRoles.includes(user.role) || !user.agencyId) {
    redirect("/client");
  }

  return user as typeof user & { agencyId: string };
}

export async function requireClientUser() {
  const user = await requireUser();

  if (user.role !== "CLIENT" || !user.clientCompanyId) {
    redirect("/dashboard");
  }

  return user as typeof user & { clientCompanyId: string };
}

export function canManageSettings(role: Role) {
  return role === "AGENCY_OWNER";
}

export function canManageBilling(role: Role) {
  return role === "AGENCY_OWNER";
}
