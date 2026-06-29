import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { requireAgencyUser } from "@/lib/permissions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await requireAgencyUser();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    include: { agency: true },
  });

  return (
    <DashboardShell
      agencyName={user.agency?.name ?? "Agency Dashboard"}
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
    >
      {children}
    </DashboardShell>
  );
}
