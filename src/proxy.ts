import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next.js 16 convention: this file runs for every matched request.
// NextAuth(authConfig).auth IS the request handler — our `authorized`
// callback inside authConfig decides allow vs redirect-to-login.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|.*\\.png$|.*\\.ico$).*)"],
};