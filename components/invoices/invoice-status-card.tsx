import type { Invoice } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListItemBox } from "@/components/ui/list-item-box";
import { formatCurrency, formatDate } from "@/lib/data";
import { InvoiceStatusForm } from "@/components/projects/delivery-forms";

export function InvoiceStatusCard({
  invoices,
  editable = true,
}: {
  invoices: Invoice[];
  editable?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Invoices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {invoices.map((invoice) => (
          <ListItemBox key={invoice.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Due {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                <Badge
                  variant={
                    invoice.status === "OVERDUE"
                      ? "destructive"
                      : invoice.status === "PAID"
                        ? "secondary"
                        : "outline"
                  }
                  className="mt-2"
                >
                  {invoice.status}
                </Badge>
                {editable && (
                  <div className="mt-3">
                    <InvoiceStatusForm invoice={invoice} />
                  </div>
                )}
              </div>
            </div>
          </ListItemBox>
        ))}
      </CardContent>
    </Card>
  );
}
