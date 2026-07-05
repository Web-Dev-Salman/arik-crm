"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { portalNav } from "@/lib/navigation";

export function Topbar() {
  const pathname = usePathname();
  const current = portalNav.find(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/")
  );

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        ARIK <span className="mx-1.5 text-border">/</span>
        <span className="font-semibold text-foreground">
          {current?.label ?? "Portal"}
        </span>
      </div>

      {/* Search + actions */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-64 items-center gap-2 rounded-lg border border-input bg-secondary px-3 text-sm text-muted-foreground">
          <Search className="size-4" />
          <span className="flex-1">Search cases, contacts…</span>
          <kbd className="rounded border border-border bg-card px-1.5 text-[10px] font-semibold">
            ⌘K
          </kbd>
        </div>
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}
