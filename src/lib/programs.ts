export type Region = "canada" | "usa" | "europe";

export type Program = {
  code: string;
  label: string;
  region: Region;
  category: string;
};

export const PROGRAMS: Program[] = [
  // Canada
  { code: "ee_fsw",       label: "Express Entry — Federal Skilled Worker", region: "canada", category: "Permanent residence" },
  { code: "ee_cec",       label: "Express Entry — Canadian Experience Class", region: "canada", category: "Permanent residence" },
  { code: "ee_fst",       label: "Express Entry — Federal Skilled Trades", region: "canada", category: "Permanent residence" },
  { code: "pnp",          label: "Provincial Nominee Program", region: "canada", category: "Permanent residence" },
  { code: "family_spon",  label: "Family Sponsorship", region: "canada", category: "Family" },
  { code: "study_permit", label: "Study Permit", region: "canada", category: "Temporary" },
  { code: "work_permit",  label: "Work Permit", region: "canada", category: "Temporary" },
  { code: "lmia",         label: "LMIA — Employer application", region: "canada", category: "Corporate" },
  { code: "ica_transfer", label: "Intra-Company Transfer", region: "canada", category: "Corporate" },
  { code: "visitor",      label: "Visitor Visa", region: "canada", category: "Temporary" },
  { code: "citizenship",  label: "Citizenship Application", region: "canada", category: "Citizenship" },
  // USA
  { code: "h1b",          label: "H-1B Specialty Occupation", region: "usa", category: "Work" },
  { code: "l1",           label: "L-1 Intra-Company Transfer", region: "usa", category: "Work" },
  { code: "eb1",          label: "EB-1 Priority Worker", region: "usa", category: "Permanent residence" },
  { code: "eb2_niw",      label: "EB-2 National Interest Waiver", region: "usa", category: "Permanent residence" },
  { code: "eb3",          label: "EB-3 Skilled Worker", region: "usa", category: "Permanent residence" },
  { code: "f1",           label: "F-1 Student Visa", region: "usa", category: "Study" },
  { code: "family_us",    label: "Family-Based Petition", region: "usa", category: "Family" },
  { code: "asylum_us",    label: "Asylum / Humanitarian", region: "usa", category: "Humanitarian" },
  // Europe
  { code: "eu_blue_card", label: "EU Blue Card", region: "europe", category: "Work" },
  { code: "de_permit",    label: "Germany National Work Permit", region: "europe", category: "Work" },
  { code: "pt_d7",        label: "Portugal D7 Passive Income Visa", region: "europe", category: "Residence" },
  { code: "uk_skilled",   label: "UK Skilled Worker Visa", region: "europe", category: "Work" },
];

export const programByCode = (code: string) => PROGRAMS.find((p) => p.code === code);

export const regionLabels: Record<Region, string> = {
  canada: "Canada", usa: "United States", europe: "Europe",
};