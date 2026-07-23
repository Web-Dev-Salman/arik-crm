import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const contactSchema = new Schema(
  {
    kind: { type: String, enum: ["person", "organization"], default: "person" },
    segment: {
      type: String,
      enum: ["client", "prospect", "corporate", "partner"],
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },      // "Dhaka, BD" — display string for now
    tags: [{ type: String, trim: true }],
    corporateAccountId: { type: Schema.Types.ObjectId, ref: "CorporateAccount" },
    source: {
      type: String,
      enum: ["manual", "website_assessment", "referral", "whatsapp", "other"],
      default: "manual",
    },
    assessment: {
      // filled by the /assess wizard (Step 3) — the WordPress lead payload
      destination: String,
      program: String,
      estimatedScore: Number,
      answers: Schema.Types.Mixed,
    },
    notes: { type: String },
    deletedAt: { type: Date, default: null },     // soft delete, per blueprint §3.1
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

contactSchema.index({ name: "text", email: "text" });     // powers search
contactSchema.index({ segment: 1, deletedAt: 1, createdAt: -1 });

export type ContactDoc = InferSchemaType<typeof contactSchema>;

export const Contact: Model<ContactDoc> =
  mongoose.models.Contact || mongoose.model<ContactDoc>("Contact", contactSchema);