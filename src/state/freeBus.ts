/**
 * Verbindung zwischen „Frei bauen“ (Teileliste, Bearbeiten) und der 3D-Ansicht
 * (Anklicken, Rechtsklick-Menü). Frei bauen bleibt Besitzer der Teile; die
 * Ansicht liest nur den aktuellen Stand und schickt Befehle.
 */
import { useSyncExternalStore } from 'react';
import type { FreePart } from '../cad/free';

export interface FreeSnapshot {
  parts: FreePart[];
  sel: number[];
}

export type FreeAction =
  | 'hole'
  | 'body'
  | 'matchHole'
  | 'duplicate'
  | 'delete'
  | 'drop'
  | 'onTop'
  | 'rotZ'
  | 'rotX'
  | 'rotY'
  | 'group'
  | 'ungroup'
  | 'color'
  | 'add'
  | 'addHole'
  | 'selectAll'
  | 'raster'
  | 'undo'
  | 'weld';

export type FreeCommand =
  | { type: 'select'; ids: number[]; additive?: boolean }
  /** Baukasten mit diesen Teilen neu füllen (andere Platte geöffnet) */
  | { type: 'load'; parts: FreePart[] }
  /** Teile (z. B. aus „Meine Teile“) als Gruppe rechts neben die vorhandenen einfügen */
  | { type: 'insert'; parts: FreePart[]; name: string }
  /** Mit der Maus in der 3D-Ansicht verschoben / gedreht (gilt für die ganze Auswahl) */
  | { type: 'transform'; move?: [number, number, number]; rot?: { axis: 0 | 1 | 2; deg: number; pivot: [number, number, number] } }
  | { type: 'action'; action: FreeAction; ids: number[]; arg?: string | number; at?: [number, number] };

export interface MenuState {
  x: number;
  y: number;
  /** angeklicktes Teil oder null (leere Fläche) */
  id: number | null;
  /** Punkt auf dem Druckbett (Modellkoordinaten), falls getroffen */
  at: [number, number] | null;
}

let snap: FreeSnapshot = { parts: [], sel: [] };
let menu: MenuState | null = null;
const listeners = new Set<() => void>();
let handler: ((c: FreeCommand) => void) | null = null;
const emit = () => listeners.forEach((l) => l());

export const freeBus = {
  publish(s: FreeSnapshot) {
    snap = s;
    emit();
  },
  get: () => snap,
  getMenu: () => menu,
  openMenu(m: MenuState | null) {
    menu = m;
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setHandler(h: ((c: FreeCommand) => void) | null) {
    handler = h;
  },
  send(c: FreeCommand) {
    handler?.(c);
  },
};

export function useFreeSnapshot(): FreeSnapshot {
  return useSyncExternalStore(freeBus.subscribe, freeBus.get, freeBus.get);
}
export function useFreeMenu(): MenuState | null {
  return useSyncExternalStore(freeBus.subscribe, freeBus.getMenu, freeBus.getMenu);
}
