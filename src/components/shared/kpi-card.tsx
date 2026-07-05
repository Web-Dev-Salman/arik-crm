import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  hint,
}: {
  label: string;
  value: string | number;
  delta?: string; // e.g. "▲ 12"
  deltaTone?: "up" | "down" | "neutral";
  hint?: string; // e.g. "vs last month"
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
        {(delta || hint) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            {delta && (
              <span
                className={cn(
                  "font-semibold",
                  deltaTone === "up" && "text-success-text",
                  deltaTone === "down" && "text-error-text",
                  deltaTone === "neutral" && "text-muted-foreground"
                )}
              >
                {delta}
              </span>
            )}
            {hint && <span className="text-muted-foreground">{hint}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
