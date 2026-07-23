import { dbConnect } from "@/lib/db";
import { ApiError } from "@/lib/api";
import { Contact } from "@/models/contact";
import type { CreateContactInput, UpdateContactInput, ListContactsQuery } from "./schema";

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