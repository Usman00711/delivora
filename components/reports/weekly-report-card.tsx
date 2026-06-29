import type { WeeklyReport } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/data";

export function WeeklyReportCard({ report }: { report: WeeklyReport }) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">{report.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 pt-4 md:grid-cols-2">
        <ReportSection title="Completed work" body={report.completedWork} />
        <ReportSection title="Next steps" body={report.nextSteps} />
        <ReportSection title="Blockers" body={report.blockers} />
        <ReportSection title="Client actions" body={report.clientActions} />
      </CardContent>
    </Card>
  );
}

function ReportSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
