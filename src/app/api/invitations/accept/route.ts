import { ok, fail, handleApiError } from "@/lib/api";
import { acceptInvitationSchema } from "@/modules/invitations/schema";
import { acceptInvitation } from "@/modules/invitations/service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = acceptInvitationSchema.safeParse(body);
    if (!parsed.success)
      return fail(
        "VALIDATION",
        "Check the form",
        400,
        parsed.error.flatten().fieldErrors
      );

    const result = await acceptInvitation(parsed.data);
    return ok(result, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
