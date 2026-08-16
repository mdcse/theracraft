import mongoose from "mongoose";

/**
 * MongoDB connection helper.
 *
 * In development, Next.js hot-reloads a lot, which would open a brand-new
 * database connection on every reload and eventually exhaust the pool.
 * To avoid that, we cache the connection on Node's global object and reuse it.
 */

const MONGODB_URI = process.env.MONGODB_URI;

// Reuse a cached connection across hot reloads / serverless invocations.
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (and to Vercel env vars)."
    );
  }

  // Already connected — reuse it.
  if (cached.conn) return cached.conn;

  // A connection is in progress — wait for it instead of starting another.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
