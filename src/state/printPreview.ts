/** Druckvorschau: aktuelle Schicht (0…1 der Höhe) – außerhalb des Stores, damit der Regler flüssig bleibt. */
import { useSyncExternalStore } from 'react';

let layer = 1;
const subs = new Set<() => void>();
export const printPreview = {
  get: () => layer,
  set(v: number) {
    layer = Math.min(1, Math.max(0, v));
    subs.forEach((f) => f());
  },
  subscribe: (f: () => void) => (subs.add(f), () => void subs.delete(f)),
};
export const usePrintLayer = () => useSyncExternalStore(printPreview.subscribe, printPreview.get, printPreview.get);
