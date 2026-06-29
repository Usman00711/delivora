import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z
    .string()
    .url("Image must be a valid URL")
    .optional()
    .or(z.literal("")),
});
