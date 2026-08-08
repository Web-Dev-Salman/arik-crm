import { dbConnect } from "@/lib/db";
import { ApiError } from "@/lib/api";
import { Contact } from "@/models/contact";
import type { CreateContactInput, UpdateContactInput, ListContactsQuery, ConvertProspectInput } from "./schema";
import { createInvitation } from "@/modules/invitations/service";

export async function listContacts(query: ListContactsQuery) {
  await dbConnect();

  const filter: Record<string, unknown> = { deletedAt: null };
  if (query.segment) filter.segment = query.segment;
  if (query.q) filter.$text = { $search: query.q };

  const [items, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean(),
    Contact.countDocuments(filter),
  ]);

  return {
    items,
    meta: { page: query.page, total, pages: Math.ceil(total / query.limit) },
  };
}

export async function getContact(id: string) {
  await dbConnect();
  const contact = await Contact.findOne({ _id: id, deletedAt: null }).lean();
  if (!contact) throw new ApiError("CONTACT_NOT_FOUND", "Contact not found", 404);
  return contact;
}

export async function createContact(input: CreateContactInput, createdBy: string) {
  await dbConnect();
  const contact = await Contact.create({
    ...input,
    email: input.email || undefined,   // "" → undefined so the index ignores it
    createdBy,
  });
  return contact.toObject();
}

export async function updateContact(id: string, input: UpdateContactInput) {
  await dbConnect();
  const contact = await Contact.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: { ...input, email: input.email || undefined } },
    { new: true, runValidators: true }
  ).lean();
  if (!contact) throw new ApiError("CONTACT_NOT_FOUND", "Contact not found", 404);
  return contact;
}

export async function softDeleteContact(id: string) {
  await dbConnect();
  const contact = await Contact.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: { deletedAt: new Date() } },
    { new: true }
  ).lean();
  if (!contact) throw new ApiError("CONTACT_NOT_FOUND", "Contact not found", 404);
  return { deleted: true };
}

export async function convertProspectToClient(
  id: string,
  input: ConvertProspectInput,
  actorUserId: string
) {
  await dbConnect();

  const contact = await Contact.findOne({ _id: id, deletedAt: null });
  if (!contact) throw new ApiError("CONTACT_NOT_FOUND", "Contact not found", 404);
  if (contact.segment !== "prospect")
    throw new ApiError("NOT_A_PROSPECT", "Only prospects can be converted", 400);

  contact.segment = "client";
  contact.tags = (contact.tags ?? []).filter((t) => t !== "New lead");
  await contact.save();

  let invitation: { inviteUrl: string } | null = null;
  if (input.sendInvitation) {
    if (!contact.email)
      throw new ApiError("EMAIL_REQUIRED", "Add an email before inviting", 400);
    
    invitation = await createInvitation(
      { email: contact.email, role: "client" },
      actorUserId
    );
  }

  return { contact: contact.toObject(), invitation };
}