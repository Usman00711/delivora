import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { SectionHeader } from "@/components/layout/section-header";
import { prisma } from "@/lib/prisma";
import { requireAgencyUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const user = await requireAgencyUser();
  const activity = await prisma.activityLog.findMany({
    where: { agencyId: user.agencyId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Activity Feed"
        description="Global timeline of approvals, milestones, reports, and project events."
      />
      <ActivityTimeline items={activity} />
    </div>
  );
}
