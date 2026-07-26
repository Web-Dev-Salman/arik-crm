import { dbConnect } from "@/lib/db";
import { Contact } from "@/models/contact";
import { sendEmail, emailLayout } from "@/lib/email";
import type { CreateLeadInput } from "./schema";

export async function createLead(input: CreateLeadInput) {
  await dbConnect();

  // De-dupe: if this email already exists as a prospect, update rather than duplicate.
  const existing = await Contact.findOne({
    email: input.email,
    segment: "prospect",
    deletedAt: null,
  });

  const assessment = {
    destination: input.destination,
    program: input.program,
    estimatedScore: input.estimatedScore,
    answers: input.answers,
  };

  let contact;
  if (existing) {
    existing.set({ name: input.name, phone: input.phone, assessment });
    await existing.save();
    contact = existing;
  } else {
    contact = await Contact.create({
      kind: "person",
      segment: "prospect",
      name: input.name,
      email: input.email,
      phone: input.phone,
      location: input.destination,
    source: input.source,
    assessment,
    tags: ["New lead"],
    });
  }

  // Notify the firm's intake inbox (fire-and-forget; email failure won't break intake).
  await sendEmail({
    to: process.env.INTAKE_NOTIFY_EMAIL ?? process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    subject: `New prospect: ${input.name} (${input.destination})`,
    html: emailLayout(
      "New website lead",
      `<strong>${input.name}</strong> completed the assessment.<br>
       Destination: ${input.destination}<br>
       ${input.program ? `Program: ${input.program}<br>` : ""}
       ${input.estimatedScore ? `Estimated score: ${input.estimatedScore}<br>` : ""}
       Email: ${input.email}${input.phone ? `<br>Phone: ${input.phone}` : ""}`,
      `${process.env.APP_URL ?? "http://localhost:3000"}/contacts?segment=prospect`,
      "View in CRM"
    ),
  });

  return { id: contact._id.toString() };
}