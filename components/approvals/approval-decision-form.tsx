import { decideApproval } from "@/lib/actions/decisions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ApprovalDecisionForm({ approvalId }: { approvalId: string }) {
  return (
    <form action={decideApproval} className="space-y-3 rounded-md border bg-muted/30 p-3">
      <input type="hidden" name="approvalId" value={approvalId} />
      <Input
        name="decisionNote"
        placeholder="Optional decision note"
        aria-label="Decision note"
      />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" name="status" value="APPROVED" size="sm">
          Approve
        </Button>
        <Button
          type="submit"
          name="status"
          value="CHANGES_REQUESTED"
          variant="outline"
          size="sm"
        >
          Request changes
        </Button>
        <Button
          type="submit"
          name="status"
          value="REJECTED"
          variant="destructive"
          size="sm"
        >
          Reject
        </Button>
      </div>
    </form>
  );
}
