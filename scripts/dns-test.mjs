import dns from "node:dns/promises";
import net from "node:net";

const SRV = "_mongodb._tcp.arik-crm-dev.3ruqcd1.mongodb.net";
const HOST = "arik-crm-dev-shard-00-00.3ruqcd1.mongodb.net";

console.log("Current DNS servers:", dns.getServers().join(", "));

// Test 1: SRV via system DNS
try {
  const r = await dns.resolveSrv(SRV);
  console.log("TEST 1  system DNS SRV:  PASS —", r.length, "records");
} catch (e) {
  console.log("TEST 1  system DNS SRV:  FAIL —", e.code);
}

// Test 2: SRV via Google DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  const r = await dns.resolveSrv(SRV);
  console.log("TEST 2  Google DNS SRV:  PASS —", r.length, "records");
} catch (e) {
  console.log("TEST 2  Google DNS SRV:  FAIL —", e.code);
}

// Test 3: can we even reach a Mongo server on port 27017?
await new Promise((done) => {
  const s = net.createConnection({ host: HOST, port: 27017, timeout: 7000 });
  s.on("connect", () => { console.log("TEST 3  TCP port 27017:  PASS — reachable"); s.destroy(); done(); });
  s.on("timeout", () => { console.log("TEST 3  TCP port 27017:  FAIL — timeout (port likely blocked)"); s.destroy(); done(); });
  s.on("error", (e) => { console.log("TEST 3  TCP port 27017:  FAIL —", e.code); done(); });
});