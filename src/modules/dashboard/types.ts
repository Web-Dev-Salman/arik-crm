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


export type ClientDashboardData = {
  caseRef: string;
  program: string;
  stages: string[];
  currentStage: number; // index into stages
  status: { label: string; tone: "info" | "success" | "warning" | "error" };
  outstanding: {
    id: string;
    label: string;
    kind: "upload" | "form" | "payment";
    due?: string; // ISO
  }[];
  nextAppointment?: {
    title: string;
    when: string; // ISO datetime
    mode: "video" | "phone" | "office";
  };
  consultant: { name: string; title: string; email: string };
};

export type CorporateDashboardData = {
  company: string;
  kpis: {
    sponsoredEmployees: number;
    activeApplications: number;
    permitsExpiring90d: number;
    complianceScore: number; // percentage
  };
  roster: {
    id: string;
    name: string;
    position: string;
    program: string;
    stages: string[];
    currentStage: number;
    status: { label: string; tone: "info" | "success" | "warning" | "error" };
  }[];
  alerts: {
    id: string;
    employee: string;
    message: string;
    severity: "warning" | "error";
    due: string; // ISO
  }[];
};

export type HomeData = {
  todaysEvents: { id: string; time: string; title: string; mode: "video" | "phone" | "office" }[];
  priorityCases: { caseRef: string; client: string; note: string; tone: "warning" | "error" | "info" }[];
  recentActivity: { id: string; text: string; when: string }[];
};