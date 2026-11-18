/**
 * „Frei bauen“: Baukasten aus Grundformen, Löchern, Text und Gelenken.
 * Jedes Teil wird in einen normalen FWCAD-DSL-Baum übersetzt. Dadurch laufen
 * Vorschau, Druck-Check, Mehrfarben, Aufteilen und Export genau wie bei
 * Vorlagen und KI-Modellen – ohne eigene Geometrie-Engine.
 */
import type { CadNode, ModelDef } from './types';

export type FreeKind = 'quader' | 'zylinder' | 'kugel' | 'rohr' | 'keil' | 'hohlraum' | 'text' | 'schraubloch' | 'scharnier' | 'kugelgelenk';
export type V3 = [number, number, number];
export type FreeValue = number | boolean | string;

export interface FreePart {
  id: number;
  kind: FreeKind;
  name: string;
  /** true = wird von allen Körpern abgezogen */
  hole: boolean;
  /** Filament-Slot (Mehrfarbendruck) */
  slot: number;
  pos: V3;
  rot: V3;
  size: V3;
  e: Record<string, FreeValue>;
  lock?: boolean;
  /** Zusammengefügte Teile teilen eine Gruppen-Nummer und bewegen sich gemeinsam */
  group?: number;
  /** Nur Text: vorberechnete Schrift-Umrisse (Höhe 1, zentriert) */
  outline?: TextOutline | null;
}

/** Schrift-Umrisse, normiert auf Höhe 1 und um den Ursprung zentriert. */
export interface TextOutline {
  key: string;
  width: number;
  shapes: { outer: [number, number][]; holes: [number, number][][] }[];
}

export interface FieldDef {
  key: string;
  label: string;
  type: 'num' | 'bool' | 'text' | 'select';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hint?: string;
}

export interface KindDef {
  size: boolean;
  fields: FieldDef[];
  hint?: string;
}

export const KINDS: Record<FreeKind, KindDef> = {
  quader: { size: true, fields: [{ key: 'r', label: 'Eckenradius', type: 'num', min: 0, max: 50, step: 0.5, unit: 'mm' }] },
  zylinder: {
    size: true,
    fields: [
      { key: 'oben', label: 'Oben (0 = Spitze)', type: 'num', min: 0, max: 200, step: 1, unit: '%' },
      { key: 'seg', label: 'Ecken (0 = rund, 6 = Sechskant)', type: 'num', min: 0, max: 12, step: 1 },
    ],
  },
  kugel: { size: true, fields: [{ key: 'halb', label: 'Halbkugel', type: 'bool' }] },
  rohr: { size: true, fields: [{ key: 'wand', label: 'Wandstärke', type: 'num', min: 0.4, max: 50, step: 0.2, unit: 'mm' }] },
  keil: { size: true, fields: [] },
  hohlraum: {
    size: true,
    fields: [
      {
        key: 'dach',
        label: 'Decke',
        type: 'select',
        options: [
          { value: 'giebel', label: '45°-Satteldach (druckt ohne Stützen)' },
          { value: 'rund', label: 'Tropfenform (druckt ohne Stützen)' },
          { value: 'flach', label: 'Flach (braucht Stützmaterial)' },
        ],
      },
    ],
    hint: 'Ein verborgener Hohlraum im Inneren: spart Material oder dient als Versteck/Kanal. Komplett im Körper platzieren, damit er geschlossen bleibt. Die Decke ist so geformt, dass sie ohne Stützen druckbar ist.',
  },
  text: {
    size: false,
    fields: [
      { key: 'text', label: 'Text', type: 'text' },
      {
        key: 'font',
        label: 'Schriftart',
        type: 'select',
        options: [
          { value: 'sans', label: 'Standard' },
          { value: 'serif', label: 'Mit Serifen' },
          { value: 'mono', label: 'Schreibmaschine' },
          { value: 'einstrich', label: 'Einstrich (dünne Linie)' },
        ],
      },
      { key: 'fett', label: 'Fett', type: 'bool' },
      { key: 'hoehe', label: 'Schrifthöhe', type: 'num', min: 3, max: 150, step: 0.5, unit: 'mm' },
      { key: 'dicke', label: 'Dicke / Gravurtiefe', type: 'num', min: 0.4, max: 30, step: 0.2, unit: 'mm' },
      { key: 'strich', label: 'Strichstärke bei Einstrich (0 = automatisch)', type: 'num', min: 0, max: 10, step: 0.1, unit: 'mm' },
    ],
    hint: 'Als Körper steht die Schrift erhaben, als Loch wird sie eingraviert. Mehrere Zeilen mit Enter. Ab 6 mm Schrifthöhe wird sie am saubersten.',
  },
  schraubloch: {
    size: false,
    fields: [
      { key: 'd', label: 'Schrauben-Ø', type: 'num', min: 1.5, max: 12, step: 0.5, unit: 'mm' },
      { key: 'k', label: 'Kopf-Ø (0 = ohne Senkung)', type: 'num', min: 0, max: 24, step: 0.5, unit: 'mm' },
      { key: 'L', label: 'Länge', type: 'num', min: 2, max: 120, step: 0.5, unit: 'mm' },
    ],
    hint: 'Die Senkung zeigt nach oben. Mit „Drehung“ in die gewünschte Richtung drehen.',
  },
  scharnier: {
    size: false,
    fields: [
      { key: 'L', label: 'Länge', type: 'num', min: 10, max: 250, step: 1, unit: 'mm' },
      { key: 'D', label: 'Gelenk-Ø', type: 'num', min: 5, max: 30, step: 0.5, unit: 'mm' },
      { key: 'W', label: 'Blattbreite', type: 'num', min: 3, max: 100, step: 1, unit: 'mm' },
      { key: 't', label: 'Blattstärke', type: 'num', min: 1, max: 10, step: 0.2, unit: 'mm' },
      { key: 'n', label: 'Anzahl Glieder', type: 'num', min: 3, max: 9, step: 2 },
      { key: 'c', label: 'Spiel', type: 'num', min: 0.15, max: 1, step: 0.05, unit: 'mm' },
    ],
    hint: 'Wird fertig beweglich gedruckt. Verbinde jedes Blatt nur mit einem Teil, sonst ist das Scharnier festgeklebt. Zu fest? Spiel um 0,1 mm erhöhen.',
  },
  kugelgelenk: {
    size: false,
    fields: [
      { key: 'Dk', label: 'Kugel-Ø', type: 'num', min: 6, max: 50, step: 0.5, unit: 'mm' },
      { key: 'stiel', label: 'Stiel-Länge', type: 'num', min: 0, max: 80, step: 1, unit: 'mm' },
      { key: 'w', label: 'Wandstärke Pfanne', type: 'num', min: 1, max: 6, step: 0.2, unit: 'mm' },
      { key: 'c', label: 'Spiel', type: 'num', min: 0.15, max: 1, step: 0.05, unit: 'mm' },
    ],
    hint: 'Wird in einem Stück beweglich gedruckt. Nach dem Druck einmal kräftig bewegen, damit es sich löst.',
  },
};

export interface Preset {
  label: string;
  icon: string;
  kind: FreeKind;
  size?: V3;
  e: Record<string, FreeValue>;
  hole?: boolean;
}

export const PRESETS: Preset[] = [
  { label: 'Quader', icon: '▢', kind: 'quader', size: [20, 20, 10], e: { r: 0 } },
  { label: 'Zylinder', icon: '◯', kind: 'zylinder', size: [20, 20, 20], e: { oben: 100, seg: 0 } },
  { label: 'Kegel', icon: '△', kind: 'zylinder', size: [20, 20, 20], e: { oben: 0, seg: 0 } },
  { label: 'Kugel', icon: '●', kind: 'kugel', size: [20, 20, 20], e: { halb: false } },
  { label: 'Halbkugel', icon: '◓', kind: 'kugel', size: [20, 20, 10], e: { halb: true } },
  { label: 'Rohr', icon: '◎', kind: 'rohr', size: [20, 20, 20], e: { wand: 2 } },
  { label: 'Keil', icon: '◺', kind: 'keil', size: [20, 20, 10], e: {} },
  { label: 'Sechskant', icon: '⬡', kind: 'zylinder', size: [10, 10, 5], e: { oben: 100, seg: 6 } },
  { label: 'Text', icon: 'T', kind: 'text', e: { text: 'Hallo', font: 'sans', fett: true, hoehe: 10, dicke: 2, strich: 0 } },
  { label: 'Loch', icon: '⊖', kind: 'zylinder', size: [5, 5, 30], e: { oben: 100, seg: 0 }, hole: true },
  { label: 'Hohlraum', icon: '⬚', kind: 'hohlraum', size: [30, 20, 15], e: { dach: 'giebel' }, hole: true },
  { label: 'Magnetloch', icon: '🧲', kind: 'zylinder', size: [6.3, 6.3, 3.2], e: { oben: 100, seg: 0 }, hole: true },
  { label: 'Schraubloch', icon: '🔩', kind: 'schraubloch', e: { d: 4, k: 8, L: 10 }, hole: true },
  { label: 'Scharnier', icon: '🚪', kind: 'scharnier', e: { L: 40, D: 8, W: 15, t: 2.4, n: 5, c: 0.4 } },
  { label: 'Kugelgelenk', icon: '🦴', kind: 'kugelgelenk', e: { Dk: 12, stiel: 15, w: 2, c: 0.35 } },
  { label: 'Zapfen', icon: '▮', kind: 'zylinder', size: [8, 8, 10], e: { oben: 100, seg: 0 } },
];

// ------------------------------------------------------------ Hilfen
/** Löcher minimal größer bauen: deckungsgleiche Flächen (Loch endet genau an der
 *  Unterseite) würden sonst offene Kanten im Netz erzeugen. 0,02 mm sind im Druck unsichtbar. */
const HOLE_EPS = 0.02;

const r3 = (n: number) => Math.round(n * 1000) / 1000;
const num = (v: FreeValue | undefined, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const tr = (v: V3, children: CadNode[]): CadNode => ({ type: 'translate', v: [r3(v[0]), r3(v[1]), r3(v[2])], children });
const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): CadNode =>
  tr([x0, y0, z0], [{ type: 'cube', size: [r3(x1 - x0), r3(y1 - y0), r3(z1 - z0)] }]);
const cylX = (r: number, x0: number, x1: number): CadNode => tr([x0, 0, 0], [{ type: 'rotate', a: [0, 90, 0], children: [{ type: 'cylinder', r: r3(r), h: r3(x1 - x0) }] }]);
const cylZ = (r: number, z0: number, z1: number): CadNode => tr([0, 0, z0], [{ type: 'cylinder', r: r3(r), h: r3(z1 - z0) }]);
const scaleXY = (sx: number, sy: number, sz: number, n: CadNode): CadNode =>
  Math.abs(sx - 1) < 1e-6 && Math.abs(sy - 1) < 1e-6 && Math.abs(sz - 1) < 1e-6 ? n : { type: 'scale', v: [r3(sx), r3(sy), r3(sz)], children: [n] };

function ngon(n: number, rx: number, ry: number): [number, number][] {
  const off = n === 6 ? Math.PI / 6 : n === 4 ? Math.PI / 4 : 0;
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n + off;
    return [r3(rx * Math.cos(a)), r3(ry * Math.sin(a))] as [number, number];
  });
}

/** Geometrie eines Teils, um den Ursprung zentriert (ohne Position/Drehung). */
export function partShape(p: FreePart): CadNode {
  const [sx, sy, sz] = p.size.map((v) => Math.max(0.2, v)) as V3;
  const e = p.e;
  switch (p.kind) {
    case 'quader': {
      const r = Math.min(num(e.r, 0), sx / 2 - 0.01, sy / 2 - 0.01);
      return { type: 'extrude', h: r3(sz), center: true, shape: r > 0.05 ? { type: 'rect', size: [r3(sx), r3(sy)], r: r3(r), center: true } : { type: 'rect', size: [r3(sx), r3(sy)], center: true } };
    }
    case 'zylinder': {
      const seg = Math.round(num(e.seg, 0));
      if (seg >= 3) return { type: 'extrude', h: r3(sz), center: true, shape: { type: 'polygon', points: ngon(seg, sx / 2, sy / 2) } };
      const r = sx / 2,
        top = Math.max(0, num(e.oben, 100)) / 100;
      const c: CadNode =
        Math.abs(top - 1) < 1e-6
          ? { type: 'cylinder', r: r3(r), h: r3(sz), center: true }
          : { type: 'cylinder', r1: r3(r), r2: r3(Math.max(r * top, 0.001)), h: r3(sz), center: true };
      return scaleXY(1, sy / sx, 1, c);
    }
    case 'kugel': {
      const r = sx / 2;
      if (e.halb) {
        const half: CadNode = { type: 'difference', children: [{ type: 'sphere', r: r3(r) }, box(-r - 1, -r - 1, -r - 1, r + 1, r + 1, 0)] };
        return tr([0, 0, -sz / 2], [scaleXY(1, sy / sx, sz / r, half)]);
      }
      return scaleXY(1, sy / sx, sz / sx, { type: 'sphere', r: r3(r) });
    }
    case 'rohr': {
      const r = sx / 2,
        w = Math.min(num(e.wand, 2), r - 0.2);
      return scaleXY(1, sy / sx, 1, {
        type: 'difference',
        children: [
          { type: 'cylinder', r: r3(r), h: r3(sz), center: true },
          { type: 'cylinder', r: r3(r - w), h: r3(sz + 2), center: true },
        ],
      });
    }
    case 'hohlraum': {
      // Profil quer (Y) × Höhe (Z), entlang X extrudiert
      const hy = sy / 2,
        hz = sz / 2;
      let pts: [number, number][];
      if (e.dach === 'flach') pts = [[-hy, -hz], [hy, -hz], [hy, hz], [-hy, hz]];
      else if (e.dach === 'rund') {
        // Tropfen: Kreis unten, oben 45°-Spitze. Einheitsform: Breite 2, Höhe 1 + √2
        const H = 1 + Math.SQRT2;
        pts = [];
        for (let i = 0; i <= 24; i++) {
          const a = Math.PI * 0.75 + (i / 24) * Math.PI * 1.5;
          pts.push([Math.cos(a), Math.sin(a)]);
        }
        pts.push([0, Math.SQRT2]);
        pts = pts.map(([y, z]) => [r3(y * hy), r3(((z + 1) / H) * sz - hz)] as [number, number]);
      } else {
        const rh = Math.min(hy, sz);
        pts = [[-hy, -hz], [hy, -hz], [hy, r3(hz - rh)], [r3(hy - rh), hz], [r3(-hy + rh), hz], [-hy, r3(hz - rh)]];
        if (rh >= hy - 1e-6) pts = [[-hy, -hz], [hy, -hz], [hy, r3(hz - rh)], [0, hz], [-hy, r3(hz - rh)]];
      }
      return { type: 'rotate', a: [90, 0, 90], children: [{ type: 'extrude', h: r3(sx), center: true, shape: { type: 'polygon', points: pts } }] };
    }
    case 'keil':
      return {
        type: 'rotate',
        a: [90, 0, 0],
        children: [{ type: 'extrude', h: r3(sy), center: true, shape: { type: 'polygon', points: [[r3(-sx / 2), r3(-sz / 2)], [r3(sx / 2), r3(-sz / 2)], [r3(-sx / 2), r3(sz / 2)]] } }],
      };
    case 'text': {
      const d = num(e.dicke, 2),
        st = num(e.strich, 0),
        hh = num(e.hoehe, 10);
      const ol = p.outline;
      if (e.font !== 'einstrich' && ol && ol.shapes.length) {
        const sc = (q: [number, number]): [number, number] => [r3(q[0] * hh), r3(q[1] * hh)];
        const solids: CadNode[] = ol.shapes.map((sh) => ({
          type: 'extrude',
          h: r3(d),
          center: true,
          shape: { type: 'polygon', points: sh.outer.map(sc), ...(sh.holes.length ? { holes: sh.holes.map((hl) => hl.map(sc)) } : {}) },
        }));
        return solids.length === 1 ? solids[0] : { type: 'union', children: solids };
      }
      const txt = String(e.text ?? '').replace(/[{}]/g, '').trim() || ' ';
      const t: CadNode = st > 0 ? { type: 'text', text: txt, size: r3(num(e.hoehe, 10)), h: r3(d), center: true, stroke: r3(st) } : { type: 'text', text: txt, size: r3(num(e.hoehe, 10)), h: r3(d), center: true };
      return tr([0, 0, -d / 2], [t]);
    }
    case 'schraubloch': {
      const d = num(e.d, 4) + 0.3,
        L = num(e.L, 10),
        k = num(e.k, 0) > num(e.d, 4) ? num(e.k, 0) + 0.3 : 0;
      if (!k) return cylZ(d / 2, -L / 2 - HOLE_EPS, L / 2 + HOLE_EPS);
      // Schaft endet innerhalb der Senkung, Kopffreiraum setzt genau an der Senkung an
      // → keine hauchdünnen Überlappungen, die offene Kanten erzeugen würden.
      const s = Math.min((k - d) / 2, L);
      const kids: CadNode[] = [
        cylZ(d / 2, -L / 2 - HOLE_EPS, L / 2 - s / 2),
        tr([0, 0, L / 2 - s], [{ type: 'cylinder', r1: r3(d / 2), r2: r3(k / 2), h: r3(s) }]),
        cylZ(k / 2, L / 2, L / 2 + 1),
      ];
      return { type: 'union', children: kids };
    }
    case 'scharnier':
      return hinge(e);
    case 'kugelgelenk':
      return ballJoint(e);
  }
}

/** Scharnier entlang X, druckbar in einem Stück (Blätter liegen auf dem Bett). */
function hinge(e: Record<string, FreeValue>): CadNode {
  const L = num(e.L, 40),
    R = num(e.D, 8) / 2,
    c = num(e.c, 0.4),
    W = num(e.W, 15);
  const n = Math.max(3, Math.round(num(e.n, 5)) | 1);
  const t = Math.min(num(e.t, 2.4), R * 1.2);
  const rp = Math.max(R * 0.45, 1);
  const seg = (L - (n - 1) * c) / n;
  const zb = -R,
    zt = -R + t;
  const A: CadNode[] = [box(-L / 2, -(R + c) - W, zb, L / 2, -(R + c), zt)];
  const Bk: CadNode[] = [box(-L / 2, R + c, zb, L / 2, R + c + W, zt)];
  for (let i = 0; i < n; i++) {
    const x0 = -L / 2 + i * (seg + c),
      x1 = x0 + seg;
    if (i % 2 === 0) A.push(cylX(R, x0, x1), box(x0, -(R + c) - 0.5, zb, x1, 0, zt));
    else Bk.push(cylX(R, x0, x1), box(x0, 0, zb, x1, R + c + 0.5, zt));
  }
  A.push(cylX(rp, -L / 2, L / 2));
  return {
    type: 'union',
    children: [
      { type: 'union', children: A },
      { type: 'difference', children: [{ type: 'union', children: Bk }, cylX(rp + c, -L / 2 - 1, L / 2 + 1)] },
    ],
  };
}

/** Kugelgelenk: Pfanne mit Standfuß + Kugel mit Stiel, beweglich in einem Stück. */
function ballJoint(e: Record<string, FreeValue>): CadNode {
  const R = num(e.Dk, 12) / 2,
    c = num(e.c, 0.35),
    stiel = num(e.stiel, 15);
  const Ri = R + c,
    Ro = Ri + num(e.w, 2),
    hc = 0.6 * R;
  const socket: CadNode = {
    type: 'difference',
    children: [
      { type: 'union', children: [{ type: 'sphere', r: r3(Ro) }, cylZ(0.75 * Ro, -Ro, 0)] },
      { type: 'sphere', r: r3(Ri) },
      box(-Ro - 2, -Ro - 2, hc, Ro + 2, Ro + 2, Ro + 2),
    ],
  };
  const ball: CadNode = { type: 'union', children: [{ type: 'sphere', r: r3(R) }, cylZ(0.45 * R, 0, R + stiel)] };
  return tr([0, 0, (Ro - (R + stiel)) / 2], [{ type: 'union', children: [socket, ball] }]);
}

/** Ungefähre Hüllbox eines Teils (lokal, zentriert) – für Platzieren & Stapeln. */
export function localExtent(p: FreePart): V3 {
  const e = p.e;
  switch (p.kind) {
    case 'text': {
      const h = num(e.hoehe, 10);
      const w = p.outline && e.font !== 'einstrich' ? p.outline.width * h : Math.max(h, String(e.text ?? '').length * h);
      return [w, h * 1.3, num(e.dicke, 2)];
    }
    case 'schraubloch':
      return [Math.max(num(e.d, 4), num(e.k, 0)) + 0.3, Math.max(num(e.d, 4), num(e.k, 0)) + 0.3, num(e.L, 10) + 1];
    case 'scharnier': {
      const R = num(e.D, 8) / 2;
      return [num(e.L, 40), 2 * (R + num(e.c, 0.4) + num(e.W, 15)), 2 * R];
    }
    case 'kugelgelenk': {
      const R = num(e.Dk, 12) / 2,
        Ro = R + num(e.c, 0.35) + num(e.w, 2);
      return [2 * Ro, 2 * Ro, Ro + R + num(e.stiel, 15)];
    }
    default:
      return p.size;
  }
}

/** Weltbox (min/max) eines Teils inkl. Drehung – über die 8 Ecken der lokalen Box. */
export function worldBox(p: FreePart): { min: V3; max: V3 } {
  const [hx, hy, hz] = localExtent(p).map((v) => v / 2);
  const [a, b, c] = p.rot.map((d) => (d * Math.PI) / 180);
  const min: V3 = [Infinity, Infinity, Infinity],
    max: V3 = [-Infinity, -Infinity, -Infinity];
  for (const sx of [-1, 1])
    for (const sy of [-1, 1])
      for (const sz of [-1, 1]) {
        let x = sx * hx,
          y = sy * hy,
          z = sz * hz;
        // gleiche Reihenfolge wie der rotate-Knoten: erst X, dann Y, dann Z
        [y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
        [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];
        [x, y] = [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)];
        const q = [x + p.pos[0], y + p.pos[1], z + p.pos[2]];
        for (let i = 0; i < 3; i++) {
          min[i] = Math.min(min[i], q[i]);
          max[i] = Math.max(max[i], q[i]);
        }
      }
  return { min, max };
}

function placed(p: FreePart): CadNode {
  const q = p.hole && KINDS[p.kind].size ? { ...p, size: p.size.map((v) => v + 2 * HOLE_EPS) as V3 } : p;
  const shape = partShape(q);
  const rotated: CadNode = p.rot.some((v) => Math.abs(v) > 1e-9) ? { type: 'rotate', a: [r3(p.rot[0]), r3(p.rot[1]), r3(p.rot[2])], children: [shape] } : shape;
  return tr(p.pos, [rotated]);
}

/** Baut aus den Teilen ein normales Formwerk-Modell. */
export function freeToModel(parts: FreePart[]): ModelDef | null {
  const bodies = parts.filter((p) => !p.hole);
  if (!bodies.length) return null;
  const holeParts = parts.filter((p) => p.hole);
  const slots = [...new Set(bodies.map((b) => b.slot || 1))].sort((a, b) => a - b);
  const group = (list: FreePart[]): CadNode => (list.length === 1 ? placed(list[0]) : { type: 'union', children: list.map(placed) });
  /** Bei mehreren Farben nur die Löcher abziehen, die das Farbteil auch berühren (großzügige Hüllbox).
   *  Das spart Rechenzeit und vermeidet unnötige Boolesche Schnitte an weit entfernten Teilen. */
  const holesFor = (list: FreePart[]): CadNode[] => {
    if (slots.length <= 1) return holeParts.map(placed);
    const bs = list.map(worldBox);
    const m = 2;
    return holeParts
      .filter((h) => {
        const hb = worldBox(h);
        return bs.some((b) => [0, 1, 2].every((k) => hb.min[k] - m < b.max[k] && hb.max[k] + m > b.min[k]));
      })
      .map(placed);
  };
  const solid = (list: FreePart[]): CadNode => {
    const hs = holesFor(list);
    return hs.length ? { type: 'difference', children: [group(list), ...hs] } : group(list);
  };
  const root: CadNode[] =
    slots.length <= 1
      ? [solid(bodies)]
      : slots.map((s) => ({ type: 'color', slot: s, name: `Farbe ${s}`, children: [solid(bodies.filter((b) => (b.slot || 1) === s))] }));
  return {
    name: 'Eigenes Modell',
    description: `Frei gebaut aus ${parts.length} Teil${parts.length === 1 ? '' : 'en'}`,
    params: [],
    root,
    source: 'custom',
    templateId: 'frei',
  };
}

export function newPart(preset: Preset, id: number): FreePart {
  return {
    id,
    kind: preset.kind,
    name: `${preset.label} ${id}`,
    hole: !!preset.hole,
    slot: 1,
    pos: [0, 0, 0],
    rot: [0, 0, 0],
    size: preset.size ? [...preset.size] : [10, 10, 10],
    e: { ...preset.e },
  };
}
