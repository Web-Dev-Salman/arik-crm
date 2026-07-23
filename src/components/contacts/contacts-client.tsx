"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Plus, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { AddContactDialog } from "./add-contact-dialog";

type Contact = {
  _id: string;
  name: string;
  segment: "client" | "prospect" | "corporate" | "partner";
  kind: "person" | "organization";
  email?: string;
  phone?: string;
  location?: string;
  tags?: string[];
};

const segmentTone: Record<Contact["segment"], StatusTone> = {
  client: "success",
  prospect: "warning",
  corporate: "info",
  partner: "neutral",
};

const tabs = [
  { key: "", label: "All" },
  { key: "client", label: "Clients" },
  { key: "prospect", label: "Prospects" },
  { key: "corporate", label: "Corporate" },
  { key: "partner", label: "Partners" },
];

export function ContactsClient({
  initialItems,
  meta,
  query,
}: {
  initialItems: Contact[];
  meta: { page: number; total: number; pages: number };
  query: { segment?: string; q?: string; page: number };
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.q ?? "");

  function setParam(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    if (!("page" in updates)) next.delete("page");   // any filter change resets to page 1
    startTransition(() => router.push(`/contacts?${next.toString()}`));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            Every person and organisation the firm works with.
          </p>
        </div>
        <AddContactDialog onCreated={() => router.refresh()} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {tabs.map((t) => {
            const active = (query.segment ?? "") === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setParam({ segment: t.key || undefined })}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setParam({ q: search || undefined }); }}
          className="ml-auto flex items-center gap-2"
        >
          <div className="flex h-9 w-64 items-center gap-2 rounded-lg border border-input bg-card px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">Search</Button>
        </form>
      </div>

      <Card className={pending ? "opacity-60 transition-opacity" : "transition-opacity"}>
        {initialItems.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium">No contacts found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different filter, or add your first contact.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Segment</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Contact</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">Location</th>
                <th className="px-5 py-3 font-medium">Tags</th>
              </tr>
            </thead>
            <tbody>
              {initialItems.map((c) => (
                <tr key={c._id} className="border-b border-border/60 last:border-0 hover:bg-secondary/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                        {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={segmentTone[c.segment]}>
                      {c.segment[0].toUpperCase() + c.segment.slice(1)}
                    </StatusBadge>
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                    {c.email && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Mail className="size-3" />{c.email}
                      </div>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Phone className="size-3" />{c.phone}
                      </div>
                    )}
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                    {c.location && (
                      <span className="flex items-center gap-1.5 text-xs">
                        <MapPin className="size-3" />{c.location}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.map((t) => (
                        <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {meta.pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {meta.page} of {meta.pages} · {meta.total} contacts
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm" disabled={meta.page <= 1}
              onClick={() => setParam({ page: String(meta.page - 1) })}
            >
              Previous
            </Button>
            <Button
              variant="outline" size="sm" disabled={meta.page >= meta.pages}
              onClick={() => setParam({ page: String(meta.page + 1) })}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}