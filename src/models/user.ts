import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // "Ada@X.com" and "ada@x.com" are the same person
      trim: true,
    },
    passwordHash: { type: String, select: false }, // never returned by queries unless explicitly selected
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["staff", "client", "corporate"],
      required: true,
    },
    staffRole: {
      type: String,
      enum: ["admin", "consultant"],
      // only meaningful when role === "staff"
    },
    contactId: { type: Schema.Types.ObjectId, ref: "Contact" },
    corporateAccountId: { type: Schema.Types.ObjectId, ref: "CorporateAccount" },
    status: {
      type: String,
      enum: ["invited", "active", "disabled"],
      default: "invited",
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// ——— Password helpers live ON the model, so hashing can never be forgotten ———
userSchema.methods.setPassword = async function (plain: string) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

userSchema.methods.verifyPassword = async function (plain: string) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plain, this.passwordHash);
};

export type UserDoc = InferSchemaType<typeof userSchema> & {
  setPassword(plain: string): Promise<void>;
  verifyPassword(plain: string): Promise<boolean>;
};

export const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", userSchema);
