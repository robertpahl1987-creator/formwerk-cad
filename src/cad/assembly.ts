/**
 * Baugruppe: mehrere Modelle (je eine Druckplatte) werden im Raum zueinander
 * angeordnet. Wo sich zwei Teile flächig berühren, erzeugt die App passende
 * Dübel-/Zapfenverbindungen – die Positionen werden im echten Querschnitt
 * beider Teile gesucht (genug Material rundherum, volle Einstecktiefe).
 */
import { distToSegs, inside, sliceSegments } from './split';
import type { CadNode, ModelDef, Value } from './types';

export type V3 = [number, number, number];

export interface AsmItem {
  id: number;
  name: string;
  model: ModelDef;
  values: Record<string, Value>;
  /** Lage in der Baugruppe (bezogen auf das abgelegte Druckteil) */
  pos: V3;
  /** Drehung in Grad: erst X, dann Y, dann Z */
  rot: V3;
  /** automatisch erzeugte Dübel-Platte */
  auto?: 'pins';
}

export type AsmJoint = 'duebel' | 'steck' | 'kleben';
export interface AsmJointOptions {
  type: AsmJoint;
  d: number;
  depth: number;
  /** 0 = automatisch nach Fläche */
  perFace: number;
  minWall: number;
}
export const DEFAULT_ASM_JOINTS: AsmJointOptions = { type: 'duebel', d: 6, depth: 8, perFace: 0, minWall: 1.6 };

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function rotV(v: V3, rot: V3): V3 {
  const [a, b, c] = rot.map((d) => (d * Math.PI) / 180);
  let [x, y, z] = v;
  [y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
  [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];
  [x, y] = [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)];
  return [x, y, z];
}
export function rotVInv(v: V3, rot: V3): V3 {
  const [a, b, c] = rot.map((d) => (-d * Math.PI) / 180);
  let [x, y, z] = v;
  [x, y] = [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)];
  [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];
  [y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
  return [x, y, z];
}
export const toWorld = (p: V3, it: Pick<AsmItem, 'pos' | 'rot'>): V3 => {
  const r = rotV(p, it.rot);
  return [r[0] + it.pos[0], r[1] + it.pos[1], r[2] + it.pos[2]];
};
export const toLocal = (p: V3, it: Pick<AsmItem, 'pos' | 'rot'>): V3 => rotVInv([p[0] - it.pos[0], p[1] - it.pos[1], p[2] - it.pos[2]], it.rot);

/** DSL-Knoten aus Weltkoordinaten in das Koordinatensystem des Teils holen. */
function intoLocal(n: CadNode, it: AsmItem): CadNode {
  let node: CadNode = { type: 'translate', v: [r3(-it.pos[0]), r3(-it.pos[1]), r3(-it.pos[2])], children: [n] };
  if (it.rot[2]) node = { type: 'rotate', a: [0, 0, -it.rot[2]], children: [node] };
  if (it.rot[1]) node = { type: 'rotate', a: [0, -it.rot[1], 0], children: [node] };
  if (it.rot[0]) node = { type: 'rotate', a: [-it.rot[0], 0, 0], children: [node] };
  return node;
}

/** Zylinder entlang Weltachse k von s0 bis s1, Mittelpunkt (u, v) in den anderen Achsen. */
function axisCyl(k: number, s0: number, s1: number, u: number, v: number, r: number, chamferTip = 0): CadNode {
  const h = s1 - s0;
  const body: CadNode =
    chamferTip > 0 && h > chamferTip * 2
      ? {
          type: 'union',
          children: [
            { type: 'cylinder', r: r3(r), h: r3(h - chamferTip + 0.01) },
            { type: 'translate', v: [0, 0, r3(h - chamferTip)], children: [{ type: 'cylinder', r1: r3(r), r2: r3(Math.max(r - chamferTip, 0.3)), h: r3(chamferTip) }] },
          ],
        }
      : { type: 'cylinder', r: r3(r), h: r3(h) };
  const oriented: CadNode = k === 2 ? body : k === 0 ? { type: 'rotate', a: [0, 90, 0], children: [body] } : { type: 'rotate', a: [-90, 0, 0], children: [body] };
  const pos: V3 = [0, 0, 0];
  pos[k] = s0;
  pos[(k + 1) % 3] = u;
  pos[(k + 2) % 3] = v;
  return { type: 'translate', v: [r3(pos[0]), r3(pos[1]), r3(pos[2])], children: [oriented] };
}

export interface ItemGeometry {
  id: number;
  /** Polygone im Druckbett-Koordinatensystem des Teils */
  polys: number[][][];
}

export interface JointResult {
  mods: Map<number, { sub: CadNode[]; add: CadNode[] }>;
  pins: number;
  contacts: { a: number; b: number; axis: number; joints: number }[];
  warnings: string[];
}

/** Sucht Berührungsflächen zwischen allen Teilen und plant Verbindungen. */
export function planJoints(items: AsmItem[], geo: ItemGeometry[], o: AsmJointOptions, tol: number): JointResult {
  const res: JointResult = { mods: new Map(), pins: 0, contacts: [], warnings: [] };
  const real = items.filter((i) => !i.auto);
  for (const it of real) res.mods.set(it.id, { sub: [], add: [] });
  // Weltpolygone + Hüllboxen
  const W = new Map<number, { polys: number[][][]; min: V3; max: V3 }>();
  for (const it of real) {
    const g = geo.find((x) => x.id === it.id);
    if (!g) continue;
    const min: V3 = [Infinity, Infinity, Infinity],
      max: V3 = [-Infinity, -Infinity, -Infinity];
    const polys = g.polys.map((poly) =>
      poly.map((v) => {
        const w = toWorld(v as V3, it);
        for (let k = 0; k < 3; k++) {
          min[k] = Math.min(min[k], w[k]);
          max[k] = Math.max(max[k], w[k]);
        }
        return w as number[];
      }),
    );
    W.set(it.id, { polys, min, max });
  }
  if (o.type === 'kleben') {
    // nur Berührungen melden
  }
  const r = o.d / 2;
  const clearance = r + tol + o.minWall;
  for (let i = 0; i < real.length; i++)
    for (let j = i + 1; j < real.length; j++) {
      const wi = W.get(real[i].id),
        wj = W.get(real[j].id);
      if (!wi || !wj) continue;
      for (let k = 0; k < 3; k++) {
        for (const [A, B, wa, wb] of [
          [real[i], real[j], wi, wj],
          [real[j], real[i], wj, wi],
        ] as const) {
          if (Math.abs(wa.max[k] - wb.min[k]) > 0.6) continue;
          const p = (wa.max[k] + wb.min[k]) / 2;
          const u = (k + 1) % 3,
            v = (k + 2) % 3;
          const lo = [Math.max(wa.min[u], wb.min[u]), Math.max(wa.min[v], wb.min[v])];
          const hi = [Math.min(wa.max[u], wb.max[u]), Math.min(wa.max[v], wb.max[v])];
          if (hi[0] - lo[0] < 1 || hi[1] - lo[1] < 1) continue;
          const sA = sliceSegments(wa.polys, k, Math.min(p, wa.max[k]) - 0.08);
          const sB = sliceSegments(wb.polys, k, Math.max(p, wb.min[k]) + 0.08);
          if (!sA.length || !sB.length) continue;
          const sAd = sliceSegments(wa.polys, k, p - o.depth - 0.6);
          const sBd = sliceSegments(wb.polys, k, p + o.depth + 0.6);
          const n = 30;
          const cand: { x: number; y: number; d: number }[] = [];
          let both = 0;
          for (let a = 0; a <= n; a++)
            for (let b = 0; b <= n; b++) {
              const x = lo[0] + ((hi[0] - lo[0]) * a) / n,
                y = lo[1] + ((hi[1] - lo[1]) * b) / n;
              if (!inside(sA, x, y) || !inside(sB, x, y)) continue;
              both++;
              if (o.type === 'kleben') continue;
              if (!inside(sAd, x, y) || !inside(sBd, x, y)) continue;
              const d = Math.min(distToSegs(sA, x, y), distToSegs(sB, x, y), distToSegs(sAd, x, y), distToSegs(sBd, x, y));
              if (d >= clearance) cand.push({ x, y, d });
            }
          if (!both) continue; // Hüllboxen berühren sich, die Flächen aber nicht
          const area = (both / ((n + 1) * (n + 1))) * (hi[0] - lo[0]) * (hi[1] - lo[1]);
          if (o.type === 'kleben') {
            res.contacts.push({ a: A.id, b: B.id, axis: k, joints: 0 });
            continue;
          }
          const want = o.perFace > 0 ? o.perFace : area < 300 ? 1 : area < 2500 ? 2 : area < 8000 ? 3 : 4;
          if (!cand.length) {
            res.warnings.push(`„${A.name}“ ↔ „${B.name}“: Fläche zu schmal für Ø ${o.d} mm – dort kleben.`);
            res.contacts.push({ a: A.id, b: B.id, axis: k, joints: 0 });
            continue;
          }
          // möglichst weit verteilt
          const chosen: { x: number; y: number }[] = [];
          cand.sort((p1, p2) => p2.d - p1.d);
          if (want === 1) chosen.push(cand[0]);
          else {
            const mx = cand.reduce((s, c) => s + c.x, 0) / cand.length,
              my = cand.reduce((s, c) => s + c.y, 0) / cand.length;
            let first = cand[0];
            for (const c of cand) if (Math.hypot(c.x - mx, c.y - my) > Math.hypot(first.x - mx, first.y - my)) first = c;
            chosen.push(first);
            while (chosen.length < want) {
              let best: (typeof cand)[number] | null = null,
                bd = -1;
              for (const c of cand) {
                const dm = Math.min(...chosen.map((q) => Math.hypot(c.x - q.x, c.y - q.y)));
                if (dm > bd) {
                  bd = dm;
                  best = c;
                }
              }
              if (!best || bd < 3 * r) break;
              chosen.push(best);
            }
          }
          const mA = res.mods.get(A.id)!,
            mB = res.mods.get(B.id)!;
          for (const c of chosen) {
            let type = o.type;
            if (type === 'steck') {
              // Zapfen darf nicht unter das Druckbett eines Teils ragen → sonst Dübel
              const tip: V3 = [0, 0, 0];
              tip[k] = p + o.depth - 0.4;
              tip[u] = c.x;
              tip[v] = c.y;
              const tipLocal = toLocal(tip, A);
              if (tipLocal[2] < -0.01) type = 'duebel';
            }
            if (type === 'steck') {
              mA.add.push(intoLocal(axisCyl(k, p - 0.5, p + o.depth - 0.4, c.x, c.y, r, 0.6), A));
              mB.sub.push(intoLocal(axisCyl(k, p - 0.02, p + o.depth + 0.2, c.x, c.y, r + tol), B));
            } else {
              mA.sub.push(intoLocal(axisCyl(k, p - o.depth - 0.2, p + 0.02, c.x, c.y, r + tol), A));
              mB.sub.push(intoLocal(axisCyl(k, p - 0.02, p + o.depth + 0.2, c.x, c.y, r + tol), B));
              res.pins++;
            }
          }
          res.contacts.push({ a: A.id, b: B.id, axis: k, joints: chosen.length });
        }
      }
    }
  return res;
}

/** Druckplatte mit allen Dübelstiften (stehend, mit Fasen an beiden Enden). */
export function pinsModel(count: number, d: number, depth: number): ModelDef {
  const len = r3(2 * depth - 0.6);
  const r = d / 2;
  const cols = Math.ceil(Math.sqrt(count));
  const pitch = d + 6;
  const root: CadNode[] = [];
  for (let i = 0; i < count; i++) {
    const x = (i % cols) * pitch,
      y = Math.floor(i / cols) * pitch;
    root.push({
      type: 'translate',
      v: [r3(x), r3(y), 0],
      children: [
        { type: 'cylinder', r1: r3(r - 0.5), r2: r3(r), h: 0.51 },
        { type: 'translate', v: [0, 0, 0.5], children: [{ type: 'cylinder', r: r3(r), h: r3(len - 1) }] },
        { type: 'translate', v: [0, 0, r3(len - 0.51)], children: [{ type: 'cylinder', r1: r3(r), r2: r3(r - 0.5), h: 0.51 }] },
      ],
    });
  }
  return {
    name: `Dübel (${count} Stück)`,
    description: `Dübelstifte Ø ${d} mm × ${len} mm für die Baugruppe.`,
    params: [],
    root,
    source: 'custom',
    templateId: 'duebel',
  };
}
