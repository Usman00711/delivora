import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/data";
import { requireClientUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function invoiceStatusColor(status: string) {
  if (status === "PAID") return "secondary";
  if (status === "OVERDUE" || status === "VOID") return "destructive";
  return "outline";
}

export default async function ClientInvoiceDetailPage({
  params,
}: {
  params: { projectId: string; invoiceId: string };
}) {
  const user = await requireClientUser();
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: params.invoiceId,
      project: { clientCompanyId: user.clientCompanyId },
    },
    include: {
      project: { select: { id: true, name: true } },
    },
  });

  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Client Action Center</p>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Invoice detail</h1>
          <Badge variant={invoiceStatusColor(invoice.status) as "outline" | "secondary" | "destructive"}>
            {invoice.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {invoice.project.name} · Due {formatDate(invoice.dueDate)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Invoice summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Invoice number</p>
            <p className="mt-1 font-medium">{invoice.invoiceNumber}</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="mt-1 font-medium">{formatCurrency(invoice.amount)}</p>
          </div>
          <div className="rounded-md border bg-background p-3 sm:col-span-2">
            <p className="text-xs text-muted-foreground">Primary action</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Review amount and follow up if payment status needs update.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        variant={invoice.status === "PAID" ? "secondary" : "outline"}
        disabled
        className="w-fit"
      >
        {invoice.status === "PAID" ? "Payment complete" : "Awaiting payment confirmation"}
      </Button>

      <Button variant="outline" nativeButton={false} render={<Link href={`/client/projects/${invoice.project.id}/invoices`}>
        <ArrowLeft className="size-3.5" />
        Back to invoices
      </Link>} />
      <Button variant="secondary" nativeButton={false} render={<Link href="/client" />}>
        Back to action center
      </Button>
    </div>
  );
}

