/**
 * Sichere Ausdrucksauswertung (kein eval / new Function).
 * Syntax ist bewusst OpenSCAD-kompatibel, damit Ausdrücke unverändert
 * in den .scad-Export übernommen werden können.
 */
import type { Expr, Value } from './types';

export type Ast =
  | { k: 'num'; v: number }
  | { k: 'bool'; v: boolean }
  | { k: 'id'; n: string }
  | { k: 'un'; op: '-' | '+' | '!'; a: Ast }
  | { k: 'bin'; op: string; a: Ast; b: Ast }
  | { k: 'tern'; c: Ast; a: Ast; b: Ast }
  | { k: 'call'; f: string; args: Ast[] };

const D2R = Math.PI / 180;
export const FUNCS: Record<string, (...a: number[]) => number> = {
  min: (...a) => Math.min(...a),
  max: (...a) => Math.max(...a),
  abs: Math.abs,
  sqrt: Math.sqrt,
  pow: Math.pow,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
  sin: (d) => Math.sin(d * D2R),
  cos: (d) => Math.cos(d * D2R),
  tan: (d) => Math.tan(d * D2R),
  asin: (x) => Math.asin(x) / D2R,
  acos: (x) => Math.acos(x) / D2R,
  atan: (x) => Math.atan(x) / D2R,
  atan2: (y, x) => Math.atan2(y, x) / D2R,
};

export class ExprError extends Error {}

const TOKEN = /\s*(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?|[A-Za-z_][A-Za-z0-9_]*|&&|\|\||==|!=|<=|>=|[-+*/%()<>!?:,])/y;

function tokenize(src: string): string[] {
  const out: string[] = [];
  TOKEN.lastIndex = 0;
  let pos = 0;
  while (pos < src.length) {
    if (/^\s*$/.test(src.slice(pos))) break;
    TOKEN.lastIndex = pos;
    const m = TOKEN.exec(src);
    if (!m) throw new ExprError(`Ungültiges Zeichen in Ausdruck "${src}" an Position ${pos}`);
    out.push(m[1]);
    pos = TOKEN.lastIndex;
  }
  return out;
}

const BIN_PREC: Record<string, number> = {
  '||': 2,
  '&&': 3,
  '==': 4,
  '!=': 4,
  '<': 5,
  '>': 5,
  '<=': 5,
  '>=': 5,
  '+': 6,
  '-': 6,
  '*': 7,
  '/': 7,
  '%': 7,
};

class Parser {
  i = 0;
  constructor(private t: string[], private src: string) {}
  peek() {
    return this.t[this.i];
  }
  next() {
    return this.t[this.i++];
  }
  expect(s: string) {
    const n = this.next();
    if (n !== s) throw new ExprError(`"${s}" erwartet in "${this.src}"`);
  }
  parse(): Ast {
    const e = this.expr(0);
    if (this.i < this.t.length) throw new ExprError(`Unerwartetes "${this.peek()}" in "${this.src}"`);
    return e;
  }
  expr(minPrec: number): Ast {
    let left = this.unary();
    for (;;) {
      const op = this.peek();
      if (op === '?' && minPrec <= 1) {
        this.next();
        const a = this.expr(0);
        this.expect(':');
        const b = this.expr(1);
        left = { k: 'tern', c: left, a, b };
        continue;
      }
      const p = op !== undefined ? BIN_PREC[op] : undefined;
      if (p === undefined || p < minPrec) break;
      this.next();
      const right = this.expr(p + 1);
      left = { k: 'bin', op, a: left, b: right };
    }
    return left;
  }
  unary(): Ast {
    const t = this.peek();
    if (t === '-' || t === '+' || t === '!') {
      this.next();
      return { k: 'un', op: t, a: this.unary() };
    }
    return this.primary();
  }
  primary(): Ast {
    const t = this.next();
    if (t === undefined) throw new ExprError(`Ausdruck unvollständig: "${this.src}"`);
    if (t === '(') {
      const e = this.expr(0);
      this.expect(')');
      return e;
    }
    if (/^[\d.]/.test(t)) return { k: 'num', v: parseFloat(t) };
    if (/^[A-Za-z_]/.test(t)) {
      if (t === 'true') return { k: 'bool', v: true };
      if (t === 'false') return { k: 'bool', v: false };
      if (this.peek() === '(') {
        this.next();
        if (!FUNCS[t]) throw new ExprError(`Unbekannte Funktion "${t}"`);
        const args: Ast[] = [];
        if (this.peek() !== ')') {
          for (;;) {
            args.push(this.expr(0));
            if (this.peek() === ',') {
              this.next();
              continue;
            }
            break;
          }
        }
        this.expect(')');
        return { k: 'call', f: t, args };
      }
      return { k: 'id', n: t };
    }
    throw new ExprError(`Unerwartetes "${t}" in "${this.src}"`);
  }
}

const cache = new Map<string, Ast>();
export function parseExpr(src: string): Ast {
  let a = cache.get(src);
  if (!a) {
    a = new Parser(tokenize(src), src).parse();
    if (cache.size > 5000) cache.clear();
    cache.set(src, a);
  }
  return a;
}

export type Scope = Record<string, Value>;

function evalAst(a: Ast, s: Scope): Value {
  switch (a.k) {
    case 'num':
      return a.v;
    case 'bool':
      return a.v;
    case 'id': {
      if (a.n === 'PI') return Math.PI;
      const v = s[a.n];
      if (v === undefined) throw new ExprError(`Unbekannte Variable "${a.n}"`);
      return v;
    }
    case 'un': {
      const v = evalAst(a.a, s);
      if (a.op === '!') return !v;
      return a.op === '-' ? -Number(v) : Number(v);
    }
    case 'tern':
      return evalAst(a.c, s) ? evalAst(a.a, s) : evalAst(a.b, s);
    case 'call':
      return FUNCS[a.f](...a.args.map((x) => Number(evalAst(x, s))));
    case 'bin': {
      if (a.op === '&&') return Boolean(evalAst(a.a, s)) && Boolean(evalAst(a.b, s));
      if (a.op === '||') return Boolean(evalAst(a.a, s)) || Boolean(evalAst(a.b, s));
      const x = evalAst(a.a, s);
      const y = evalAst(a.b, s);
      switch (a.op) {
        case '==':
          return x === y;
        case '!=':
          return x !== y;
      }
      const nx = Number(x),
        ny = Number(y);
      switch (a.op) {
        case '+':
          return nx + ny;
        case '-':
          return nx - ny;
        case '*':
          return nx * ny;
        case '/':
          return nx / ny;
        case '%':
          return nx % ny;
        case '<':
          return nx < ny;
        case '>':
          return nx > ny;
        case '<=':
          return nx <= ny;
        case '>=':
          return nx >= ny;
      }
    }
  }
  throw new ExprError('Interner Ausdrucksfehler');
}

export function evalExpr(e: Expr, s: Scope): Value {
  if (typeof e === 'number' || typeof e === 'boolean') return e;
  if (typeof e !== 'string') throw new ExprError(`Ungültiger Wert: ${JSON.stringify(e)}`);
  return evalAst(parseExpr(e), s);
}

export function num(e: Expr | undefined, s: Scope, what = 'Wert'): number {
  if (e === undefined) throw new ExprError(`${what} fehlt`);
  const v = evalExpr(e, s);
  const n = typeof v === 'boolean' ? (v ? 1 : 0) : Number(v);
  if (!Number.isFinite(n)) throw new ExprError(`${what} ergibt keine gültige Zahl (${String(e)})`);
  return n;
}

export function bool(e: Expr, s: Scope): boolean {
  return Boolean(evalExpr(e, s));
}

// ---------- OpenSCAD-Ausgabe ----------
export function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return '0';
  const r = Math.round(n * 1e6) / 1e6;
  return Object.is(r, -0) ? '0' : String(r);
}

function astToScad(a: Ast): string {
  switch (a.k) {
    case 'num':
      return fmtNum(a.v);
    case 'bool':
      return a.v ? 'true' : 'false';
    case 'id':
      return a.n;
    case 'un':
      return `${a.op}${wrap(a.a)}`;
    case 'tern':
      return `(${astToScad(a.c)} ? ${astToScad(a.a)} : ${astToScad(a.b)})`;
    case 'call':
      return `${a.f}(${a.args.map(astToScad).join(', ')})`;
    case 'bin':
      return `${wrap(a.a)} ${a.op} ${wrap(a.b)}`;
  }
}
function wrap(a: Ast): string {
  return a.k === 'bin' || a.k === 'tern' ? `(${astToScad(a)})` : astToScad(a);
}

export function exprToScad(e: Expr): string {
  if (typeof e === 'number') return fmtNum(e);
  if (typeof e === 'boolean') return e ? 'true' : 'false';
  return astToScad(parseExpr(e));
}

/** Liefert alle Variablennamen eines Ausdrucks (für die Validierung). */
export function exprIdentifiers(e: Expr): string[] {
  if (typeof e !== 'string') return [];
  const out: string[] = [];
  const walk = (a: Ast) => {
    switch (a.k) {
      case 'id':
        if (a.n !== 'PI') out.push(a.n);
        break;
      case 'un':
        walk(a.a);
        break;
      case 'bin':
        walk(a.a);
        walk(a.b);
        break;
      case 'tern':
        walk(a.c);
        walk(a.a);
        walk(a.b);
        break;
      case 'call':
        a.args.forEach(walk);
        break;
    }
  };
  walk(parseExpr(e));
  return out;
}
