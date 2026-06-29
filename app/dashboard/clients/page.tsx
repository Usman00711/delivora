import Link from "next/link";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClients } from "@/lib/data";
import { requireAgencyUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const user = await requireAgencyUser();
  const clients = await getClients(user.agencyId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Clients"
        description="Manage client companies and portal users."
        action={
          <Button nativeButton={false} render={<Link href="/dashboard/clients/new" />}>
            New client
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader className="pb-0">
              <CardTitle className="text-base font-semibold">{client.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{client.contactEmail}</p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-4">
              <Badge variant="secondary">{client.projects.length} projects</Badge>
              <Badge variant="outline">{client.users.length} portal users</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
