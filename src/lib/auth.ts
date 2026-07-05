import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { dbConnect } from "./db";
import { User } from "@/models/user";

const dev = process.env.NODE_ENV !== "production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const conn = await dbConnect();
        if (dev) console.log("[auth] database:", conn.connection.name);

        const user = await User.findOne({ email, status: "active" }).select(
          "+passwordHash"
        );
        if (dev) console.log("[auth] lookup:", email, "found:", !!user);
        if (!user) return null;

        const valid = await user.verifyPassword(password);
        if (dev)
          console.log("[auth] hash present:", !!user.passwordHash, "valid:", valid);
        if (!valid) return null;

        user.lastLoginAt = new Date();
        await user.save();

        // Whatever we return becomes `user` in the jwt callback
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          staffRole: user.staffRole,
        };
      },
    }),
  ],
});
