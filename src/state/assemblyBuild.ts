/**
 * Baugruppe bauen: jedes Teil einzeln (mit Zwischenspeicher), dann in die
 * Lage der Baugruppe verschieben/drehen – für die Ansicht „zusammengebaut“.
 */
import { buildParts } from '../cad/build';
import { rotV, type AsmItem, type V3 } from '../cad/assembly';
import type { Mesh } from '../mesh/mesh';
import { runPipeline, translateMesh, type BuildResult, type PartResult, type PipelineSettings } from './pipeline';

const cache = new Map<string, BuildResult>();

function key(it: AsmItem, s: PipelineSettings): string {
  return JSON.stringify([it.model, it.values, s.globals, s.palette, s.material, s.profile, s.layer, s.overhangDeg, s.hollow]);
}

/** Baut ein Teil der Baugruppe (ohne Aufteilen/Zonen/Ausrichtung – so wie es gedruckt wird). */
export function buildItem(it: AsmItem, s: PipelineSettings): BuildResult {
  const k = key(it, s);
  let r = cache.get(k);
  if (!r) {
    r = runPipeline(it.model, it.values, { ...s, orientation: { rx: 0, ry: 0 }, zones: null, split: { ...s.split, enabled: false } });
    if (cache.size > 40) cache.clear();
    cache.set(k, r);
  }
  return r;
}

/** Polygone eines Teils im Druckbett-System (für die Verbindungs-Suche). */
export function itemPolys(it: AsmItem, s: PipelineSettings): number[][][] {
  const out = buildParts({ ...it.model, mods: undefined }, it.values, s.globals, { rx: 0, ry: 0 }, null, undefined, s.hollow);
  return out.parts.flatMap((p) => p.polys);
}

function poseMesh(m: Mesh, rot: V3, pos: V3): Mesh {
  if (!rot.some((v) => v)) return translateMesh(m, pos);
  const p = new Float64Array(m.pos.length);
  for (let i = 0; i < p.length; i += 3) {
    const w = rotV([m.pos[i], m.pos[i + 1], m.pos[i + 2]], rot);
    p[i] = w[0] + pos[0];
    p[i + 1] = w[1] + pos[1];
    p[i + 2] = w[2] + pos[2];
  }
  return { pos: p, tri: m.tri };
}

/** Alle Teile in Baugruppen-Lage (optional auseinandergezogen). */
export function assembledParts(items: AsmItem[], s: PipelineSettings, explode = 0): PartResult[] {
  const real = items.filter((i) => !i.auto);
  if (!real.length) return [];
  const built = real.map((it) => ({ it, r: buildItem(it, s) }));
  // Mittelpunkte für die Explosionsansicht
  const centers = built.map(({ it, r }) => {
    const c: V3 = [(r.total.min[0] + r.total.max[0]) / 2, (r.total.min[1] + r.total.max[1]) / 2, (r.total.min[2] + r.total.max[2]) / 2];
    const w = rotV(c, it.rot);
    return [w[0] + it.pos[0], w[1] + it.pos[1], w[2] + it.pos[2]] as V3;
  });
  const mid = [0, 1, 2].map((k) => centers.reduce((a, c) => a + c[k], 0) / centers.length);
  const out: PartResult[] = [];
  built.forEach(({ it, r }, i) => {
    let off: V3 = [0, 0, 0];
    if (explode > 0 && built.length > 1) {
      const d = centers[i].map((v, k) => v - mid[k]);
      const len = Math.hypot(...d) || 1;
      off = d.map((v) => (v / len) * explode) as V3;
    }
    const pos: V3 = [it.pos[0] + off[0], it.pos[1] + off[1], it.pos[2] + off[2]];
    for (const p of r.parts) out.push({ ...p, mesh: poseMesh(p.mesh, it.rot, pos) });
  });
  // Auf das Bett stellen (für die Ansicht)
  let minZ = Infinity;
  for (const p of out) for (let i = 2; i < p.mesh.pos.length; i += 3) minZ = Math.min(minZ, p.mesh.pos[i]);
  if (Number.isFinite(minZ) && Math.abs(minZ) > 1e-6) return out.map((p) => ({ ...p, mesh: translateMesh(p.mesh, [0, 0, -minZ]) })).map(restat);
  return out.map(restat);
}

/** Hüllbox-Werte der Teile nach dem Verschieben aktualisieren (Ansicht nutzt min/max). */
function restat(p: PartResult): PartResult {
  const min: [number, number, number] = [Infinity, Infinity, Infinity],
    max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < p.mesh.pos.length; i += 3)
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], p.mesh.pos[i + k]);
      max[k] = Math.max(max[k], p.mesh.pos[i + k]);
    }
  // Überhang-Markierung gilt fürs Druckteil, nicht für die Baugruppen-Lage
  return { ...p, stats: { ...p.stats, min, max, overhangFlags: new Uint8Array(p.stats.overhangFlags.length) } };
}

/** Welt-Hüllbox eines Teils (für „Anlegen an …“). */
export function itemWorldBox(it: AsmItem, s: PipelineSettings): { min: V3; max: V3 } {
  const r = buildItem(it, s);
  const min: V3 = [Infinity, Infinity, Infinity],
    max: V3 = [-Infinity, -Infinity, -Infinity];
  for (const x of [r.total.min[0], r.total.max[0]])
    for (const y of [r.total.min[1], r.total.max[1]])
      for (const z of [r.total.min[2], r.total.max[2]]) {
        const w = rotV([x, y, z], it.rot);
        for (let k = 0; k < 3; k++) {
          min[k] = Math.min(min[k], w[k] + it.pos[k]);
          max[k] = Math.max(max[k], w[k] + it.pos[k]);
        }
      }
  return { min, max };
}

/** Druck-Einstellungen aus den App-Einstellungen (ohne Aufteilen/Farbzonen). */
export function asmSettings(s: {
  tol: number;
  fase: boolean;
  palette: PipelineSettings['palette'];
  material: string;
  profile: PipelineSettings['profile'];
  layer: number;
  overhangDeg: number;
  bedSize: number;
  bedHeight: number;
  split: PipelineSettings['split'];
  hollow?: PipelineSettings['hollow'];
}): PipelineSettings {
  return {
    globals: { tol: s.tol, fase: s.fase },
    orientation: { rx: 0, ry: 0 },
    zones: null,
    palette: s.palette,
    material: s.material,
    profile: s.profile,
    layer: s.layer,
    overhangDeg: s.overhangDeg,
    bedSize: s.bedSize,
    bedHeight: s.bedHeight,
    split: { ...s.split, enabled: false },
    hollow: s.hollow,
  };
}

/** Lage für eine neue Platte: bündig rechts neben die bisherige Baugruppe. */
export function autoPos(model: AsmItem['model'], values: AsmItem['values'], items: AsmItem[], s: PipelineSettings): V3 {
  const probe: AsmItem = { id: -1, name: '', model: { ...model, mods: undefined }, values, pos: [0, 0, 0], rot: [0, 0, 0] };
  const lb = itemWorldBox(probe, s);
  const real = items.filter((i) => !i.auto);
  if (!real.length) return [0, 0, Math.round(-lb.min[2] * 10) / 10];
  const min: V3 = [Infinity, Infinity, Infinity],
    max: V3 = [-Infinity, -Infinity, -Infinity];
  for (const it of real) {
    const b = itemWorldBox(it, s);
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], b.min[k]);
      max[k] = Math.max(max[k], b.max[k]);
    }
  }
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return [r1(max[0] - lb.min[0]), r1(min[1] - lb.min[1]), r1(min[2] - lb.min[2])];
}
