import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  clientCompanyId: z.string().min(1, "Choose a client"),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  budget: z.coerce.number().positive("Budget must be greater than 0"),
  status: z
    .enum(["PLANNING", "ACTIVE", "REVIEW", "HANDOVER", "COMPLETED", "PAUSED"])
    .optional(),
}).refine((data) => new Date(data.dueDate) >= new Date(data.startDate), {
  message: "Due date must be after the start date",
  path: ["dueDate"],
});

export const updateProjectSchema = projectSchema.extend({
  projectId: z.string().min(1),
});

export const milestoneSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2, "Milestone title is required"),
  description: z.string().min(5, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["UPCOMING", "IN_PROGRESS", "COMPLETED", "OVERDUE"]),
});

export const milestoneStatusSchema = z.object({
  milestoneId: z.string().min(1),
  status: z.enum(["UPCOMING", "IN_PROGRESS", "COMPLETED", "OVERDUE"]),
});

export const deliverableSchema = z.object({
  projectId: z.string().min(1),
  milestoneId: z.string().optional(),
  title: z.string().min(2, "Deliverable title is required"),
  description: z.string().min(5, "Description is required"),
  fileUrl: z.string().url("Enter a valid file URL").optional().or(z.literal("")),
  externalUrl: z.string().url("Enter a valid external URL").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "SUBMITTED", "APPROVED", "CHANGES_REQUESTED"]),
});

export const approvalRequestSchema = z.object({
  projectId: z.string().min(1),
  deliverableId: z.string().optional(),
  title: z.string().min(2, "Approval title is required"),
  notes: z.string().min(5, "Notes are required"),
  dueDate: z.string().min(1, "Due date is required"),
});

export const weeklyReportSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2, "Report title is required"),
  weekStart: z.string().min(1, "Week start is required"),
  weekEnd: z.string().min(1, "Week end is required"),
  completedWork: z.string().min(5, "Completed work is required"),
  nextSteps: z.string().min(5, "Next steps are required"),
  blockers: z.string().min(2, "Blockers field is required"),
  clientActions: z.string().min(2, "Client actions field is required"),
  publish: z.coerce.boolean().optional(),
}).refine((data) => new Date(data.weekEnd) >= new Date(data.weekStart), {
  message: "Week end must be after week start",
  path: ["weekEnd"],
});

export const scopeQuoteSchema = z.object({
  scopeChangeId: z.string().min(1),
  estimateAmount: z.coerce.number().positive("Estimate must be greater than 0"),
  estimateDays: z.coerce.number().int().positive("Days must be greater than 0"),
});

export const invoiceSchema = z.object({
  projectId: z.string().min(1),
  invoiceNumber: z.string().min(2, "Invoice number is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "VOID"]),
});

export const invoiceStatusSchema = z.object({
  invoiceId: z.string().min(1),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "VOID"]),
});

export const handoverItemSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2, "Handover title is required"),
  type: z.enum(["REPOSITORY", "CREDENTIAL", "DOCUMENT", "TRAINING", "ASSET", "OTHER"]),
  description: z.string().min(5, "Description is required"),
  url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  isVisibleToClient: z.coerce.boolean().optional(),
});

export const approvalDecisionSchema = z.object({
  approvalId: z.string().min(1),
  status: z.enum(["APPROVED", "CHANGES_REQUESTED", "REJECTED"]),
  decisionNote: z.string().max(1000).optional(),
});

export const scopeDecisionSchema = z.object({
  scopeChangeId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
});
