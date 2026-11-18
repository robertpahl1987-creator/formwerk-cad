/**
 * Ablage zwischen Handy und PC: ein privater GitHub-Gist des Nutzers dient als Zwischenspeicher
 * für Fotos und Projekte. Der Zugangsschlüssel (Token mit Recht „gist“) bleibt nur auf dem Gerät.
 */
const TOKEN_KEY = 'formwerk-cad:gh-token';
const GIST_KEY = 'formwerk-cad:gist-id';
const DESC = 'Formwerk CAD – Ablage (Fotos & Projekte)';
const API = 'https://api.github.com';

export const cloudToken = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) ?? '';
    } catch {
      return '';
    }
  },
  set: (t: string) => {
    try {
      if (t.trim()) localStorage.setItem(TOKEN_KEY, t.trim());
      else localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(GIST_KEY);
    } catch {
      /* egal */
    }
  },
};

async function gh(path: string, init: RequestInit = {}): Promise<Response> {
  const token = cloudToken.get();
  if (!token) throw new Error('Für die Ablage in den Einstellungen einen GitHub-Schlüssel (Recht „gist“) eintragen');
  const r = await fetch(API + path, {
    ...init,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  if (r.status === 401) throw new Error('GitHub-Schlüssel ungültig oder abgelaufen – in den Einstellungen neu eintragen');
  if (r.status === 403 || r.status === 404) {
    const t = await r.text();
    if (/scope|permission|Resource not accessible/i.test(t)) throw new Error('Dem GitHub-Schlüssel fehlt das Recht „gist“');
    if (r.status === 404) throw Object.assign(new Error('nicht gefunden'), { notFound: true });
    throw new Error(`GitHub: ${t.slice(0, 120)}`);
  }
  if (!r.ok) throw new Error(`GitHub-Fehler ${r.status}: ${(await r.text()).slice(0, 120)}`);
  return r;
}

async function gistId(): Promise<string> {
  try {
    const cached = localStorage.getItem(GIST_KEY);
    if (cached) return cached;
  } catch {
    /* egal */
  }
  // vorhandene Ablage suchen (auf allen Geräten derselbe Gist)
  for (let page = 1; page <= 5; page++) {
    const list = (await (await gh(`/gists?per_page=100&page=${page}`)).json()) as { id: string; description: string }[];
    const f = list.find((g) => g.description === DESC);
    if (f) {
      localStorage.setItem(GIST_KEY, f.id);
      return f.id;
    }
    if (list.length < 100) break;
  }
  const created = (await (
    await gh('/gists', {
      method: 'POST',
      body: JSON.stringify({ description: DESC, public: false, files: { 'LIESMICH.md': { content: 'Ablage von Formwerk CAD. Dateien hier nicht von Hand ändern.' } } }),
    })
  ).json()) as { id: string };
  localStorage.setItem(GIST_KEY, created.id);
  return created.id;
}

export interface CloudEntry {
  file: string;
  kind: 'foto' | 'projekt';
  name: string;
  time: number;
  size: number;
  rawUrl: string;
}

/** Dateiname: foto__<zeit>__<name>.b64 bzw. projekt__<zeit>__<name>.json */
const parse = (file: string, size: number, rawUrl: string): CloudEntry | null => {
  const m = file.match(/^(foto|projekt)__(\d+)__(.*)\.(b64|json)$/);
  if (!m) return null;
  return { file, kind: m[1] as CloudEntry['kind'], time: +m[2], name: decodeURIComponent(m[3]), size, rawUrl };
};

export async function cloudList(): Promise<CloudEntry[]> {
  let g: { files: Record<string, { size: number; raw_url: string }> };
  try {
    g = await (await gh(`/gists/${await gistId()}`)).json();
  } catch (e) {
    if ((e as { notFound?: boolean }).notFound) {
      localStorage.removeItem(GIST_KEY);
      g = await (await gh(`/gists/${await gistId()}`)).json();
    } else throw e;
  }
  return Object.entries(g.files)
    .map(([f, v]) => parse(f, v.size, v.raw_url))
    .filter((x): x is CloudEntry => !!x)
    .sort((a, b) => b.time - a.time);
}

export async function cloudPut(kind: CloudEntry['kind'], name: string, content: string): Promise<void> {
  const file = `${kind}__${Date.now()}__${encodeURIComponent(name.replace(/[\\/]/g, '-')).slice(0, 80)}.${kind === 'foto' ? 'b64' : 'json'}`;
  if (content.length > 9_000_000) throw new Error('Zu groß für die Ablage (max. ca. 9 MB)');
  await gh(`/gists/${await gistId()}`, { method: 'PATCH', body: JSON.stringify({ files: { [file]: { content } } }) });
}

export async function cloudGet(e: CloudEntry): Promise<string> {
  // raw_url liefert auch große Dateien vollständig (die API kürzt ab 1 MB)
  try {
    const r = await fetch(e.rawUrl);
    if (r.ok) return await r.text();
  } catch {
    /* z. B. blockiert – über die API versuchen */
  }
  const g = (await (await gh(`/gists/${await gistId()}`)).json()) as { files: Record<string, { content?: string; truncated?: boolean }> };
  const f = g.files[e.file];
  if (!f?.content || f.truncated) throw new Error('Datei konnte nicht geladen werden');
  return f.content;
}

export async function cloudDelete(e: CloudEntry): Promise<void> {
  await gh(`/gists/${await gistId()}`, { method: 'PATCH', body: JSON.stringify({ files: { [e.file]: null } }) });
}

/** Foto verkleinern (max. 2000 px, JPEG) und als Base64 (ohne data:-Präfix) liefern. */
export async function photoToB64(file: Blob, maxSide = 2000): Promise<string> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const cv = document.createElement('canvas');
  cv.width = Math.round(bmp.width * k);
  cv.height = Math.round(bmp.height * k);
  cv.getContext('2d')!.drawImage(bmp, 0, 0, cv.width, cv.height);
  const blob: Blob = await new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('Bild konnte nicht umgewandelt werden'))), 'image/jpeg', 0.88));
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = '';
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}
export function b64ToBlob(b64: string): Blob {
  const bin = atob(b64.trim());
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type: 'image/jpeg' });
}

/** Foto aus der Ablage an Foto-Modus / Lithophanie übergeben. */
export const PHOTO_EVENT = 'formwerk:foto';
export function sendPhoto(blob: Blob, target: 'photo' | 'litho') {
  window.dispatchEvent(new CustomEvent(PHOTO_EVENT, { detail: { blob, target } }));
}
