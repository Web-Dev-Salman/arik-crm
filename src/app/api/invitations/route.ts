import { ok, fail, handleApiError } from "@/lib/api";
import { requireStaff } from "@/lib/guards";
import { createInvitationSchema } from "@/modules/invitations/schema";
import { createInvitation } from "@/modules/invitations/service";

export async function POST(req: Request) {
  try {
    const session = await requireStaff(true); // admin only
    const body = await req.json();

    const parsed = createInvitationSchema.safeParse(body);
    if (!parsed.success)
      return fail(
        "VALIDATION",
        "Check the form",
        400,
        parsed.error.flatten().fieldErrors
      );

    const result = await createInvitation(parsed.data, session.user.id);
    return ok(result, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
