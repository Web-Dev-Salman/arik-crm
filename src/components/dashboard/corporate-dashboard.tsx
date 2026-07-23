import { AlertTriangle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { JourneyRail } from "@/components/shared/journey-rail";
import { getCorporateDashboardData } from "@/modules/dashboard/service";

export async function CorporateDashboard({ firstName }: { firstName: string }) {
  const data = await getCorporateDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Welcome, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Sponsorship overview for {data.company}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Sponsored employees" value={data.kpis.sponsoredEmployees} />
        <KpiCard label="Active applications" value={data.kpis.activeApplications} />
        <KpiCard
          label="Permits expiring (90d)" value={data.kpis.permitsExpiring90d}
          delta={data.kpis.permitsExpiring90d > 0 ? "Review needed" : undefined}
          deltaTone="down"
        />
        <KpiCard
          label="Compliance score" value={`${data.kpis.complianceScore}%`}
          delta="Healthy" deltaTone="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Employee roster</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 font-medium">Employee</th>
                  <th className="py-2 font-medium">Program</th>
                  <th className="hidden py-2 font-medium md:table-cell">Progress</th>
                  <th className="py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.roster.map((e) => (
                  <tr key={e.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3">
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.position}</div>
                    </td>
                    <td className="py-3 text-muted-foreground">{e.program}</td>
                    <td className="hidden py-3 pr-4 md:table-cell">
                      <div className="max-w-[180px]">
                        <JourneyRail stages={e.stages} current={e.currentStage} size="sm" />
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge tone={e.status.tone}>{e.status.label}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Compliance alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            {data.alerts.map((a) => {
              const err = a.severity === "error";
              const Icon = err ? AlertCircle : AlertTriangle;
              return (
                <div
                  key={a.id}
                  className={`flex gap-3 rounded-lg p-3 ${err ? "bg-error-soft" : "bg-warning-soft"}`}
                >
                  <Icon
                    className={`mt-0.5 size-4 shrink-0 ${err ? "text-error-text" : "text-warning-text"}`}
                  />
                  <div className="min-w-0">
                    <div className={`text-sm font-medium ${err ? "text-error-text" : "text-warning-text"}`}>
                      {a.employee}
                    </div>
                    <div className="text-xs text-foreground/70">{a.message}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {new Date(a.due).toLocaleDateString("en-CA", { month: "long", day: "numeric" })}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}