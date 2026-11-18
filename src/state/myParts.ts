/** „Meine Teile“: eigene Modelle dauerhaft auf dem Gerät speichern und wiederverwenden. */
import { useSyncExternalStore } from 'react';
import type { ModelDef, Value } from '../cad/types';

export interface MyPart {
  id: string;
  name: string;
  created: number;
  model: ModelDef;
  values: Record<string, Value>;
}

const KEY = 'formwerk-cad:meine-teile';
let list: MyPart[] = (() => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MyPart[]) : [];
  } catch {
    return [];
  }
})();
const subs = new Set<() => void>();
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    throw new Error('Gerätespeicher voll – bitte alte Teile löschen');
  }
  subs.forEach((f) => f());
};

export const myParts = {
  get: () => list,
  subscribe: (f: () => void) => (subs.add(f), () => void subs.delete(f)),
  add(name: string, model: ModelDef, values: Record<string, Value>) {
    const prev = list;
    list = [{ id: `t${Date.now().toString(36)}`, name: name.trim() || model.name, created: Date.now(), model: structuredClone(model), values: { ...values } }, ...list];
    try {
      save();
    } catch (e) {
      list = prev;
      throw e;
    }
  },
  remove(id: string) {
    list = list.filter((p) => p.id !== id);
    save();
  },
  rename(id: string, name: string) {
    list = list.map((p) => (p.id === id ? { ...p, name } : p));
    save();
  },
};

export function useMyParts(): MyPart[] {
  return useSyncExternalStore(myParts.subscribe, myParts.get, myParts.get);
}
