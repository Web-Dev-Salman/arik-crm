import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PipelineChart, RevenueChart } from "./staff-charts";
import { getStaffDashboardData } from "@/modules/dashboard/service";

function daysUntil(iso: string) {
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return `${-diff}d overdue`;
  if (diff === 0) return "today";
  return `in ${diff}d`;
}

export async function StaffDashboard({ firstName }: { firstName: string }) {
  const data = await getStaffDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Good morning, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's how the firm is doing today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Active cases" value={data.kpis.activeCases}
          delta={`▲ ${data.kpis.activeDelta}`} deltaTone="up" hint="vs last month"
        />
        <KpiCard
          label="Approval rate" value={`${data.kpis.approvalRate}%`}
          delta="12 months" deltaTone="neutral"
        />
        <KpiCard
          label="New leads" value={data.kpis.newLeads}
          delta="this month" deltaTone="neutral"
        />
        <KpiCard
          label="Overdue filings" value={data.kpis.overdueFilings}
          delta="Needs action" deltaTone="down"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Case pipeline</CardTitle>
          </CardHeader>
          <CardContent><PipelineChart data={data.pipeline} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Retainer revenue</CardTitle>
          </CardHeader>
          <CardContent><RevenueChart data={data.revenueTrend} /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Upcoming deadlines</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Case</th>
                <th className="py-2 font-medium">Client</th>
                <th className="py-2 font-medium">Item</th>
                <th className="py-2 font-medium">Due</th>
                <th className="py-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.deadlines.map((d) => (
                <tr key={d.caseRef} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 font-medium">{d.caseRef}</td>
                  <td className="py-2.5">{d.client}</td>
                  <td className="py-2.5 text-muted-foreground">{d.item}</td>
                  <td className="py-2.5">{daysUntil(d.due)}</td>
                  <td className="py-2.5 text-right">
                    <StatusBadge tone={d.tone}>
                      {d.tone === "error" ? "Overdue risk" : d.tone === "warning" ? "Due soon" : "On track"}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}