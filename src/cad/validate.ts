/**
 * Strenge Validierung eines Modells (z. B. KI-Ausgabe), bevor es gebaut wird.
 * Liefert ein bereinigtes Modell oder eine Liste verständlicher Fehler.
 */
import { exprIdentifiers, ExprError, parseExpr } from './expr';
import type { CadNode, ModelDef, ParamDef, Shape2D } from './types';

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
const RESERVED = new Set(['tol', 'fase', 'PI', 'true', 'false', 'for', 'if', 'else', 'module', 'function']);
const NODE_TYPES = new Set([
  'cube', 'roundedCube', 'cylinder', 'sphere', 'extrude', 'revolve', 'teardrop', 'import',
  'union', 'difference', 'intersection', 'hull', 'translate', 'rotate', 'mirror', 'scale', 'if', 'for',
  'text', 'color',
]);

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  model?: ModelDef;
}

export function validateModel(raw: unknown, source: ModelDef['source'] = 'ai'): ValidationResult {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object') return { ok: false, errors: ['Antwort ist kein JSON-Objekt'] };
  const r = raw as Record<string, unknown>;
  const name = typeof r.name === 'string' && r.name.trim() ? r.name.trim().slice(0, 80) : 'Modell';
  const description = typeof r.description === 'string' ? r.description.slice(0, 600) : undefined;

  const params: ParamDef[] = [];
  const known = new Set<string>(['tol', 'fase']);
  if (!Array.isArray(r.params)) errors.push('"params" muss ein Array sein');
  else {
    for (const [i, p0] of (r.params as unknown[]).entries()) {
      const p = p0 as Record<string, unknown>;
      const key = String(p?.key ?? '');
      if (!IDENT.test(key) || RESERVED.has(key)) {
        errors.push(`Parameter ${i}: ungültiger Schlüssel "${key}"`);
        continue;
      }
      if (known.has(key)) {
        errors.push(`Parameter "${key}" doppelt`);
        continue;
      }
      const type = p.type === 'bool' ? 'bool' : p.type === 'select' ? 'select' : p.type === 'text' ? 'text' : 'number';
      let value: number | boolean | string;
      if (type === 'bool') value = Boolean(p.value);
      else if (type === 'text') value = String(p.value ?? '').slice(0, 60);
      else {
        value = Number(p.value);
        if (!Number.isFinite(value)) {
          errors.push(`Parameter "${key}": Wert ist keine Zahl`);
          continue;
        }
      }
      const def: ParamDef = {
        key,
        label: typeof p.label === 'string' && p.label ? p.label.slice(0, 60) : key,
        type,
        value,
        unit: typeof p.unit === 'string' ? p.unit.slice(0, 6) : type === 'number' ? 'mm' : undefined,
        group: typeof p.group === 'string' ? p.group.slice(0, 30) : undefined,
        hint: typeof p.hint === 'string' ? p.hint.slice(0, 160) : undefined,
      };
      if (type === 'number' || type === 'select') {
        const v = value as number;
        def.min = Number.isFinite(Number(p.min)) ? Number(p.min) : Math.min(0, v);
        def.max = Number.isFinite(Number(p.max)) ? Number(p.max) : Math.max(v * 3, v + 10);
        def.step = Number.isFinite(Number(p.step)) && Number(p.step) > 0 ? Number(p.step) : 0.1;
        if (def.min! > v) def.min = v;
        if (def.max! < v) def.max = v;
      }
      if (type === 'select' && Array.isArray(p.options)) {
        def.options = (p.options as Record<string, unknown>[])
          .filter((o) => o && Number.isFinite(Number(o.value)))
          .map((o) => ({ value: Number(o.value), label: String(o.label ?? o.value) }));
      }
      if (typeof p.role === 'string' && ['length', 'width', 'height', 'wall', 'hole', 'count', 'depth'].includes(p.role))
        def.role = p.role as ParamDef['role'];
      known.add(key);
      params.push(def);
    }
  }

  let count = 0;
  const checkExpr = (e: unknown, where: string, scope: Set<string>) => {
    if (typeof e === 'number' && Number.isFinite(e)) return;
    if (typeof e === 'boolean') return;
    if (typeof e !== 'string') {
      errors.push(`${where}: Wert fehlt oder ist ungültig`);
      return;
    }
    try {
      parseExpr(e);
      for (const id of exprIdentifiers(e)) if (!scope.has(id)) errors.push(`${where}: unbekannte Variable "${id}"`);
    } catch (err) {
      errors.push(`${where}: ${(err as ExprError).message}`);
    }
  };
  const checkVec = (v: unknown, n: number, where: string, scope: Set<string>) => {
    if (!Array.isArray(v) || v.length !== n) {
      errors.push(`${where}: Vektor mit ${n} Werten erwartet`);
      return;
    }
    v.forEach((e, i) => checkExpr(e, `${where}[${i}]`, scope));
  };
  const checkShape = (s: unknown, where: string, scope: Set<string>) => {
    const sh = s as Shape2D;
    if (!sh || typeof sh !== 'object') return errors.push(`${where}: 2D-Form fehlt`);
    if (sh.type === 'rect') {
      checkVec(sh.size, 2, `${where}.size`, scope);
      if (sh.r !== undefined) checkExpr(sh.r, `${where}.r`, scope);
    } else if (sh.type === 'circle') {
      if (sh.r === undefined && sh.d === undefined) errors.push(`${where}: r oder d fehlt`);
      if (sh.r !== undefined) checkExpr(sh.r, `${where}.r`, scope);
      if (sh.d !== undefined) checkExpr(sh.d, `${where}.d`, scope);
    } else if (sh.type === 'polygon') {
      if (!Array.isArray(sh.points) || sh.points.length < 3) errors.push(`${where}: Polygon braucht ≥3 Punkte`);
      else sh.points.forEach((p, i) => checkVec(p, 2, `${where}.points[${i}]`, scope));
      if (sh.holes) {
        if (!Array.isArray(sh.holes)) errors.push(`${where}.holes: Array erwartet`);
        else sh.holes.forEach((h, j) => Array.isArray(h) && h.forEach((p, i) => checkVec(p, 2, `${where}.holes[${j}][${i}]`, scope)));
      }
      if (sh.offset !== undefined) checkExpr(sh.offset, `${where}.offset`, scope);
    } else errors.push(`${where}: unbekannte 2D-Form "${(sh as { type?: string }).type}"`);
  };
  const checkNodes = (nodes: unknown, where: string, scope: Set<string>) => {
    if (!Array.isArray(nodes)) return errors.push(`${where}: Array von Knoten erwartet`);
    nodes.forEach((n, i) => checkNode(n, `${where}[${i}]`, scope));
  };
  const checkNode = (n0: unknown, where: string, scope: Set<string>) => {
    if (++count > 4000) {
      if (count === 4001) errors.push('Modell zu groß (>4000 Knoten)');
      return;
    }
    const n = n0 as CadNode;
    if (!n || typeof n !== 'object' || !NODE_TYPES.has((n as { type: string }).type))
      return errors.push(`${where}: unbekannter Knotentyp "${(n as { type?: string })?.type}"`);
    const w = `${where}(${n.type})`;
    switch (n.type) {
      case 'cube':
        return checkVec(n.size, 3, `${w}.size`, scope);
      case 'roundedCube':
        checkVec(n.size, 3, `${w}.size`, scope);
        return checkExpr(n.r, `${w}.r`, scope);
      case 'cylinder':
        checkExpr(n.h, `${w}.h`, scope);
        if (n.r === undefined && n.d === undefined && (n.r1 === undefined || n.r2 === undefined))
          errors.push(`${w}: r, d oder r1+r2 fehlt`);
        for (const k of ['r', 'd', 'r1', 'r2', 'fn'] as const) if (n[k] !== undefined) checkExpr(n[k], `${w}.${k}`, scope);
        return;
      case 'sphere':
        if (n.r === undefined && n.d === undefined) errors.push(`${w}: r oder d fehlt`);
        if (n.r !== undefined) checkExpr(n.r, `${w}.r`, scope);
        if (n.d !== undefined) checkExpr(n.d, `${w}.d`, scope);
        return;
      case 'extrude':
        checkExpr(n.h, `${w}.h`, scope);
        return checkShape(n.shape, `${w}.shape`, scope);
      case 'revolve':
        if (n.angle !== undefined) checkExpr(n.angle, `${w}.angle`, scope);
        return checkShape(n.shape, `${w}.shape`, scope);
      case 'import':
        if (typeof n.ref !== 'string') errors.push(`${w}: ref fehlt`);
        return;
      case 'teardrop':
        checkExpr(n.h, `${w}.h`, scope);
        if (n.r === undefined && n.d === undefined) errors.push(`${w}: r oder d fehlt`);
        if (n.r !== undefined) checkExpr(n.r, `${w}.r`, scope);
        if (n.d !== undefined) checkExpr(n.d, `${w}.d`, scope);
        if (n.axis !== undefined && !['x', 'y', 'z'].includes(n.axis)) errors.push(`${w}.axis muss x, y oder z sein`);
        return;
      case 'text':
        if (typeof n.text !== 'string' || !n.text.trim()) errors.push(`${w}: "text" fehlt`);
        else if (n.text.length > 60) errors.push(`${w}: Text zu lang (max. 60 Zeichen)`);
        checkExpr(n.size, `${w}.size`, scope);
        checkExpr(n.h, `${w}.h`, scope);
        if (n.stroke !== undefined) checkExpr(n.stroke, `${w}.stroke`, scope);
        if (n.maxW !== undefined) checkExpr(n.maxW, `${w}.maxW`, scope);
        return;
      case 'color':
        checkExpr(n.slot, `${w}.slot`, scope);
        return checkNodes(n.children, `${w}.children`, scope);
      case 'union':
      case 'difference':
      case 'intersection':
      case 'hull':
        return checkNodes(n.children, `${w}.children`, scope);
      case 'translate':
      case 'mirror':
      case 'scale':
        checkVec(n.v, 3, `${w}.v`, scope);
        return checkNodes(n.children, `${w}.children`, scope);
      case 'rotate':
        checkVec(n.a, 3, `${w}.a`, scope);
        return checkNodes(n.children, `${w}.children`, scope);
      case 'if':
        checkExpr(n.cond, `${w}.cond`, scope);
        checkNodes(n.then, `${w}.then`, scope);
        if (n.else !== undefined) checkNodes(n.else, `${w}.else`, scope);
        return;
      case 'for': {
        if (!IDENT.test(n.var ?? '') || RESERVED.has(n.var)) errors.push(`${w}: ungültiger Schleifenname "${n.var}"`);
        checkExpr(n.from, `${w}.from`, scope);
        checkExpr(n.to, `${w}.to`, scope);
        if (n.step !== undefined) checkExpr(n.step, `${w}.step`, scope);
        const inner = new Set(scope);
        inner.add(n.var);
        return checkNodes(n.children, `${w}.children`, inner);
      }
    }
  };

  const root = Array.isArray(r.root) ? r.root : r.root && typeof r.root === 'object' ? [r.root] : null;
  if (!root || root.length === 0) errors.push('"root" fehlt oder ist leer');
  else checkNodes(root, 'root', known);

  if (errors.length) return { ok: false, errors: errors.slice(0, 25) };
  return { ok: true, errors: [], model: { name, description, params, root: root as CadNode[], source } };
}

/** Holt ein JSON-Objekt aus einer LLM-Antwort (auch wenn sie in ```json-Blöcken steckt). */
export function extractJson(text: string): unknown {
  const t = text.trim();
  try {
    return JSON.parse(t);
  } catch {
    /* weiter */
  }
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    try {
      return JSON.parse(fence[1]);
    } catch {
      /* weiter */
    }
  }
  const a = t.indexOf('{');
  const b = t.lastIndexOf('}');
  if (a >= 0 && b > a) return JSON.parse(t.slice(a, b + 1));
  throw new Error('Keine JSON-Antwort erhalten');
}

export function defaultValues(m: ModelDef): Record<string, number | boolean | string> {
  const v: Record<string, number | boolean | string> = {};
  for (const p of m.params) v[p.key] = p.value;
  return v;
}
