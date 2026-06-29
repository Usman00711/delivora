import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/projects/project-form";
import { SectionHeader } from "@/components/layout/section-header";
import { prisma } from "@/lib/prisma";
import { requireAgencyUser } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Edit Project",
};

export default async function EditProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const user = await requireAgencyUser();
  const [project, clients] = await Promise.all([
    prisma.project.findFirst({
      where: { id: params.projectId, agencyId: user.agencyId },
    }),
    prisma.clientCompany.findMany({
      where: { agencyId: user.agencyId },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Edit Project"
        description="Update project details, status, client, timeline, and budget."
      />
      <ProjectForm clients={clients} project={project} />
    </div>
  );
}
