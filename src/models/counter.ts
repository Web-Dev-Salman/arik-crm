import mongoose, { Schema, type Model } from "mongoose";

const counterSchema = new Schema({
  _id: { type: String, required: true },   // e.g. "case"
  seq: { type: Number, default: 0 },
});

type CounterDoc = { _id: string; seq: number };

export const Counter: Model<CounterDoc> =
  mongoose.models.Counter || mongoose.model<CounterDoc>("Counter", counterSchema);

/** Atomically returns the next number in a named sequence. */
export async function nextSequence(name: string) {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc!.seq;
}