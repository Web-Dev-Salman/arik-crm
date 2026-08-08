import { ok, fail, handleApiError } from "@/lib/api";
import { requireStaff } from "@/lib/guards";
import { createCaseSchema, listCasesQuerySchema } from "@/modules/cases/schema";
import { createCase, listCases } from "@/modules/cases/service";

export async function GET(req: Request) {
  try {
    await requireStaff();
    const url = new URL(req.url);
    const parsed = listCasesQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success)
      return fail("VALIDATION", "Bad query", 400, parsed.error.flatten().fieldErrors);
    const { items, meta } = await listCases(parsed.data);
    return ok(items, { meta });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireStaff();
    const parsed = createCaseSchema.safeParse(await req.json());
    if (!parsed.success)
      return fail("VALIDATION", "Check the form", 400, parsed.error.flatten().fieldErrors);
    return ok(await createCase(parsed.data, session.user.id), { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}