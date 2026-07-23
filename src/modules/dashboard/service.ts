import type { StaffDashboardData, ClientDashboardData, CorporateDashboardData, HomeData, } from "./types";
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
// MOCK — becomes a real query scoped by session.contactId in Week 7.
export async function getClientDashboardData(): Promise<ClientDashboardData> {
  return {
    caseRef: "AIC-2417",
    program: "Express Entry — Canadian Experience Class",
    stages: ["Consultation", "Forms", "File submitted", "IRCC review", "Decision"],
    currentStage: 2,
    status: { label: "On track", tone: "success" },
    outstanding: [
      { id: "1", label: "Upload passport bio page", kind: "upload", due: "2026-07-16" },
      { id: "2", label: "Confirm current address", kind: "form" },
      { id: "3", label: "Second retainer installment", kind: "payment", due: "2026-07-20" },
    ],
    nextAppointment: {
      title: "Document review call",
      when: "2026-07-15T16:00:00",
      mode: "video",
    },
    consultant: {
      name: "Arik Admin",
      title: "Senior Consultant, RCIC",
      email: "admin@arikconsulting.ca",
    },
  };
}

export async function getCorporateDashboardData(): Promise<CorporateDashboardData> {
  const lmiaStages = ["Retainer", "LMIA filed", "Approval", "Work permits", "Complete"];
  return {
    company: "NorQuest Logistics",
    kpis: {
      sponsoredEmployees: 14,
      activeApplications: 9,
      permitsExpiring90d: 3,
      complianceScore: 96,
    },
    roster: [
      { id: "1", name: "Rahim Uddin", position: "Long-haul driver", program: "LMIA Work Permit", stages: lmiaStages, currentStage: 2, status: { label: "On track", tone: "success" } },
      { id: "2", name: "Elena Petrova", position: "Dispatch lead", program: "LMIA Work Permit", stages: lmiaStages, currentStage: 1, status: { label: "Docs needed", tone: "warning" } },
      { id: "3", name: "Carlos Mendez", position: "Fleet mechanic", program: "PNP — AAIP", stages: ["Retainer", "Nomination", "PR filed", "Decision"], currentStage: 2, status: { label: "IRCC review", tone: "info" } },
      { id: "4", name: "Wei Zhang", position: "Logistics analyst", program: "Work Permit renewal", stages: ["Filed", "Biometrics", "Decision"], currentStage: 0, status: { label: "Permit expiring", tone: "error" } },
    ],
    alerts: [
      { id: "a1", employee: "Wei Zhang", message: "Work permit expires — renewal filed, biometrics pending", severity: "error", due: "2026-08-30" },
      { id: "a2", employee: "Rahim Uddin", message: "Medical exam result expires soon", severity: "warning", due: "2026-09-15" },
      { id: "a3", employee: "Elena Petrova", message: "Employment contract copy required for LMIA", severity: "warning", due: "2026-07-19" },
    ],
  };
}

export type HomeData = {
  todaysEvents: { id: string; time: string; title: string; mode: "video" | "phone" | "office" }[];
  priorityCases: { caseRef: string; client: string; note: string; tone: "warning" | "error" | "info" }[];
  recentActivity: { id: string; text: string; when: string }[];
};
// MOCK — Home aggregates events (Week 11), cases (Week 7), audit log (Week 8).
export async function getHomeData(): Promise<HomeData> {
  return {
    todaysEvents: [
      { id: "1", time: "10:30", title: "Initial consult — Daniel Mensah", mode: "video" },
      { id: "2", time: "14:00", title: "AAIP strategy — Chen Wei", mode: "phone" },
      { id: "3", time: "16:00", title: "Document review — Priya Raghavan", mode: "video" },
    ],
    priorityCases: [
      { caseRef: "AIC-2398", client: "Chen Wei", note: "AAIP response due tomorrow", tone: "error" },
      { caseRef: "AIC-2417", client: "Priya Raghavan", note: "PR forms ready for final review", tone: "warning" },
      { caseRef: "AIC-2385", client: "NorQuest Logistics", note: "3 of 12 LMIA files incomplete", tone: "warning" },
    ],
    recentActivity: [
      { id: "1", text: "Mateus Ferreira uploaded biometrics confirmation", when: "25m ago" },
      { id: "2", text: "New prospect from website assessment — est. CRS 471", when: "2h ago" },
      { id: "3", text: "Sofia Ricci case marked Approved 🎉", when: "yesterday" },
    ],
  };
}