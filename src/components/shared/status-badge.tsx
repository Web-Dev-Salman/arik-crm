import { cn } from "@/lib/utils";

/** Semantic tones available across the design system */
type Tone = "success" | "warning" | "error" | "info" | "neutral";

/** Business statuses → semantic tone. ONE place. Extend as modules grow. */
const STATUS_TONE: Record<string, Tone> = {
  // Case / filing lifecycle
  "on track": "success",
  approved: "success",
  verified: "success",
  active: "info",
  filed: "info",
  "in review": "warning",
  "action needed": "warning",
  waiting: "neutral",
  overdue: "error",
  refused: "error",
};

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-success-soft text-success-text",
  warning: "bg-warning-soft text-warning-text",
  error: "bg-error-soft text-error-text",
  info: "bg-info-soft text-info-text",
  neutral: "bg-muted text-muted-foreground",
};

type StatusBadgeProps = {
  status: string;
  /** Escape hatch: force a tone when the status text is unusual */
  tone?: Tone;
  className?: string;
};

export function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  const resolved: Tone = tone ?? STATUS_TONE[status.toLowerCase()] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONE_CLASSES[resolved],
        className
      )}
    >
      {status}
    </span>
  );
}