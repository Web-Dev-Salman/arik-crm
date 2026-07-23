export type StaffDashboardData = {
  kpis: {
    activeCases: number;
    activeDelta: number;
    approvalRate: number;
    newLeads: number;
    overdueFilings: number;
  };
  pipeline: { stage: string; count: number }[];
  revenueTrend: { month: string; retainers: number }[];
  deadlines: {
    caseRef: string;
    client: string;
    item: string;
    due: string;       // ISO date
    tone: "warning" | "error" | "info";
  }[];
};