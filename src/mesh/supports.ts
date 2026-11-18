/**
 * Vereinfachte Stützen-Vorschau: unter jeder Überhangfläche senkrechte Säulen bis zur
 * nächsten Fläche darunter (oder zum Bett) – wie „normale“ Stützen im Slicer.
 */
import type { Mesh } from './mesh';

export interface SupportColumn {
  x: number;
  y: number;
  z0: number;
  z1: number;
}

export function supportColumns(parts: { mesh: Mesh; flags: Uint8Array }[], cell = 2.5, gap = 0.2, maxCols = 2500): SupportColumn[] {
  // 1) Nach oben zeigende Flächen in ein XY-Raster eintragen (für die Suche „was liegt darunter?“)
  type Tri = [number, number, number, number, number, number, number, number, number];
  const ups: Tri[] = [];
  const top = new Map<string, { x: number; y: number; z: number }>();
  for (const { mesh, flags } of parts) {
    const P = mesh.pos,
      T = mesh.tri;
    for (let t = 0; t < T.length; t += 3) {
      const a = T[t] * 3,
        b = T[t + 1] * 3,
        c = T[t + 2] * 3;
      const ax = P[a], ay = P[a + 1], az = P[a + 2];
      const bx = P[b], by = P[b + 1], bz = P[b + 2];
      const cx = P[c], cy = P[c + 1], cz = P[c + 2];
      const nz = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      if (nz > 1e-9) ups.push([ax, ay, az, bx, by, bz, cx, cy, cz]);
      if (flags[t / 3] !== 1) continue;
      // 2) Überhangdreieck abtasten (Rasterpunkte innerhalb des Dreiecks + Schwerpunkt)
      const x0 = Math.floor(Math.min(ax, bx, cx) / cell),
        x1 = Math.floor(Math.max(ax, bx, cx) / cell);
      const y0 = Math.floor(Math.min(ay, by, cy) / cell),
        y1 = Math.floor(Math.max(ay, by, cy) / cell);
      const samples: [number, number][] = [[(ax + bx + cx) / 3, (ay + by + cy) / 3]];
      for (let i = x0; i <= x1; i++) for (let j = y0; j <= y1; j++) samples.push([(i + 0.5) * cell, (j + 0.5) * cell]);
      for (const [x, y] of samples) {
        const z = zOn(x, y, ax, ay, az, bx, by, bz, cx, cy, cz);
        if (z === null) continue;
        const k = `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
        const cur = top.get(k);
        // tiefste Überhangstelle je Zelle zählt (dort beginnt die Stütze)
        if (!cur || z < cur.z) top.set(k, { x: (Math.floor(x / cell) + 0.5) * cell, y: (Math.floor(y / cell) + 0.5) * cell, z });
      }
    }
  }
  const grid = new Map<string, number[]>();
  ups.forEach((t, i) => {
    const x0 = Math.floor(Math.min(t[0], t[3], t[6]) / cell),
      x1 = Math.floor(Math.max(t[0], t[3], t[6]) / cell);
    const y0 = Math.floor(Math.min(t[1], t[4], t[7]) / cell),
      y1 = Math.floor(Math.max(t[1], t[4], t[7]) / cell);
    if ((x1 - x0 + 1) * (y1 - y0 + 1) > 4000) return;
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++) {
        const k = `${x},${y}`;
        let l = grid.get(k);
        if (!l) grid.set(k, (l = []));
        l.push(i);
      }
  });
  const out: SupportColumn[] = [];
  for (const [k, p] of top) {
    if (out.length >= maxCols) break;
    let floor = 0;
    for (const i of grid.get(k) ?? []) {
      const t = ups[i];
      const z = zOn(p.x, p.y, ...t);
      if (z !== null && z < p.z - 0.05 && z > floor) floor = z;
    }
    if (p.z - floor > 0.6) out.push({ x: p.x, y: p.y, z0: floor, z1: p.z - gap });
  }
  return out;
}

/** Höhe der Dreiecksebene über (x, y), falls der Punkt im Dreieck liegt. */
function zOn(x: number, y: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number): number | null {
  const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
  if (Math.abs(d) < 1e-12) return null;
  const l1 = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d;
  const l2 = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
  const l3 = 1 - l1 - l2;
  if (l1 < -1e-6 || l2 < -1e-6 || l3 < -1e-6) return null;
  return l1 * az + l2 * bz + l3 * cz;
}
