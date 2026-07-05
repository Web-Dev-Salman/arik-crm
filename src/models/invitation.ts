import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const invitationSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ["staff", "client", "corporate"],
      required: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// TTL index: MongoDB itself deletes expired, unaccepted invitations.
// Accepted invitations are kept forever as an audit trail.
invitationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { acceptedAt: null } }
);

export type InvitationDoc = InferSchemaType<typeof invitationSchema>;

export const Invitation: Model<InvitationDoc> =
  mongoose.models.Invitation ||
  mongoose.model<InvitationDoc>("Invitation", invitationSchema);
