"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/profile";

type ProfileState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _previousState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image") || "",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid profile details.",
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      image: parsed.data.image || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/client");
  revalidatePath("/client/profile");

  return { success: "Profile updated." };
}
