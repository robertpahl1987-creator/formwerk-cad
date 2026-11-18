/**
 * Echte Schrift-Umrisse für „Frei bauen“: Der Text wird im Browser mit einer
 * Systemschrift auf ein Canvas gezeichnet, die Pixelkanten werden zu Konturen
 * verbunden und vereinfacht. Ergebnis: Außenkonturen mit Innenlöchern
 * (o, e, A …), normiert auf Höhe 1 und mittig um den Ursprung.
 * Läuft nur im Browser (braucht ein Canvas).
 */
import type { TextOutline } from './free';

type Pt = [number, number];

function area(p: Pt[]): number {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const q = p[i],
      r = p[(i + 1) % p.length];
    a += q[0] * r[1] - r[0] * q[1];
  }
  return a / 2;
}

function dp(pts: Pt[], eps: number): Pt[] {
  if (pts.length < 3) return pts.slice();
  const a = pts[0],
    b = pts[pts.length - 1],
    dx = b[0] - a[0],
    dy = b[1] - a[1],
    L = Math.hypot(dx, dy);
  let dm = 0,
    ix = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const d = L < 1e-9 ? Math.hypot(p[0] - a[0], p[1] - a[1]) : Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / L;
    if (d > dm) {
      dm = d;
      ix = i;
    }
  }
  if (dm > eps) return dp(pts.slice(0, ix + 1), eps).slice(0, -1).concat(dp(pts.slice(ix), eps));
  return [a, b];
}

function simplifyLoop(loop: Pt[], eps: number): Pt[] {
  let k = 0,
    dm = 0;
  for (let i = 1; i < loop.length; i++) {
    const d = Math.hypot(loop[i][0] - loop[0][0], loop[i][1] - loop[0][1]);
    if (d > dm) {
      dm = d;
      k = i;
    }
  }
  const c1 = dp(loop.slice(0, k + 1), eps),
    c2 = dp(loop.slice(k).concat([loop[0]]), eps);
  return c1.slice(0, -1).concat(c2.slice(0, -1));
}

function inside(pt: Pt, poly: Pt[]): boolean {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i],
      b = poly[j];
    if (a[1] > pt[1] !== b[1] > pt[1] && pt[0] < ((b[0] - a[0]) * (pt[1] - a[1])) / (b[1] - a[1]) + a[0]) ins = !ins;
  }
  return ins;
}

export const FONT_CSS: Record<string, string> = {
  sans: 'system-ui, Roboto, "Segoe UI", Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", Consolas, monospace',
};

export function outlineText(text: string, font: string, bold: boolean): TextOutline | null {
  const lines = text.replace(/\r/g, '').split('\n').slice(0, 4);
  if (!lines.some((l) => l.trim())) return null;
  if (typeof document === 'undefined') return null;
  const css = `${bold ? '700' : '400'} 100px ${FONT_CSS[font] ?? FONT_CSS.sans}`;
  const c = document.createElement('canvas'),
    g = c.getContext('2d', { willReadFrequently: true });
  if (!g) return null;
  g.font = css;
  const W = Math.min(4000, Math.ceil(Math.max(...lines.map((l) => g.measureText(l).width), 1)) + 40);
  const H = lines.length * 125 + 50;
  c.width = W;
  c.height = H;
  g.font = css;
  g.fillStyle = '#000';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  lines.forEach((l, i) => g.fillText(l, W / 2, 40 + i * 125 + 90));
  const d = g.getImageData(0, 0, W, H).data;
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] >= 128;

  // Pixelkanten sammeln: gefüllt liegt links (Y nach oben) → Außenkonturen gegen den Uhrzeigersinn
  interface Edge {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    used: boolean;
  }
  const out = new Map<number, Edge[]>();
  const edges: Edge[] = [];
  const key = (x: number, y: number) => y * (W + 2) + x;
  const add = (x0: number, y0: number, x1: number, y1: number) => {
    const e = { x0, y0, x1, y1, used: false };
    edges.push(e);
    const k = key(x0, y0);
    const l = out.get(k);
    if (l) l.push(e);
    else out.set(k, [e]);
  };
  let minY = Infinity,
    maxY = -Infinity;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (!on(x, y)) continue;
      const Y0 = H - y - 1,
        Y1 = H - y;
      minY = Math.min(minY, Y0);
      maxY = Math.max(maxY, Y1);
      if (!on(x, y + 1)) add(x, Y0, x + 1, Y0);
      if (!on(x + 1, y)) add(x + 1, Y0, x + 1, Y1);
      if (!on(x, y - 1)) add(x + 1, Y1, x, Y1);
      if (!on(x - 1, y)) add(x, Y1, x, Y0);
    }
  if (!edges.length) return null;
  const loops: Pt[][] = [];
  for (const st of edges) {
    if (st.used) continue;
    const loop: Pt[] = [];
    let e: Edge | undefined = st;
    while (e && !e.used) {
      e.used = true;
      loop.push([e.x0, e.y0]);
      const cur: Edge = e;
      const cand = (out.get(key(cur.x1, cur.y1)) ?? []).filter((n) => !n.used);
      if (cand.length > 1) {
        // an Diagonal-Berührungen rechts abbiegen → getrennte, einfache Konturen
        const dx = cur.x1 - cur.x0,
          dy = cur.y1 - cur.y0;
        cand.sort((p, q) => (q.x1 - q.x0) * dy - (q.y1 - q.y0) * dx - ((p.x1 - p.x0) * dy - (p.y1 - p.y0) * dx));
      }
      e = cand[0];
    }
    if (loop.length >= 4) loops.push(loop);
  }
  const h = Math.max(1, maxY - minY),
    cy = (minY + maxY) / 2;
  let minX = Infinity,
    maxX = -Infinity;
  const outers: Pt[][] = [],
    holes: Pt[][] = [];
  for (const l of loops) {
    const s = simplifyLoop(l, 0.55);
    if (s.length < 3) continue;
    const a = area(s);
    if (Math.abs(a) < 2) continue;
    for (const p of s) {
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
    }
    (a > 0 ? outers : holes).push(s);
  }
  if (!outers.length) return null;
  const cx = (minX + maxX) / 2;
  const norm = (p: Pt): Pt => [Math.round(((p[0] - cx) / h) * 1e4) / 1e4, Math.round(((p[1] - cy) / h) * 1e4) / 1e4];
  return {
    key: outlineKey(text, font, bold),
    width: (maxX - minX) / h,
    shapes: outers.map((o) => ({
      outer: o.map(norm),
      holes: holes.filter((hl) => inside(hl[0], o)).map((hl) => hl.map(norm)),
    })),
  };
}

export function outlineKey(text: string, font: string, bold: boolean): string {
  return `${font}|${bold ? 1 : 0}|${text}`;
}
