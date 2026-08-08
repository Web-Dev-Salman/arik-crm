import { ok, fail, handleApiError } from "@/lib/api";
import { requireStaff } from "@/lib/guards";
import { convertProspectSchema } from "@/modules/contacts/schema";
import { convertProspectToClient } from "@/modules/contacts/service";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireStaff();
    const { id } = await ctx.params;
    const parsed = convertProspectSchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success)
      return fail("VALIDATION", "Invalid request", 400, parsed.error.flatten().fieldErrors);

    return ok(await convertProspectToClient(id, parsed.data, session.user.id));
  } catch (err) {
    return handleApiError(err);
  }
}