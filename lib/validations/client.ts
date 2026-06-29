import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(2, "Client company name is required"),
  contactEmail: z.string().email("Enter a valid company email"),
  clientUserName: z.string().optional(),
  clientUserEmail: z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? "")
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Enter a valid client user email",
    }),
});
