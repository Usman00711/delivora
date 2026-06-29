import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";
import { SectionHeader } from "@/components/layout/section-header";
import { prisma } from "@/lib/prisma";
import { requireAgencyUser } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Profile",
};

export const dynamic = "force-dynamic";

export default async function AgencyProfilePage() {
  const sessionUser = await requireAgencyUser();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    include: { agency: true },
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Profile"
        description="Manage your account details and profile image."
      />
      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }}
        organizationName={user.agency?.name}
      />
    </div>
  );
}
