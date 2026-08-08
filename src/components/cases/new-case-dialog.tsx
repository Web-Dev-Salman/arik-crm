"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PROGRAMS, regionLabels, type Region } from "@/lib/programs";

export function NewCaseDialog({
  contacts, onCreated,
}: {
  contacts: { _id: string; name: string; segment: string }[];
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    contactId: "", programCode: "", priority: "normal", targetDate: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const field = "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, targetDate: form.targetDate || undefined }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) { setError(json.error.message); return; }
    setForm({ contactId: "", programCode: "", priority: "normal", targetDate: "" });
    setOpen(false);
    onCreated();
  }

  const grouped = (["canada", "usa", "europe"] as Region[]).map((r) => ({
    region: r,
    programs: PROGRAMS.filter((p) => p.region === r),
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm"><Plus className="size-4" /> New case</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create a case</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Contact</label>
            <select required className={field} value={form.contactId}
              onChange={(e) => setForm({ ...form, contactId: e.target.value })}>
              <option value="">Select a contact…</option>
              {contacts.filter((c) => c.segment !== "partner").map((c) => (
                <option key={c._id} value={c._id}>{c.name} ({c.segment})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Program</label>
            <select required className={field} value={form.programCode}
              onChange={(e) => setForm({ ...form, programCode: e.target.value })}>
              <option value="">Select a program…</option>
              {grouped.map((g) => (
                <optgroup key={g.region} label={regionLabels[g.region]}>
                  {g.programs.map((p) => (
                    <option key={p.code} value={p.code}>{p.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground">
              Programs without a workflow template yet will show an error — seed more templates as Arik defines them.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <select className={field} value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Target date</label>
              <input type="date" className={field} value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
            </div>
          </div>

          {error && <div className="rounded-lg bg-error-soft px-3 py-2 text-sm text-error-text">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create case"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}