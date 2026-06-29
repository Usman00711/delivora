import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAgencyUser } from "@/lib/permissions";
import { ProjectCreationWizard } from "@/components/projects/project-creation-wizard";
import { SectionHeader } from "@/components/layout/section-header";

export const metadata: Metadata = {
  title: "New Project",
};

export default async function NewProjectPage() {
  const user = await requireAgencyUser();
  const clients = await prisma.clientCompany.findMany({
    where: { agencyId: user.agencyId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="New Project"
        description="Create a delivery project for an existing client."
      />
      <ProjectCreationWizard clients={clients} />
    </div>
  );
}
