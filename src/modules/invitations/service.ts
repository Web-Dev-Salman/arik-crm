import crypto from "node:crypto";
import { dbConnect } from "@/lib/db";
import { ApiError } from "@/lib/api";
import { Invitation } from "@/models/invitation";
import { User } from "@/models/user";
import type { CreateInvitationInput, AcceptInvitationInput } from "./schema";
import { sendEmail, emailLayout } from "@/lib/email";

const INVITE_TTL_DAYS = 7;

const sha256 = (s: string) =>
  crypto.createHash("sha256").update(s).digest("hex");

export async function createInvitation(
  input: CreateInvitationInput,
  invitedByUserId: string
) {
  await dbConnect();

  if (await User.findOne({ email: input.email }))
    throw new ApiError(
      "EMAIL_TAKEN",
      "A user with this email already exists",
      409
    );

  // Re-inviting the same email replaces the old invitation
  await Invitation.deleteMany({ email: input.email, acceptedAt: null });

  const token = crypto.randomBytes(32).toString("hex"); // raw token -> link only
  await Invitation.create({
    email: input.email,
    role: input.role,
    tokenHash: sha256(token), // ONLY the hash is stored
    expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 86_400_000),
    invitedBy: invitedByUserId,
  });

  const inviteUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/invite/${token}`;
  await sendEmail({
    to: input.email,
    subject: "You're invited to the Arik client portal",
    html: emailLayout(
      "Welcome to Arik",
      "Arik Immigration Consulting has invited you to their secure client portal, where you can track your case, upload documents, and message your consultant. This invitation is valid for 7 days.",
      inviteUrl,
      "Set up my account"
    ),
  });
  return { email: input.email, role: input.role, inviteUrl };
}

export async function getInvitationByToken(token: string) {
  await dbConnect();
  const invitation = await Invitation.findOne({
    tokenHash: sha256(token),
    acceptedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!invitation)
    throw new ApiError(
      "INVITE_INVALID",
      "This invitation is invalid or expired",
      404
    );
  return invitation;
}

export async function acceptInvitation(input: AcceptInvitationInput) {
  const invitation = await getInvitationByToken(input.token);

  if (await User.findOne({ email: invitation.email }))
    throw new ApiError("EMAIL_TAKEN", "This invitation was already used", 409);

  const user = new User({
    email: invitation.email,
    name: input.name,
    role: invitation.role,
    status: "active",
  });
  await user.setPassword(input.password);
  await user.save();

  invitation.acceptedAt = new Date();
  await invitation.save();

  return { email: user.email };
}
