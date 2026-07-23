import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const passwordResetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

passwordResetSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { usedAt: null } }
);

export type PasswordResetDoc = InferSchemaType<typeof passwordResetSchema>;

export const PasswordReset: Model<PasswordResetDoc> =
  mongoose.models.PasswordReset ||
  mongoose.model<PasswordResetDoc>("PasswordReset", passwordResetSchema);