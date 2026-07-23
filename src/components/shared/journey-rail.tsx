import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function JourneyRail({
  stages,
  current,
  size = "md",
}: {
  stages: string[];
  current: number;
  size?: "md" | "sm";
}) {
  return (
    <div className="flex items-center">
      {stages.map((stage, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={stage} className={cn("flex items-center", i > 0 && "flex-1")}>
            {i > 0 && (
              <div
                className={cn(
                  "h-0.5 flex-1",
                  i <= current ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <div
              className={cn(
                "flex flex-col items-center gap-1.5",
                size === "sm" ? "px-0.5" : "px-1"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2 font-bold",
                  size === "sm" ? "size-5 text-[10px]" : "size-7 text-xs",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary bg-accent text-accent-foreground",
                  !done && !active && "border-border bg-card text-muted-foreground"
                )}
              >
                {done ? (
                  <Check className={size === "sm" ? "size-3" : "size-3.5"} />
                ) : (
                  i + 1
                )}
              </div>
              {size === "md" && (
                <span
                  className={cn(
                    "whitespace-nowrap text-[11px] font-medium",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stage}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}