/**
 * Malen aufs Modell (wie die Mal-Werkzeuge in Bambu Studio / OrcaSlicer):
 * Farbe (Filament-Nr.) und Stützen (erzwingen/blockieren) je Dreieck. Wird ins 3MF geschrieben.
 */
import { useSyncExternalStore } from 'react';
import type { PartResult } from './pipeline';

export type PaintMode = 'color' | 'enforce' | 'block' | 'erase';
interface PaintState {
  mode: PaintMode;
  slot: number;
  radius: number;
  sig: string;
  color: Map<number, Uint8Array>;
  support: Map<number, Uint8Array>;
  version: number;
}
let st: PaintState = { mode: 'color', slot: 2, radius: 4, sig: '', color: new Map(), support: new Map(), version: 0 };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

/** Kennung der Netze – bleibt die Geometrie gleich, bleibt die Bemalung erhalten. */
export function partsSig(parts: PartResult[]): string {
  return parts.map((p) => `${p.role ?? ''}${p.mesh.tri.length}:${p.stats.volume.toFixed(2)}`).join('|');
}

export const paint = {
  get: () => st,
  subscribe: (f: () => void) => (subs.add(f), () => void subs.delete(f)),
  set(p: Partial<Pick<PaintState, 'mode' | 'slot' | 'radius'>>) {
    st = { ...st, ...p };
    emit();
  },
  /** Bemalung an neue Netze anpassen (bei geänderter Geometrie verwerfen). */
  sync(parts: PartResult[]): boolean {
    const sig = partsSig(parts);
    if (sig === st.sig) return true;
    const had = st.color.size + st.support.size > 0;
    st = { ...st, sig, color: new Map(), support: new Map(), version: st.version + 1 };
    emit();
    return !had;
  },
  /** Dreiecke eines Teils bemalen. */
  apply(part: number, tris: number[], triCount: number) {
    const get = (m: Map<number, Uint8Array>) => {
      let a = m.get(part);
      if (!a) m.set(part, (a = new Uint8Array(triCount)));
      return a;
    };
    if (st.mode === 'color') {
      const a = get(st.color);
      for (const t of tris) a[t] = st.slot;
    } else if (st.mode === 'erase') {
      const a = st.color.get(part),
        b = st.support.get(part);
      for (const t of tris) {
        if (a) a[t] = 0;
        if (b) b[t] = 0;
      }
    } else {
      const a = get(st.support);
      for (const t of tris) a[t] = st.mode === 'enforce' ? 1 : 2;
    }
    st = { ...st, version: st.version + 1 };
    emit();
  },
  clear() {
    st = { ...st, color: new Map(), support: new Map(), version: st.version + 1 };
    emit();
  },
  /** Bemalung fürs Exportieren (nur wenn sie zu genau diesen Netzen gehört). */
  forExport(parts: PartResult[], i: number): { paintColor?: Uint8Array; paintSupport?: Uint8Array } {
    if (partsSig(parts) !== st.sig) return {};
    const c = st.color.get(i),
      s = st.support.get(i);
    return { ...(c && c.some((v) => v) ? { paintColor: c } : {}), ...(s && s.some((v) => v) ? { paintSupport: s } : {}) };
  },
  painted: () => [...st.color.values(), ...st.support.values()].some((a) => a.some((v) => v)),
};
export const usePaint = () => useSyncExternalStore(paint.subscribe, paint.get, paint.get);
