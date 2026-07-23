import { auth } from "@/lib/auth";
import { StaffDashboard } from "@/components/dashboard/staff-dashboard";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { CorporateDashboard } from "@/components/dashboard/corporate-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const role = session?.user?.role;

  if (role === "client") return <ClientDashboard firstName={firstName} />;
  if (role === "corporate") return <CorporateDashboard firstName={firstName} />;
  return <StaffDashboard firstName={firstName} />;
}