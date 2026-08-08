import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { WorkflowTemplate } from "@/models/workflow-template";
import { programByCode } from "@/lib/programs";

const TEMPLATES: Record<string, { stages: string[]; checklist: [string, number][] }> = {
  ee_cec: {
    stages: ["Consultation", "Documents", "Profile submitted", "ITA received", "PR application", "Decision"],
    checklist: [
      ["Passport bio page", 1], ["Language test results (IELTS/CELPIP)", 1],
      ["Educational Credential Assessment (ECA)", 1], ["Employment reference letters", 1],
      ["Proof of funds", 1], ["Police clearance certificate", 4],
      ["Medical examination", 4], ["Digital photo", 4],
    ],
  },
  ee_fsw: {
    stages: ["Consultation", "Documents", "Profile submitted", "ITA received", "PR application", "Decision"],
    checklist: [
      ["Passport bio page", 1], ["Language test results", 1], ["ECA report", 1],
      ["Employment reference letters", 1], ["Proof of funds", 1],
      ["Police clearance certificate", 4], ["Medical examination", 4],
    ],
  },
  pnp: {
    stages: ["Consultation", "Eligibility review", "Provincial application", "Nomination", "Federal PR", "Decision"],
    checklist: [
      ["Passport bio page", 1], ["Language test results", 1], ["ECA report", 1],
      ["Job offer / employment proof", 2], ["Provincial forms", 2],
      ["Settlement funds proof", 2], ["Police clearance", 4], ["Medical examination", 4],
    ],
  },
  study_permit: {
    stages: ["Consultation", "Documents", "Application filed", "Biometrics", "Decision"],
    checklist: [
      ["Passport bio page", 1], ["Letter of acceptance", 1],
      ["Proof of funds / GIC", 1], ["Statement of purpose", 1],
      ["Language test results", 1], ["Biometrics confirmation", 3],
    ],
  },
  work_permit: {
    stages: ["Consultation", "Documents", "Application filed", "Biometrics", "Decision"],
    checklist: [
      ["Passport bio page", 1], ["Job offer letter", 1], ["LMIA or exemption proof", 1],
      ["Employment history", 1], ["Biometrics confirmation", 3],
    ],
  },
  lmia: {
    stages: ["Retainer", "Recruitment evidence", "LMIA filed", "Approval", "Work permits", "Complete"],
    checklist: [
      ["Business registration documents", 1], ["Job advertisements proof", 1],
      ["Recruitment summary", 1], ["Employment contracts", 2],
      ["Transition plan", 2], ["Wage evidence", 2],
    ],
  },
  h1b: {
    stages: ["Consultation", "Documents", "LCA filed", "Petition filed", "Decision"],
    checklist: [
      ["Passport bio page", 1], ["Degree certificates + transcripts", 1],
      ["Employment offer letter", 1], ["Resume / CV", 1],
      ["Labor Condition Application", 2], ["Support letter from employer", 3],
    ],
  },
  eu_blue_card: {
    stages: ["Consultation", "Documents", "Application filed", "Decision", "Residence permit"],
    checklist: [
      ["Passport bio page", 1], ["University degree (recognized)", 1],
      ["Employment contract (salary threshold)", 1], ["Health insurance proof", 1],
      ["Proof of accommodation", 3],
    ],
  },
};

export async function GET() {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json({ success: false }, { status: 404 });

  await dbConnect();
  const results: string[] = [];

  for (const [code, t] of Object.entries(TEMPLATES)) {
    const program = programByCode(code);
    if (!program) continue;
    await WorkflowTemplate.findOneAndUpdate(
      { programCode: code },
      {
        $set: {
          label: program.label,
          stages: t.stages,
          checklist: t.checklist.map(([label, stage]) => ({ label, stage, required: true })),
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );
    results.push(code);
  }

  return NextResponse.json({ success: true, data: { seeded: results, count: results.length } });
}