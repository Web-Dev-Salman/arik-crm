import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login"); // belt AND braces — proxy is the belt

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        user={{
          name: session.user.name ?? "User",
          role: session.user.role,
          staffRole: session.user.staffRole,
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}