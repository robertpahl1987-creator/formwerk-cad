/**
 * Mausohren (Brim-Ohren) gegen Ablösen an spitzen Ecken: dünne runde Scheiben auf dem Bett,
 * genau an konvexen Ecken der ersten Schicht. Werden nach dem Druck einfach abgebrochen.
 */
import type { Mesh } from './mesh';

export function earPoints(m: Mesh, maxAngle = 110, minEdge = 1.5, minDist = 8): [number, number][] {
  const P = m.pos,
    T = m.tri;
  // Dreiecke, die flach auf dem Bett liegen (z ≈ 0, Normale nach unten)
  const edges = new Map<string, [number, number]>();
  const key = (a: number, b: number) => `${a},${b}`;
  for (let t = 0; t < T.length; t += 3) {
    const a = T[t], b = T[t + 1], c = T[t + 2];
    if (P[a * 3 + 2] > 0.02 || P[b * 3 + 2] > 0.02 || P[c * 3 + 2] > 0.02) continue;
    for (const [u, v] of [
      [a, b],
      [b, c],
      [c, a],
    ])
      edges.set(key(u, v), [u, v]);
  }
  // Randkanten: Gegenrichtung fehlt
  const next = new Map<number, number>();
  for (const [u, v] of edges.values()) if (!edges.has(key(v, u))) next.set(u, v);
  const prev = new Map<number, number>();
  for (const [u, v] of next) prev.set(v, u);
  const out: [number, number][] = [];
  for (const [v, b] of next) {
    const a = prev.get(v);
    if (a === undefined) continue;
    const ax = P[v * 3] - P[a * 3], ay = P[v * 3 + 1] - P[a * 3 + 1];
    const bx = P[b * 3] - P[v * 3], by = P[b * 3 + 1] - P[v * 3 + 1];
    const la = Math.hypot(ax, ay),
      lb = Math.hypot(bx, by);
    if (la < minEdge || lb < minEdge) continue;
    // Bodenflächen zeigen nach unten → von oben gesehen läuft der Außenrand im Uhrzeigersinn; konvex = Rechtskurve
    const cross = ax * by - ay * bx;
    if (cross >= 0) continue;
    const inner = 180 - (Math.acos(Math.max(-1, Math.min(1, (ax * bx + ay * by) / (la * lb)))) * 180) / Math.PI;
    if (inner > maxAngle) continue;
    const p: [number, number] = [P[v * 3], P[v * 3 + 1]];
    if (out.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < minDist)) continue;
    out.push(p);
  }
  return out;
}

/** Flache Scheiben (geschlossene Netze) an den Punkten. */
export function earDiscs(points: [number, number][], d: number, h: number): Mesh {
  const N = 40;
  const pos: number[] = [];
  const tri: number[] = [];
  for (const [x, y] of points) {
    const o = pos.length / 3;
    pos.push(x, y, 0, x, y, h);
    for (let i = 0; i < N; i++) {
      const a = (2 * Math.PI * i) / N;
      pos.push(x + (d / 2) * Math.cos(a), y + (d / 2) * Math.sin(a), 0);
      pos.push(x + (d / 2) * Math.cos(a), y + (d / 2) * Math.sin(a), h);
    }
    for (let i = 0; i < N; i++) {
      const b0 = o + 2 + 2 * i,
        t0 = b0 + 1,
        b1 = o + 2 + 2 * ((i + 1) % N),
        t1 = b1 + 1;
      tri.push(o, b1, b0); // unten
      tri.push(o + 1, t0, t1); // oben
      tri.push(b0, b1, t1, b0, t1, t0); // Rand
    }
  }
  return { pos: new Float64Array(pos), tri: new Uint32Array(tri) };
}
