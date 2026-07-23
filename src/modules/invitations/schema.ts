import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().email("Enter a valid email").toLowerCase().trim(),
  role: z.enum(["staff", "client", "corporate"]),
});
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

export const acceptInvitationSchema = z.object({
  token: z.string().min(32, "Invalid invitation link"),
  name: z.string().min(2, "Enter your full name").trim(),
  password: z
    .string()
    .min(10, "At least 10 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
