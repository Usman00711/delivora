"use client";

import { useFormState } from "react-dom";
import { ActionMessage } from "@/components/forms/action-message";
import { decideApproval } from "@/lib/actions/decisions";
import { Input } from "@/components/ui/input";
import { SubmittingButton } from "@/components/forms/submitting-button";

export function ApprovalDecisionForm({ approvalId }: { approvalId: string }) {
  const [state, action] = useFormState(decideApproval, {});

  return (
    <form action={action} className="space-y-3 rounded-md border bg-muted/30 p-3">
      <input type="hidden" name="approvalId" value={approvalId} />
      <Input
        name="decisionNote"
        placeholder="Optional decision note"
        aria-label="Decision note"
      />
      <div className="flex flex-wrap gap-2">
        <SubmittingButton
          type="submit"
          name="status"
          value="APPROVED"
          size="sm"
          pendingLabel="Approving..."
        >
          Approve
        </SubmittingButton>
        <SubmittingButton
          type="submit"
          name="status"
          value="CHANGES_REQUESTED"
          variant="outline"
          size="sm"
          pendingLabel="Requesting changes..."
        >
          Request changes
        </SubmittingButton>
        <SubmittingButton
          type="submit"
          name="status"
          value="REJECTED"
          variant="destructive"
          size="sm"
          pendingLabel="Rejecting..."
        >
          Reject
        </SubmittingButton>
      </div>
      <ActionMessage state={state} />
    </form>
  );
}
