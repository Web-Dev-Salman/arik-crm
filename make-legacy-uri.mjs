import { Resolver } from "node:dns/promises";

const r = new Resolver();
r.setServers(["8.8.8.8"]); // ask Google directly, bypassing the local proxy

const base = "arik-crm-dev.3ruqcd1.mongodb.net";
const srv = await r.resolveSrv(`_mongodb._tcp.${base}`);
const txt = await r.resolveTxt(base);

const hosts = srv.map((s) => `${s.name}:${s.port}`).join(",");
const params = txt.flat().join("");

console.log("\nPaste this into .env.local (replace YOUR_PASSWORD):\n");
console.log(
  `MONGODB_URI=mongodb://arik_dev:YOUR_PASSWORD@${hosts}/arik-crm?ssl=true&${params}`
);