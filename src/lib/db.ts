import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

// In development, Next.js hot-reloads modules on every save. Without caching,
// each reload would open a NEW database connection until Atlas hits its limit.
// We stash the connection on the global object, which survives reloads.
const cached = (global as any).mongoose ?? { conn: null, promise: null };
(global as any).mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn; // already connected -> reuse
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
