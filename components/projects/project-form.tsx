"use client";

import { useFormState } from "react-dom";
import type { ClientCompany, Project } from "@prisma/client";
import { createProjectAction, updateProjectAction } from "@/lib/actions/projects";
import { ActionMessage } from "@/components/forms/action-message";
import { FormField, FormSection } from "@/components/forms/form-field";
import { SubmittingButton } from "@/components/forms/submitting-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type ProjectFormProps = {
  clients: ClientCompany[];
  project?: Project;
};

function dateValue(date?: Date) {
  return date?.toISOString().slice(0, 10) ?? "";
}

export function ProjectForm({ clients, project }: ProjectFormProps) {
  const action = project ? updateProjectAction : createProjectAction;
  const [state, formAction] = useFormState(action, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit project" : "New project"}</CardTitle>
        <CardDescription>
          {project
            ? "Update delivery details, status, timeline, and budget."
            : "Create a delivery-focused client project."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {project && <input type="hidden" name="projectId" value={project.id} />}
          <FormSection>
            <FormField label="Project name" htmlFor="name">
              <Input id="name" name="name" defaultValue={project?.name} required />
            </FormField>
            <FormField label="Description" htmlFor="description">
              <textarea
                id="description"
                name="description"
                defaultValue={project?.description}
                required
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </FormField>
            <FormField label="Client" htmlFor="clientCompanyId">
              <Select
                id="clientCompanyId"
                name="clientCompanyId"
                defaultValue={project?.clientCompanyId}
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
          </FormSection>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Start date" htmlFor="startDate">
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={dateValue(project?.startDate)}
                required
              />
            </FormField>
            <FormField label="Due date" htmlFor="dueDate">
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={dateValue(project?.dueDate)}
                required
              />
            </FormField>
            <FormField label="Budget" htmlFor="budget">
              <Input
                id="budget"
                name="budget"
                type="number"
                min="1"
                step="0.01"
                defaultValue={project?.budget.toString()}
                required
              />
            </FormField>
            <FormField label="Status" htmlFor="status">
              <Select id="status" name="status" defaultValue={project?.status ?? "PLANNING"}>
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="REVIEW">Review</option>
                <option value="HANDOVER">Handover</option>
                <option value="COMPLETED">Completed</option>
                <option value="PAUSED">Paused</option>
              </Select>
            </FormField>
          </div>

          <ActionMessage state={state} />
          <SubmittingButton type="submit" pendingLabel="Saving project...">
            {project ? "Save project" : "Create project"}
          </SubmittingButton>
        </form>
      </CardContent>
    </Card>
  );
}
