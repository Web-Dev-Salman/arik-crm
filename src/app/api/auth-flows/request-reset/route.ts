import { ok, fail, handleApiError } from "@/lib/api";
import { requestResetSchema } from "@/modules/auth/schema";
import { requestPasswordReset } from "@/modules/auth/service";

export async function POST(req: Request) {
  try {
    const parsed = requestResetSchema.safeParse(await req.json());
    if (!parsed.success)
      return fail("VALIDATION", "Check the form", 400, parsed.error.flatten().fieldErrors);
    return ok(await requestPasswordReset(parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}