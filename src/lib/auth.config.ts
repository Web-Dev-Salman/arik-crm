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
    // Runs when a token is created/updated: copy our fields INTO the token
    jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.staffRole = (user as any).staffRole;
      }
      return token;
    },
    // Runs when a session is read: copy token fields OUT to what the app sees
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).staffRole = token.staffRole;
      }
      return session;
    },
  },
  providers: [], // filled in by the full config in auth.ts
} satisfies NextAuthConfig;
