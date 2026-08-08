import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const caseSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true },   // "AIC-2417"
    contactId: { type: Schema.Types.ObjectId, ref: "Contact", required: true, index: true },
    corporateAccountId: { type: Schema.Types.ObjectId, ref: "CorporateAccount", index: true },
    segment: {
      type: String,
      enum: ["client", "prospect", "corporate"],
      required: true,
      index: true,
    },

    programCode: { type: String, required: true },
    programLabel: { type: String, required: true },   // denormalized for display
    region: { type: String, enum: ["canada", "usa", "europe"], required: true },

    // STAMPED from the template at creation — never re-read from the template
    stages: [{ type: String, required: true }],
    currentStage: { type: Number, default: 0 },
    stageHistory: [
      {
        stage: Number,
        enteredAt: { type: Date, default: Date.now },
        byUserId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    checklist: [
      {
        label: { type: String, required: true },
        stage: { type: Number, default: 0 },
        required: { type: Boolean, default: true },
        status: {
          type: String,
          enum: ["pending", "uploaded", "approved", "rejected"],
          default: "pending",
        },
        documentId: { type: Schema.Types.ObjectId, ref: "Document" },
        updatedAt: Date,
      },
    ],

    status: {
      type: String,
      enum: ["active", "on_hold", "approved", "refused", "withdrawn", "closed"],
      default: "active",
      index: true,
    },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    sensitivity: { type: String, enum: ["normal", "restricted"], default: "normal" },

    assigneeIds: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    targetDate: { type: Date },
    estimatedScore: { type: Number },     // CRS, when relevant

    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

caseSchema.index({ segment: 1, status: 1, deletedAt: 1, createdAt: -1 });
caseSchema.index({ reference: "text" });

export type CaseDoc = InferSchemaType<typeof caseSchema>;

export const CaseModel: Model<CaseDoc> =
  mongoose.models.Case || mongoose.model<CaseDoc>("Case", caseSchema);