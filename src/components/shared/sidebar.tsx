"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { portalNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname(); // current URL path, e.g. "/cases/123"

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Image src="/arik-seal-red.png" alt="ARIK" width={32} height={32} />
        <div className="leading-tight">
          <div className="text-sm font-extrabold tracking-wide text-foreground">ARIK</div>
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Immigration Consulting
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {portalNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="size-4" strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User (static placeholder until auth in Week 3) */}
      <div className="flex items-center gap-3 border-t border-sidebar-border px-4 py-4">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          AM
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-foreground">Alex Moreau</div>
          <div className="text-xs text-muted-foreground">Senior Consultant</div>
        </div>
      </div>
    </aside>
  );
}