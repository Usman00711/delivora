import { Badge } from "@/components/ui/badge";
import { ProjectHealthBadge } from "@/components/dashboard/health-score-card";
import { formatCurrency, formatDate } from "@/lib/data";

type ProjectHeaderProps = {
  project: {
    name: string;
    description: string;
    status: string;
    startDate: Date;
    dueDate: Date;
    budget: { toNumber(): number };
    healthScore: number;
    healthLabel: string;
    clientCompany: { name: string };
  };
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{project.status.replace("_", " ")}</Badge>
            <ProjectHealthBadge
              score={project.healthScore}
              label={project.healthLabel}
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>
        </div>
        <div className="grid gap-2 text-sm sm:grid-cols-3 lg:min-w-[460px]">
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Client</p>
            <p className="mt-1 font-medium">{project.clientCompany.name}</p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Timeline</p>
            <p className="mt-1 font-medium">
              {formatDate(project.startDate)} - {formatDate(project.dueDate)}
            </p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="mt-1 font-medium">{formatCurrency(project.budget)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
