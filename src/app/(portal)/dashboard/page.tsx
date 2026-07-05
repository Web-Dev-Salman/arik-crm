import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Good morning, Alex 👋</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active cases" value={128}
          trend={{ direction: "up", label: "▲ 12 vs last month" }} />
        <KpiCard title="Approval rate" value="98.2%"
          trend={{ direction: "up", label: "▲ 1.4% this quarter" }} />
        <KpiCard title="New leads" value={34}
          trend={{ direction: "up", label: "▲ 9 this week" }} />
        <KpiCard title="Overdue filings" value={6} hint="Needs action today" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status vocabulary check</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {["Active", "On track", "Approved", "In review", "Action needed",
            "Waiting", "Overdue", "Refused", "Filed", "Verified"].map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}