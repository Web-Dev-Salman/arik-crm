import { z } from "zod";

export const requestResetSchema = z.object({
  email: z.string().email("Enter a valid email").toLowerCase().trim(),
});
export type RequestResetInput = z.infer<typeof requestResetSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(32, "Invalid reset link"),
  password: z
    .string()
    .min(10, "At least 10 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;