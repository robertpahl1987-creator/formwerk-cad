/**
 * Mesh-Pipeline: CSG-Polygone → indiziertes Dreiecksnetz.
 *  - Verschweißen identischer Punkte
 *  - Reparatur von T-Kreuzungen (typisch nach Booleschen Operationen)
 *  - Manifold-Prüfung (jede Kante genau 2× mit entgegengesetzter Richtung)
 *  - Volumen, Fläche, Überhänge, Bettkontakt
 */

export interface Mesh {
  pos: Float64Array;
  tri: Uint32Array;
}

const QUANT = 1e-4; // 0,1 µm

export function meshFromPolygons(polys: number[][][]): Mesh {
  const map = new Map<string, number>();
  const pos: number[] = [];
  const tri: number[] = [];
  const idx = (v: number[]) => {
    const key = `${Math.round(v[0] / QUANT)},${Math.round(v[1] / QUANT)},${Math.round(v[2] / QUANT)}`;
    let i = map.get(key);
    if (i === undefined) {
      i = pos.length / 3;
      pos.push(v[0], v[1], v[2]);
      map.set(key, i);
    }
    return i;
  };
  for (const poly of polys) {
    if (poly.length < 3) continue;
    const ids = poly.map(idx);
    // aufeinanderfolgende Duplikate entfernen
    const clean: number[] = [];
    for (const i of ids) if (clean[clean.length - 1] !== i) clean.push(i);
    if (clean.length > 1 && clean[0] === clean[clean.length - 1]) clean.pop();
    for (let k = 1; k + 1 < clean.length; k++) {
      const a = clean[0],
        b = clean[k],
        c = clean[k + 1];
      if (a !== b && b !== c && a !== c) tri.push(a, b, c);
    }
  }
  let m: Mesh = { pos: new Float64Array(pos), tri: new Uint32Array(tri) };
  for (let pass = 0; pass < 3; pass++) {
    m = repairTJunctions(m);
    const cleaned = cleanTriangles(m);
    if (cleaned.tri.length === m.tri.length) break;
    m = cleaned;
  }
  return m;
}

/**
 * Entfernt Dreiecke ohne Fläche (alle Punkte auf einer Linie), doppelte Dreiecke
 * und Null-Dicke-„Flossen“ (gleiches Dreieck in beiden Richtungen). Solche Reste
 * entstehen bei Booleschen Operationen und würden als Fehlkanten zählen.
 */
export function cleanTriangles(m: Mesh): Mesh {
  const { pos, tri } = m;
  const keyOf = (a: number, b: number, c: number) => {
    const s = [a, b, c].sort((x, y) => x - y);
    return `${s[0]},${s[1]},${s[2]}`;
  };
  // Orientierung kanonisch: Rotation so, dass kleinster Index vorne steht
  const orient = (a: number, b: number, c: number) => {
    if (a < b && a < c) return `${a},${b},${c}`;
    if (b < a && b < c) return `${b},${c},${a}`;
    return `${c},${a},${b}`;
  };
  const count = new Map<string, { n: number; dirs: Map<string, number> }>();
  const keep: boolean[] = [];
  for (let t = 0; t < tri.length; t += 3) {
    const a = tri[t], b = tri[t + 1], c = tri[t + 2];
    const ux = pos[3 * b] - pos[3 * a], uy = pos[3 * b + 1] - pos[3 * a + 1], uz = pos[3 * b + 2] - pos[3 * a + 2];
    const vx = pos[3 * c] - pos[3 * a], vy = pos[3 * c + 1] - pos[3 * a + 1], vz = pos[3 * c + 2] - pos[3 * a + 2];
    const cr = Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx);
    const lmax = Math.max(Math.hypot(ux, uy, uz), Math.hypot(vx, vy, vz), 1e-12);
    const degenerate = cr / lmax < 1e-7; // Höhe < 0,1 µm
    keep.push(!degenerate);
    if (degenerate) continue;
    const k = keyOf(a, b, c);
    let e = count.get(k);
    if (!e) count.set(k, (e = { n: 0, dirs: new Map() }));
    e.n++;
    const o = orient(a, b, c);
    e.dirs.set(o, (e.dirs.get(o) ?? 0) + 1);
  }
  const out: number[] = [];
  const emitted = new Map<string, number>();
  for (let t = 0, i = 0; t < tri.length; t += 3, i++) {
    if (!keep[i]) continue;
    const a = tri[t], b = tri[t + 1], c = tri[t + 2];
    const k = keyOf(a, b, c);
    const e = count.get(k)!;
    if (e.n > 1) {
      // Paare entgegengesetzter Richtung heben sich auf; Rest einmal behalten
      const dirs = [...e.dirs.values()];
      const net = dirs.length === 2 ? Math.abs(dirs[0] - dirs[1]) : dirs[0];
      const o = orient(a, b, c);
      const mine = e.dirs.get(o)!;
      const other = dirs.length === 2 ? dirs.find((_, j) => [...e.dirs.keys()][j] !== o)! : 0;
      const allowed = mine > other ? Math.min(1, net) : 0;
      const done = emitted.get(k + '|' + o) ?? 0;
      if (done >= allowed) continue;
      emitted.set(k + '|' + o, done + 1);
    }
    out.push(a, b, c);
  }
  return { pos, tri: new Uint32Array(out) };
}

function edgeKey(a: number, b: number, n: number) {
  return a * n + b;
}

/**
 * CSG-Ergebnisse enthalten oft T-Kreuzungen: ein Punkt liegt auf der Kante
 * eines Nachbardreiecks. Wir teilen solche Dreiecke, bis jede Kante ein
 * Gegenstück hat – das macht das Netz für Slicer sauber manifold.
 */
export function repairTJunctions(m: Mesh, maxPass = 4): Mesh {
  let pos = Array.from(m.pos);
  let tri = Array.from(m.tri);
  for (let pass = 0; pass < maxPass; pass++) {
    const n = pos.length / 3;
    const edges = new Set<number>();
    for (let t = 0; t < tri.length; t += 3)
      for (let e = 0; e < 3; e++) edges.add(edgeKey(tri[t + e], tri[t + ((e + 1) % 3)], n));
    const bad: number[] = [];
    for (let t = 0; t < tri.length; t += 3) {
      for (let e = 0; e < 3; e++) {
        const a = tri[t + e],
          b = tri[t + ((e + 1) % 3)];
        if (!edges.has(edgeKey(b, a, n))) {
          bad.push(t);
          break;
        }
      }
    }
    if (!bad.length) break;

    // Raster für schnelle Punktsuche
    let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < pos.length; i += 3) {
      minX = Math.min(minX, pos[i]); maxX = Math.max(maxX, pos[i]);
      minY = Math.min(minY, pos[i + 1]); maxY = Math.max(maxY, pos[i + 1]);
      minZ = Math.min(minZ, pos[i + 2]); maxZ = Math.max(maxZ, pos[i + 2]);
    }
    const cs = Math.max(0.5, Math.max(maxX - minX, maxY - minY, maxZ - minZ) / 80);
    const grid = new Map<string, number[]>();
    const cell = (x: number, y: number, z: number) => `${Math.floor((x - minX) / cs)},${Math.floor((y - minY) / cs)},${Math.floor((z - minZ) / cs)}`;
    for (let i = 0; i < n; i++) {
      const k = cell(pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]);
      let l = grid.get(k);
      if (!l) grid.set(k, (l = []));
      l.push(i);
    }
    const pointsOnEdge = (a: number, b: number): number[] => {
      const ax = pos[3 * a], ay = pos[3 * a + 1], az = pos[3 * a + 2];
      const dx = pos[3 * b] - ax, dy = pos[3 * b + 1] - ay, dz = pos[3 * b + 2] - az;
      const len2 = dx * dx + dy * dy + dz * dz;
      if (len2 < 1e-14) return [];
      const lo = [Math.min(ax, ax + dx), Math.min(ay, ay + dy), Math.min(az, az + dz)];
      const hi = [Math.max(ax, ax + dx), Math.max(ay, ay + dy), Math.max(az, az + dz)];
      const c0 = [Math.floor((lo[0] - minX) / cs), Math.floor((lo[1] - minY) / cs), Math.floor((lo[2] - minZ) / cs)];
      const c1 = [Math.floor((hi[0] - minX) / cs), Math.floor((hi[1] - minY) / cs), Math.floor((hi[2] - minZ) / cs)];
      const found: { i: number; t: number }[] = [];
      const eps = 1e-3; // 1 µm: Schnittpunkte aus Booleschen Operationen liegen nicht immer exakt auf der Kante
      const ncell = (c1[0] - c0[0] + 1) * (c1[1] - c0[1] + 1) * (c1[2] - c0[2] + 1);
      const test = (i: number) => {
        if (i === a || i === b) return;
        const px = pos[3 * i] - ax, py = pos[3 * i + 1] - ay, pz = pos[3 * i + 2] - az;
        const t = (px * dx + py * dy + pz * dz) / len2;
        if (t <= 1e-7 || t >= 1 - 1e-7) return;
        const ex = px - t * dx, ey = py - t * dy, ez = pz - t * dz;
        if (ex * ex + ey * ey + ez * ez < eps * eps) found.push({ i, t });
      };
      if (ncell > 4000) {
        for (let i = 0; i < n; i++) test(i);
      } else {
        for (let x = c0[0]; x <= c1[0]; x++)
          for (let y = c0[1]; y <= c1[1]; y++)
            for (let z = c0[2]; z <= c1[2]; z++) {
              const l = grid.get(`${x},${y},${z}`);
              if (l) for (const i of l) test(i);
            }
      }
      found.sort((p, q) => p.t - q.t);
      return found.map((f) => f.i);
    };

    const badSet = new Set(bad);
    const out: number[] = [];
    let changed = false;
    for (let t = 0; t < tri.length; t += 3) {
      if (!badSet.has(t)) {
        out.push(tri[t], tri[t + 1], tri[t + 2]);
        continue;
      }
      const v = [tri[t], tri[t + 1], tri[t + 2]];
      const ring: number[] = [];
      let inserted = 0;
      for (let e = 0; e < 3; e++) {
        ring.push(v[e]);
        const pts = pointsOnEdge(v[e], v[(e + 1) % 3]);
        inserted += pts.length;
        ring.push(...pts);
      }
      if (!inserted) {
        out.push(...v);
        continue;
      }
      changed = true;
      // Zerlegung: Fächer vom gegenüberliegenden Eckpunkt, falls nur eine Kante betroffen, sonst vom Schwerpunkt
      const edgesHit = [0, 1, 2].filter((e) => pointsOnEdge(v[e], v[(e + 1) % 3]).length > 0);
      if (edgesHit.length === 1) {
        const e = edgesHit[0];
        const opp = v[(e + 2) % 3];
        const chain = [v[e], ...pointsOnEdge(v[e], v[(e + 1) % 3]), v[(e + 1) % 3]];
        for (let k = 0; k + 1 < chain.length; k++) out.push(chain[k], chain[k + 1], opp);
      } else {
        const c = pos.length / 3;
        pos.push(
          (pos[3 * v[0]] + pos[3 * v[1]] + pos[3 * v[2]]) / 3,
          (pos[3 * v[0] + 1] + pos[3 * v[1] + 1] + pos[3 * v[2] + 1]) / 3,
          (pos[3 * v[0] + 2] + pos[3 * v[1] + 2] + pos[3 * v[2] + 2]) / 3,
        );
        for (let k = 0; k < ring.length; k++) out.push(ring[k], ring[(k + 1) % ring.length], c);
      }
    }
    tri = out;
    if (!changed) break;
  }
  return { pos: new Float64Array(pos), tri: new Uint32Array(tri) };
}

export interface MeshStats {
  triangles: number;
  vertices: number;
  manifold: boolean;
  openEdges: number;
  nonManifoldEdges: number;
  shells: number;
  volume: number; // mm³
  area: number; // mm²
  /** Fläche nach oben/unten zeigender Flächen (Decken/Böden) */
  areaTB: number;
  min: [number, number, number];
  max: [number, number, number];
  overhangArea: number; // mm²
  overhangFlags: Uint8Array; // pro Dreieck
  bedContactArea: number;
}

/** bedZ: Höhe des Druckbetts (Standard: tiefster Punkt dieses Netzes). */
export function analyzeMesh(m: Mesh, overhangDeg = 45, bedZ?: number): MeshStats {
  const { pos, tri } = m;
  const n = pos.length / 3;
  const tcount = tri.length / 3;
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3)
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], pos[i + k]);
      max[k] = Math.max(max[k], pos[i + k]);
    }
  // Kanten
  const dir = new Map<number, number>();
  for (let t = 0; t < tri.length; t += 3)
    for (let e = 0; e < 3; e++) {
      const k = edgeKey(tri[t + e], tri[t + ((e + 1) % 3)], n);
      dir.set(k, (dir.get(k) ?? 0) + 1);
    }
  let open = 0,
    nonMan = 0;
  for (const [k, c] of dir) {
    const a = Math.floor(k / n),
      b = k % n;
    const r = dir.get(edgeKey(b, a, n)) ?? 0;
    if (c > 1) nonMan++;
    else if (r === 0) open++;
  }
  // Schalen (zusammenhängende Teile)
  const parent = new Int32Array(n).map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (let t = 0; t < tri.length; t += 3) {
    const a = find(tri[t]);
    parent[find(tri[t + 1])] = a;
    parent[find(tri[t + 2])] = a;
  }
  const roots = new Set<number>();
  for (let t = 0; t < tri.length; t += 3) roots.add(find(tri[t]));

  let vol = 0,
    area = 0,
    areaTB = 0,
    over = 0,
    bed = 0;
  const flags = new Uint8Array(tcount);
  const cosLim = Math.cos((overhangDeg * Math.PI) / 180);
  const zBed = (bedZ ?? min[2]) + 0.05;
  for (let t = 0, f = 0; t < tri.length; t += 3, f++) {
    const a = 3 * tri[t],
      b = 3 * tri[t + 1],
      c = 3 * tri[t + 2];
    const ax = pos[a], ay = pos[a + 1], az = pos[a + 2];
    const bx = pos[b], by = pos[b + 1], bz = pos[b + 2];
    const cx = pos[c], cy = pos[c + 1], cz = pos[c + 2];
    vol += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-12) continue;
    const ar = len / 2;
    area += ar;
    const z = nz / len;
    if (Math.abs(z) > 0.7) areaTB += ar;
    const onBed = az < zBed && bz < zBed && cz < zBed;
    if (onBed && z < -0.999) bed += ar;
    else if (z < -cosLim) {
      over += ar;
      flags[f] = 1;
    }
  }
  return {
    triangles: tcount,
    vertices: n,
    manifold: tcount > 0 && open === 0 && nonMan === 0,
    openEdges: open,
    nonManifoldEdges: nonMan,
    shells: roots.size,
    volume: Math.abs(vol),
    area,
    areaTB,
    min,
    max,
    overhangArea: over,
    overhangFlags: flags,
    bedContactArea: bed,
  };
}

export interface MaterialDef {
  id: string;
  name: string;
  density: number; // g/cm³
}
export const MATERIALS: MaterialDef[] = [
  { id: 'pla', name: 'PLA', density: 1.24 },
  { id: 'petg', name: 'PETG', density: 1.27 },
  { id: 'abs', name: 'ABS', density: 1.04 },
  { id: 'asa', name: 'ASA', density: 1.07 },
  { id: 'tpu', name: 'TPU', density: 1.21 },
  { id: 'pacf', name: 'PA-CF', density: 1.15 },
];

export interface PrintEstimate {
  grams: number;
  meters: number;
  minutes: number;
}

export type InfillPattern = 'lightning' | 'gyroid' | 'grid' | 'cubic' | 'honeycomb' | 'adaptivecubic' | 'triangles' | 'line';

/** Druckprofil (wird auch als Objekt-Einstellung ins 3MF geschrieben). */
export interface PrintProfile {
  id: 'leicht' | 'standard' | 'stabil' | 'maximal' | 'eigen';
  infill: number; // 0..1
  pattern: InfillPattern;
  walls: number;
  top: number;
  bottom: number;
}

export const PROFILES: Record<Exclude<PrintProfile['id'], 'eigen'>, PrintProfile & { label: string; info: string }> = {
  leicht: { id: 'leicht', label: 'Leicht / Deko', info: 'Minimaler Materialeinsatz, Blitz-Füllung stützt nur die Decken', infill: 0.08, pattern: 'lightning', walls: 2, top: 4, bottom: 3 },
  standard: { id: 'standard', label: 'Standard', info: 'Ausgewogen für Alltagsteile', infill: 0.15, pattern: 'gyroid', walls: 3, top: 5, bottom: 4 },
  stabil: { id: 'stabil', label: 'Stabil', info: 'Halterungen, Haken, Funktionsteile unter Last', infill: 0.3, pattern: 'gyroid', walls: 4, top: 6, bottom: 5 },
  maximal: { id: 'maximal', label: 'Maximal', info: 'Hochbelastete Teile – viel Material', infill: 0.6, pattern: 'cubic', walls: 6, top: 8, bottom: 6 },
};

export const PATTERN_LABEL: Record<InfillPattern, string> = {
  lightning: 'Blitz (minimal)',
  gyroid: 'Gyroid (stabil in alle Richtungen)',
  grid: 'Gitter',
  cubic: 'Kubisch',
  honeycomb: 'Wabe',
  adaptivecubic: 'Adaptiv kubisch',
  triangles: 'Dreiecke',
  line: 'Linien',
};

/**
 * Schätzung wie im Slicer: Wände + Decken/Böden massiv, Inneres mit Füllung.
 * Das Innere ist dabei ein Hohlraum mit Stützstruktur – genau dort wird gespart.
 */
export function estimatePrint(volume: number, area: number, areaTB: number, height: number, density: number, pr: PrintProfile, layer = 0.2): PrintEstimate {
  const line = 0.42;
  const side = Math.max(0, area - areaTB);
  const shell = Math.min(volume, side * pr.walls * line + (areaTB / 2) * (pr.top + pr.bottom) * layer);
  const eff = pr.pattern === 'lightning' ? pr.infill * 0.45 : pr.pattern === 'adaptivecubic' ? pr.infill * 0.75 : pr.infill;
  const solid = shell + Math.max(0, volume - shell) * eff;
  const grams = (solid / 1000) * density;
  const meters = solid / (Math.PI * 0.875 * 0.875) / 1000;
  const flow = 9; // mm³/s effektiv (P1S/X1, Standardprofil)
  const layers = Math.max(1, height / layer);
  const minutes = (solid / flow + layers * 4) / 60 + 1.5;
  return { grams, meters, minutes };
}

/** Prüft 6 Grundausrichtungen und wählt die mit den wenigsten Überhängen. */
export function bestOrientation(m: Mesh, overhangDeg = 45): { rx: number; ry: number; overhang: number } {
  const cands: [number, number][] = [
    [0, 0],
    [180, 0],
    [90, 0],
    [-90, 0],
    [0, 90],
    [0, -90],
  ];
  let best = { rx: 0, ry: 0, overhang: Infinity, bed: 0 };
  for (const [rx, ry] of cands) {
    const r = rotateMesh(m, rx, ry);
    const s = analyzeMesh(r, overhangDeg);
    const score = s.overhangArea - s.bedContactArea * 0.05;
    const bestScore = best.overhang - best.bed * 0.05;
    if (score < bestScore - 1e-6) best = { rx, ry, overhang: s.overhangArea, bed: s.bedContactArea };
  }
  return { rx: best.rx, ry: best.ry, overhang: best.overhang };
}

export function rotateMesh(m: Mesh, rxDeg: number, ryDeg: number): Mesh {
  const rx = (rxDeg * Math.PI) / 180,
    ry = (ryDeg * Math.PI) / 180;
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  const p = new Float64Array(m.pos.length);
  for (let i = 0; i < p.length; i += 3) {
    const x = m.pos[i],
      y = m.pos[i + 1],
      z = m.pos[i + 2];
    // erst X, dann Y (wie im CAD-Bau)
    const y1 = y * cx - z * sx,
      z1 = y * sx + z * cx;
    p[i] = x * cy + z1 * sy;
    p[i + 1] = y1;
    p[i + 2] = -x * sy + z1 * cy;
  }
  return { pos: p, tri: m.tri };
}

export function mergeMeshes(ms: Mesh[]): Mesh {
  let np = 0,
    nt = 0;
  for (const m of ms) {
    np += m.pos.length;
    nt += m.tri.length;
  }
  const pos = new Float64Array(np);
  const tri = new Uint32Array(nt);
  let op = 0,
    ot = 0;
  for (const m of ms) {
    pos.set(m.pos, op);
    const base = op / 3;
    for (let i = 0; i < m.tri.length; i++) tri[ot + i] = m.tri[i] + base;
    op += m.pos.length;
    ot += m.tri.length;
  }
  return { pos, tri };
}

/**
 * Mehrteilige Modelle: Waagerechte Unterseiten, die direkt auf der Oberseite
 * eines anderen Teils aufliegen (z. B. Schrift auf Schild), sind gestützt und
 * zählen nicht als Überhang.
 */
export function suppressSupportedOverhangs(parts: { mesh: Mesh; stats: MeshStats }[]): void {
  if (parts.length < 2) return;
  const ups = new Map<number, number[][]>(); // z (0,01 mm) → Dreiecke [ax,ay,bx,by,cx,cy, teil]
  parts.forEach((p, pi) => {
    const { pos, tri } = p.mesh;
    for (let t = 0; t < tri.length; t += 3) {
      const a = 3 * tri[t], b = 3 * tri[t + 1], c = 3 * tri[t + 2];
      const nz = (pos[b] - pos[a]) * (pos[c + 1] - pos[a + 1]) - (pos[b + 1] - pos[a + 1]) * (pos[c] - pos[a]);
      if (nz <= 0) continue;
      if (Math.abs(pos[a + 2] - pos[b + 2]) > 1e-4 || Math.abs(pos[a + 2] - pos[c + 2]) > 1e-4) continue;
      const k = Math.round(pos[a + 2] * 100);
      if (!ups.has(k)) ups.set(k, []);
      ups.get(k)!.push([pos[a], pos[a + 1], pos[b], pos[b + 1], pos[c], pos[c + 1], pi]);
    }
  });
  const inTri = (x: number, y: number, q: number[]) => {
    const d1 = (x - q[2]) * (q[1] - q[3]) - (q[0] - q[2]) * (y - q[3]);
    const d2 = (x - q[4]) * (q[3] - q[5]) - (q[2] - q[4]) * (y - q[5]);
    const d3 = (x - q[0]) * (q[5] - q[1]) - (q[4] - q[0]) * (y - q[1]);
    const neg = d1 < -1e-9 || d2 < -1e-9 || d3 < -1e-9;
    const pos = d1 > 1e-9 || d2 > 1e-9 || d3 > 1e-9;
    return !(neg && pos);
  };
  parts.forEach((p, pi) => {
    const { pos, tri } = p.mesh;
    const f = p.stats.overhangFlags;
    for (let t = 0, i = 0; t < tri.length; t += 3, i++) {
      if (!f[i]) continue;
      const a = 3 * tri[t], b = 3 * tri[t + 1], c = 3 * tri[t + 2];
      if (Math.abs(pos[a + 2] - pos[b + 2]) > 1e-4 || Math.abs(pos[a + 2] - pos[c + 2]) > 1e-4) continue;
      const cand = ups.get(Math.round(pos[a + 2] * 100));
      if (!cand) continue;
      const cx = (pos[a] + pos[b] + pos[c]) / 3, cy = (pos[a + 1] + pos[b + 1] + pos[c + 1]) / 3;
      if (cand.some((q) => q[6] !== pi && inTri(cx, cy, q))) {
        f[i] = 0;
        const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1];
        p.stats.overhangArea -= Math.abs(ux * vy - uy * vx) / 2;
      }
    }
    p.stats.overhangArea = Math.max(0, p.stats.overhangArea);
  });
}
