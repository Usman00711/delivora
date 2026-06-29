"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import type {
  Deliverable,
  HandoverItemType,
  Invoice,
  Milestone,
  ScopeChangeRequest,
  User,
} from "@prisma/client";
import {
  createApprovalRequestAction,
  createDeliverableAction,
  createHandoverItemAction,
  createInvoiceAction,
  createMilestoneAction,
  createWeeklyReportAction,
  quoteScopeChangeAction,
  updateInvoiceStatusAction,
  updateMilestoneStatusAction,
} from "@/lib/actions/delivery";
import { ActionMessage } from "@/components/forms/action-message";
import { CloudinaryUploadField } from "@/components/forms/cloudinary-upload-field";
import { FormField, FormSection } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function MilestoneCreateForm({ projectId }: { projectId: string }) {
  const [state, action] = useFormState(createMilestoneAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add milestone</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <FormField label="Title" htmlFor="milestoneTitle">
            <Input id="milestoneTitle" name="title" required />
          </FormField>
          <FormField label="Description" htmlFor="milestoneDescription">
            <Input id="milestoneDescription" name="description" required />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Due date" htmlFor="milestoneDueDate">
              <Input id="milestoneDueDate" name="dueDate" type="date" required />
            </FormField>
            <FormField label="Status" htmlFor="milestoneStatus">
              <Select id="milestoneStatus" name="status" defaultValue="UPCOMING">
                <option value="UPCOMING">Upcoming</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="OVERDUE">Overdue</option>
              </Select>
            </FormField>
          </div>
          <ActionMessage state={state} />
          <Button type="submit">Add milestone</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function MilestoneStatusForm({ milestone }: { milestone: Milestone }) {
  return (
    <form action={updateMilestoneStatusAction} className="flex gap-2">
      <input type="hidden" name="milestoneId" value={milestone.id} />
      <Select name="status" defaultValue={milestone.status} className="h-8 text-xs">
        <option value="UPCOMING">Upcoming</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="OVERDUE">Overdue</option>
      </Select>
      <Button size="sm" variant="outline" type="submit">
        Update
      </Button>
    </form>
  );
}

export function DeliverableCreateForm({
  projectId,
  milestones,
}: {
  projectId: string;
  milestones: Milestone[];
}) {
  const [state, action] = useFormState(createDeliverableAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add deliverable</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <FormSection>
            <FormField label="Title" htmlFor="deliverableTitle">
              <Input id="deliverableTitle" name="title" required />
            </FormField>
            <FormField label="Description" htmlFor="deliverableDescription">
              <Input id="deliverableDescription" name="description" required />
            </FormField>
            <FormField label="Milestone" htmlFor="deliverableMilestone">
              <Select id="deliverableMilestone" name="milestoneId">
                <option value="">No milestone</option>
                {milestones.map((milestone) => (
                  <option key={milestone.id} value={milestone.id}>
                    {milestone.title}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="File URL" htmlFor="fileUrl">
              <Input id="fileUrl" name="fileUrl" type="url" placeholder="https://..." />
            </FormField>
            <FormField label="External URL" htmlFor="externalUrl">
              <Input id="externalUrl" name="externalUrl" type="url" placeholder="https://..." />
            </FormField>
            <FormField label="Status" htmlFor="deliverableStatus">
              <Select id="deliverableStatus" name="status" defaultValue="SUBMITTED">
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="CHANGES_REQUESTED">Changes requested</option>
              </Select>
            </FormField>
          </FormSection>
          <ActionMessage state={state} />
          <Button type="submit">Add deliverable</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ApprovalRequestCreateForm({
  projectId,
  deliverables,
}: {
  projectId: string;
  deliverables: Deliverable[];
}) {
  const [state, action] = useFormState(createApprovalRequestAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Request approval</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <FormField label="Title" htmlFor="approvalTitle">
            <Input id="approvalTitle" name="title" required />
          </FormField>
          <FormField label="Deliverable" htmlFor="approvalDeliverable">
            <Select id="approvalDeliverable" name="deliverableId">
              <option value="">General approval</option>
              {deliverables.map((deliverable) => (
                <option key={deliverable.id} value={deliverable.id}>
                  {deliverable.title}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Notes" htmlFor="approvalNotes">
            <Input id="approvalNotes" name="notes" required />
          </FormField>
          <FormField label="Due date" htmlFor="approvalDueDate">
            <Input id="approvalDueDate" name="dueDate" type="date" required />
          </FormField>
          <ActionMessage state={state} />
          <Button type="submit">Request approval</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function WeeklyReportCreateForm({ projectId }: { projectId: string }) {
  const [state, action] = useFormState(createWeeklyReportAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create weekly report</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <FormField label="Title" htmlFor="reportTitle">
            <Input id="reportTitle" name="title" required />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Week start" htmlFor="weekStart">
              <Input id="weekStart" name="weekStart" type="date" required />
            </FormField>
            <FormField label="Week end" htmlFor="weekEnd">
              <Input id="weekEnd" name="weekEnd" type="date" required />
            </FormField>
          </div>
          <FormField label="Completed work" htmlFor="completedWork">
            <Input id="completedWork" name="completedWork" required />
          </FormField>
          <FormField label="Next steps" htmlFor="nextSteps">
            <Input id="nextSteps" name="nextSteps" required />
          </FormField>
          <FormField label="Blockers" htmlFor="blockers">
            <Input id="blockers" name="blockers" defaultValue="None" required />
          </FormField>
          <FormField label="Client actions" htmlFor="clientActions">
            <Input id="clientActions" name="clientActions" defaultValue="None" required />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="publish" className="size-4" defaultChecked />
            Publish to client portal
          </label>
          <ActionMessage state={state} />
          <Button type="submit">Create report</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ScopeQuoteForm({
  scopeChange,
}: {
  scopeChange: ScopeChangeRequest & { requestedBy: User };
}) {
  const [state, action] = useFormState(quoteScopeChangeAction, {});

  if (!["REQUESTED", "QUOTED"].includes(scopeChange.status)) return null;

  return (
    <form action={action} className="mt-4 grid gap-3 rounded-md border bg-muted/30 p-3 sm:grid-cols-[1fr_1fr_auto]">
      <input type="hidden" name="scopeChangeId" value={scopeChange.id} />
      <Input
        name="estimateAmount"
        type="number"
        min="1"
        step="0.01"
        placeholder="Estimate amount"
        defaultValue={scopeChange.estimateAmount?.toString()}
        required
      />
      <Input
        name="estimateDays"
        type="number"
        min="1"
        placeholder="Days"
        defaultValue={scopeChange.estimateDays ?? undefined}
        required
      />
      <Button type="submit" size="sm">
        Quote
      </Button>
      <div className="sm:col-span-3">
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

export function InvoiceCreateForm({ projectId }: { projectId: string }) {
  const [state, action] = useFormState(createInvoiceAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create invoice</CardTitle>
        <CardDescription>Simulated invoice only, no payment processor.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Invoice number" htmlFor="invoiceNumber">
              <Input id="invoiceNumber" name="invoiceNumber" required />
            </FormField>
            <FormField label="Amount" htmlFor="invoiceAmount">
              <Input id="invoiceAmount" name="amount" type="number" min="1" step="0.01" required />
            </FormField>
            <FormField label="Due date" htmlFor="invoiceDueDate">
              <Input id="invoiceDueDate" name="dueDate" type="date" required />
            </FormField>
            <FormField label="Status" htmlFor="invoiceStatus">
              <Select id="invoiceStatus" name="status" defaultValue="DRAFT">
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="VOID">Void</option>
              </Select>
            </FormField>
          </div>
          <ActionMessage state={state} />
          <Button type="submit">Create invoice</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function InvoiceStatusForm({ invoice }: { invoice: Invoice }) {
  return (
    <form action={updateInvoiceStatusAction} className="flex gap-2">
      <input type="hidden" name="invoiceId" value={invoice.id} />
      <Select name="status" defaultValue={invoice.status} className="h-8 text-xs">
        <option value="DRAFT">Draft</option>
        <option value="SENT">Sent</option>
        <option value="PAID">Paid</option>
        <option value="OVERDUE">Overdue</option>
        <option value="VOID">Void</option>
      </Select>
      <Button size="sm" variant="outline" type="submit">
        Update
      </Button>
    </form>
  );
}

export function HandoverItemCreateForm({ projectId }: { projectId: string }) {
  const [state, action] = useFormState(createHandoverItemAction, {});
  const [fileUrl, setFileUrl] = useState("");
  const types: HandoverItemType[] = [
    "REPOSITORY",
    "CREDENTIAL",
    "DOCUMENT",
    "TRAINING",
    "ASSET",
    "OTHER",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add handover item</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <FormField label="Title" htmlFor="handoverTitle">
            <Input id="handoverTitle" name="title" required />
          </FormField>
          <FormField label="Type" htmlFor="handoverType">
            <Select id="handoverType" name="type" defaultValue="DOCUMENT">
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Description" htmlFor="handoverDescription">
            <Input id="handoverDescription" name="description" required />
          </FormField>
          <FormField
            label="File or URL"
            htmlFor="handoverFile"
            hint="Upload a file to Cloudinary or paste an existing URL."
          >
            <CloudinaryUploadField
              id="handoverFile"
              name="url"
              value={fileUrl}
              onChange={setFileUrl}
              folder="clouddesk/handover"
              resourceType="auto"
              maxSizeMb={10}
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isVisibleToClient" className="size-4" defaultChecked />
            Visible to client
          </label>
          <ActionMessage state={state} />
          <Button type="submit">Add handover item</Button>
        </form>
      </CardContent>
    </Card>
  );
}
