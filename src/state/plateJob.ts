/** Sammelplatte: mehrere (verschiedene) Objekte platzsparend auf eine oder mehrere Druckplatten legen. */
import { useSyncExternalStore } from 'react';
import type { ModelDef, Value } from '../cad/types';
import type { AsmItem } from '../cad/assembly';
import { buildItem } from './assemblyBuild';
import { translateMesh, type PartResult, type PipelineSettings } from './pipeline';

export interface JobItem {
  id: number;
  name: string;
  model: ModelDef;
  values: Record<string, Value>;
  copies: number;
}
interface JobState {
  items: JobItem[];
  show: boolean;
  plate: number;
}
const KEY = 'formwerk-cad:sammelplatte';
let st: JobState = (() => {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return { ...(JSON.parse(r) as JobState), show: false, plate: 0 };
  } catch {
    /* egal */
  }
  return { items: [], show: false, plate: 0 };
})();
const subs = new Set<() => void>();
const set = (n: Partial<JobState>) => {
  st = { ...st, ...n };
  try {
    localStorage.setItem(KEY, JSON.stringify({ items: st.items }));
  } catch {
    /* voll */
  }
  subs.forEach((f) => f());
};
export const plateJob = {
  get: () => st,
  subscribe: (f: () => void) => (subs.add(f), () => void subs.delete(f)),
  add(name: string, model: ModelDef, values: Record<string, Value>, copies = 1) {
    const id = Math.max(0, ...st.items.map((i) => i.id)) + 1;
    set({ items: [...st.items, { id, name, model: structuredClone(model), values: { ...values }, copies }], show: true });
  },
  update(id: number, patch: Partial<JobItem>) {
    set({ items: st.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  },
  remove(id: number) {
    const items = st.items.filter((i) => i.id !== id);
    set({ items, show: items.length ? st.show : false, plate: 0 });
  },
  clear: () => set({ items: [], show: false, plate: 0 }),
  show: (v: boolean) => set({ show: v }),
  plate: (n: number) => set({ plate: n }),
};
export const usePlateJob = () => useSyncExternalStore(plateJob.subscribe, plateJob.get, plateJob.get);

export interface PackedPlate {
  objects: { name: string; parts: PartResult[] }[];
  grams: number;
  minutes: number;
}
export interface PackResult {
  plates: PackedPlate[];
  tooBig: string[];
}

/** Regal-Packen: nach Tiefe sortiert, Reihen von links nach rechts, 5 mm Abstand. */
export function packPlates(items: JobItem[], s: PipelineSettings, gap = 5): PackResult {
  const usable = s.bedSize - 8;
  const pieces: { name: string; parts: PartResult[]; w: number; d: number; grams: number; minutes: number }[] = [];
  const tooBig: string[] = [];
  for (const it of items) {
    const r = buildItem({ id: -it.id, name: it.name, model: it.model, values: it.values, pos: [0, 0, 0], rot: [0, 0, 0] } as AsmItem, s);
    const w = r.total.max[0] - r.total.min[0],
      d = r.total.max[1] - r.total.min[1];
    if (w > usable || d > usable || r.total.max[2] - r.total.min[2] > s.bedHeight) {
      tooBig.push(it.name);
      continue;
    }
    for (let c = 0; c < it.copies; c++) pieces.push({ name: it.copies > 1 ? `${it.name} ${c + 1}` : it.name, parts: r.parts, w, d, grams: r.estimate.grams, minutes: r.estimate.minutes });
  }
  pieces.sort((a, b) => b.d - a.d || b.w - a.w);
  type Pl = { rows: { y: number; h: number; x: number }[]; items: { p: (typeof pieces)[number]; x: number; y: number }[] };
  const plates: Pl[] = [];
  for (const p of pieces) {
    let placed = false;
    for (const pl of plates) {
      for (const row of pl.rows)
        if (row.x + p.w <= usable && p.d <= row.h) {
          pl.items.push({ p, x: row.x, y: row.y });
          row.x += p.w + gap;
          placed = true;
          break;
        }
      if (placed) break;
      const last = pl.rows[pl.rows.length - 1];
      const ny = last.y + last.h + gap;
      if (ny + p.d <= usable) {
        pl.rows.push({ y: ny, h: p.d, x: p.w + gap });
        pl.items.push({ p, x: 0, y: ny });
        placed = true;
        break;
      }
    }
    if (!placed) plates.push({ rows: [{ y: 0, h: p.d, x: p.w + gap }], items: [{ p, x: 0, y: 0 }] });
  }
  return {
    tooBig,
    plates: plates.map((pl) => {
      const maxX = Math.max(...pl.items.map((i) => i.x + i.p.w)),
        maxY = Math.max(...pl.items.map((i) => i.y + i.p.d));
      return {
        grams: pl.items.reduce((a, i) => a + i.p.grams, 0),
        minutes: pl.items.reduce((a, i) => a + i.p.minutes, 0),
        objects: pl.items.map((i) => {
          // Teile sind um (0,0) zentriert → in die Packposition verschieben, Platte mittig aufs Bett
          const dx = -maxX / 2 + i.x + i.p.w / 2,
            dy = -maxY / 2 + i.y + i.p.d / 2;
          return { name: i.p.name, parts: i.p.parts.map((pp) => ({ ...pp, mesh: translateMesh(pp.mesh, [dx, dy, 0]) })) };
        }),
      };
    }),
  };
}
