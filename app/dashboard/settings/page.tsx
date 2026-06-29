import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAgencyUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireAgencyUser();
  const agency = await prisma.agency.findUnique({
    where: { id: user.agencyId },
    include: { users: true },
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        description="Agency profile, team members, and account preferences."
      />
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold">{agency?.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{agency?.contactEmail}</p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {agency?.users.map((member) => (
              <div key={member.id} className="rounded-md border bg-background p-3">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{member.email}</p>
                <p className="mt-2 text-xs font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
