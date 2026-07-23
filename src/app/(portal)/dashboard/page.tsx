import { auth } from "@/lib/auth";
import { StaffDashboard } from "@/components/dashboard/staff-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const role = session?.user?.role;

  if (role === "staff") return <StaffDashboard firstName={firstName} />;

  // Client & Corporate variants arrive in the next two steps —
  // honest placeholder until then:
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Welcome, {firstName} 👋</h1>
      <p className="text-sm text-muted-foreground">
        Your {role} dashboard is coming in the next build step.
      </p>
    </div>
  );
}