import { buildParts, type HollowOptions } from '../cad/build';
import { rotV } from '../cad/assembly';
import { getImported } from '../mesh/importMesh';
import type { ModelImport } from '../cad/types';
import type { SplitOptions, SplitReport } from '../cad/split';
import type { ColorZone, FilamentSlot, Globals, ModelDef, Orientation, Value } from '../cad/types';
import {
  analyzeMesh,
  estimatePrint,
  MATERIALS,
  mergeMeshes,
  meshFromPolygons,
  rotateMesh,
  type Mesh,
  type MeshStats,
  type PrintEstimate,
  type PrintProfile,
  suppressSupportedOverhangs,
} from '../mesh/mesh';

export interface PartResult {
  slot: number;
  name: string;
  color: string;
  mesh: Mesh;
  stats: MeshStats;
}

export interface PieceResult {
  label: string;
  kind: 'segment' | 'pin';
  cell: [number, number, number];
  /** Lage im zusammengebauten Modell */
  assembled: PartResult[];
  /** Druckausrichtung, lokal (Mitte 0/0, z ≥ 0) */
  local: PartResult[];
  size: [number, number, number];
  orientation: Orientation;
  manifold: boolean;
}

export interface PlateResult {
  index: number;
  /** Teile in Plattenkoordinaten (Mitte = Bettmitte) */
  items: { piece: number; parts: PartResult[] }[];
  estimate: PrintEstimate;
  height: number;
}

export interface BuildResult {
  parts: PartResult[];
  total: MeshStats;
  estimate: PrintEstimate;
  ms: number;
  placement: { rx: number; ry: number; t: [number, number, number] };
  fitsBed: boolean;
  swaps: number;
  purgeGrams: number;
  pieces?: PieceResult[];
  plates?: PlateResult[];
  splitReport?: SplitReport;
  hollowNote?: string;
  /** Hinweise zu importierten Dateien */
  importNote?: string;
}

export interface PipelineSettings {
  globals: Globals;
  orientation: Orientation;
  zones: ColorZone[] | null;
  palette: FilamentSlot[];
  material: string;
  profile: PrintProfile;
  layer: number;
  overhangDeg: number;
  bedSize: number;
  bedHeight: number;
  split: SplitOptions;
  hollow?: HollowOptions;
}

export function slotColor(palette: FilamentSlot[], slot: number): string {
  return palette.find((p) => p.slot === slot)?.color ?? '#b8c2cc';
}

export function translateMesh(m: Mesh, d: [number, number, number]): Mesh {
  const p = new Float64Array(m.pos.length);
  for (let i = 0; i < p.length; i += 3) {
    p[i] = m.pos[i] + d[0];
    p[i + 1] = m.pos[i + 1] + d[1];
    p[i + 2] = m.pos[i + 2] + d[2];
  }
  return { pos: p, tri: m.tri };
}

function bounds(ms: Mesh[]): { min: number[]; max: number[] } {
  const min = [Infinity, Infinity, Infinity],
    max = [-Infinity, -Infinity, -Infinity];
  for (const m of ms)
    for (let i = 0; i < m.pos.length; i += 3)
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], m.pos[i + k]);
        max[k] = Math.max(max[k], m.pos[i + k]);
      }
  return { min, max };
}

/** Farbwechsel zählen (AMS): pro Schicht (Farben − 1) + Wechsel zwischen Schichten. */
function countSwaps(parts: { slot: number; stats: MeshStats }[], height: number, layer: number): number {
  const slots = [...new Set(parts.map((p) => p.slot))];
  if (slots.length < 2) return 0;
  let swaps = 0,
    last = -1;
  for (let z = layer / 2; z < height; z += layer) {
    const present = slots.filter((sl) => parts.some((p) => p.slot === sl && p.stats.min[2] <= z && p.stats.max[2] >= z));
    if (!present.length) continue;
    if (last >= 0 && present[0] !== last) swaps++;
    swaps += present.length - 1;
    last = present[present.length - 1];
  }
  return swaps;
}

const ORIENTS: [number, number][] = [
  [0, 0],
  [180, 0],
  [90, 0],
  [-90, 0],
  [0, 90],
  [0, -90],
];

/** Importiertes Netz in Modellkoordinaten: skalieren, drehen (X→Y→Z), verschieben. */
export function importToMesh(im: ModelImport): Mesh {
  const src = getImported(im.ref);
  if (!src) throw new Error(`Die importierte Datei „${im.name}“ fehlt auf diesem Gerät – bitte erneut importieren`);
  const k = [0, 1, 2].map((i) => (src.size[i] > 0 ? im.size[i] / src.size[i] : 1));
  const p = new Float64Array(src.mesh.pos.length);
  const rot = im.rot.some((v) => v);
  for (let i = 0; i < p.length; i += 3) {
    let v: [number, number, number] = [src.mesh.pos[i] * k[0], src.mesh.pos[i + 1] * k[1], src.mesh.pos[i + 2] * k[2]];
    if (rot) v = rotV(v, im.rot);
    p[i] = v[0] + im.pos[0];
    p[i + 1] = v[1] + im.pos[1];
    p[i + 2] = v[2] + im.pos[2];
  }
  // Spiegeln durch negative Skalierung dreht die Flächen um
  if (k[0] * k[1] * k[2] < 0) {
    const t = new Uint32Array(src.mesh.tri);
    for (let i = 0; i < t.length; i += 3) [t[i + 1], t[i + 2]] = [t[i + 2], t[i + 1]];
    return { pos: p, tri: t };
  }
  return { pos: p, tri: src.mesh.tri };
}

export function runPipeline(model: ModelDef, values: Record<string, Value>, s: PipelineSettings): BuildResult {
  const t0 = performance.now();
  const bed = { size: s.bedSize, height: s.bedHeight };
  const imports = model.imports ?? [];
  // Aufteilen arbeitet nur mit CAD-Geometrie – mit Importen bleibt das Modell am Stück
  const splitOn = s.split.enabled && !imports.length;
  const out = model.root.length
    ? buildParts(model, values, s.globals, s.orientation, s.zones, splitOn ? { opts: s.split, bed } : undefined, s.hollow)
    : { parts: [], placement: { rx: s.orientation.rx, ry: s.orientation.ry, t: [0, 0, 0] as [number, number, number] }, pieces: undefined, splitReport: undefined, hollowNote: undefined };
  const density = MATERIALS.find((m) => m.id === s.material)?.density ?? 1.24;
  const mk = (slot: number, name: string, mesh: Mesh): PartResult => ({ slot, name, color: slotColor(s.palette, slot), mesh, stats: analyzeMesh(mesh, s.overhangDeg, 0) });

  let parts: PartResult[] = out.parts.map((p) => mk(p.slot, p.name, meshFromPolygons(p.polys)));
  if (imports.length) {
    // Importe genauso ausrichten wie das CAD-Modell, danach alles gemeinsam aufs Bett legen
    const t = out.placement.t;
    const im = imports.map((x) => ({ x, mesh: translateMesh(rotateMesh(importToMesh(x), s.orientation.rx, s.orientation.ry), t) }));
    const b = bounds([...parts.map((p) => p.mesh), ...im.map((i) => i.mesh)]);
    const d: [number, number, number] = [-(b.min[0] + b.max[0]) / 2, -(b.min[1] + b.max[1]) / 2, -b.min[2]];
    const moved = Math.abs(d[0]) + Math.abs(d[1]) + Math.abs(d[2]) > 1e-9;
    parts = [
      ...parts.map((p) => (moved ? mk(p.slot, p.name, translateMesh(p.mesh, d)) : p)),
      ...im.map((i) => mk(i.x.slot, `Import: ${i.x.name}`, moved ? translateMesh(i.mesh, d) : i.mesh)),
    ];
    out.placement = { ...out.placement, t: [t[0] + d[0], t[1] + d[1], t[2] + d[2]] };
  }
  const total = analyzeMesh(mergeMeshes(parts.map((p) => p.mesh)), s.overhangDeg);
  suppressSupportedOverhangs(parts);
  total.overhangArea = parts.reduce((a, p) => a + p.stats.overhangArea, 0);
  total.manifold = parts.every((p) => p.stats.manifold);
  total.openEdges = parts.reduce((a, p) => a + p.stats.openEdges, 0);
  total.nonManifoldEdges = parts.reduce((a, p) => a + p.stats.nonManifoldEdges, 0);
  const height = total.max[2] - total.min[2];
  const size = [total.max[0] - total.min[0], total.max[1] - total.min[1], height];

  const estimate = estimatePrint(total.volume, total.area, total.areaTB, height, density, s.profile, s.layer);
  const swaps = countSwaps(parts, height, s.layer);
  estimate.minutes += (swaps * 45) / 60;

  const res: BuildResult = {
    parts,
    total,
    estimate,
    ms: 0,
    placement: out.placement,
    fitsBed: size[0] <= s.bedSize && size[1] <= s.bedSize && size[2] <= s.bedHeight,
    swaps,
    purgeGrams: swaps * 0.4,
    hollowNote: out.hollowNote,
  };
  if (imports.length) {
    const open = parts.filter((p) => p.name.startsWith('Import: ') && !p.stats.manifold);
    if (open.length) res.importNote = `${open.map((p) => `„${p.name.slice(8)}“`).join(', ')} hat offene Kanten – Bambu Studio/Orca reparieren das beim Laden meist automatisch.`;
    if (s.split.enabled) res.importNote = (res.importNote ? res.importNote + ' ' : '') + 'Aufteilen auf mehrere Platten geht mit importierten Dateien noch nicht – nutze dafür die Baugruppe.';
  }

  if (out.pieces) {
    res.splitReport = out.splitReport;
    const pieces: PieceResult[] = out.pieces.map((pc) => {
      const assembled = pc.parts.map((p) => mk(p.slot, p.name, meshFromPolygons(p.polys)));
      // Druckausrichtung: wenigste Überhänge, muss aufs Bett passen
      let best = { o: [0, 0] as [number, number], score: Infinity };
      const merged = mergeMeshes(assembled.map((a) => a.mesh));
      const cands: [number, number][] = pc.kind === 'pin' ? [[0, 0]] : ORIENTS;
      for (const [rx, ry] of cands) {
        const st = analyzeMesh(rotateMesh(merged, rx, ry), s.overhangDeg);
        const fits = st.max[0] - st.min[0] <= s.bedSize && st.max[1] - st.min[1] <= s.bedSize && st.max[2] - st.min[2] <= s.bedHeight;
        const score = st.overhangArea - st.bedContactArea * 0.05 + (fits ? 0 : 1e9) + (st.max[2] - st.min[2]) * 0.01;
        if (score < best.score) best = { o: [rx, ry], score };
      }
      const rotated = assembled.map((a) => rotateMesh(a.mesh, best.o[0], best.o[1]));
      const b = bounds(rotated);
      const d: [number, number, number] = [-(b.min[0] + b.max[0]) / 2, -(b.min[1] + b.max[1]) / 2, -b.min[2]];
      const local = rotated.map((m, i) => mk(assembled[i].slot, assembled[i].name, translateMesh(m, d)));
      suppressSupportedOverhangs(assembled);
      suppressSupportedOverhangs(local);
      return {
        label: pc.label,
        kind: pc.kind,
        cell: pc.cell,
        assembled,
        local,
        size: [b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]],
        orientation: { rx: best.o[0], ry: best.o[1] },
        manifold: local.every((l) => l.stats.manifold),
      };
    });
    // Platten füllen (Regal-Algorithmus)
    const gap = 6;
    const usable = s.bedSize - 4;
    const order = pieces.map((_, i) => i).sort((a, b) => pieces[b].size[1] - pieces[a].size[1] || pieces[b].size[0] - pieces[a].size[0]);
    const plates: { items: { piece: number; x: number; y: number }[]; x: number; y: number; rowH: number }[] = [];
    for (const i of order) {
      const [w, dd] = pieces[i].size;
      let placed = false;
      for (const pl of plates) {
        if (pl.x + w <= usable && pl.y + dd <= usable) {
          pl.items.push({ piece: i, x: pl.x, y: pl.y });
          pl.x += w + gap;
          pl.rowH = Math.max(pl.rowH, dd);
          placed = true;
          break;
        }
        const ny = pl.y + pl.rowH + gap;
        if (w <= usable && ny + dd <= usable) {
          pl.y = ny;
          pl.x = 0;
          pl.rowH = dd;
          pl.items.push({ piece: i, x: 0, y: ny });
          pl.x = w + gap;
          placed = true;
          break;
        }
      }
      if (!placed) plates.push({ items: [{ piece: i, x: 0, y: 0 }], x: w + gap, y: 0, rowH: dd });
    }
    const plateResults: PlateResult[] = plates.map((pl, k) => {
      const maxX = Math.max(...pl.items.map((it) => it.x + pieces[it.piece].size[0]));
      const maxY = Math.max(...pl.items.map((it) => it.y + pieces[it.piece].size[1]));
      const items = pl.items.map((it) => {
        const pc = pieces[it.piece];
        const dx = -maxX / 2 + it.x + pc.size[0] / 2,
          dy = -maxY / 2 + it.y + pc.size[1] / 2;
        return { piece: it.piece, parts: pc.local.map((l) => ({ ...l, mesh: translateMesh(l.mesh, [dx, dy, 0]) })) };
      });
      const all = items.flatMap((it) => it.parts);
      const st = analyzeMesh(mergeMeshes(all.map((p) => p.mesh)), s.overhangDeg);
      const h = st.max[2] - st.min[2];
      const est = estimatePrint(st.volume, st.area, st.areaTB, h, density, s.profile, s.layer);
      const sw = countSwaps(
        all.map((p) => ({ slot: p.slot, stats: analyzeMesh(p.mesh, s.overhangDeg) })),
        h,
        s.layer,
      );
      est.minutes += (sw * 45) / 60;
      return { index: k + 1, items, estimate: est, height: h };
    });
    res.pieces = pieces;
    res.plates = plateResults;
    res.estimate = {
      grams: plateResults.reduce((a, p) => a + p.estimate.grams, 0),
      meters: plateResults.reduce((a, p) => a + p.estimate.meters, 0),
      minutes: plateResults.reduce((a, p) => a + p.estimate.minutes, 0),
    };
    res.total = { ...res.total, manifold: pieces.every((p) => p.manifold) };
    res.fitsBed = pieces.every((p) => p.size[0] <= s.bedSize && p.size[1] <= s.bedSize && p.size[2] <= s.bedHeight);
  }
  res.ms = performance.now() - t0;
  return res;
}

/** Explosionsansicht der Segmente (zeigt Schnitte und Verbinder). */
export function explodedParts(pieces: PieceResult[], gap = 14): PartResult[] {
  const segs = pieces.filter((p) => p.kind === 'segment');
  if (!segs.length) return [];
  const n = [0, 1, 2].map((i) => Math.max(...segs.map((p) => p.cell[i])) + 1);
  return segs.flatMap((p) => {
    const d = [0, 1, 2].map((i) => (i === 2 ? p.cell[2] : p.cell[i] - (n[i] - 1) / 2) * gap) as [number, number, number];
    return p.assembled.map((a) => ({ ...a, mesh: translateMesh(a.mesh, d) }));
  });
}
