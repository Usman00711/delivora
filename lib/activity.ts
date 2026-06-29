import type { ActivityType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateActivityInput = {
  agencyId: string;
  projectId?: string;
  actorId?: string;
  type: ActivityType;
  title: string;
  metadata?: Prisma.InputJsonValue;
};

export async function createActivityLog(input: CreateActivityInput) {
  return prisma.activityLog.create({
    data: {
      agencyId: input.agencyId,
      projectId: input.projectId,
      actorId: input.actorId,
      type: input.type,
      title: input.title,
      metadata: input.metadata,
    },
  });
}
