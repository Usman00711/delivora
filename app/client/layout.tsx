import { ClientPortalShell } from "@/components/layout/client-portal-shell";
import { prisma } from "@/lib/prisma";
import { requireClientUser } from "@/lib/permissions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal",
};

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await requireClientUser();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    include: { clientCompany: true },
  });

  return (
    <ClientPortalShell
      companyName={user.clientCompany?.name ?? "Client Portal"}
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
    >
      {children}
    </ClientPortalShell>
  );
}
