import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const workflowTemplateSchema = new Schema(
  {
    programCode: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    stages: [{ type: String, required: true }],
    checklist: [
      {
        label: { type: String, required: true },
        stage: { type: Number, default: 0 },   // stage index this item belongs to
        required: { type: Boolean, default: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type WorkflowTemplateDoc = InferSchemaType<typeof workflowTemplateSchema>;

export const WorkflowTemplate: Model<WorkflowTemplateDoc> =
  mongoose.models.WorkflowTemplate ||
  mongoose.model<WorkflowTemplateDoc>("WorkflowTemplate", workflowTemplateSchema);