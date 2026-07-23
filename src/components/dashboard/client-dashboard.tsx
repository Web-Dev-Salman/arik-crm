import { Upload, FileText, CreditCard, Video, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { JourneyRail } from "@/components/shared/journey-rail";
import { getClientDashboardData } from "@/modules/dashboard/service";

const kindIcon = { upload: Upload, form: FileText, payment: CreditCard };
const modeIcon = { video: Video, phone: Phone, office: MapPin };

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export async function ClientDashboard({ firstName }: { firstName: string }) {
  const data = await getClientDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            {data.caseRef} · {data.program}
          </p>
        </div>
        <StatusBadge tone={data.status.tone}>{data.status.label}</StatusBadge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Your application progress</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <JourneyRail stages={data.stages} current={data.currentStage} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Action needed from you
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            {data.outstanding.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing needed right now — we'll notify you when something comes up.
              </p>
            ) : (
              data.outstanding.map((item) => {
                const Icon = kindIcon[item.kind];
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{item.label}</div>
                      {item.due && (
                        <div className="text-xs text-muted-foreground">
                          Due {new Date(item.due).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                        </div>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      {item.kind === "upload" ? "Upload" : item.kind === "payment" ? "Pay" : "Complete"}
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Next appointment</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              {data.nextAppointment ? (
                <div className="flex items-start gap-3">
                  {(() => {
                    const Icon = modeIcon[data.nextAppointment.mode];
                    return (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-info-soft text-info-text">
                        <Icon className="size-4" />
                      </div>
                    );
                  })()}
                  <div>
                    <div className="text-sm font-medium">{data.nextAppointment.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatWhen(data.nextAppointment.when)}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Your consultant</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="text-sm font-medium">{data.consultant.name}</div>
              <div className="text-xs text-muted-foreground">{data.consultant.title}</div>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Send a message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}