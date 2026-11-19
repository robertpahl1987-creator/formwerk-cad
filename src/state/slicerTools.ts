/** Zustand der Slicer-Werkzeugleiste (wie Bambu Studio / OrcaSlicer). */
import { useSyncExternalStore } from 'react';

export type ToolPanel = 'cut' | 'scale' | 'mirror' | 'copies' | null;
interface ToolState {
  tool: 'face' | 'measure' | null;
  panel: ToolPanel;
  cut: { axis: 0 | 1 | 2; frac: number };
}
let st: ToolState = { tool: null, panel: null, cut: { axis: 2, frac: 0.5 } };
const subs = new Set<() => void>();
export const slicerTools = {
  get: () => st,
  set(p: Partial<ToolState>) {
    st = { ...st, ...p };
    subs.forEach((f) => f());
  },
  subscribe: (f: () => void) => (subs.add(f), () => void subs.delete(f)),
};
export const useSlicerTools = () => useSyncExternalStore(slicerTools.subscribe, slicerTools.get, slicerTools.get);

/** Neue Ausrichtung, damit die angeklickte Fläche (Normale in Weltkoordinaten) nach unten aufs Bett zeigt. */
export function layOnFace(n: [number, number, number], cur: { rx: number; ry: number }): { rx: number; ry: number } {
  const D = Math.PI / 180;
  // zurück in die Grundlage: erst Y rückgängig, dann X
  const [x0, y0, z0] = n;
  const cy = Math.cos(-cur.ry * D),
    sy = Math.sin(-cur.ry * D);
  const x1 = x0 * cy + z0 * sy,
    z1 = -x0 * sy + z0 * cy,
    y1 = y0;
  const cx = Math.cos(-cur.rx * D),
    sx = Math.sin(-cur.rx * D);
  const nx = x1,
    ny = y1 * cx - z1 * sx,
    nz = y1 * sx + z1 * cx;
  // erst um X so drehen, dass y = 0, dann um Y, sodass die Normale nach −Z zeigt
  const a = Math.atan2(ny, nz);
  const r = Math.hypot(ny, nz);
  const b = Math.atan2(nx, -r);
  const round = (v: number) => {
    const d = Math.round((v / D) * 100) / 100;
    return Math.abs(d) < 0.005 ? 0 : d;
  };
  return { rx: round(a), ry: round(b) };
}
