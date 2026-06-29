"use client";

import { useFormState } from "react-dom";
import { createClientAction } from "@/lib/actions/clients";
import { ActionMessage } from "@/components/forms/action-message";
import { FormField, FormSection } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ClientForm() {
  const [state, formAction] = useFormState(createClientAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>New client</CardTitle>
        <CardDescription>
          Create a client company and optionally add a portal user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <FormSection>
            <FormField label="Company name" htmlFor="name">
              <Input id="name" name="name" placeholder="Orbit CRM Solutions" required />
            </FormField>
            <FormField label="Company email" htmlFor="contactEmail">
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="hello@client.com"
                required
              />
            </FormField>
          </FormSection>

          <FormSection>
            <div>
              <p className="text-sm font-medium">Client portal user</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Optional. Demo password will be password123.
              </p>
            </div>
            <FormField label="User name" htmlFor="clientUserName">
              <Input id="clientUserName" name="clientUserName" placeholder="Sarah Chen" />
            </FormField>
            <FormField label="User email" htmlFor="clientUserEmail">
              <Input
                id="clientUserEmail"
                name="clientUserEmail"
                type="email"
                placeholder="sarah@client.com"
              />
            </FormField>
          </FormSection>

          <ActionMessage state={state} />
          <Button type="submit">Create client</Button>
        </form>
      </CardContent>
    </Card>
  );
}
