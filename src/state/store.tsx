import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { DEFAULT_AI, type AiSettings } from '../ai/providers';
import { defaultValues } from '../cad/validate';
import type { ColorZone, FilamentSlot, ModelDef, Orientation, Value } from '../cad/types';
import type { BuildResult } from './pipeline';
import { DEFAULT_SPLIT, type SplitOptions } from '../cad/split';
import { DEFAULT_HOLLOW, type HollowOptions } from '../cad/build';
import { PROFILES, type PrintProfile } from '../mesh/mesh';

export type Mode = 'text' | 'photo' | 'library' | 'free';

export interface Settings {
  ai: AiSettings;
  bedSize: number;
  bedHeight: number;
  material: string;
  profile: PrintProfile;
  layer: number;
  overhangDeg: number;
  tol: number;
  fase: boolean;
  palette: FilamentSlot[];
  split: SplitOptions;
  hollow: HollowOptions;
}

export interface ViewOpts {
  /** -1 = Modell/Zusammenbau, ≥1 = Druckplatte n */
  plate: number;
  xray: boolean;
  section: boolean;
  sectionAxis: 'x' | 'y' | 'z';
  sectionPos: number; // 0..1
  dims: boolean;
  overhangs: boolean;
}

export interface State {
  mode: Mode;
  model: ModelDef | null;
  values: Record<string, Value>;
  orientation: Orientation;
  zonesOn: boolean;
  zones: ColorZone[];
  build: BuildResult | null;
  buildError: string | null;
  building: boolean;
  busy: string | null; // KI läuft …
  toast: { kind: 'ok' | 'err' | 'info'; text: string } | null;
  settings: Settings;
  view: ViewOpts;
  showSettings: boolean;
  showCode: boolean;
  history: { model: ModelDef; values: Record<string, Value> }[];
  modelVersion: number; // erhöht sich bei neuem Modell → Kamera neu ausrichten
}

export const DEFAULT_PALETTE: FilamentSlot[] = [
  { slot: 1, name: 'Weiß', color: '#e9ecef' },
  { slot: 2, name: 'Schwarz', color: '#2b2f36' },
  { slot: 3, name: 'Rot', color: '#e03131' },
  { slot: 4, name: 'Blau', color: '#1c7ed6' },
];

const DEFAULT_SETTINGS: Settings = {
  ai: DEFAULT_AI,
  bedSize: 256,
  bedHeight: 256,
  material: 'pla',
  profile: { ...PROFILES.standard },
  layer: 0.2,
  overhangDeg: 45,
  tol: 0.2,
  fase: true,
  palette: DEFAULT_PALETTE,
  split: DEFAULT_SPLIT,
  hollow: DEFAULT_HOLLOW,
};

const STORE_KEY = 'formwerk-cad:settings:v1';
function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const s = JSON.parse(raw);
    // Veraltete Gemini-Modelle automatisch auf das aktuelle umstellen
    let hint: string | null = null;
    try {
      hint = localStorage.getItem('formwerk-cad:gemini-model-hint');
    } catch {
      /* egal */
    }
    if (s.ai && (!s.ai.geminiModel || /^gemini-(1|2)\./.test(s.ai.geminiModel))) s.ai.geminiModel = hint || DEFAULT_AI.geminiModel;
    return {
      ...DEFAULT_SETTINGS,
      ...s,
      ai: { ...DEFAULT_AI, ...(s.ai ?? {}) },
      palette: s.palette?.length ? s.palette : DEFAULT_PALETTE,
      profile: { ...DEFAULT_SETTINGS.profile, ...(s.profile ?? {}) },
      split: { ...DEFAULT_SPLIT, ...(s.split ?? {}), enabled: false },
      hollow: { ...DEFAULT_HOLLOW, ...(s.hollow ?? {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export type Action =
  | { type: 'mode'; mode: Mode }
  | { type: 'setModel'; model: ModelDef; values?: Record<string, Value> }
  /** Frei bauen: Modell ersetzen, ohne Kamera neu auszurichten und ohne Verlaufseintrag pro Regler-Bewegung. */
  | { type: 'freeModel'; model: ModelDef }
  /** Frei bauen: leeres Feld → keine Vorschau, kein Export */
  | { type: 'clearModel' }
  | { type: 'param'; key: string; value: Value }
  | { type: 'resetParams' }
  | { type: 'orientation'; o: Orientation }
  | { type: 'zonesOn'; on: boolean }
  | { type: 'zones'; zones: ColorZone[] }
  | { type: 'buildStart' }
  | { type: 'buildOk'; build: BuildResult }
  | { type: 'buildErr'; error: string }
  | { type: 'busy'; text: string | null }
  | { type: 'toast'; kind: 'ok' | 'err' | 'info'; text: string }
  | { type: 'clearToast' }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'view'; patch: Partial<ViewOpts> }
  | { type: 'showSettings'; on: boolean }
  | { type: 'showCode'; on: boolean }
  | { type: 'undo' };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'mode':
      return { ...s, mode: a.mode };
    case 'setModel': {
      const history = s.model ? [...s.history.slice(-19), { model: s.model, values: s.values }] : s.history;
      return {
        ...s,
        model: a.model,
        values: a.values ?? defaultValues(a.model),
        orientation: { rx: 0, ry: 0 },
        buildError: null,
        view: { ...s.view, plate: -1 },
        history,
        modelVersion: s.modelVersion + 1,
      };
    }
    case 'freeModel': {
      const fresh = s.model?.templateId !== 'frei';
      return {
        ...s,
        model: a.model,
        values: {},
        buildError: null,
        ...(fresh
          ? {
              orientation: { rx: 0, ry: 0 },
              view: { ...s.view, plate: -1 },
              history: s.model ? [...s.history.slice(-19), { model: s.model, values: s.values }] : s.history,
              modelVersion: s.modelVersion + 1,
            }
          : {}),
      };
    }
    case 'clearModel':
      return {
        ...s,
        model: null,
        values: {},
        build: null,
        buildError: null,
        building: false,
        // gelöschtes Objekt bleibt im Verlauf → mit ↶ wiederherstellbar
        history: s.model ? [...s.history.slice(-19), { model: s.model, values: s.values }] : s.history,
      };
    case 'param':
      return { ...s, values: { ...s.values, [a.key]: a.value } };
    case 'resetParams':
      return s.model ? { ...s, values: defaultValues(s.model) } : s;
    case 'orientation':
      return { ...s, orientation: a.o };
    case 'zonesOn':
      return { ...s, zonesOn: a.on };
    case 'zones':
      return { ...s, zones: a.zones };
    case 'buildStart':
      return { ...s, building: true };
    case 'buildOk':
      return { ...s, building: false, build: a.build, buildError: null };
    case 'buildErr':
      return { ...s, building: false, buildError: a.error };
    case 'busy':
      return { ...s, busy: a.text };
    case 'toast':
      return { ...s, toast: { kind: a.kind, text: a.text } };
    case 'clearToast':
      return { ...s, toast: null };
    case 'settings':
      return { ...s, settings: { ...s.settings, ...a.patch } };
    case 'view':
      return { ...s, view: { ...s.view, ...a.patch } };
    case 'showSettings':
      return { ...s, showSettings: a.on };
    case 'showCode':
      return { ...s, showCode: a.on };
    case 'undo': {
      const last = s.history[s.history.length - 1];
      if (!last) return s;
      return { ...s, model: last.model, values: last.values, history: s.history.slice(0, -1), modelVersion: s.modelVersion + 1 };
    }
  }
}

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function StoreProvider({ children, initialModel = null }: { children: ReactNode; initialModel?: ModelDef | null }) {
  const [state, dispatch] = useReducer(reducer, undefined, (): State => ({
    mode: 'text',
    model: initialModel,
    values: initialModel ? defaultValues(initialModel) : {},
    orientation: { rx: 0, ry: 0 },
    zonesOn: false,
    zones: [
      { z: 0, slot: 1 },
      { z: 3, slot: 2 },
    ],
    build: null,
    buildError: null,
    building: false,
    busy: null,
    toast: null,
    settings: loadSettings(),
    view: { plate: -1, xray: false, section: false, sectionAxis: 'x', sectionPos: 0.5, dims: true, overhangs: true },
    showSettings: false,
    showCode: false,
    history: [],
    modelVersion: 1,
  }));
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.settings));
    } catch {
      /* Speicher nicht verfügbar – egal */
    }
  }, [state.settings]);
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'clearToast' }), state.toast.kind === 'err' ? 7000 : 3500);
    return () => clearTimeout(t);
  }, [state.toast]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('StoreProvider fehlt');
  return c;
}
