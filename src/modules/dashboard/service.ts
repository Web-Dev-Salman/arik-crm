import type { StaffDashboardData } from "./types";

// MOCK — replaced by real aggregation queries when Cases exist (Week 7).
// Shape is the contract; the dashboard never knows the difference.
export async function getStaffDashboardData(): Promise<StaffDashboardData> {
  return {
    kpis: {
      activeCases: 148,
      activeDelta: 12,
      approvalRate: 98.2,
      newLeads: 36,
      overdueFilings: 4,
    },
    pipeline: [
      { stage: "Inquiry", count: 42 },
      { stage: "Assessment", count: 28 },
      { stage: "Consultation", count: 19 },
      { stage: "Retainer", count: 12 },
      { stage: "Filed", count: 31 },
      { stage: "Decision", count: 16 },
    ],
    revenueTrend: [
      { month: "Feb", retainers: 24500 },
      { month: "Mar", retainers: 28200 },
      { month: "Apr", retainers: 26800 },
      { month: "May", retainers: 31400 },
      { month: "Jun", retainers: 35100 },
      { month: "Jul", retainers: 33800 },
    ],
    deadlines: [
      { caseRef: "AIC-2417", client: "Priya Raghavan", item: "Submit PR forms", due: "2026-07-14", tone: "warning" },
      { caseRef: "AIC-2398", client: "Chen Wei", item: "AAIP response due", due: "2026-07-11", tone: "error" },
      { caseRef: "AIC-2385", client: "NorQuest Logistics", item: "LMIA documents", due: "2026-07-18", tone: "warning" },
      { caseRef: "AIC-2409", client: "Mateus Ferreira", item: "Biometrics booking", due: "2026-07-21", tone: "info" },
    ],
  };
}