"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { portalNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/shared/sign-out-button";

type SidebarUser = {
  name: string;
  role: "staff" | "client" | "corporate";
  staffRole?: "admin" | "consultant";
};

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  consultant: "Consultant",
  client: "Client",
  corporate: "Corporate",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Image src="/arik-seal-red.png" alt="ARIK" width={32} height={32} />
        <div className="leading-tight">
          <div className="text-sm font-extrabold tracking-wide text-foreground">
            ARIK
          </div>
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

      {/* User — real session data */}
      <div className="flex items-center gap-3 border-t border-sidebar-border px-4 py-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initials(user.name)}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-semibold text-foreground">
            {user.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {roleLabels[user.staffRole ?? user.role]}
          </div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
