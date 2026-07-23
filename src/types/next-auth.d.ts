import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "staff" | "client" | "corporate";
      staffRole?: "admin" | "consultant";
    } & DefaultSession["user"];
  }

  interface User {
    role: "staff" | "client" | "corporate";
    staffRole?: "admin" | "consultant";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "staff" | "client" | "corporate";
    staffRole?: "admin" | "consultant";
  }
}
