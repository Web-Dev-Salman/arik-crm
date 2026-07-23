import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export async function requireSession() {
  const session = await auth();
  if (!session?.user)
    throw new ApiError("UNAUTHENTICATED", "Sign in required", 401);
  return session;
}

export async function requireStaff(adminOnly = false) {
  const session = await requireSession();
  if (session.user.role !== "staff")
    throw new ApiError("FORBIDDEN", "Staff access required", 403);
  if (adminOnly && session.user.staffRole !== "admin")
    throw new ApiError("FORBIDDEN", "Admin access required", 403);
  return session;
}
