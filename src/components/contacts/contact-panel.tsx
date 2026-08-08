"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Compass, UserCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";

export type ContactDetail = {
  _id: string;
  name: string;
  segment: "client" | "prospect" | "corporate" | "partner";
  email?: string;
  phone?: string;
  location?: string;
  tags?: string[];
  source?: string;
  createdAt?: string;
  assessment?: {
    destination?: string;
    program?: string;
    estimatedScore?: number;
    answers?: Record<string, unknown>;
  };
};

const segmentTone: Record<ContactDetail["segment"], StatusTone> = {
  client: "success", prospect: "warning", corporate: "info", partner: "neutral",
};

const sourceLabels: Record<string, string> = {
  website_assessment: "Website assessment",
  wordpress_form: "Website form",
  manual: "Added manually",
  referral: "Referral",
  whatsapp: "WhatsApp",
  other: "Other",
};

export function ContactPanel({
  contact,
  open,
  onOpenChange,
  onChanged,
}: {
  contact: ContactDetail | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChanged: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!contact) return null;

  async function convert(sendInvitation: boolean) {
    setLoading(true); setError(null); setResult(null);
    const res = await fetch(`/api/contacts/${contact!._id}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sendInvitation }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) { setError(json.error.message); return; }
    setResult(
      json.data.invitation
        ? `Converted to client. Invitation sent — link: ${json.data.invitation.inviteUrl}`
        : "Converted to client."
    );
    onChanged();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="sr-only">Contact details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
              {contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold">{contact.name}</h2>
              <StatusBadge tone={segmentTone[contact.segment]}>
                {contact.segment[0].toUpperCase() + contact.segment.slice(1)}
              </StatusBadge>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-border p-4 text-sm">
            {contact.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-muted-foreground" />{contact.phone}
              </div>
            )}
            {contact.location && (
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-muted-foreground" />{contact.location}
              </div>
            )}
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Compass className="size-4" />
              {sourceLabels[contact.source ?? "manual"] ?? contact.source}
            </div>
          </div>

          {contact.assessment?.destination && (
            <div className="rounded-xl border border-border p-4">
              <h3 className="mb-3 text-sm font-semibold">Assessment submitted</h3>
              <div className="flex items-center gap-4">
                {contact.assessment.estimatedScore ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {contact.assessment.estimatedScore}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      est. points
                    </div>
                  </div>
                ) : null}
                <div className="text-sm">
                  <div><span className="text-muted-foreground">Destination:</span> {contact.assessment.destination}</div>
                  {contact.assessment.program && (
                    <div><span className="text-muted-foreground">Program:</span> {contact.assessment.program}</div>
                  )}
                </div>
              </div>
              {contact.assessment.answers && (
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-border pt-3 text-xs">
                  {Object.entries(contact.assessment.answers).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.map((t) => (
                <span key={t} className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-error-soft px-3 py-2 text-sm text-error-text">{error}</div>
          )}
          {result && (
            <div className="break-all rounded-lg bg-success-soft px-3 py-2 text-xs text-success-text">{result}</div>
          )}

          {contact.segment === "prospect" && (
            <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-4">
              <h3 className="text-sm font-semibold">Convert prospect</h3>
              <p className="text-xs text-muted-foreground">
                Retainer signed? Convert to client and optionally send portal access.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Button size="sm" disabled={loading} onClick={() => convert(true)}>
                  <Send className="size-3.5" /> Convert and invite to portal
                </Button>
                <Button size="sm" variant="outline" disabled={loading} onClick={() => convert(false)}>
                  <UserCheck className="size-3.5" /> Convert only
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}