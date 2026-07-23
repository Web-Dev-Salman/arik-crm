import { ok, fail, handleApiError } from "@/lib/api";
import { requireStaff } from "@/lib/guards";
import { updateContactSchema } from "@/modules/contacts/schema";
import { getContact, updateContact, softDeleteContact } from "@/modules/contacts/service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await requireStaff();
    const { id } = await ctx.params;
    return ok(await getContact(id));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireStaff();
    const { id } = await ctx.params;
    const parsed = updateContactSchema.safeParse(await req.json());
    if (!parsed.success)
      return fail("VALIDATION", "Check the form", 400, parsed.error.flatten().fieldErrors);
    return ok(await updateContact(id, parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireStaff(true);   // deleting is admin-only
    const { id } = await ctx.params;
    return ok(await softDeleteContact(id));
  } catch (err) {
    return handleApiError(err);
  }
}