import { dbConnect } from "@/lib/db";
import { ApiError } from "@/lib/api";
import { CaseModel } from "@/models/case";
import { Contact } from "@/models/contact";
import { WorkflowTemplate } from "@/models/workflow-template";
import { nextSequence } from "@/models/counter";
import { programByCode } from "@/lib/programs";
import type { CreateCaseInput, ListCasesQuery } from "./schema";

const RESTRICTED_PROGRAMS = ["asylum_us"];   // blueprint §7: humanitarian = restricted by default

export async function createCase(input: CreateCaseInput, createdBy: string) {
  await dbConnect();

  const contact = await Contact.findOne({ _id: input.contactId, deletedAt: null });
  if (!contact) throw new ApiError("CONTACT_NOT_FOUND", "Contact not found", 404);

  const program = programByCode(input.programCode);
  if (!program) throw new ApiError("PROGRAM_UNKNOWN", "Unknown program", 400);

  const template = await WorkflowTemplate.findOne({
    programCode: input.programCode,
    isActive: true,
  });
  if (!template)
    throw new ApiError(
      "TEMPLATE_MISSING",
      `No workflow template exists for ${program.label} yet`,
      400
    );

  const seq = await nextSequence("case");
  const reference = `AIC-${String(2000 + seq).padStart(4, "0")}`;

  // Contact segment decides case segment; partners can't have cases.
  const segment =
    contact.segment === "corporate" ? "corporate" :
    contact.segment === "prospect" ? "prospect" : "client";

  const created = await CaseModel.create({
    reference,
    contactId: contact._id,
    corporateAccountId: contact.corporateAccountId,
    segment,
    programCode: program.code,
    programLabel: program.label,
    region: program.region,
    // ——— STAMPED copies, not references ———
    stages: [...template.stages],
    checklist: template.checklist.map((c) => ({
      label: c.label,
      stage: c.stage,
      required: c.required,
      status: "pending",
    })),
    currentStage: 0,
    stageHistory: [{ stage: 0, enteredAt: new Date(), byUserId: createdBy }],
    priority: input.priority,
    targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
    assigneeIds: input.assigneeIds,
    sensitivity: RESTRICTED_PROGRAMS.includes(program.code) ? "restricted" : "normal",
    createdBy,
  });

  return created.toObject();
}

export async function listCases(query: ListCasesQuery) {
  await dbConnect();

  const filter: Record<string, unknown> = { deletedAt: null };
  if (query.segment) filter.segment = query.segment;
  if (query.status) filter.status = query.status;

  const [rows, total] = await Promise.all([
    CaseModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .populate("contactId", "name email segment")   // join the contact's name
      .lean(),
    CaseModel.countDocuments(filter),
  ]);

  // Text search on the joined contact name has to happen after populate.
  const items = query.q
    ? rows.filter((r: any) =>
        [r.reference, r.programLabel, r.contactId?.name]
          .join(" ")
          .toLowerCase()
          .includes(query.q!.toLowerCase())
      )
    : rows;

  return {
    items,
    meta: { page: query.page, total, pages: Math.ceil(total / query.limit) },
  };
}