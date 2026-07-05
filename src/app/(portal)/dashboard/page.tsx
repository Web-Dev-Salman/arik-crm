import { KpiCard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">
        Good morning, Alex 👋
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Active cases"
          value={148}
          delta="▲ 12"
          deltaTone="up"
          hint="vs last month"
        />
        <KpiCard
          label="Approval rate"
          value="98.2%"
          delta="▲ 1.4%"
          deltaTone="up"
          hint="this quarter"
        />
        <KpiCard
          label="New leads"
          value={36}
          delta="▲ 9"
          deltaTone="up"
          hint="this week"
        />
        <KpiCard
          label="Overdue filings"
          value={4}
          delta="Needs action"
          deltaTone="down"
        />
      </div>

      <div className="flex gap-2">
        <StatusBadge tone="info">Active</StatusBadge>
        <StatusBadge tone="success">On track</StatusBadge>
        <StatusBadge tone="warning">Action needed</StatusBadge>
        <StatusBadge tone="error">Overdue</StatusBadge>
        <StatusBadge tone="neutral">Waiting</StatusBadge>
      </div>
    </div>
  );
}
