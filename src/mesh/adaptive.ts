/**
 * Variable Schichthöhe (wie „Adaptiv“ in Bambu Studio / OrcaSlicer):
 * fein, wo flache Schrägen und Rundungen Treppenstufen zeigen würden, grob an senkrechten Wänden.
 */
import type { Mesh } from './mesh';

export interface LayerRange {
  from: number;
  to: number;
  layer?: number;
  infill?: number; // 0–1
  walls?: number;
}

export const LAYER_STEPS = [0.08, 0.12, 0.16, 0.2, 0.24, 0.28];

export function adaptiveRanges(m: Mesh, quality = 0.12, minH = 0.08, maxH = 0.28, bin = 0.5): LayerRange[] {
  let zMin = Infinity,
    zMax = -Infinity;
  for (let i = 2; i < m.pos.length; i += 3) {
    zMin = Math.min(zMin, m.pos[i]);
    zMax = Math.max(zMax, m.pos[i]);
  }
  if (!Number.isFinite(zMin) || zMax - zMin < 1) return [];
  const n = Math.ceil((zMax - zMin) / bin);
  const need = new Float64Array(n).fill(maxH);
  const P = m.pos,
    T = m.tri;
  for (let t = 0; t < T.length; t += 3) {
    const a = T[t] * 3,
      b = T[t + 1] * 3,
      c = T[t + 2] * 3;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
    const vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz);
    if (len < 1) continue; // winzige Dreiecke (Fläche < 0,5 mm²) ignorieren
    const az = Math.abs(nz / len);
    if (az > 0.995 || az < 0.05) continue; // waagerecht oder senkrecht: keine Treppenstufen
    const h = Math.min(maxH, Math.max(minH, quality / az));
    const z0 = Math.min(P[a + 2], P[b + 2], P[c + 2]),
      z1 = Math.max(P[a + 2], P[b + 2], P[c + 2]);
    for (let i = Math.max(0, Math.floor((z0 - zMin) / bin)); i <= Math.min(n - 1, Math.floor((z1 - zMin) / bin)); i++) if (h < need[i]) need[i] = h;
  }
  // auf feste Stufen runden (abwärts = sicher fein genug), zu Bereichen zusammenfassen
  const q = (h: number) => [...LAYER_STEPS].reverse().find((s) => s <= h + 1e-9) ?? minH;
  const out: LayerRange[] = [];
  for (let i = 0; i < n; i++) {
    const h = q(need[i]);
    const from = zMin + i * bin,
      to = Math.min(zMax, from + bin);
    const last = out[out.length - 1];
    if (last && last.layer === h) last.to = to;
    else out.push({ from, to, layer: h });
  }
  // sehr kurze Bereiche (< 1 mm) dem feineren Nachbarn zuschlagen
  for (let i = 0; i < out.length; i++) {
    if (out[i].to - out[i].from >= 1 || out.length < 2) continue;
    const prev = out[i - 1],
      next = out[i + 1];
    const tgt = !prev ? next : !next ? prev : (prev.layer ?? 1) <= (next.layer ?? 1) ? prev : next;
    tgt.from = Math.min(tgt.from, out[i].from);
    tgt.to = Math.max(tgt.to, out[i].to);
    tgt.layer = Math.min(tgt.layer ?? 1, out[i].layer ?? 1);
    out.splice(i, 1);
    i = -1;
  }
  return out.map((r) => ({ ...r, from: Math.round(r.from * 100) / 100, to: Math.round(r.to * 100) / 100 }));
}

/** Nutzer-Höhenbereiche über die (adaptiven) Schichtbereiche legen. */
export function mergeRanges(base: LayerRange[], user: LayerRange[], height: number): LayerRange[] {
  const cuts = new Set<number>([0, height]);
  for (const r of [...base, ...user]) {
    cuts.add(Math.max(0, Math.min(height, r.from)));
    cuts.add(Math.max(0, Math.min(height, r.to)));
  }
  const zs = [...cuts].sort((a, b) => a - b);
  const out: LayerRange[] = [];
  for (let i = 0; i < zs.length - 1; i++) {
    const a = zs[i],
      b = zs[i + 1];
    if (b - a < 1e-6) continue;
    const mid = (a + b) / 2;
    const u = [...user].reverse().find((r) => r.from <= mid && r.to >= mid);
    const ba = base.find((r) => r.from <= mid && r.to >= mid);
    const layer = u?.layer ?? ba?.layer;
    const r: LayerRange = { from: a, to: b, ...(layer ? { layer } : {}), ...(u?.infill !== undefined ? { infill: u.infill } : {}), ...(u?.walls !== undefined ? { walls: u.walls } : {}) };
    if (r.layer === undefined && r.infill === undefined && r.walls === undefined) continue;
    const last = out[out.length - 1];
    if (last && Math.abs(last.to - a) < 1e-6 && last.layer === r.layer && last.infill === r.infill && last.walls === r.walls) last.to = b;
    else out.push(r);
  }
  return out;
}

/** Anzahl Schichten mit Bereichen (für die Zeitschätzung). */
export function layerCount(height: number, base: number, ranges: LayerRange[]): number {
  let n = 0,
    covered = 0;
  for (const r of ranges) {
    const len = Math.max(0, Math.min(height, r.to) - Math.max(0, r.from));
    covered += len;
    n += len / (r.layer ?? base);
  }
  return Math.round(n + Math.max(0, height - covered) / base);
}
