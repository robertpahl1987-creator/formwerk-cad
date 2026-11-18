/**
 * Übersetzt den DSL-Baum 1:1 in OpenSCAD-Code mit Customizer-Parametern.
 */
import { exprToScad, fmtNum } from './expr';
import { textToScad } from './text';
import type { CadNode, Expr, FilamentSlot, Globals, ModelDef, Shape2D, Value, Vec2, Vec3 } from './types';

const e = exprToScad;
const vec = (v: Vec2 | Vec3) => `[${(v as Expr[]).map(e).join(', ')}]`;

function radiusArg(n: { r?: Expr; d?: Expr }): string {
  return n.r !== undefined ? `r = ${e(n.r)}` : `d = ${e(n.d as Expr)}`;
}

function shape(sh: Shape2D, ind: string): string {
  switch (sh.type) {
    case 'rect':
      if (sh.r !== undefined) return `${ind}fw_rounded_rect(${vec(sh.size)}, ${e(sh.r)}, center = ${sh.center ? 'true' : 'false'});\n`;
      return `${ind}square(${vec(sh.size)}, center = ${sh.center ? 'true' : 'false'});\n`;
    case 'circle':
      return `${ind}circle(${radiusArg(sh)}${sh.fn !== undefined ? `, $fn = ${e(sh.fn)}` : ''});\n`;
    case 'polygon': {
      const poly = (pts: Vec2[]) => `polygon([${pts.map(vec).join(', ')}]);`;
      let body: string;
      if (sh.holes && sh.holes.length) {
        body = `${ind}difference() {\n${ind}  ${poly(sh.points)}\n${sh.holes.map((h) => `${ind}  ${poly(h)}\n`).join('')}${ind}}\n`;
      } else body = `${ind}${poly(sh.points)}\n`;
      if (sh.offset !== undefined) return `${ind}offset(r = ${e(sh.offset)}) {\n${body.replace(/^/gm, '  ')}${ind}}\n`;
      return body;
    }
  }
}

function block(head: string, kids: CadNode[] | undefined, ind: string): string {
  const inner = (kids ?? []).map((k) => node(k, ind + '  ')).join('');
  return `${ind}${head} {\n${inner}${ind}}\n`;
}

function node(n: CadNode, ind: string): string {
  switch (n.type) {
    case 'cube':
      return `${ind}cube(${vec(n.size)}, center = ${n.center ? 'true' : 'false'});\n`;
    case 'roundedCube':
      return `${ind}fw_rounded_cube(${vec(n.size)}, ${e(n.r)}, center = ${n.center ? 'true' : 'false'});\n`;
    case 'cylinder': {
      const fn = n.fn !== undefined ? `, $fn = ${e(n.fn)}` : '';
      const r = n.r1 !== undefined && n.r2 !== undefined ? `r1 = ${e(n.r1)}, r2 = ${e(n.r2)}` : radiusArg(n);
      return `${ind}cylinder(h = ${e(n.h)}, ${r}, center = ${n.center ? 'true' : 'false'}${fn});\n`;
    }
    case 'sphere':
      return `${ind}sphere(${radiusArg(n)}${n.fn !== undefined ? `, $fn = ${e(n.fn)}` : ''});\n`;
    case 'extrude':
      return `${ind}linear_extrude(height = ${e(n.h)}, center = ${n.center ? 'true' : 'false'}) {\n${shape(n.shape, ind + '  ')}${ind}}\n`;
    case 'revolve':
      return `${ind}rotate_extrude(angle = ${n.angle !== undefined ? e(n.angle) : '360'}${n.fn !== undefined ? `, $fn = ${e(n.fn)}` : ''}) {\n${shape(n.shape, ind + '  ')}${ind}}\n`;
    case 'import':
      return `${ind}resize(${vec(n.size)}) import("${n.ref}.stl", center = true); // importierte Datei – bitte daneben ablegen\n`;
    case 'teardrop':
      return `${ind}fw_teardrop(${n.r !== undefined ? e(n.r) : `(${e(n.d as Expr)}) / 2`}, ${e(n.h)}, "${n.axis ?? 'x'}");\n`;
    case 'union':
    case 'difference':
    case 'intersection':
    case 'hull':
      return block(`${n.type}()`, n.children, ind);
    case 'translate':
      return block(`translate(${vec(n.v)})`, n.children, ind);
    case 'rotate':
      return block(`rotate(${vec(n.a)})`, n.children, ind);
    case 'mirror':
      return block(`mirror(${vec(n.v)})`, n.children, ind);
    case 'scale':
      return block(`scale(${vec(n.v)})`, n.children, ind);
    case 'text': {
      const txt = textToScad(n.text);
      const al = n.center !== false ? ', halign = "center", valign = "center"' : '';
      if (n.maxW !== undefined)
        return `${ind}// In der App wird zu langer Text auf max. ${e(n.maxW)} mm Breite verkleinert\n${ind}linear_extrude(height = ${e(n.h)}) text(${txt}, size = ${e(n.size)}${al});\n`;
      return `${ind}// Hinweis: OpenSCAD nutzt eine andere Schrift als die App-Vorschau (Einstrich-Font)\n${ind}linear_extrude(height = ${e(n.h)}) text(${txt}, size = ${e(n.size)}${al});\n`;
    }
    case 'color':
      return block(`color(fw_slot_color(${e(n.slot)}))`, n.children, ind);
    case 'if': {
      let s = block(`if (${e(n.cond)})`, n.then, ind);
      if (n.else && n.else.length) s = s.trimEnd() + ` else {\n${n.else.map((k) => node(k, ind + '  ')).join('')}${ind}}\n`;
      return s;
    }
    case 'for':
      return block(`for (${n.var} = [${e(n.from)} : ${n.step !== undefined ? e(n.step) : '1'} : ${e(n.to)}])`, n.children, ind);
  }
}

const HELPERS = `
// ---------- Hilfsmodule (Formwerk CAD) ----------
module fw_rounded_cube(size, r, center = false) {
  rr = min(r, min(size) / 2 - 0.001);
  translate(center ? [0, 0, 0] : size / 2)
    hull() for (x = [-1, 1], y = [-1, 1], z = [-1, 1])
      translate([x * (size[0] / 2 - rr), y * (size[1] / 2 - rr), z * (size[2] / 2 - rr)]) sphere(r = rr);
}
module fw_rounded_rect(size, r, center = false) {
  rr = min(r, min(size) / 2 - 0.001);
  translate(center ? [0, 0] : size / 2) {
    if (rr > 0.001) offset(r = rr) square([size[0] - 2 * rr, size[1] - 2 * rr], center = true);
    else square(size, center = true);
  }
}
// Tropfenförmiges Loch: überhangfrei druckbar, Spitze zeigt nach +Z
module fw_teardrop(r, h, axis = "x") {
  rotate(axis == "x" ? [90, 0, 90] : axis == "y" ? [90, 0, 0] : [0, 0, 0])
    linear_extrude(height = h, center = true)
      hull() { circle(r = r); translate([0, r * sqrt(2)]) square(0.02, center = true); }
}
`;

export interface ScadPlacement {
  /** Ausrichtung (Grad) */
  rx: number;
  ry: number;
  /** Verschiebung nach dem Drehen, damit das Teil auf dem Bett liegt */
  t: [number, number, number];
}

function paramLine(key: string, val: Value, p?: ModelDef['params'][number]): string {
  if (typeof val === 'string') return `${key} = ${JSON.stringify(val)};${p ? ` // ${p.label}` : ''}`;
  if (typeof val === 'boolean') return `${key} = ${val};${p ? ` // ${p.label}` : ''}`;
  let comment = '';
  if (p) {
    if (p.type === 'select' && p.options?.length) comment = ` // [${p.options.map((o) => `${fmtNum(o.value)}:${o.label.replace(/[,\]]/g, ' ')}`).join(', ')}] ${p.label}`;
    else if (p.min !== undefined && p.max !== undefined) comment = ` // [${fmtNum(p.min)}:${fmtNum(p.step ?? 0.1)}:${fmtNum(p.max)}] ${p.label}${p.unit ? ` (${p.unit})` : ''}`;
    else comment = ` // ${p.label}`;
  }
  return `${key} = ${fmtNum(val)};${comment}`;
}

export function toScad(model: ModelDef, values: Record<string, Value>, g: Globals, place?: ScadPlacement, palette: FilamentSlot[] = []): string {
  const lines: string[] = [];
  lines.push(`// ${model.name}`);
  if (model.description) lines.push(`// ${model.description.replace(/\n/g, ' ')}`);
  lines.push(`// Erstellt mit Formwerk CAD am ${new Date().toLocaleString('de-DE')} – Einheiten: Millimeter`);
  lines.push('// In OpenSCAD öffnen: Alle Parameter sind im Customizer (Fenster > Customizer) einstellbar.');
  lines.push('');
  const groups = new Map<string, ModelDef['params']>();
  for (const p of model.params) {
    const k = p.group || 'Parameter';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(p);
  }
  for (const [name, ps] of groups) {
    lines.push(`/* [${name}] */`);
    for (const p of ps) lines.push(paramLine(p.key, values[p.key] ?? p.value, p));
    lines.push('');
  }
  lines.push('/* [Druck] */');
  lines.push(`tol = ${fmtNum(g.tol)}; // [0:0.05:1] Drucktoleranz (mm)`);
  lines.push(`fase = ${g.fase}; // Überhänge automatisch entschärfen (Fasen / Tropfenlöcher)`);
  lines.push('');
  lines.push('/* [Hidden] */');
  lines.push('$fa = 2;');
  lines.push('$fs = 0.4;');
  lines.push(HELPERS);
  const cols = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => JSON.stringify(palette.find((p) => p.slot === i)?.color ?? '#cccccc'));
  lines.push(`// Filament-Slots (Mehrfarbendruck): Slot 1–8\nfw_palette = [${cols.join(', ')}];\nfunction fw_slot_color(s) = fw_palette[max(0, min(7, round(s) - 1))];\n`);
  lines.push('// ---------- Modell ----------');
  let body = model.root.map((n) => node(n, '  ')).join('');
  body = `union() {\n${body}}\n`;
  if (place && (place.rx || place.ry || place.t.some((x) => Math.abs(x) > 1e-6))) {
    lines.push('// Druckausrichtung (in der App optimiert)');
    body = `translate([${place.t.map(fmtNum).join(', ')}])\n  rotate([0, ${fmtNum(place.ry)}, 0])\n  rotate([${fmtNum(place.rx)}, 0, 0])\n${body.replace(/^/gm, '  ')}`;
  }
  lines.push(body);
  return lines.join('\n');
}
