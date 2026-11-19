/** Verlauf wie in CAD-Programmen: automatische Zwischenstände mit Beschreibung, zu jedem zurückspringen. */
import { useSyncExternalStore } from 'react';
import type { ModelDef, Value } from '../cad/types';

export interface Snapshot {
  id: number;
  at: number;
  label: string;
  model: ModelDef;
  values: Record<string, Value>;
}
let list: Snapshot[] = [];
let next = 1;
let lastKey = '';
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

const fmtV = (v: Value | undefined) => (typeof v === 'number' ? String(Math.round(v * 100) / 100).replace('.', ',') : typeof v === 'boolean' ? (v ? 'an' : 'aus') : String(v ?? '–'));

function describe(prev: Snapshot | undefined, model: ModelDef, values: Record<string, Value>): string {
  if (!prev || prev.model.name !== model.name || prev.model.templateId !== model.templateId) return `Neu: ${model.name}`;
  const changed = model.params.filter((p) => JSON.stringify(prev.values[p.key]) !== JSON.stringify(values[p.key]));
  if (changed.length === 1) return `${changed[0].label}: ${fmtV(prev.values[changed[0].key])} → ${fmtV(values[changed[0].key])}`;
  if (changed.length > 1) return `${changed.length} Werte geändert`;
  const pf = (prev.model.freeParts?.length ?? 0) - (model.freeParts?.length ?? 0);
  if (pf < 0) return `${-pf} Teil${pf === -1 ? '' : 'e'} hinzugefügt`;
  if (pf > 0) return `${pf} Teil${pf === 1 ? '' : 'e'} entfernt`;
  if (JSON.stringify(prev.model.xform) !== JSON.stringify(model.xform)) return 'Skaliert / gespiegelt';
  if (prev.model.freeParts) return 'Teile verändert';
  if (JSON.stringify(prev.model.root) !== JSON.stringify(model.root)) return 'Konstruktion geändert';
  return 'Geändert';
}

export const timeline = {
  get: () => list,
  subscribe: (f: () => void) => (subs.add(f), () => void subs.delete(f)),
  record(model: ModelDef, values: Record<string, Value>) {
    const key = JSON.stringify([model, values]);
    if (key === lastKey) return;
    lastKey = key;
    const label = describe(list[0], model, values);
    list = [{ id: next++, at: Date.now(), label, model: structuredClone(model), values: { ...values } }, ...list].slice(0, 40);
    emit();
  },
  /** Beim Zurückspringen nicht sofort einen neuen Eintrag erzeugen */
  mark(model: ModelDef, values: Record<string, Value>) {
    lastKey = JSON.stringify([model, values]);
  },
  clear() {
    list = [];
    lastKey = '';
    emit();
  },
};
export const useTimeline = () => useSyncExternalStore(timeline.subscribe, timeline.get, timeline.get);
