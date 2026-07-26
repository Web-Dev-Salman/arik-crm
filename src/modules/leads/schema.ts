import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name is required").trim(),
  email: z.string().email("Valid email required").toLowerCase().trim(),
  phone: z.string().trim().optional(),
  destination: z.enum(["Canada", "USA", "Europe"]),
  program: z.string().trim().optional(),
  estimatedScore: z.number().int().min(0).max(1200).optional(),
  answers: z.record(z.string(), z.any()).optional(),   // flexible bag of wizard answers
  source: z.enum(["website_assessment", "wordpress_form"]).default("website_assessment"),
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;