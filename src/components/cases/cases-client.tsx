"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { JourneyRail } from "@/components/shared/journey-rail";
import { NewCaseDialog } from "./new-case-dialog";

type CaseRow = {
  _id: string;
  reference: string;
  programLabel: string;
  region: string;
  segment: "client" | "prospect" | "corporate";
  status: string;
  priority: string;
  stages: string[];
  currentStage: number;
  contactId?: { _id: string; name: string } | null;
};

const statusTone: Record<string, StatusTone> = {
  active: "info", on_hold: "neutral", approved: "success",
  refused: "error", withdrawn: "neutral", closed: "neutral",
};

const tabs = [
  { key: "", label: "All cases" },
  { key: "client", label: "Individual clients" },
  { key: "prospect", label: "Prospects" },
  { key: "corporate", label: "Corporate clients" },
];

export function CasesClient({
  initialItems, contacts, meta, query,
}: {
  initialItems: CaseRow[];
  contacts: { _id: string; name: string; segment: string }[];
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
      if (v) next.set(k, v); else next.delete(k);
    }
    if (!("page" in updates)) next.delete("page");
    startTransition(() => router.push(`/cases?${next.toString()}`));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Cases</h1>
          <p className="text-sm text-muted-foreground">
            Every application the firm is handling.
          </p>
        </div>
        <NewCaseDialog contacts={contacts} onCreated={() => router.refresh()} />
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
          className="ml-auto flex h-9 w-64 items-center gap-2 rounded-lg border border-input bg-card px-3"
        >
          <Search className="size-4 text-muted-foreground" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </form>
      </div>

      <Card className={pending ? "opacity-60" : ""}>
        {initialItems.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium">No cases yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a case from an existing contact to get started.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Program</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">Progress</th>
                <th className="px-5 py-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {initialItems.map((c) => (
                <tr key={c._id} className="border-b border-border/60 last:border-0 hover:bg-secondary/50">
                  <td className="px-5 py-3">
                    <Link href={`/cases/${c._id}`} className="font-medium text-primary hover:underline">
                      {c.reference}
                    </Link>
                    {c.priority === "high" && (
                      <span className="ml-2 rounded bg-error-soft px-1.5 py-0.5 text-[10px] font-semibold text-error-text">
                        HIGH
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium">{c.contactId?.name ?? "—"}</td>
                  <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                    {c.programLabel}
                  </td>
                  <td className="hidden px-5 py-3 lg:table-cell">
                    <div className="max-w-50">
                      <JourneyRail stages={c.stages} current={c.currentStage} size="sm" />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge tone={statusTone[c.status] ?? "neutral"}>
                      {c.status.replace("_", " ")}
                    </StatusBadge>
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
            Page {meta.page} of {meta.pages} · {meta.total} cases
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={meta.page <= 1}
              onClick={() => setParam({ page: String(meta.page - 1) })}>Previous</Button>
            <Button variant="outline" size="sm" disabled={meta.page >= meta.pages}
              onClick={() => setParam({ page: String(meta.page + 1) })}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}