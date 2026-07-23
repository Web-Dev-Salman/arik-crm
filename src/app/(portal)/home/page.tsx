import { redirect } from "next/navigation";
import Link from "next/link";
import { UserPlus, FolderPlus, Calculator, CalendarDays, Video, Phone, MapPin, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { getHomeData } from "@/modules/dashboard/service";

const modeIcon = { video: Video, phone: Phone, office: MapPin };

const quickActions = [
  { label: "Add contact", href: "/contacts", icon: UserPlus },
  { label: "New case", href: "/cases", icon: FolderPlus },
  { label: "Run assessment", href: "/eligibility", icon: Calculator },
  { label: "Open calendar", href: "/calendar", icon: CalendarDays },
];

export default async function HomePage() {
  const session = await auth();
  const role = session?.user?.role;

  // Clients & corporate: their dashboard IS their home.
  if (role !== "staff") redirect("/dashboard");

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const today = new Date().toLocaleDateString("en-CA", {
    weekday: "long", month: "long", day: "numeric",
  });
  const data = await getHomeData();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {today}
          </p>
          <h1 className="text-xl font-bold text-foreground">
            Good morning, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {data.priorityCases.length} cases need attention · {data.todaysEvents.length} appointments today
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            Firm dashboard <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <a.icon className="size-4" />
            </div>
            <span className="text-sm font-medium">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Today's schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {data.todaysEvents.map((e) => {
              const Icon = modeIcon[e.mode];
              return (
                <div key={e.id} className="flex items-center gap-3">
                  <span className="w-11 text-xs font-semibold text-muted-foreground">{e.time}</span>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-info-soft text-info-text">
                    <Icon className="size-3.5" />
                  </div>
                  <span className="min-w-0 truncate text-sm">{e.title}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Needs your attention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            {data.priorityCases.map((c) => (
              <div key={c.caseRef} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{c.client}</span>
                  <StatusBadge tone={c.tone}>{c.caseRef}</StatusBadge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {data.recentActivity.map((a) => (
              <div key={a.id} className="border-l-2 border-border pl-3">
                <p className="text-sm leading-snug">{a.text}</p>
                <p className="text-[11px] text-muted-foreground">{a.when}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}