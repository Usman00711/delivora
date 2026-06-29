"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ClientCompany } from "@prisma/client";
import { createProjectAction } from "@/lib/actions/projects";
import { ActionMessage } from "@/components/forms/action-message";
import { FormField } from "@/components/forms/form-field";
import { SubmittingButton } from "@/components/forms/submitting-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CheckCircle2, Clock3, CreditCard, FileText } from "lucide-react";

type ProjectDraftState = {
  name: string;
  description: string;
  clientCompanyId: string;
  startDate: string;
  dueDate: string;
  budget: string;
  status: "PLANNING" | "ACTIVE" | "REVIEW" | "HANDOVER" | "COMPLETED" | "PAUSED";
};

const stepLabels = [
  { id: 1, title: "Basic info", icon: FileText },
  { id: 2, title: "Timing & budget", icon: Clock3 },
  { id: 3, title: "Review", icon: CheckCircle2 },
];

const storageKey = "project-creation-wizard";

function readDraft(): ProjectDraftState {
  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    return {
      name: "",
      description: "",
      clientCompanyId: "",
      startDate: "",
      dueDate: "",
      budget: "",
      status: "PLANNING",
    };
  }

  try {
    const data = JSON.parse(saved);
    return {
      name: data.name ?? "",
      description: data.description ?? "",
      clientCompanyId: data.clientCompanyId ?? "",
      startDate: data.startDate ?? "",
      dueDate: data.dueDate ?? "",
      budget: data.budget ?? "",
      status: data.status ?? "PLANNING",
    };
  } catch {
    return {
      name: "",
      description: "",
      clientCompanyId: "",
      startDate: "",
      dueDate: "",
      budget: "",
      status: "PLANNING",
    };
  }
}

function clampStep(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 3) return 1;
  return Math.trunc(parsed);
}

type ProjectCreationWizardProps = {
  clients: ClientCompany[];
};

export function ProjectCreationWizard({ clients }: ProjectCreationWizardProps) {
  const [state, action] = useFormState(createProjectAction, {});
  const [draft, setDraft] = useState<ProjectDraftState>({
    name: "",
    description: "",
    clientCompanyId: "",
    startDate: "",
    dueDate: "",
    budget: "",
    status: "PLANNING",
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState<number>(clampStep(searchParams.get("step")));

  useEffect(() => {
    const nextStep = clampStep(searchParams.get("step"));
    setStep((current) => (current !== nextStep ? nextStep : current));
  }, [searchParams]);

  useEffect(() => {
    setDraft(readDraft());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft]);

  const setField = (key: keyof ProjectDraftState, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const changeStep = (nextStep: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("step", String(nextStep));
    router.replace(`${pathname}?${next.toString()}`);
    setStep(nextStep);
  };

  const canContinueToStep2 = draft.name.trim().length >= 2 && draft.description.length >= 10;
  const canContinueToStep3 =
    canContinueToStep2 &&
    draft.clientCompanyId &&
    draft.startDate &&
    draft.dueDate &&
    draft.budget &&
    Number(draft.budget) > 0 &&
    new Date(draft.dueDate) >= new Date(draft.startDate);

  const resetDraft = () => {
    window.localStorage.removeItem(storageKey);
    router.replace("/dashboard/projects/new");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {stepLabels.map((item) => {
          const Icon = item.icon;
          const isActive = item.id <= step;
          return (
            <Card
              key={item.id}
              className={isActive ? "border-primary/60" : "border-muted-foreground/20"}
            >
              <CardContent className="flex items-center gap-3 py-4">
                <div
                  className={
                    isActive
                      ? "rounded-md bg-primary/15 p-2 text-primary"
                      : "rounded-md bg-muted p-2 text-muted-foreground"
                  }
                >
                  <Icon className="size-4" />
                </div>
                <p className="text-sm font-medium">{item.title}</p>
                {isActive && <span className="text-xs text-muted-foreground">active</span>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Project</CardTitle>
          <CardDescription>
            Keep your progress and return anytime. This wizard creates one delivery project.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-6">
            <input type="hidden" name="name" value={draft.name} />
            <input type="hidden" name="description" value={draft.description} />
            <input type="hidden" name="clientCompanyId" value={draft.clientCompanyId} />
            <input type="hidden" name="startDate" value={draft.startDate} />
            <input type="hidden" name="dueDate" value={draft.dueDate} />
            <input type="hidden" name="budget" value={draft.budget} />
            <input type="hidden" name="status" value={draft.status} />

            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Project name" htmlFor="wizard-name">
                  <Input
                    id="wizard-name"
                    name="name"
                    value={draft.name}
                    onChange={(event) => setField("name", event.target.value)}
                    required
                  />
                </FormField>
                <FormField label="Client" htmlFor="wizard-client">
                  <Select
                    id="wizard-client"
                    name="clientCompanyId"
                    value={draft.clientCompanyId}
                    onChange={(event) => setField("clientCompanyId", event.target.value)}
                    required
                  >
                    <option value="">Choose client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Description" htmlFor="wizard-description">
                    <textarea
                      id="wizard-description"
                      name="description"
                      value={draft.description}
                      onChange={(event) => setField("description", event.target.value)}
                      required
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Start date" htmlFor="wizard-start-date">
                  <Input
                    id="wizard-start-date"
                    name="startDate"
                    type="date"
                    value={draft.startDate}
                    onChange={(event) => setField("startDate", event.target.value)}
                    required
                  />
                </FormField>
                <FormField label="Due date" htmlFor="wizard-due-date">
                  <Input
                    id="wizard-due-date"
                    name="dueDate"
                    type="date"
                    value={draft.dueDate}
                    onChange={(event) => setField("dueDate", event.target.value)}
                    required
                  />
                </FormField>
                <FormField label="Budget (USD)" htmlFor="wizard-budget">
                  <Input
                    id="wizard-budget"
                    name="budget"
                    type="number"
                    min="1"
                    step="0.01"
                    value={draft.budget}
                    onChange={(event) => setField("budget", event.target.value)}
                    required
                  />
                </FormField>
                <FormField label="Status" htmlFor="wizard-status">
                  <Select
                    id="wizard-status"
                    name="status"
                    value={draft.status}
                    onChange={(event) =>
                      setField("status", event.target.value as ProjectDraftState["status"])
                    }
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="ACTIVE">Active</option>
                    <option value="REVIEW">Review</option>
                    <option value="HANDOVER">Handover</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PAUSED">Paused</option>
                  </Select>
                </FormField>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-3 rounded-md border bg-muted/40 p-3 sm:grid-cols-2">
                  <div className="rounded bg-background p-3">
                    <p className="text-xs text-muted-foreground">Project</p>
                    <p className="mt-1 font-medium">{draft.name || "Unnamed project"}</p>
                  </div>
                  <div className="rounded bg-background p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="mt-1 font-medium">{draft.status}</p>
                  </div>
                  <div className="rounded bg-background p-3">
                    <p className="text-xs text-muted-foreground">Timeline</p>
                    <p className="mt-1 font-medium">
                      {draft.startDate || "N/A"} → {draft.dueDate || "N/A"}
                    </p>
                  </div>
                  <div className="rounded bg-background p-3">
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="mt-1 font-medium">
                      {draft.budget ? `$${draft.budget}` : "N/A"}
                    </p>
                  </div>
                  <div className="rounded bg-background p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Client</p>
                    <p className="mt-1 font-medium">
                      {clients.find((client) => client.id === draft.clientCompanyId)?.name ?? "N/A"}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CreditCard className="size-4" />
                    This action will create the project and open it immediately.
                  </span>
                </p>

                <ActionMessage state={state} />
                <SubmittingButton type="submit" pendingLabel="Creating project...">
                  Create project
                </SubmittingButton>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => changeStep(step - 1)}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={resetDraft}>
            Reset
          </Button>
        </div>

        <div className="flex gap-2">
          {step === 1 && (
            <Button disabled={!canContinueToStep2} onClick={() => changeStep(2)}>
              Continue
            </Button>
          )}
          {step === 2 && (
            <>
              <Button disabled={!canContinueToStep3} onClick={() => changeStep(3)}>
                Review
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/projects/new">Cancel</Link>
              </Button>
            </>
          )}
          {step === 3 && (
            <Button asChild variant="outline">
              <Link href="/dashboard/projects">Open project list</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
