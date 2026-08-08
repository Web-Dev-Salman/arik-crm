import { z } from "zod";

export const createCaseSchema = z.object({
  contactId: z.string().min(1, "Select a contact"),
  programCode: z.string().min(1, "Select a program"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  targetDate: z.string().optional(),           // ISO date from a date input
  assigneeIds: z.array(z.string()).default([]),
});
export type CreateCaseInput = z.infer<typeof createCaseSchema>;

export const listCasesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  segment: z.enum(["client", "prospect", "corporate"]).optional(),
  status: z.enum(["active", "on_hold", "approved", "refused", "withdrawn", "closed"]).optional(),
  q: z.string().trim().optional(),
});
export type ListCasesQuery = z.infer<typeof listCasesQuerySchema>;

export const updateStageSchema = z.object({
  currentStage: z.number().int().min(0),
});

export const updateChecklistItemSchema = z.object({
  index: z.number().int().min(0),
  status: z.enum(["pending", "uploaded", "approved", "rejected"]),
});