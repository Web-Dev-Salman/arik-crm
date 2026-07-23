import { ok, fail, handleApiError } from "@/lib/api";
import { resetPasswordSchema } from "@/modules/auth/schema";
import { resetPassword } from "@/modules/auth/service";

export async function POST(req: Request) {
  try {
    const parsed = resetPasswordSchema.safeParse(await req.json());
    if (!parsed.success)
      return fail("VALIDATION", "Check the form", 400, parsed.error.flatten().fieldErrors);
    return ok(await resetPassword(parsed.data));
  } catch (err) {
    return handleApiError(err);
  }
}