/**
 * Lithophanie: Foto → Relief, das gegen Licht gehalten das Bild zeigt
 * (dunkle Stellen = dicker). Flach oder gebogen (Lampenschirm), als geschlossenes Netz.
 */
export interface LithoOptions {
  width: number; // mm
  tMin: number; // mm (hellste Stelle)
  tMax: number; // mm (dunkelste Stelle)
  border: number; // mm Rahmen in voller Stärke
  arc: number; // Grad, 0 = flach
  res: number; // mm pro Bildpunkt
  invert: boolean;
  contrast: number; // 0.5 … 2
}

export const DEFAULT_LITHO: LithoOptions = { width: 100, tMin: 0.8, tMax: 3, border: 3, arc: 0, res: 0.25, invert: false, contrast: 1.15 };

/** Helligkeitsraster (0 = schwarz, 1 = weiß) aus einem Bild. */
export function sampleImage(img: CanvasImageSource & { width: number; height: number }, o: LithoOptions): { w: number; h: number; lum: Float32Array } {
  const inner = Math.max(10, o.width - 2 * o.border);
  const aspect = img.height / img.width;
  const w = Math.min(500, Math.max(20, Math.round(inner / o.res)));
  const h = Math.min(700, Math.max(20, Math.round(w * aspect)));
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    let l = (0.2126 * d[4 * i] + 0.7152 * d[4 * i + 1] + 0.0722 * d[4 * i + 2]) / 255;
    l = Math.min(1, Math.max(0, (l - 0.5) * o.contrast + 0.5));
    lum[i] = o.invert ? 1 - l : l;
  }
  return { w, h, lum };
}

/** Erzeugt die Dreiecks-Suppe (x,y,z je Ecke) – Bild steht in X/Z, Stärke in Y (gedruckt stehend). */
export function lithoSoup(g: { w: number; h: number; lum: Float32Array }, o: LithoOptions): Float32Array {
  const inner = Math.max(10, o.width - 2 * o.border);
  const px = inner / g.w;
  const bw = Math.max(0, Math.round(o.border / px));
  const W = g.w + 2 * bw,
    Hh = g.h + 2 * bw;
  const width = W * px;
  // Stärke je Gitterpunkt (Ecken der Bildpunkte)
  const th = new Float32Array((W + 1) * (Hh + 1));
  const at = (x: number, y: number) => {
    const ix = x - bw,
      iy = y - bw;
    if (ix < 0 || iy < 0 || ix >= g.w || iy >= g.h) return o.tMax;
    return o.tMin + (1 - g.lum[iy * g.w + ix]) * (o.tMax - o.tMin);
  };
  for (let y = 0; y <= Hh; y++)
    for (let x = 0; x <= W; x++) {
      // Mittel der angrenzenden Bildpunkte → glatte Oberfläche
      let s = 0,
        n = 0;
      for (const [dx, dy] of [
        [-1, -1],
        [0, -1],
        [-1, 0],
        [0, 0],
      ]) {
        const xx = x + dx,
          yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= Hh) continue;
        s += at(xx, yy);
        n++;
      }
      th[y * (W + 1) + x] = n ? s / n : o.tMax;
    }
  const arc = (Math.min(Math.max(o.arc, 0), 330) * Math.PI) / 180;
  const Rc = arc > 0.01 ? width / arc : 0;
  // Bildzeile 0 ist oben → Z nach oben = Hh - y
  const map = (x: number, y: number, t: number): [number, number, number] => {
    const u = x * px,
      z = (Hh - y) * px;
    if (!Rc) return [u - width / 2, t, z];
    const a = u / Rc - arc / 2;
    return [(Rc + t) * Math.sin(a), (Rc + t) * Math.cos(a) - Rc, z];
  };
  const out: number[] = [];
  const tri = (a: number[], b: number[], c: number[]) => out.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  const top = (x: number, y: number) => map(x, y, th[y * (W + 1) + x]);
  const bot = (x: number, y: number) => map(x, y, 0);
  // Vorderseite (Relief, zeigt nach +Y) und Rückseite (glatt)
  for (let y = 0; y < Hh; y++)
    for (let x = 0; x < W; x++) {
      const a = top(x, y),
        b = top(x + 1, y),
        c = top(x + 1, y + 1),
        d = top(x, y + 1);
      tri(a, b, c);
      tri(a, c, d);
    }
  if (!Rc) {
    // flache Rückseite: Fächer von der Mitte über den Rand (konvexes Rechteck)
    const ring: [number, number][] = [];
    for (let x = 0; x < W; x++) ring.push([x, 0]);
    for (let y = 0; y < Hh; y++) ring.push([W, y]);
    for (let x = W; x > 0; x--) ring.push([x, Hh]);
    for (let y = Hh; y > 0; y--) ring.push([0, y]);
    const c = map(W / 2, Hh / 2, 0);
    for (let i = 0; i < ring.length; i++) {
      const p = ring[i],
        q = ring[(i + 1) % ring.length];
      tri(c, bot(q[0], q[1]), bot(p[0], p[1]));
    }
  } else {
    // gebogene Rückseite: Streifen über die ganze Höhe je Spalte (eben in Höhenrichtung)
    for (let x = 0; x < W; x++) {
      // Spalte als Fächer: linke Kante unten → oben, rechte Kante oben → unten
      for (let y = 0; y < Hh; y++) {
        const a = bot(x, y),
          b = bot(x + 1, y),
          c = bot(x + 1, y + 1),
          d = bot(x, y + 1);
        tri(a, c, b);
        tri(a, d, c);
      }
    }
  }
  // Seitenwände
  for (let x = 0; x < W; x++) {
    // obere Kante (y = 0) und untere Kante (y = Hh)
    tri(top(x, 0), bot(x, 0), bot(x + 1, 0));
    tri(top(x, 0), bot(x + 1, 0), top(x + 1, 0));
    tri(top(x + 1, Hh), bot(x + 1, Hh), bot(x, Hh));
    tri(top(x + 1, Hh), bot(x, Hh), top(x, Hh));
  }
  for (let y = 0; y < Hh; y++) {
    tri(top(0, y + 1), bot(0, y + 1), bot(0, y));
    tri(top(0, y + 1), bot(0, y), top(0, y));
    tri(top(W, y), bot(W, y), bot(W, y + 1));
    tri(top(W, y), bot(W, y + 1), top(W, y + 1));
  }
  return new Float32Array(out);
}
