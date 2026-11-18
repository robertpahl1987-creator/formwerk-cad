/**
 * Aufteilen großer Modelle in druckbare Segmente mit Verbindungselementen.
 *
 *  - Schnittebenen pro Achse (automatisch aus Druckbettgröße oder manuell)
 *  - Verbindungen je Schnittfläche: Steckzapfen, Dübel (separate Stifte) oder Kleben
 *  - Positionen der Verbinder werden im realen Querschnitt gesucht:
 *    Punkt muss in der Schnittfläche UND in beiden Teilen bis zur vollen
 *    Einstecktiefe im Material liegen, mit Mindestwand rundherum.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jscad from '@jscad/modeling';

const { primitives: P, booleans: B, transforms: T, geometries: G } = jscad as any;
type Geom = any;

export type JointType = 'steck' | 'duebel' | 'kleben';

export interface SplitOptions {
  enabled: boolean;
  /** 0 = automatisch aus Bettgröße */
  cuts: [number, number, number];
  joint: JointType;
  /** Zapfen-/Dübel-Durchmesser */
  pinD: number;
  /** Einstecktiefe je Seite */
  depth: number;
  /** 0 = automatisch nach Querschnittsfläche */
  perFace: number;
  minWall: number;
}

export const DEFAULT_SPLIT: SplitOptions = {
  enabled: false,
  cuts: [0, 0, 0],
  joint: 'steck',
  pinD: 6,
  depth: 8,
  perFace: 0,
  minWall: 1.6,
};

export interface PieceGeom {
  label: string;
  cell: [number, number, number];
  parts: { slot: number; name: string; geom: Geom }[];
  kind: 'segment' | 'pin';
}

export interface SplitReport {
  counts: [number, number, number];
  faces: number;
  joints: number;
  warnings: string[];
}

const polysOf = (g: Geom): number[][][] => (G.geom3.toPolygons(g) as { vertices: number[][] }[]).map((p) => p.vertices);

/** Schneidet konvexe Polygone mit der Ebene x[axis] = value → 2D-Segmente (u,v). */
export function sliceSegments(polys: number[][][], axis: number, value: number): number[][] {
  const u = (axis + 1) % 3,
    v = (axis + 2) % 3;
  const segs: number[][] = [];
  for (const poly of polys) {
    const pts: number[][] = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i],
        b = poly[(i + 1) % poly.length];
      let da = a[axis] - value,
        db = b[axis] - value;
      if (da === 0) da = 1e-9;
      if (db === 0) db = 1e-9;
      if (da > 0 !== db > 0) {
        const t = da / (da - db);
        pts.push([a[u] + (b[u] - a[u]) * t, a[v] + (b[v] - a[v]) * t]);
      }
    }
    if (pts.length >= 2) segs.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
  }
  return segs;
}

export function inside(segs: number[][], x: number, y: number): boolean {
  let c = false;
  for (const [x1, y1, x2, y2] of segs) {
    if (y1 > y !== y2 > y) {
      const xi = x1 + ((y - y1) * (x2 - x1)) / (y2 - y1);
      if (xi > x) c = !c;
    }
  }
  return c;
}

export function distToSegs(segs: number[][], x: number, y: number): number {
  let best = Infinity;
  for (const [x1, y1, x2, y2] of segs) {
    const dx = x2 - x1,
      dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    let t = l2 > 0 ? ((x - x1) * dx + (y - y1) * dy) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    const ex = x1 + t * dx - x,
      ey = y1 + t * dy - y;
    best = Math.min(best, ex * ex + ey * ey);
  }
  return Math.sqrt(best);
}

/** Zylinder entlang der Achse axis, von s0 bis s1 (Achskoordinate), Mitte (cu, cv). */
function axisCylinder(axis: number, s0: number, s1: number, cu: number, cv: number, r: number, chamfer = 0): Geom {
  const h = s1 - s0;
  const seg = Math.min(160, Math.max(32, Math.ceil((2 * Math.PI * r) / 0.5 / 16) * 16));
  let g: Geom;
  if (chamfer > 0 && h > chamfer * 2) {
    const body = P.cylinder({ radius: r, height: h - chamfer, segments: seg, center: [0, 0, (h - chamfer) / 2] });
    const tip = P.cylinderElliptic({ height: chamfer + 0.01, startRadius: [r, r], endRadius: [Math.max(r - chamfer, 0.3), Math.max(r - chamfer, 0.3)], segments: seg, center: [0, 0, h - chamfer / 2 - 0.005] });
    g = B.union(body, tip);
  } else g = P.cylinder({ radius: r, height: h, segments: seg, center: [0, 0, h / 2] });
  // lokale Z-Achse → Zielachse
  if (axis === 0) g = T.rotateY(Math.PI / 2, g); // Z → +X
  else if (axis === 1) g = T.rotateX(-Math.PI / 2, g); // Z → +Y
  const pos = [0, 0, 0];
  pos[axis] = s0;
  pos[(axis + 1) % 3] = cu;
  pos[(axis + 2) % 3] = cv;
  return T.translate(pos, g);
}

/**
 * Teilt die (bereits auf dem Bett platzierten) Farbteile.
 * Gibt Segmente (+ ggf. Dübelstifte) zurück.
 */
export function splitParts(
  parts: { slot: number; name: string; geom: Geom }[],
  bb: { min: number[]; max: number[] },
  o: SplitOptions,
  bed: { size: number; height: number },
  tol: number,
): { pieces: PieceGeom[]; report: SplitReport } {
  const size = [0, 1, 2].map((i) => bb.max[i] - bb.min[i]);
  const usable = [bed.size - 8, bed.size - 8, bed.height - 4];
  const counts = [0, 1, 2].map((i) => {
    const manual = Math.round(o.cuts[i]);
    if (manual > 0) return Math.min(12, manual);
    return Math.max(1, Math.ceil(size[i] / usable[i]));
  }) as [number, number, number];
  const warnings: string[] = [];
  const planes: number[][] = [0, 1, 2].map((i) => Array.from({ length: counts[i] - 1 }, (_, k) => bb.min[i] + ((k + 1) * size[i]) / counts[i]));

  const BIG = 1e4;
  const bounds = (i: number, k: number): [number, number] => [k === 0 ? -BIG : planes[i][k - 1], k === counts[i] - 1 ? BIG : planes[i][k]];

  // Zellen
  const cells: PieceGeom[] = [];
  const cellIndex = new Map<string, number>();
  for (let ix = 0; ix < counts[0]; ix++)
    for (let iy = 0; iy < counts[1]; iy++)
      for (let iz = 0; iz < counts[2]; iz++) {
        const [x0, x1] = bounds(0, ix),
          [y0, y1] = bounds(1, iy),
          [z0, z1] = bounds(2, iz);
        const box = P.cuboid({ size: [x1 - x0, y1 - y0, z1 - z0], center: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2] });
        const ps = parts
          .map((p) => ({ ...p, geom: B.intersect(p.geom, box) }))
          .filter((p) => polysOf(p.geom).length > 0);
        if (!ps.length) continue;
        cellIndex.set(`${ix},${iy},${iz}`, cells.length);
        cells.push({ label: '', cell: [ix, iy, iz], parts: ps, kind: 'segment' });
      }

  const r = o.pinD / 2;
  const pins: PieceGeom[] = [];
  let faces = 0,
    joints = 0;
  if (o.joint !== 'kleben' && cells.length > 1) {
    const allPolys = polysOf(parts.length === 1 ? parts[0].geom : B.union(...parts.map((p) => p.geom)));
    const clearance = r + tol + o.minWall;
    for (let axis = 0; axis < 3; axis++) {
      planes[axis].forEach((pv, k) => {
        const s0 = sliceSegments(allPolys, axis, pv);
        const sA = sliceSegments(allPolys, axis, pv - o.depth - 0.6);
        const sB = sliceSegments(allPolys, axis, pv + o.depth + 0.6);
        if (!s0.length) return;
        // alle Zellpaare an dieser Ebene
        for (const [key, ia] of cellIndex) {
          const c = key.split(',').map(Number);
          if (c[axis] !== k) continue;
          const nb = [...c];
          nb[axis] = k + 1;
          const ib = cellIndex.get(nb.join(','));
          if (ib === undefined) continue;
          faces++;
          const u = (axis + 1) % 3,
            v = (axis + 2) % 3;
          const [u0, u1] = bounds(u, c[u]),
            [v0, v1] = bounds(v, c[v]);
          const lo = [Math.max(u0, bb.min[u]), Math.max(v0, bb.min[v])];
          const hi = [Math.min(u1, bb.max[u]), Math.min(v1, bb.max[v])];
          // Kandidaten im Raster
          const n = 28;
          const cand: { x: number; y: number; d: number }[] = [];
          let areaHits = 0;
          for (let a = 0; a <= n; a++)
            for (let b = 0; b <= n; b++) {
              const x = lo[0] + ((hi[0] - lo[0]) * a) / n,
                y = lo[1] + ((hi[1] - lo[1]) * b) / n;
              if (!inside(s0, x, y)) continue;
              areaHits++;
              if (x - lo[0] < clearance || hi[0] - x < clearance || y - lo[1] < clearance || hi[1] - y < clearance) continue;
              if (!inside(sA, x, y) || !inside(sB, x, y)) continue;
              const d = Math.min(distToSegs(s0, x, y), distToSegs(sA, x, y), distToSegs(sB, x, y));
              if (d >= clearance) cand.push({ x, y, d });
            }
          const area = (areaHits / ((n + 1) * (n + 1))) * (hi[0] - lo[0]) * (hi[1] - lo[1]);
          const want = o.perFace > 0 ? o.perFace : area < 300 ? 1 : area < 2500 ? 2 : area < 8000 ? 3 : 4;
          if (!cand.length) {
            warnings.push(`Schnitt ${'XYZ'[axis]} = ${pv.toFixed(1)} mm: zu wenig Material für Ø ${o.pinD} mm – bitte kleben oder kleineren Durchmesser wählen.`);
            continue;
          }
          // Auswahl: erst der „innerste“ Punkt, dann maximal verteilt
          const chosen: { x: number; y: number }[] = [];
          cand.sort((p, q) => q.d - p.d);
          if (want === 1) chosen.push(cand[0]);
          else {
            // Startpunkt: am weitesten vom Schwerpunkt der Kandidaten entfernt
            const mx = cand.reduce((s, p) => s + p.x, 0) / cand.length,
              my = cand.reduce((s, p) => s + p.y, 0) / cand.length;
            let first = cand[0];
            for (const p of cand) if (Math.hypot(p.x - mx, p.y - my) > Math.hypot(first.x - mx, first.y - my)) first = p;
            chosen.push(first);
            while (chosen.length < want) {
              let best: (typeof cand)[number] | null = null,
                bd = -1;
              for (const p of cand) {
                const dmin = Math.min(...chosen.map((q) => Math.hypot(p.x - q.x, p.y - q.y)));
                if (dmin > bd) {
                  bd = dmin;
                  best = p;
                }
              }
              if (!best || bd < 3 * r) break;
              chosen.push(best);
            }
          }
          const A = cells[ia],
            Bc = cells[ib];
          for (const p of chosen) {
            joints++;
            if (o.joint === 'steck') {
              // Zapfen an Teil A (ragt in B), Bohrung in B
              const peg = axisCylinder(axis, pv - 0.5, pv + o.depth - 0.4, p.x, p.y, r, 0.6);
              A.parts[0] = { ...A.parts[0], geom: B.union(A.parts[0].geom, peg) };
              const hole = axisCylinder(axis, pv - 0.01, pv + o.depth + 0.2, p.x, p.y, r + tol);
              Bc.parts = Bc.parts.map((q) => ({ ...q, geom: B.subtract(q.geom, hole) }));
            } else {
              const holeA = axisCylinder(axis, pv - o.depth - 0.2, pv + 0.01, p.x, p.y, r + tol);
              const holeB = axisCylinder(axis, pv - 0.01, pv + o.depth + 0.2, p.x, p.y, r + tol);
              A.parts = A.parts.map((q) => ({ ...q, geom: B.subtract(q.geom, holeA) }));
              Bc.parts = Bc.parts.map((q) => ({ ...q, geom: B.subtract(q.geom, holeB) }));
              const len = 2 * o.depth - 0.6;
              // Stift mit 0,5-mm-Fasen an beiden Enden, stehend auf dem Bett (z = 0 … len)
              const seg = Math.max(24, Math.ceil((2 * Math.PI * r) / 0.5 / 4) * 4);
              const c = 0.5;
              const pinGeom = B.union(
                P.cylinderElliptic({ height: c + 0.01, startRadius: [r - c, r - c], endRadius: [r, r], segments: seg, center: [0, 0, (c + 0.01) / 2] }),
                P.cylinder({ radius: r, height: len - 2 * c, segments: seg, center: [0, 0, len / 2] }),
                P.cylinderElliptic({ height: c + 0.01, startRadius: [r, r], endRadius: [r - c, r - c], segments: seg, center: [0, 0, len - (c + 0.01) / 2] }),
              );
              pins.push({ label: `Dübel ${pins.length + 1}`, cell: [-1, -1, -1], parts: [{ slot: parts[0].slot, name: 'Dübel', geom: pinGeom }], kind: 'pin' });
            }
          }
          if (chosen.length < want && o.perFace > 0) warnings.push(`Schnitt ${'XYZ'[axis]} = ${pv.toFixed(1)} mm: nur ${chosen.length} von ${want} Verbindern passen.`);
        }
      });
    }
  }
  // Beschriftung A1, A2 … (Reihenfolge X, Y, Z)
  cells.forEach((c, i) => (c.label = `Teil ${i + 1} (${c.cell[0] + 1}/${c.cell[1] + 1}/${c.cell[2] + 1})`));
  return { pieces: [...cells, ...pins], report: { counts, faces, joints, warnings } };
}
