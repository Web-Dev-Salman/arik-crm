"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export function AddContactDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", segment: "prospect", email: "", phone: "", location: "", tags: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({}); setLoading(true);

    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      }),
    });
    const json = await res.json();
    setLoading(false);

    if (!json.success) { setErrors(json.error.fields ?? {}); return; }
    setForm({ name: "", segment: "prospect", email: "", phone: "", location: "", tags: "" });
    setOpen(false);
    onCreated();
  }

  const field = "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="size-4" /> Add contact</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New contact</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <input
              className={field} required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="text-xs text-error-text">{errors.name[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Segment</label>
              <select
                className={field} value={form.segment}
                onChange={(e) => setForm({ ...form, segment: e.target.value })}
              >
                <option value="prospect">Prospect</option>
                <option value="client">Client</option>
                <option value="corporate">Corporate</option>
                <option value="partner">Partner</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Location</label>
              <input
                className={field} value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <input
                className={field} type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-error-text">{errors.email[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone</label>
              <input
                className={field} value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags</label>
            <input
              className={field} placeholder="Express Entry, Priority"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
            <p className="text-[11px] text-muted-foreground">Separate with commas</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Create contact"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}