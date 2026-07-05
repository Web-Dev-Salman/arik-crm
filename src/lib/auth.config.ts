import type { NextAuthConfig } from "next-auth";

// Paths reachable without a session, always:
const publicPaths = ["/login"];
// Paths reachable without a session ONLY in development (dev tooling):
const devOnlyOpenPaths = ["/api/dev-seed", "/api/health"];

export const authConfig = {
  pages: {
    signIn: "/login", // send unauthenticated users to OUR page, not the default
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12h, per blueprint §6
  },
  callbacks: {
    // Runs in the proxy for every request: true = allow, false = bounce to /login
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (publicPaths.some((p) => pathname.startsWith(p))) return true;

      if (
        process.env.NODE_ENV !== "production" &&
        devOnlyOpenPaths.some((p) => pathname.startsWith(p))
      ) {
        return true; // dev tooling stays reachable while building auth itself
      }

      return !!auth?.user; // everything else requires a session
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
        session.user.id = token.id as string;
        session.user.role = token.role as "staff" | "client" | "corporate";
        session.user.staffRole = token.staffRole as "admin" | "consultant" | undefined;
      }
      return session;
    },
  },
  providers: [], // filled in by the full config in auth.ts
} satisfies NextAuthConfig;
