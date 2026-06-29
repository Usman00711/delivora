import type { ScopeChangeRequest, User } from "@prisma/client";
import { decideScopeChange } from "@/lib/actions/decisions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/data";

type ScopeChangeWithRequester = ScopeChangeRequest & {
  requestedBy: User;
};

export function ScopeChangeCard({
  scopeChange,
  showDecisionForm = false,
}: {
  scopeChange: ScopeChangeWithRequester;
  showDecisionForm?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold">{scopeChange.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Requested by {scopeChange.requestedBy.name}
            </p>
          </div>
          <Badge variant="outline">{scopeChange.status.replace("_", " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {scopeChange.description}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Estimated cost</p>
            <p className="mt-1 font-medium">
              {scopeChange.estimateAmount
                ? formatCurrency(scopeChange.estimateAmount)
                : "To be quoted"}
            </p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Estimated timeline</p>
            <p className="mt-1 font-medium">
              {scopeChange.estimateDays
                ? `${scopeChange.estimateDays} days`
                : "To be quoted"}
            </p>
          </div>
        </div>
        {showDecisionForm && scopeChange.status === "QUOTED" && (
          <form action={decideScopeChange} className="mt-4 flex flex-wrap gap-2">
            <input type="hidden" name="scopeChangeId" value={scopeChange.id} />
            <Button type="submit" name="status" value="APPROVED" size="sm">
              Approve quote
            </Button>
            <Button
              type="submit"
              name="status"
              value="REJECTED"
              variant="outline"
              size="sm"
            >
              Decline
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
