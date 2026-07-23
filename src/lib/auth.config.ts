import type { NextAuthConfig } from "next-auth";

// Paths reachable without a session, always:
const publicPaths = ["/login",
  "/invite",
  "/api/invitations/accept",
  "/forgot-password",
  "/reset-password",
  "/api/auth-flows",];
// Paths reachable without a session ONLY in development (dev tooling):
const devOnlyOpenPaths = ["/api/dev-seed", "/api/health"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12h
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (publicPaths.some((p) => pathname.startsWith(p))) return true;

      if (
        process.env.NODE_ENV !== "production" &&
        devOnlyOpenPaths.some((p) => pathname.startsWith(p))
      ) {
        return true;
      }

      return !!auth?.user;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.staffRole = user.staffRole;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.staffRole = token.staffRole;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
