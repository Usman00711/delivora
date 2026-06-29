import { notFound } from "next/navigation";
import { InvoiceStatusCard } from "@/components/invoices/invoice-status-card";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectSubNav } from "@/components/projects/project-sub-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getClientProject } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ClientInvoicesPage({ params }: { params: { projectId: string } }) {
  const user = await requireClientUser();
  const project = await getClientProject(user.clientCompanyId, params.projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectSubNav baseHref={`/client/projects/${project.id}`} />
      {project.invoices.length ? (
        <InvoiceStatusCard invoices={project.invoices} editable={false} />
      ) : (
        <EmptyState
          title="No invoices yet"
          description="The team has not issued invoices for this project."
          actions={
            <Button
              nativeButton={false}
              render={<Link href={`/client/projects/${project.id}`} />}
            >
              Back to project
            </Button>
          }
        />
      )}
    </div>
  );
}
