import crypto from "node:crypto";
import { dbConnect } from "@/lib/db";
import { ApiError } from "@/lib/api";
import { sendEmail, emailLayout } from "@/lib/email";
import { User } from "@/models/user";
import { PasswordReset } from "@/models/password-reset";
import type { RequestResetInput, ResetPasswordInput } from "./schema";

const RESET_TTL_MINUTES = 60;
const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export async function requestPasswordReset(input: RequestResetInput) {
  await dbConnect();

  const user = await User.findOne({ email: input.email, status: "active" });

  // CRITICAL: whether or not the user exists, we return the SAME success.
  // Otherwise this endpoint becomes an email-checking oracle for attackers.
  if (!user) return { ok: true };

  await PasswordReset.deleteMany({ userId: user._id, usedAt: null });

  const token = crypto.randomBytes(32).toString("hex");
  await PasswordReset.create({
    userId: user._id,
    tokenHash: sha256(token),
    expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60_000),
  });

  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/reset-password/${token}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your Arik portal password",
    html: emailLayout(
      "Reset your password",
      `Someone (hopefully you) requested a password reset for your Arik portal account. This link is valid for ${RESET_TTL_MINUTES} minutes. If you didn't request this, you can safely ignore this email.`,
      url,
      "Choose a new password"
    ),
  });

  return { ok: true };
}

export async function resetPassword(input: ResetPasswordInput) {
  await dbConnect();

  const reset = await PasswordReset.findOne({
    tokenHash: sha256(input.token),
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!reset)
    throw new ApiError("RESET_INVALID", "This reset link is invalid or expired", 404);

  const user = await User.findById(reset.userId);
  if (!user) throw new ApiError("RESET_INVALID", "This reset link is invalid", 404);

  await user.setPassword(input.password);
  await user.save();

  reset.usedAt = new Date();
  await reset.save();

  return { email: user.email };
}