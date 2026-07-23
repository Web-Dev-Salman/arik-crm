"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setError(null); setFieldErrors({}); setLoading(true);

    const res = await fetch("/api/auth-flows/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json();
    setLoading(false);

    if (!json.success) {
      setFieldErrors(json.error.fields ?? {});
      setError(json.error.fields ? null : json.error.message);
      return;
    }
    router.push("/login?reset=1");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-xl font-bold">Choose a new password</h1>
          <p className="text-sm text-muted-foreground">
            At least 10 characters, with an uppercase letter and a number.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-error-soft px-3 py-2 text-sm font-medium text-error-text">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="pw" className="text-sm font-medium">New password</label>
          <input
            id="pw" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {fieldErrors.password && (
            <p className="text-xs text-error-text">{fieldErrors.password[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pw2" className="text-sm font-medium">Confirm password</label>
          <input
            id="pw2" type="password" required value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving…" : "Set new password"}
        </Button>
      </form>
    </div>
  );
}