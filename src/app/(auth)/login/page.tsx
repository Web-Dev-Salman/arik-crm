"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // we handle navigation ourselves to show errors inline
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password."); // one message for all failures
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <Image src="/arik-seal-white.png" alt="" width={40} height={40} />
          <div>
            <div className="text-lg font-extrabold tracking-wide">ARIK</div>
            <div className="text-[10px] font-medium uppercase tracking-widest opacity-80">
              Immigration Consulting
            </div>
          </div>
        </div>
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            Case Management Portal
          </h2>
          <p className="mt-3 max-w-md text-sm opacity-80">
            Track every application, document, and deadline — in one place.
          </p>
        </div>
        <div className="text-xs opacity-70">
          12,400+ cases managed · 40+ countries served · 98.2% approval rate
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div>
            <h1 className="text-xl font-bold">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Use your Arik portal account.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-error-soft px-3 py-2 text-sm font-medium text-error-text">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="text-right">
            <a href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </a>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
