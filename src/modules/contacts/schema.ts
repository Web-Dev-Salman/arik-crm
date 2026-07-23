import { z } from "zod";

export const contactBaseSchema = z.object({
  kind: z.enum(["person", "organization"]).default("person"),
  segment: z.enum(["client", "prospect", "corporate", "partner"]),
  name: z.string().min(2, "Name is required").trim(),
  email: z.string().email("Enter a valid email").toLowerCase().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  tags: z.array(z.string().trim()).default([]),
  notes: z.string().optional(),
});
export const createContactSchema = contactBaseSchema;
export const updateContactSchema = contactBaseSchema.partial();   // every field optional
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;

export const listContactsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  segment: z.enum(["client", "prospect", "corporate", "partner"]).optional(),
  q: z.string().trim().optional(),
});
export type ListContactsQuery = z.infer<typeof listContactsQuerySchema>;