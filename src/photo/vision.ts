/**
 * Foto → maßhaltige Kontur.
 *  1) Maßstab: Referenzlinie (px ↔ mm) ODER 4-Punkt-Perspektiventzerrung
 *     anhand eines bekannten Rechtecks (A4, Kreditkarte …)
 *  2) Segmentierung: Graustufen → Otsu-Schwelle → Morphologie
 *  3) Größtes Objekt + Innenlöcher → Moore-Konturverfolgung → Douglas-Peucker
 * Alles läuft lokal im Browser (keine Cloud nötig).
 */

export type Pt = [number, number];

export async function loadImageToCanvas(file: Blob, maxSide = 1800): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('Bild konnte nicht geladen werden'));
      img.src = url;
    });
    const s = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ---------- Homographie ----------
function solve(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) throw new Error('Punkte ungültig (liegen auf einer Linie?)');
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r, i) => r[n] / r[i]);
}

/** Homographie H mit dst = H·src (3×3, h33 = 1). */
export function homography(src: Pt[], dst: Pt[]): number[] {
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  return [...solve(A, b), 1];
}

export function applyH(H: number[], p: Pt): Pt {
  const w = H[6] * p[0] + H[7] * p[1] + H[8];
  return [(H[0] * p[0] + H[1] * p[1] + H[2]) / w, (H[3] * p[0] + H[4] * p[1] + H[5]) / w];
}

/** Sortiert 4 Punkte zu: oben-links, oben-rechts, unten-rechts, unten-links. */
export function orderQuad(pts: Pt[]): Pt[] {
  const c: Pt = [pts.reduce((s, p) => s + p[0], 0) / 4, pts.reduce((s, p) => s + p[1], 0) / 4];
  const sorted = [...pts].sort((a, b) => Math.atan2(a[1] - c[1], a[0] - c[0]) - Math.atan2(b[1] - c[1], b[0] - c[0]));
  // atan2 sortiert ab -π (links) im Uhrzeigersinn (y nach unten) → finde TL (kleinstes x+y)
  let tl = 0;
  sorted.forEach((p, i) => {
    if (p[0] + p[1] < sorted[tl][0] + sorted[tl][1]) tl = i;
  });
  return [0, 1, 2, 3].map((k) => sorted[(tl + k) % 4]);
}

/**
 * Entzerrt das Viereck `quad` (Bildpixel) auf ein Rechteck wMm × hMm.
 * Ergebnis: neues Bild mit bekanntem Maßstab pxPerMm.
 */
export function rectify(src: HTMLCanvasElement, quad: Pt[], wMm: number, hMm: number, marginMm = 0): { canvas: HTMLCanvasElement; pxPerMm: number } {
  const q = orderQuad(quad);
  // Längere Bildseite des Vierecks ↔ längere Rechteckseite
  const top = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
  const left = Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]);
  let W = wMm,
    Hh = hMm;
  if ((top > left) !== (W > Hh)) [W, Hh] = [Hh, W];
  const totalW = W + 2 * marginMm,
    totalH = Hh + 2 * marginMm;
  const pxPerMm = Math.min(5, 1500 / Math.max(totalW, totalH));
  const ow = Math.round(totalW * pxPerMm),
    oh = Math.round(totalH * pxPerMm);
  const m = marginMm * pxPerMm;
  const dst: Pt[] = [
    [m, m],
    [m + W * pxPerMm, m],
    [m + W * pxPerMm, m + Hh * pxPerMm],
    [m, m + Hh * pxPerMm],
  ];
  const Hinv = homography(dst, q); // Ziel → Quelle
  const sctx = src.getContext('2d')!;
  const sd = sctx.getImageData(0, 0, src.width, src.height);
  const out = document.createElement('canvas');
  out.width = ow;
  out.height = oh;
  const octx = out.getContext('2d')!;
  const od = octx.createImageData(ow, oh);
  const sw = src.width,
    sh = src.height,
    S = sd.data,
    O = od.data;
  for (let y = 0; y < oh; y++) {
    for (let x = 0; x < ow; x++) {
      const [sx, sy] = applyH(Hinv, [x + 0.5, y + 0.5]);
      const o = 4 * (y * ow + x);
      const fx = sx - 0.5,
        fy = sy - 0.5;
      const x0 = Math.floor(fx),
        y0 = Math.floor(fy);
      if (x0 < 0 || y0 < 0 || x0 + 1 >= sw || y0 + 1 >= sh) {
        O[o] = O[o + 1] = O[o + 2] = 128;
        O[o + 3] = 255;
        continue;
      }
      const ax = fx - x0,
        ay = fy - y0;
      for (let c = 0; c < 3; c++) {
        const i00 = S[4 * (y0 * sw + x0) + c],
          i10 = S[4 * (y0 * sw + x0 + 1) + c],
          i01 = S[4 * ((y0 + 1) * sw + x0) + c],
          i11 = S[4 * ((y0 + 1) * sw + x0 + 1) + c];
        O[o + c] = (i00 * (1 - ax) + i10 * ax) * (1 - ay) + (i01 * (1 - ax) + i11 * ax) * ay;
      }
      O[o + 3] = 255;
    }
  }
  octx.putImageData(od, 0, 0);
  return { canvas: out, pxPerMm };
}

// ---------- Segmentierung ----------
export interface SegOptions {
  invert: boolean; // true: Objekt ist heller als der Hintergrund
  threshold: number | null; // null = automatisch (Otsu)
  maxSide?: number;
}
export interface SegResult {
  mask: Uint8Array;
  w: number;
  h: number;
  scale: number; // Faktor Arbeitsbild → Eingabebild
  threshold: number;
}

export function segment(src: HTMLCanvasElement, o: SegOptions): SegResult {
  const maxSide = o.maxSide ?? 900;
  const scale = Math.min(1, maxSide / Math.max(src.width, src.height));
  const w = Math.max(2, Math.round(src.width * scale)),
    h = Math.max(2, Math.round(src.height * scale));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = 0.299 * d[4 * i] + 0.587 * d[4 * i + 1] + 0.114 * d[4 * i + 2];
  // 3×3-Weichzeichner
  const gb = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let s = 0,
        n = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx,
            yy = y + dy;
          if (xx >= 0 && yy >= 0 && xx < w && yy < h) {
            s += g[yy * w + xx];
            n++;
          }
        }
      gb[y * w + x] = s / n;
    }
  const thr = o.threshold ?? otsu(gb);
  let mask: Uint8Array = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = (o.invert ? gb[i] > thr : gb[i] < thr) ? 1 : 0;
  mask = morph(morph(mask, w, h, 'close'), w, h, 'open');
  return { mask, w, h, scale, threshold: thr };
}

function otsu(g: Float32Array): number {
  const hist = new Float64Array(256);
  for (const v of g) hist[Math.max(0, Math.min(255, Math.round(v)))]++;
  const total = g.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0,
    wB = 0,
    best = 0,
    thr = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB,
      mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > best) {
      best = between;
      thr = t;
    }
  }
  return thr + 0.5;
}

function morph(m: Uint8Array, w: number, h: number, op: 'open' | 'close'): Uint8Array {
  const er = (a: Uint8Array, val: 0 | 1) => {
    // val=0: Erosion (Pixel bleibt 1 nur wenn alle Nachbarn 1); val=1: Dilatation
    const o = new Uint8Array(a.length);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let r = val === 0 ? 1 : 0;
        for (let dy = -1; dy <= 1 && (val === 0 ? r : !r); dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const xx = Math.min(w - 1, Math.max(0, x + dx)),
              yy = Math.min(h - 1, Math.max(0, y + dy));
            const v = a[yy * w + xx];
            if (val === 0 && !v) {
              r = 0;
              break;
            }
            if (val === 1 && v) {
              r = 1;
              break;
            }
          }
        o[y * w + x] = r;
      }
    return o;
  };
  return op === 'open' ? er(er(m, 0), 1) : er(er(m, 1), 0);
}

// ---------- Komponenten & Konturen ----------
function label(mask: Uint8Array, w: number, h: number, value: 0 | 1, conn8: boolean): { labels: Int32Array; sizes: number[]; touches: boolean[] } {
  const labels = new Int32Array(w * h).fill(-1);
  const sizes: number[] = [];
  const touches: boolean[] = [];
  const stack: number[] = [];
  const nb = conn8 ? [-1, 1, -w, w, -w - 1, -w + 1, w - 1, w + 1] : [-1, 1, -w, w];
  for (let i = 0; i < w * h; i++) {
    if (mask[i] !== value || labels[i] >= 0) continue;
    const id = sizes.length;
    let size = 0,
      touch = false;
    labels[i] = id;
    stack.push(i);
    while (stack.length) {
      const p = stack.pop()!;
      size++;
      const x = p % w,
        y = (p / w) | 0;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touch = true;
      for (const d of nb) {
        const q = p + d;
        if (q < 0 || q >= w * h) continue;
        const qx = q % w;
        if (Math.abs(qx - x) > 1) continue;
        if (mask[q] === value && labels[q] < 0) {
          labels[q] = id;
          stack.push(q);
        }
      }
    }
    sizes.push(size);
    touches.push(touch);
  }
  return { labels, sizes, touches };
}

const DIRS: Pt[] = [
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
];

/** Moore-Nachbarschafts-Konturverfolgung (8er-Nachbarschaft). */
function trace(inside: (x: number, y: number) => boolean, sx: number, sy: number, maxSteps: number): Pt[] {
  const out: Pt[] = [[sx, sy]];
  let px = sx,
    py = sy,
    start = 0;
  let second: Pt | null = null;
  for (let step = 0; step < maxSteps; step++) {
    let found = -1;
    for (let k = 0; k < 8; k++) {
      const idx = (start + k) % 8;
      if (inside(px + DIRS[idx][0], py + DIRS[idx][1])) {
        found = idx;
        break;
      }
    }
    if (found < 0) return out; // Einzelpixel
    const nx = px + DIRS[found][0],
      ny = py + DIRS[found][1];
    if (px === sx && py === sy && second && nx === second[0] && ny === second[1] && step > 1) break;
    if (!second) second = [nx, ny];
    px = nx;
    py = ny;
    out.push([px, py]);
    start = found % 2 ? (found + 5) % 8 : (found + 6) % 8;
  }
  if (out.length > 1 && out[out.length - 1][0] === sx && out[out.length - 1][1] === sy) out.pop();
  return out;
}

function rdp(pts: Pt[], eps: number): Pt[] {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = pts[a],
      [bx, by] = pts[b];
    const dx = bx - ax,
      dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-9;
    let md = -1,
      mi = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > md) {
        md = d;
        mi = i;
      }
    }
    if (md > eps && mi > 0) {
      keep[mi] = 1;
      stack.push([a, mi], [mi, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Vereinfachung eines geschlossenen Polygons. */
export function simplifyClosed(pts: Pt[], eps: number): Pt[] {
  if (pts.length < 8) return pts;
  // am weitest entfernten Punktepaar teilen
  let far = 0,
    fd = -1;
  for (let i = 0; i < pts.length; i++) {
    const d = (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2;
    if (d > fd) {
      fd = d;
      far = i;
    }
  }
  const a = rdp(pts.slice(0, far + 1), eps);
  const b = rdp([...pts.slice(far), pts[0]], eps);
  const res = [...a.slice(0, -1), ...b.slice(0, -1)];
  return res.length >= 3 ? res : pts;
}

export interface Contour {
  outer: Pt[]; // in Pixeln des Eingabebilds
  holes: Pt[][];
  areaPx: number;
}

export function findContour(seg: SegResult, minHoleFrac = 0.002): Contour | null {
  const { mask, w, h, scale } = seg;
  const fg = label(mask, w, h, 1, true);
  if (!fg.sizes.length) return null;
  // größtes Objekt, das den Rand nicht berührt – sonst das größte überhaupt
  let best = -1;
  fg.sizes.forEach((s, i) => {
    if (!fg.touches[i] && (best < 0 || s > fg.sizes[best])) best = i;
  });
  if (best < 0 || fg.sizes[best] < 0.002 * w * h) {
    best = 0;
    fg.sizes.forEach((s, i) => {
      if (s > fg.sizes[best]) best = i;
    });
  }
  const obj = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) obj[i] = fg.labels[i] === best ? 1 : 0;
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && obj[y * w + x] === 1;
  let s = 0;
  while (s < w * h && !obj[s]) s++;
  const outer = trace(inside, s % w, (s / w) | 0, 8 * w * h);

  // Löcher: Hintergrund-Komponenten, die nicht mit dem Rand verbunden sind
  const bg = label(obj, w, h, 0, false);
  const holes: Pt[][] = [];
  const minHole = Math.max(12, minHoleFrac * fg.sizes[best]);
  bg.sizes.forEach((size, id) => {
    if (bg.touches[id] || size < minHole) return;
    const ins = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && bg.labels[y * w + x] === id;
    let st = 0;
    while (st < w * h && bg.labels[st] !== id) st++;
    const hc = trace(ins, st % w, (st / w) | 0, 8 * w * h);
    if (hc.length >= 3) holes.push(hc);
  });
  const inv = 1 / scale;
  const toSrc = (p: Pt): Pt => [(p[0] + 0.5) * inv, (p[1] + 0.5) * inv];
  return { outer: outer.map(toSrc), holes: holes.map((h2) => h2.map(toSrc)), areaPx: fg.sizes[best] * inv * inv };
}

/** Pixel → mm, Y nach oben, zentriert. Vereinfachung in mm. */
export function contourToMm(c: Contour, pxPerMm: number, simplifyMm: number): { outer: Pt[]; holes: Pt[][]; width: number; height: number } {
  const xs = c.outer.map((p) => p[0]),
    ys = c.outer.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2,
    cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const conv = (pts: Pt[]) =>
    simplifyClosed(pts, simplifyMm * pxPerMm).map((p) => [Math.round(((p[0] - cx) / pxPerMm) * 100) / 100, Math.round((-(p[1] - cy) / pxPerMm) * 100) / 100] as Pt);
  const outer = conv(c.outer);
  const holes = c.holes.map(conv).filter((h) => h.length >= 3);
  return {
    outer,
    holes,
    width: (Math.max(...xs) - Math.min(...xs)) / pxPerMm,
    height: (Math.max(...ys) - Math.min(...ys)) / pxPerMm,
  };
}
