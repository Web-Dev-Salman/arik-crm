"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setError(null);
    setLoading(true);
    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) {
      setError(json.error.message);
      return;
    }
    setResult(json.data.inviteUrl);
    setEmail("");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite a user</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={invite} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="person@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 flex-1 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 rounded-lg border border-input bg-card px-2 text-sm"
            >
              <option value="client">Client</option>
              <option value="corporate">Corporate</option>
              <option value="staff">Staff</option>
            </select>
            <Button type="submit" disabled={loading}>
              {loading ? "…" : "Invite"}
            </Button>
          </form>
          {error && <p className="mt-3 text-sm text-error-text">{error}</p>}
          {result && (
            <div className="mt-3 rounded-lg bg-success-soft p-3 text-xs">
              <p className="mb-1 font-semibold text-success-text">
                Invitation created — send this link (email delivery comes later):
              </p>
              <code className="break-all">{result}</code>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
