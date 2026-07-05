import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Trend = {
  direction: "up" | "down";
  label: string;          // e.g. "▲ 12 vs last month"
  positive?: boolean;     // is this trend GOOD? (down can be good: overdue ▼)
};

type KpiCardProps = {
  title: string;
  value: string | number;
  trend?: Trend;
  hint?: string;          // e.g. "Needs action today"
  className?: string;
};

export function KpiCard({ title, value, trend, hint, className }: KpiCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {trend && (
          <p
            className={cn(
              "mt-1 text-xs font-semibold",
              trend.positive !== false ? "text-success-text" : "text-error-text"
            )}
          >
            {trend.label}
          </p>
        )}
        {hint && !trend && (
          <p className="mt-1 text-xs font-medium text-warning-text">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}