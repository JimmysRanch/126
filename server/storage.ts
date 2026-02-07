import fs from "node:fs";
import path from "node:path";

type StoreShape = {
  salons: Record<string, { stripeAccountId?: string; lastWebhookAt?: number; lastEvents?: { id: string; type: string; created: number }[] }>;
};

const DATA_DIR = path.join(process.cwd(), "server", ".data");
const FILE = path.join(DATA_DIR, "store.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ salons: {} } satisfies StoreShape, null, 2));
}

export function readStore(): StoreShape {
  ensure();
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
export function writeStore(next: StoreShape) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2));
}
export function getSalon(salonId: string) {
  const s = readStore();
  return s.salons[salonId] ?? {};
}
export function upsertSalon(salonId: string, patch: Partial<StoreShape["salons"][string]>) {
  const s = readStore();
  s.salons[salonId] = { ...(s.salons[salonId] ?? {}), ...patch };
  writeStore(s);
  return s.salons[salonId];
}
export function pushEvent(salonId: string, evt: { id: string; type: string; created: number }) {
  const s = readStore();
  const cur = s.salons[salonId] ?? {};
  const arr = cur.lastEvents ?? [];
  const nextArr = [evt, ...arr].slice(0, 20);
  s.salons[salonId] = { ...cur, lastEvents: nextArr, lastWebhookAt: Date.now() };
  writeStore(s);
}
