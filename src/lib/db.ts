import mongoose from "mongoose";
import { Resolver } from "node:dns";
import { promisify } from "node:util";

// ——— Explicit DNS: resolve everything ourselves via public DNS ———
// (System resolver on this machine is broken: stuck on 127.0.0.1.)
const resolver = new Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);
const resolveSrv = promisify(resolver.resolveSrv.bind(resolver));
const resolveTxt = promisify(resolver.resolveTxt.bind(resolver));
const resolve4 = promisify(resolver.resolve4.bind(resolver));

function customLookup(
  hostname: string,
  options: any,
  callback: (err: any, address?: any, family?: number) => void
) {
  resolve4(hostname)
    .then((addresses) => {
      if (!addresses?.length) return callback(new Error("ENOTFOUND " + hostname));
      if (options?.all) {
        return callback(null, addresses.map((address) => ({ address, family: 4 })));
      }
      callback(null, addresses[0], 4);
    })
    .catch(callback);
}

// Convert mongodb+srv:// to a classic mongodb:// URI by doing the SRV/TXT
// lookups ourselves — after this, NOTHING in the driver needs SRV.
async function toStandardUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const u = new URL(uri);
  const [srv, txt] = await Promise.all([
    resolveSrv(`_mongodb._tcp.${u.hostname}`),
    resolveTxt(u.hostname),
  ]);

  const hosts = srv.map((s) => `${s.name}:${s.port}`).join(",");
  const params = new URLSearchParams(u.search);
  new URLSearchParams(txt.flat().join("")).forEach((v, k) => {
    if (!params.has(k)) params.set(k, v); // TXT supplies replicaSet & authSource
  });
  if (!params.has("tls") && !params.has("ssl")) params.set("tls", "true");

  const auth = u.username ? `${u.username}:${u.password}@` : "";
  const dbPath = u.pathname && u.pathname !== "" ? u.pathname : "/";
  const standard = `mongodb://${auth}${hosts}${dbPath}?${params.toString()}`;
  console.log(`[db] SRV resolved via 8.8.8.8 → ${srv.length} hosts, replicaSet=${params.get("replicaSet")}`);
  return standard;
}
// ————————————————————————————————————————————————————————————————

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

const cached = (global as any).mongoose ?? { conn: null, promise: null };
(global as any).mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = (async () => {
      const uri = await toStandardUri(MONGODB_URI!);
      return mongoose.connect(uri, {
        bufferCommands: false,
        lookup: customLookup,
      } as any);
    })();
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // never cache a failed attempt
    throw err;
  }
  return cached.conn;
}