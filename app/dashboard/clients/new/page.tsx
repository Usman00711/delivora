import type { Metadata } from "next";
import { ClientForm } from "@/components/clients/client-form";
import { SectionHeader } from "@/components/layout/section-header";
import { requireAgencyUser } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "New Client",
};

export default async function NewClientPage() {
  await requireAgencyUser();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="New Client"
        description="Create a client company and optional portal user."
      />
      <ClientForm />
    </div>
  );
}
