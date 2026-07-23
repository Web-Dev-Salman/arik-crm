import { ok, fail, handleApiError } from "@/lib/api";
import { requireStaff } from "@/lib/guards";
import { createContactSchema, listContactsQuerySchema } from "@/modules/contacts/schema";
import { createContact, listContacts } from "@/modules/contacts/service";

export async function GET(req: Request) {
  try {
    await requireStaff();
    const url = new URL(req.url);
    const parsed = listContactsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success)
      return fail("VALIDATION", "Bad query", 400, parsed.error.flatten().fieldErrors);

    const { items, meta } = await listContacts(parsed.data);
    return ok(items, { meta });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireStaff();
    const parsed = createContactSchema.safeParse(await req.json());
    if (!parsed.success)
      return fail("VALIDATION", "Check the form", 400, parsed.error.flatten().fieldErrors);

    const contact = await createContact(parsed.data, session.user.id);
    return ok(contact, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}