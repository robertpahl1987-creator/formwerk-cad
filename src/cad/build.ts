/**
 * Baut den DSL-Baum mit @jscad/modeling zu exakter CSG-Geometrie.
 * Alle Körper entstehen aus Primitiven + Booleschen Operationen –
 * das Ergebnis ist per Konstruktion geschlossen (wasserdicht).
 */
import * as jscad from '@jscad/modeling';
import { bool, ExprError, num, type Scope } from './expr';
import { fillText, normalizeText } from './text';
import { splitParts, type SplitOptions, type SplitReport } from './split';
import { analyzeMesh, meshFromPolygons } from '../mesh/mesh';
import { getImported } from '../mesh/importMesh';
import type { CadNode, ColorZone, Globals, ModelDef, Orientation, Shape2D, Value, Vec2, Vec3 } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Geom = any;
const { primitives: P, booleans: B, transforms: T, extrusions: E, expansions: X, hulls: H, geometries: G } = jscad as any;

const DEG = Math.PI / 180;
const MAX_NODES = 20000;
const MAX_LOOP = 1000;

export class BuildError extends Error {}

interface Ctx {
  scope: Scope;
  count: { n: number };
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
/** Segmentzahl aus Radius: ~0,5 mm Kantenlänge, Vielfaches von 4 (symmetrisch). */
/**
 * Gewinde als verdrehte Extrusion: der Querschnitt ist ein Kreis, dessen Radius dem Gewindeprofil
 * entlang einer Umdrehung folgt; die Drehung um 360° je Steigung erzeugt die exakte Schraubenlinie.
 */
export function threadProfile(p: number, iso: boolean): { depth: number; r: (phi: number) => number } {
  // Anteile einer Steigung: Spitze (Kamm), Flanke hoch, Grund, Flanke runter
  const crest = p / 8,
    root = iso ? p / 4 : p / 8;
  const depth = iso ? 0.5413 * p : (p - crest - root) / 2; // druckoptimiert: 45°-Flanken
  const flank = (p - crest - root) / 2;
  return {
    depth,
    r: (phi: number) => {
      const x = phi * p; // 0..p
      if (x < crest) return 0;
      if (x < crest + flank) return ((x - crest) / flank) * depth;
      if (x < crest + flank + root) return depth;
      return depth - ((x - crest - flank - root) / flank) * depth;
    },
  };
}
function threadGeom(d: number, p: number, h: number, iso: boolean, chamfer: boolean, left: boolean): Geom {
  const { depth, r } = threadProfile(p, iso);
  const R = d / 2;
  const N = clamp(Math.round((Math.PI * d) / 0.45 / 8) * 8, 64, 192);
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const th = (2 * Math.PI * i) / N;
    const phi = (((left ? i / N : 1 - i / N) % 1) + 1) % 1;
    const rr = R - r(phi);
    pts.push([rr * Math.cos(th), rr * Math.sin(th)]);
  }
  const turns = h / p;
  let g = E.extrudeLinear({ height: h, twistAngle: (left ? -1 : 1) * 2 * Math.PI * turns, twistSteps: Math.max(8, Math.ceil(turns * 32)) }, G.geom2.fromPoints(pts));
  if (chamfer) {
    // 45°-Fase an beiden Enden (leichter Ansatz der Mutter)
    const c = Math.min(depth, h / 4);
    const sg = segs(R);
    const cut = H.hull(
      T.translate([0, 0, c / 2], P.cylinder({ radius: R - c, height: c, segments: sg })),
      T.translate([0, 0, h / 2], P.cylinder({ radius: R + 0.01, height: h - 2 * c, segments: sg })),
      T.translate([0, 0, h - c / 2], P.cylinder({ radius: R - c, height: c, segments: sg })),
    );
    g = B.intersect(g, cut);
  }
  return g;
}

function segs(r: number, fn?: number): number {
  if (fn && fn >= 3) return Math.max(4, Math.ceil(fn / 4) * 4);
  // In 16er-Stufen: benachbarte Radien (Bohrung + Fase/Senkung) bekommen dieselbe
  // Teilung → deckungsgleiche Kanten statt hauchdünner Splitter nach dem CSG.
  const n = (2 * Math.PI * r) / 0.5;
  return clamp(Math.ceil(n / 16) * 16, 32, 160);
}
const v2 = (v: Vec2, s: Scope, w: string): [number, number] => [num(v[0], s, w), num(v[1], s, w)];
const v3 = (v: Vec3, s: Scope, w: string): [number, number, number] => [num(v[0], s, w), num(v[1], s, w), num(v[2], s, w)];

function positive(n: number, what: string): number {
  if (!(n > 0)) throw new BuildError(`${what} muss größer als 0 sein (ist ${n.toFixed(3)})`);
  return n;
}

function radius(n: { r?: unknown; d?: unknown }, s: Scope, what: string): number {
  if (n.r !== undefined) return positive(num(n.r as any, s, what), what);
  return positive(num(n.d as any, s, what) / 2, what);
}

function signedArea(pts: [number, number][]): number {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j][0] - pts[i][0]) * (pts[j][1] + pts[i][1]);
  return a / 2;
}
function ccw(pts: [number, number][]): [number, number][] {
  // Doppelte aufeinanderfolgende Punkte entfernen
  const out: [number, number][] = [];
  for (const p of pts) {
    const q = out[out.length - 1];
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6) out.push(p);
  }
  if (out.length > 1) {
    const f = out[0],
      l = out[out.length - 1];
    if (Math.hypot(f[0] - l[0], f[1] - l[1]) < 1e-6) out.pop();
  }
  if (out.length < 3) throw new BuildError('Polygon hat weniger als 3 unterschiedliche Punkte');
  return signedArea(out) < 0 ? out.reverse() : out;
}

function shape2d(sh: Shape2D, s: Scope): Geom {
  switch (sh.type) {
    case 'rect': {
      const [w, h] = v2(sh.size, s, 'rect.size');
      positive(w, 'Rechteck-Breite');
      positive(h, 'Rechteck-Höhe');
      const center: [number, number] = sh.center ? [0, 0] : [w / 2, h / 2];
      const r = sh.r !== undefined ? num(sh.r, s, 'rect.r') : 0;
      if (r > 0.001) {
        const rr = Math.min(r, Math.min(w, h) / 2 - 0.001);
        if (rr > 0.001) return P.roundedRectangle({ size: [w, h], roundRadius: rr, segments: segs(rr) * 1, center });
      }
      return P.rectangle({ size: [w, h], center });
    }
    case 'circle': {
      const r = radius(sh, s, 'Kreisradius');
      return P.circle({ radius: r, segments: segs(r, sh.fn !== undefined ? num(sh.fn, s) : undefined) });
    }
    case 'polygon': {
      const outer = ccw(sh.points.map((p) => v2(p, s, 'polygon.points')));
      let g = P.polygon({ points: outer });
      if (sh.holes && sh.holes.length) {
        const holes = sh.holes.filter((h) => h.length >= 3).map((h) => P.polygon({ points: ccw(h.map((p) => v2(p, s, 'polygon.holes'))) }));
        if (holes.length) g = B.subtract(g, ...holes);
      }
      if (sh.offset !== undefined) {
        const d = num(sh.offset, s, 'polygon.offset');
        if (Math.abs(d) > 1e-4) g = X.offset({ delta: d, corners: 'round', segments: 32 }, g);
      }
      return g;
    }
  }
  throw new BuildError(`Unbekannte 2D-Form`);
}

function unionAll(list: Geom[]): Geom | null {
  const l = list.filter(Boolean);
  if (l.length === 0) return null;
  if (l.length === 1) return l[0];
  return B.union(...l);
}

function children(nodes: CadNode[] | undefined, ctx: Ctx): Geom[] {
  const out: Geom[] = [];
  for (const n of nodes ?? []) out.push(...build(n, ctx));
  return out;
}

function build(n: CadNode, ctx: Ctx): Geom[] {
  if (++ctx.count.n > MAX_NODES) throw new BuildError('Modell zu komplex (zu viele Knoten / Schleifen)');
  const s = ctx.scope;
  switch (n.type) {
    case 'cube': {
      const size = v3(n.size, s, 'cube.size');
      size.forEach((x, i) => positive(x, `Quader-Maß ${'XYZ'[i]}`));
      return [P.cuboid({ size, center: n.center ? [0, 0, 0] : [size[0] / 2, size[1] / 2, size[2] / 2] })];
    }
    case 'roundedCube': {
      const size = v3(n.size, s, 'roundedCube.size');
      size.forEach((x, i) => positive(x, `Quader-Maß ${'XYZ'[i]}`));
      const center: [number, number, number] = n.center ? [0, 0, 0] : [size[0] / 2, size[1] / 2, size[2] / 2];
      const r = Math.min(num(n.r, s, 'roundedCube.r'), Math.min(...size) / 2 - 0.001);
      if (r <= 0.01) return [P.cuboid({ size, center })];
      return [P.roundedCuboid({ size, center, roundRadius: r, segments: clamp(Math.ceil(((2 * Math.PI * r) / 0.6) / 4) * 4, 8, 48) })];
    }
    case 'cylinder': {
      const h = positive(num(n.h, s, 'cylinder.h'), 'Zylinderhöhe');
      const fn = n.fn !== undefined ? num(n.fn, s) : undefined;
      const center: [number, number, number] = [0, 0, n.center ? 0 : h / 2];
      if (n.r1 !== undefined && n.r2 !== undefined) {
        const r1 = Math.max(num(n.r1, s, 'r1'), 0);
        const r2 = Math.max(num(n.r2, s, 'r2'), 0);
        if (r1 <= 0 && r2 <= 0) throw new BuildError('Kegel: r1 und r2 sind beide 0');
        const sg = segs(Math.max(r1, r2), fn);
        if (Math.abs(r1 - r2) < 1e-6) return [P.cylinder({ height: h, radius: r1, segments: sg, center })];
        return [
          P.cylinderElliptic({
            height: h,
            startRadius: [Math.max(r1, 1e-3), Math.max(r1, 1e-3)],
            endRadius: [Math.max(r2, 1e-3), Math.max(r2, 1e-3)],
            segments: sg,
            center,
          }),
        ];
      }
      const r = radius(n, s, 'Zylinderradius');
      return [P.cylinder({ height: h, radius: r, segments: segs(r, fn), center })];
    }
    case 'sphere': {
      const r = radius(n, s, 'Kugelradius');
      return [P.sphere({ radius: r, segments: segs(r, n.fn !== undefined ? num(n.fn, s) : undefined) })];
    }
    case 'extrude': {
      const h = positive(num(n.h, s, 'extrude.h'), 'Extrusionshöhe');
      let g = E.extrudeLinear({ height: h }, shape2d(n.shape, s));
      if (n.center) g = T.translate([0, 0, -h / 2], g);
      return [g];
    }
    case 'revolve': {
      const angle = n.angle !== undefined ? num(n.angle, s, 'revolve.angle') : 360;
      const g2 = shape2d(n.shape, s);
      const fn = n.fn !== undefined ? num(n.fn, s) : 96;
      if (angle >= 359.999) return [E.extrudeRotate({ segments: Math.max(8, Math.round(fn)) }, g2)];
      return [E.extrudeRotate({ segments: Math.max(8, Math.round(fn)), angle: angle * DEG }, g2)];
    }
    case 'thread': {
      const d = positive(num(n.d, s, 'thread.d'), 'Gewinde-Durchmesser');
      const p = positive(num(n.pitch, s, 'thread.pitch'), 'Steigung');
      const h = positive(num(n.h, s, 'thread.h'), 'Gewindelänge');
      if (p > d / 2) throw new BuildError('Steigung zu groß für den Durchmesser');
      return [threadGeom(d, p, h, !!n.iso, !!n.chamfer, !!n.left)];
    }
    case 'teardrop': {
      const r = radius(n, s, 'Tropfenloch-Radius');
      const h = positive(num(n.h, s, 'teardrop.h'), 'Tropfenloch-Länge');
      const profile = H.hull(
        P.circle({ radius: r, segments: segs(r) }),
        P.rectangle({ size: [0.02, 0.02], center: [0, r * Math.SQRT2] }),
      );
      let g = T.translate([0, 0, -h / 2], E.extrudeLinear({ height: h }, profile));
      const axis = n.axis ?? 'x';
      if (axis === 'y') g = T.rotateX(90 * DEG, g);
      else if (axis === 'x') g = T.rotateZ(90 * DEG, T.rotateX(90 * DEG, g));
      return [g];
    }
    case 'union': {
      const u = unionAll(children(n.children, ctx));
      return u ? [u] : [];
    }
    case 'difference': {
      const kids = n.children ?? [];
      if (!kids.length) return [];
      const first = unionAll(build(kids[0], ctx));
      if (!first) return [];
      const rest = children(kids.slice(1), ctx);
      return [rest.length ? B.subtract(first, ...rest) : first];
    }
    case 'intersection': {
      const parts = (n.children ?? []).map((c) => unionAll(build(c, ctx))).filter(Boolean);
      if (!parts.length) return [];
      return [parts.length === 1 ? parts[0] : B.intersect(...parts)];
    }
    case 'hull': {
      const parts = children(n.children, ctx);
      if (!parts.length) return [];
      return [parts.length === 1 ? parts[0] : H.hull(...parts)];
    }
    case 'translate': {
      const g = unionAll(children(n.children, ctx));
      return g ? [T.translate(v3(n.v, s, 'translate.v'), g)] : [];
    }
    case 'rotate': {
      let g = unionAll(children(n.children, ctx));
      if (!g) return [];
      const [ax, ay, az] = v3(n.a, s, 'rotate.a');
      if (ax) g = T.rotateX(ax * DEG, g);
      if (ay) g = T.rotateY(ay * DEG, g);
      if (az) g = T.rotateZ(az * DEG, g);
      return [g];
    }
    case 'mirror': {
      const g = unionAll(children(n.children, ctx));
      const nv = v3(n.v, s, 'mirror.v');
      if (!g) return [];
      if (Math.hypot(...nv) < 1e-9) throw new BuildError('mirror.v darf nicht [0,0,0] sein');
      return [T.mirror({ normal: nv }, g)];
    }
    case 'scale': {
      const g = unionAll(children(n.children, ctx));
      const sv = v3(n.v, s, 'scale.v');
      sv.forEach((x) => positive(x, 'Skalierungsfaktor'));
      return g ? [T.scale(sv, g)] : [];
    }
    case 'text':
      return [
        textSolid(
          fillText(n.text, s),
          num(n.size, s, 'text.size'),
          num(n.h, s, 'text.h'),
          n.stroke !== undefined ? num(n.stroke, s, 'text.stroke') : undefined,
          n.center !== false,
          n.maxW !== undefined ? num(n.maxW, s, 'text.maxW') : undefined,
        ),
      ];
    case 'import': {
      const im = getImported(n.ref);
      if (!im) throw new BuildError('Eine importierte Datei fehlt auf diesem Gerät – bitte erneut importieren');
      const tris = im.mesh.tri.length / 3;
      if (tris > 60000) throw new BuildError(`„${im.name}“ ist mit ${tris.toLocaleString('de-DE')} Dreiecken zu fein, um es als Loch zu verwenden (max. 60.000) – als Körper geht es.`);
      const sz = v3(n.size, s, 'import.size');
      const k = [0, 1, 2].map((i) => (im.size[i] > 0 ? sz[i] / im.size[i] : 1));
      const polys: number[][][] = [];
      const P3 = im.mesh.pos;
      for (let t = 0; t < im.mesh.tri.length; t += 3)
        polys.push([0, 1, 2].map((j) => {
          const i = im.mesh.tri[t + j] * 3;
          return [P3[i] * k[0], P3[i + 1] * k[1], P3[i + 2] * k[2]];
        }));
      return [G.geom3.fromPoints(polys)];
    }
    case 'color': {
      // Innerhalb von CSG-Operationen nur Gruppierung; Farbtrennung passiert auf oberster Ebene.
      const u = unionAll(children(n.children, ctx));
      return u ? [u] : [];
    }
    case 'if':
      return bool(n.cond, s) ? children(n.then, ctx) : children(n.else, ctx);
    case 'for': {
      const from = num(n.from, s, 'for.from');
      const to = num(n.to, s, 'for.to');
      const step = n.step !== undefined ? num(n.step, s, 'for.step') : 1;
      if (step === 0) throw new BuildError('for.step darf nicht 0 sein');
      const out: Geom[] = [];
      let k = 0;
      for (let i = from; step > 0 ? i <= to + 1e-9 : i >= to - 1e-9; i += step) {
        if (++k > MAX_LOOP) throw new BuildError(`Schleife "${n.var}" hat mehr als ${MAX_LOOP} Durchläufe`);
        out.push(...children(n.children, { scope: { ...s, [n.var]: i }, count: ctx.count }));
      }
      const u = unionAll(out);
      return u ? [u] : [];
    }
  }
  throw new BuildError(`Unbekannter Knotentyp "${(n as { type: string }).type}"`);
}

export function makeScope(model: ModelDef, values: Record<string, Value>, g: Globals): Scope {
  const scope: Scope = { tol: g.tol, fase: g.fase };
  for (const p of model.params) scope[p.key] = values[p.key] ?? p.value;
  return scope;
}

// ---------- Text (Einstrich-Vektorschrift von JSCAD) ----------
function textSolid(text: string, size0: number, h: number, stroke: number | undefined, center: boolean, maxW?: number): Geom {
  positive(size0, 'Schriftgröße');
  positive(h, 'Texthöhe');
  const input = normalizeText(text);
  let size = size0;
  let segments = (jscad as any).text.vectorText({ height: size, input }) as [number, number][][];
  if (maxW && maxW > 0) {
    // Breite inkl. Strichstärke messen und ggf. Schrift verkleinern
    const xs = segments.flat().map((p) => p[0]);
    const width = xs.length ? Math.max(...xs) - Math.min(...xs) + (stroke && stroke > 0 ? stroke : size * 0.16) : 0;
    if (width > maxW) {
      size = Math.max(1, (size * maxW) / width);
      segments = (jscad as any).text.vectorText({ height: size, input }) as [number, number][][];
    }
  }
  const sw = Math.min(stroke && stroke > 0 ? stroke : Math.max(0.6, size * 0.16), size * 0.3);
  // Jeder Strich wird als Kette konvexer 3D-Körper (Hülle zweier Zylinder) gebaut und
  // im Raum vereinigt. Das ist robuster als 2D-Umrisse, die sich bei engen Kurven
  // selbst überlappen und dann nicht-manifolde Deckflächen erzeugen.
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const r = sw / 2;
  const strokes: Geom[] = [];
  for (const seg of segments) {
    if (!seg || seg.length < 2) continue;
    const pts: [number, number][] = [];
    for (const p of seg) {
      const q = pts[pts.length - 1];
      if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > r * 0.25) pts.push(p);
    }
    if (pts.length === 1) pts.push(seg[seg.length - 1]);
    for (const [x, y] of pts) {
      minX = Math.min(minX, x - r);
      maxX = Math.max(maxX, x + r);
      minY = Math.min(minY, y - r);
      maxY = Math.max(maxY, y + r);
    }
    const dots = pts.map(([x, y]) => P.cylinder({ radius: r, height: h, segments: 16, center: [x, y, h / 2] }));
    strokes.push(dots.length === 1 ? dots[0] : H.hullChain(...dots));
  }
  if (!strokes.length) throw new BuildError('Text ergibt keine Geometrie');
  let g = strokes.length === 1 ? strokes[0] : B.union(...strokes);
  if (center) g = T.translate([-(minX + maxX) / 2, -(minY + maxY) / 2, 0], g);
  return g;
}

function polysOf(g: Geom): number[][][] {
  return (G.geom3.toPolygons(g) as { vertices: number[][] }[]).map((p) => p.vertices);
}

function bbox(geoms: Geom[]): { min: number[]; max: number[] } {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const g of geoms) {
    const [a, b] = (jscad as any).measurements.measureBoundingBox(g) as number[][];
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], a[i]);
      max[i] = Math.max(max[i], b[i]);
    }
  }
  return { min, max };
}

// ---------- Automatischer Hohlraum ----------
export interface HollowOptions {
  enabled: boolean;
  /** Mindest-Wandstärke rundum (mm) */
  wall: number;
  /** Decke als 45°-Satteldach → druckbar ohne Stützmaterial */
  roof: boolean;
}
export const DEFAULT_HOLLOW: HollowOptions = { enabled: false, wall: 2.4, roof: true };

const HOLLOW_DIRS: [number, number, number][] = (() => {
  const d: [number, number, number][] = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ];
  const k = 1 / Math.sqrt(3);
  for (const x of [-k, k]) for (const y of [-k, k]) for (const z of [-k, k]) d.push([x, y, z]);
  return d;
})();

/**
 * Höhlt einen Körper aus: Der Hohlraum ist der um `wall` nach innen versetzte Körper
 * (Schnitt verschobener Kopien in 14 Richtungen – garantiert überall ≥ wall).
 * Mit roof wird die Decke als 45°-Satteldach geformt, damit nichts frei in der Luft hängt.
 * Zu dünne Bereiche bleiben automatisch massiv.
 */
export function hollowGeom(g: Geom, o: HollowOptions, jitter = 0.00731): { geom: Geom; hollowed: boolean } {
  // Ausgleich der Richtungs-Abtastung (cos 35° ≈ 0,82). Der krumme Zusatz verhindert, dass
  // Hohlraumflächen exakt auf anderen Modellflächen liegen (das erzeugt sonst Risse im Netz).
  const t = o.wall / 0.8 + jitter;
  let inner = g;
  for (const [x, y, z] of HOLLOW_DIRS) inner = B.intersect(inner, T.translate([x * t, y * t, z * t], g));
  if (!polysOf(inner).length) return { geom: g, hollowed: false };
  const bb = bbox([inner]);
  const size = [0, 1, 2].map((i) => bb.max[i] - bb.min[i]);
  if (size.some((v) => v < 1)) return { geom: g, hollowed: false };
  if (o.roof) {
    // First entlang der längeren Seite, Dachflächen 45° zur kürzeren Seite hin
    const along = size[0] >= size[1] ? 0 : 1;
    const across = along === 0 ? 1 : 0;
    const c0 = bb.min[across],
      c1 = bb.max[across];
    const hw = (c1 - c0) / 2 + 0.0071,
      cc = (c0 + c1) / 2 + 0.0029;
    const apex = bb.max[2] + 0.0137;
    const z0 = bb.min[2] - 1;
    const pts: [number, number][] = [
      [cc - hw - 1, z0],
      [cc + hw + 1, z0],
      [cc + hw + 1, apex - hw - 1],
      [cc, apex],
      [cc - hw - 1, apex - hw - 1],
    ];
    // Profil liegt in (across, z); extrudiert entlang der First-Achse
    let roof = E.extrudeLinear({ height: size[along] + 4 }, P.polygon({ points: pts }));
    // lokale Achsen: x→across, y→z, z→along
    roof = T.rotateX(Math.PI / 2, roof); // Profil-y → Welt-z, Extrusion → −Welt-y (across = x)
    if (along === 0) roof = T.rotateZ(Math.PI / 2, roof); // across x → y, Extrusion → +x
    const rb = bbox([roof]);
    const shift = [0, 0, 0];
    shift[along] = (bb.min[along] - 2) - rb.min[along];
    roof = T.translate(shift, roof);
    inner = B.intersect(inner, roof);
    if (!polysOf(inner).length) return { geom: g, hollowed: false };
  }
  return { geom: B.subtract(g, inner), hollowed: true };
}

export interface BuiltPart {
  slot: number;
  name: string;
  polys: number[][][];
}
export interface BuiltPiece {
  label: string;
  kind: 'segment' | 'pin';
  cell: [number, number, number];
  parts: BuiltPart[];
}
export interface BuildOutput {
  parts: BuiltPart[];
  /** Nur bei aktivierter Aufteilung: druckbare Segmente (+ Dübel) */
  pieces?: BuiltPiece[];
  splitReport?: SplitReport;
  /** Hinweis, falls der automatische Hohlraum nicht gebaut wurde */
  hollowNote?: string;
  /** Für den SCAD-Export: Drehung + Verschiebung auf das Druckbett */
  placement: { rx: number; ry: number; t: [number, number, number] };
}

/**
 * Baut das Modell als (ggf. mehrfarbige) Druckteile:
 *  - color-Knoten auf oberster Ebene → eigene Teile (spätere haben Vorrang),
 *  - Ausrichtung, Ablage mittig auf dem Druckbett (z = 0),
 *  - optional Farbwechsel nach Höhe (überschreibt die Teilefarben).
 */
export function buildParts(
  model: ModelDef,
  values: Record<string, Value>,
  g: Globals,
  o: Orientation,
  zones?: ColorZone[] | null,
  split?: { opts: SplitOptions; bed: { size: number; height: number } },
  hollow?: HollowOptions,
): BuildOutput {
  const ctx: Ctx = { scope: makeScope(model, values, g), count: { n: 0 } };
  const groups: { slot: number; name: string; geoms: Geom[] }[] = [];
  const groupFor = (slot: number, name: string) => {
    let gr = groups.find((x) => x.slot === slot);
    if (!gr) groups.push((gr = { slot, name, geoms: [] }));
    return gr;
  };
  try {
    for (const n of model.root) {
      if (n.type === 'color') {
        const slot = clamp(Math.round(num(n.slot, ctx.scope, 'color.slot')), 1, 8);
        groupFor(slot, n.name || `Farbe ${slot}`).geoms.push(...children(n.children, ctx));
      } else groupFor(1, 'Basis').geoms.push(...build(n, ctx));
    }
    let parts = groups
      .map((gr) => ({ slot: gr.slot, name: gr.name, geom: unionAll(gr.geoms) }))
      .filter((p) => p.geom) as { slot: number; name: string; geom: Geom }[];
    if (!parts.length) throw new BuildError('Das Modell ist leer');
    // Überschneidungen auflösen: spätere Teile gewinnen (Einlagen, Beschriftungen)
    // Nur Teile abziehen, die wirklich in dieses Teil hineinragen. Nur aufliegende Teile
    // (z. B. Schrift auf der Platte) würden sonst deckungsgleiche Flächen schneiden und offene Kanten erzeugen.
    for (let i = 0; i < parts.length - 1; i++) {
      const mine = bbox([parts[i].geom]);
      const overlapping = parts.slice(i + 1).filter((p) => {
        const b = bbox([p.geom]);
        return [0, 1, 2].every((k) => Math.min(mine.max[k], b.max[k]) - Math.max(mine.min[k], b.min[k]) > 1e-3);
      });
      const later = unionAll(overlapping.map((p) => p.geom));
      if (later) parts[i].geom = B.subtract(parts[i].geom, later);
    }
    // Ausrichtung
    parts = parts.map((p) => {
      let gg = p.geom;
      if (o.rx) gg = T.rotateX(o.rx * DEG, gg);
      if (o.ry) gg = T.rotateY(o.ry * DEG, gg);
      return { ...p, geom: gg };
    });
    parts = parts.filter((p) => polysOf(p.geom).length > 0);
    if (!parts.length) throw new BuildError('Das Modell ist leer');
    // Auf das Bett legen, XY zentrieren
    const bb = bbox(parts.map((p) => p.geom));
    const t: [number, number, number] = [-(bb.min[0] + bb.max[0]) / 2, -(bb.min[1] + bb.max[1]) / 2, -bb.min[2]];
    parts = parts.map((p) => ({ ...p, geom: T.translate(t, p.geom) }));
    const height = bb.max[2] - bb.min[2];

    // Baugruppen-Verbindungen (im abgelegten Koordinatensystem): Löcher abziehen, Zapfen anfügen
    if (model.mods && (model.mods.sub.length || model.mods.add.length)) {
      const sub = unionAll(children(model.mods.sub, ctx));
      const add = unionAll(children(model.mods.add, ctx));
      if (sub) parts = parts.map((p) => ({ ...p, geom: B.subtract(p.geom, sub) }));
      if (add) parts[0] = { ...parts[0], geom: B.union(parts[0].geom, add) };
    }

    // Automatischer Hohlraum (nur Grundkörper = erstes Teil; Beschriftungen/Einlagen bleiben massiv)
    let hollowNote: string | undefined;
    if (hollow?.enabled && parts.length) {
      // Ergebnis prüfen: nur übernehmen, wenn das Netz wasserdicht bleibt (sonst 2. Versuch, sonst massiv)
      let done = false;
      for (const jitter of [0.00731, 0.0613, 0.137]) {
        const h = hollowGeom(parts[0].geom, hollow, jitter);
        if (!h.hollowed) {
          hollowNote = 'Zu dünn für einen Hohlraum – Teil bleibt massiv.';
          done = true;
          break;
        }
        if (analyzeMesh(meshFromPolygons(polysOf(h.geom))).manifold) {
          parts[0] = { ...parts[0], geom: h.geom };
          hollowNote = undefined;
          done = true;
          break;
        }
      }
      if (!done) hollowNote = 'Hohlraum ließ sich hier nicht sauber bauen – Teil bleibt massiv (100 % druckbar).';
    }

    // Farbwechsel nach Höhe
    if (zones && zones.length > 1) {
      const zs = [...zones].sort((a, b) => a.z - b.z);
      const all = unionAll(parts.map((p) => p.geom));
      const W = bb.max[0] - bb.min[0] + 20;
      const D = bb.max[1] - bb.min[1] + 20;
      const zoned: { slot: number; name: string; geom: Geom }[] = [];
      for (let k = 0; k < zs.length; k++) {
        const z0 = k === 0 ? -1 : clamp(zs[k].z, 0, height);
        const z1 = k === zs.length - 1 ? height + 1 : clamp(zs[k + 1].z, 0, height + 1);
        if (z1 - z0 < 0.01) continue;
        const slab = P.cuboid({ size: [W, D, z1 - z0], center: [0, 0, (z0 + z1) / 2] });
        const part = B.intersect(all, slab);
        if (polysOf(part).length) zoned.push({ slot: zs[k].slot, name: `Zone ${k + 1}`, geom: part });
      }
      // gleiche Slots zusammenfassen
      const merged: typeof zoned = [];
      for (const z of zoned) {
        const m = merged.find((x) => x.slot === z.slot);
        if (m) m.geom = B.union(m.geom, z.geom);
        else merged.push(z);
      }
      parts = merged;
    }

    let pieces: BuiltPiece[] | undefined;
    let splitReport: SplitReport | undefined;
    if (split?.opts.enabled) {
      const res = splitParts(parts, bbox(parts.map((p) => p.geom)), split.opts, split.bed, g.tol);
      splitReport = res.report;
      pieces = res.pieces.map((pc) => ({
        label: pc.label,
        kind: pc.kind,
        cell: pc.cell,
        parts: pc.parts.map((p) => ({ slot: p.slot, name: p.name, polys: polysOf(p.geom) })).filter((p) => p.polys.length),
      }));
    }
    return {
      parts: parts.map((p) => ({ slot: p.slot, name: p.name, polys: polysOf(p.geom) })),
      pieces,
      splitReport,
      hollowNote,
      placement: { rx: o.rx, ry: o.ry, t },
    };
  } catch (e) {
    if (e instanceof BuildError || e instanceof ExprError) throw e;
    throw new BuildError(`Geometriefehler: ${(e as Error).message}`);
  }
}
