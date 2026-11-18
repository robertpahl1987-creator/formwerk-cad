/**
 * Fremde 3D-Dateien importieren (STL binär/ASCII, OBJ, 3MF – z. B. von MakerWorld,
 * Printables, Thingiverse). Die Netze werden verschweißt, um den Ursprung zentriert
 * und im Gerät gespeichert (IndexedDB), damit Projekte sie wiederfinden.
 */
import JSZip from 'jszip';
import type { Mesh } from './mesh';

export interface ImportedMesh {
  id: string;
  name: string;
  /** zentriert: Hüllbox-Mitte im Ursprung */
  mesh: Mesh;
  /** Originalgröße in mm */
  size: [number, number, number];
}

// ------------------------------------------------------------ Parser
function parseStl(buf: ArrayBuffer): number[] {
  const dv = new DataView(buf);
  const out: number[] = [];
  if (buf.byteLength >= 84) {
    const n = dv.getUint32(80, true);
    if (84 + n * 50 === buf.byteLength) {
      for (let i = 0; i < n; i++) {
        const o = 84 + i * 50 + 12;
        for (let k = 0; k < 9; k++) out.push(dv.getFloat32(o + k * 4, true));
      }
      return out;
    }
  }
  // ASCII
  const txt = new TextDecoder().decode(buf);
  const re = /vertex\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(txt))) out.push(+m[1], +m[2], +m[3]);
  if (!out.length || out.length % 9) throw new Error('Diese STL-Datei konnte nicht gelesen werden');
  return out;
}

function parseObj(txt: string): number[] {
  const v: number[][] = [];
  const out: number[] = [];
  for (const line of txt.split(/\r?\n/)) {
    const p = line.trim().split(/\s+/);
    if (p[0] === 'v') v.push([+p[1], +p[2], +p[3]]);
    else if (p[0] === 'f') {
      const ids = p.slice(1).map((s) => {
        const i = parseInt(s.split('/')[0], 10);
        return i < 0 ? v.length + i : i - 1;
      });
      for (let k = 1; k + 1 < ids.length; k++) for (const i of [ids[0], ids[k], ids[k + 1]]) out.push(...(v[i] ?? [0, 0, 0]));
    }
  }
  if (!out.length) throw new Error('Diese OBJ-Datei enthält keine Flächen');
  return out;
}

type Mat = number[]; // 3×4, Zeilen: m00 m01 m02 m10 … wie in 3MF ("m00 m01 m02 m10 m11 m12 m20 m21 m22 m30 m31 m32")
const IDENT: Mat = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
const parseMat = (s: string | null): Mat => (s ? s.trim().split(/\s+/).map(Number) : IDENT);
/** 3MF: Punkt p' = p · M (Zeilenvektor) */
const apply = (m: Mat, x: number, y: number, z: number) => [x * m[0] + y * m[3] + z * m[6] + m[9], x * m[1] + y * m[4] + z * m[7] + m[10], x * m[2] + y * m[5] + z * m[8] + m[11]];
const mul = (a: Mat, b: Mat): Mat => {
  // erst a, dann b
  const r: Mat = new Array(12).fill(0);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 3; j++) {
      const row = i * 3;
      r[row + j] = (i < 3 ? 0 : b[9 + j]) + a[row] * b[j] + a[row + 1] * b[3 + j] + a[row + 2] * b[6 + j];
    }
  return r;
};

async function parse3mf(buf: ArrayBuffer): Promise<number[]> {
  const zip = await JSZip.loadAsync(buf);
  const docs = new Map<string, Document>();
  for (const name of Object.keys(zip.files)) {
    if (!/\.model$/i.test(name)) continue;
    const xml = await zip.files[name].async('string');
    docs.set('/' + name.replace(/^\/+/, ''), new DOMParser().parseFromString(xml, 'application/xml'));
  }
  const main = docs.get('/3D/3dmodel.model') ?? [...docs.values()][0];
  if (!main) throw new Error('In der 3MF-Datei wurde kein Modell gefunden');
  const out: number[] = [];
  const byTag = (el: Element | Document, tag: string) => Array.from(el.getElementsByTagName(tag)).concat(Array.from(el.getElementsByTagName('m:' + tag)));
  const findObj = (doc: Document, id: string) => byTag(doc, 'object').find((o) => o.getAttribute('id') === id);
  const emit = (doc: Document, id: string, m: Mat, depth: number) => {
    if (depth > 8) return;
    const obj = findObj(doc, id);
    if (!obj) return;
    const mesh = byTag(obj, 'mesh')[0];
    if (mesh) {
      const vs = byTag(mesh, 'vertex').map((v) => apply(m, +v.getAttribute('x')!, +v.getAttribute('y')!, +v.getAttribute('z')!));
      for (const t of byTag(mesh, 'triangle')) for (const k of ['v1', 'v2', 'v3']) out.push(...(vs[+t.getAttribute(k)!] ?? [0, 0, 0]));
    }
    for (const c of byTag(obj, 'component')) {
      const path = c.getAttribute('p:path') ?? c.getAttribute('path');
      const d = path ? (docs.get(path) ?? doc) : doc;
      emit(d, c.getAttribute('objectid')!, mul(parseMat(c.getAttribute('transform')), m), depth + 1);
    }
  };
  const items = byTag(main, 'item');
  if (items.length) for (const it of items) emit(main, it.getAttribute('objectid')!, parseMat(it.getAttribute('transform')), 0);
  else for (const o of byTag(main, 'object')) emit(main, o.getAttribute('id')!, IDENT, 0);
  if (!out.length) throw new Error('Die 3MF-Datei enthält keine Dreiecke');
  return out;
}

// ------------------------------------------------------------ Aufbereiten
/** Dreiecks-Suppe → verschweißtes, zentriertes Netz. */
export function weldTriangles(soup: ArrayLike<number>): { mesh: Mesh; size: [number, number, number] } {
  const min = [Infinity, Infinity, Infinity],
    max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < soup.length; i++) {
    const k = i % 3;
    if (soup[i] < min[k]) min[k] = soup[i];
    if (soup[i] > max[k]) max[k] = soup[i];
  }
  if (!Number.isFinite(min[0])) throw new Error('Die Datei ist leer');
  const c = [0, 1, 2].map((k) => (min[k] + max[k]) / 2);
  const Q = 1e-3;
  const map = new Map<string, number>();
  const pos: number[] = [];
  const tri: number[] = [];
  const idx = (x: number, y: number, z: number) => {
    const key = `${Math.round(x / Q)},${Math.round(y / Q)},${Math.round(z / Q)}`;
    let i = map.get(key);
    if (i === undefined) {
      i = pos.length / 3;
      pos.push(x, y, z);
      map.set(key, i);
    }
    return i;
  };
  for (let i = 0; i + 8 < soup.length; i += 9) {
    const a = idx(soup[i] - c[0], soup[i + 1] - c[1], soup[i + 2] - c[2]);
    const b = idx(soup[i + 3] - c[0], soup[i + 4] - c[1], soup[i + 5] - c[2]);
    const d = idx(soup[i + 6] - c[0], soup[i + 7] - c[1], soup[i + 8] - c[2]);
    if (a !== b && b !== d && a !== d) tri.push(a, b, d);
  }
  if (!tri.length) throw new Error('Die Datei enthält keine gültigen Dreiecke');
  return { mesh: { pos: new Float64Array(pos), tri: new Uint32Array(tri) }, size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]].map((v) => Math.round(v * 100) / 100) as [number, number, number] };
}

export function hashId(m: Mesh): string {
  let h = 2166136261;
  const step = Math.max(1, Math.floor(m.pos.length / 4000));
  for (let i = 0; i < m.pos.length; i += step) {
    h ^= Math.round(m.pos[i] * 1000);
    h = Math.imul(h, 16777619);
  }
  return `m${(h >>> 0).toString(36)}${m.tri.length.toString(36)}`;
}

export async function readMeshFile(file: File): Promise<ImportedMesh> {
  const name = file.name.replace(/\.[^.]+$/, '');
  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  if (file.size > 80 * 1024 * 1024) throw new Error('Die Datei ist zu groß (max. 80 MB)');
  const im = await parseMeshBuffer(name, ext, await file.arrayBuffer());
  await registerImported(im);
  return im;
}

export async function parseMeshBuffer(name: string, ext: string, buf: ArrayBuffer): Promise<ImportedMesh> {
  let soup: number[];
  if (ext === 'stl') soup = parseStl(buf);
  else if (ext === 'obj') soup = parseObj(new TextDecoder().decode(buf));
  else if (ext === '3mf') soup = await parse3mf(buf);
  else throw new Error('Bitte eine STL-, 3MF- oder OBJ-Datei wählen');
  const { mesh, size } = weldTriangles(soup);
  return { id: hashId(mesh), name, mesh, size };
}

// ------------------------------------------------------------ Speicher (Gerät)
const reg = new Map<string, ImportedMesh>();
let version = 0;
const listeners = new Set<() => void>();
const bump = () => {
  version++;
  listeners.forEach((l) => l());
};
export const importVersion = () => version;
export const subscribeImports = (l: () => void) => (listeners.add(l), () => void listeners.delete(l));
export const getImported = (id: string) => reg.get(id);

function db(): Promise<IDBDatabase | null> {
  return new Promise((res) => {
    try {
      if (typeof indexedDB === 'undefined') return res(null);
      const r = indexedDB.open('formwerk-imports', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('meshes');
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch {
      res(null);
    }
  });
}

export async function registerImported(im: ImportedMesh, persist = true): Promise<void> {
  reg.set(im.id, im);
  bump();
  if (!persist) return;
  const d = await db();
  if (!d) return;
  await new Promise<void>((res) => {
    const tx = d.transaction('meshes', 'readwrite');
    tx.objectStore('meshes').put({ id: im.id, name: im.name, size: im.size, pos: im.mesh.pos, tri: im.mesh.tri }, im.id);
    tx.oncomplete = () => res();
    tx.onerror = () => res();
  });
}

/** Beim Start: alle gespeicherten Importe laden. */
export async function loadImported(): Promise<void> {
  const d = await db();
  if (!d) return;
  await new Promise<void>((res) => {
    const tx = d.transaction('meshes', 'readonly');
    const rq = tx.objectStore('meshes').getAll();
    rq.onsuccess = () => {
      for (const r of rq.result as { id: string; name: string; size: [number, number, number]; pos: Float64Array; tri: Uint32Array }[])
        reg.set(r.id, { id: r.id, name: r.name, size: r.size, mesh: { pos: r.pos, tri: r.tri } });
      res();
    };
    rq.onerror = () => res();
  });
  bump();
}

/** Für Projekt-Dateien: Netz als Base64 einbetten / wiederherstellen. */
export function meshToJson(im: ImportedMesh): { id: string; name: string; size: [number, number, number]; pos: string; tri: string } {
  const b64 = (u8: Uint8Array) => {
    let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    return btoa(s);
  };
  return { id: im.id, name: im.name, size: im.size, pos: b64(new Uint8Array(new Float32Array(im.mesh.pos).buffer)), tri: b64(new Uint8Array(im.mesh.tri.buffer.slice(0))) };
}
export function meshFromJson(j: { id: string; name: string; size: [number, number, number]; pos: string; tri: string }): ImportedMesh {
  const u8 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return { id: j.id, name: j.name, size: j.size, mesh: { pos: new Float64Array(new Float32Array(u8(j.pos).buffer)), tri: new Uint32Array(u8(j.tri).buffer) } };
}
