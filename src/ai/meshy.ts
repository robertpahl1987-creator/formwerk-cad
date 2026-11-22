/**
 * Echte Foto-zu-3D-Umwandlung über Meshy (meshy.ai): 1–4 Fotos → druckbares STL.
 * Der API-Schlüssel bleibt nur auf dem Gerät. In der Android-App laufen die Anfragen
 * nativ (CapacitorHttp) – so stören Browser-Sperren (CORS) dort nicht.
 */
import { Capacitor, CapacitorHttp } from '@capacitor/core';

const BASE = 'https://api.meshy.ai/openapi/v1';

function meshyError(status: number, body: unknown): Error {
  const msg = typeof body === 'string' ? body : JSON.stringify(body ?? '');
  if (status === 401) return new Error('Meshy-Schlüssel ungültig – bitte in den Einstellungen prüfen');
  if (status === 402) return new Error('Meshy-Guthaben aufgebraucht – auf meshy.ai Credits auffüllen');
  if (status === 429) return new Error('Meshy: zu viele Anfragen – bitte kurz warten');
  return new Error(`Meshy-Fehler ${status}: ${msg.slice(0, 160)}`);
}

async function http<T>(method: 'GET' | 'POST', url: string, key: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Authorization: `Bearer ${key}` };
  if (body) headers['Content-Type'] = 'application/json';
  if (Capacitor.isNativePlatform()) {
    const r = await CapacitorHttp.request({ method, url, headers, data: body });
    if (r.status >= 400) throw meshyError(r.status, r.data);
    return (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) as T;
  }
  let res: Response;
  try {
    res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Meshy ist aus diesem Browser nicht erreichbar (Verbindung blockiert). Bitte in der Android-App oder einem anderen Browser versuchen.');
  }
  if (!res.ok) throw meshyError(res.status, await res.text().catch(() => ''));
  return (await res.json()) as T;
}

async function download(url: string): Promise<ArrayBuffer> {
  if (Capacitor.isNativePlatform()) {
    const r = await CapacitorHttp.request({ method: 'GET', url, responseType: 'arraybuffer' });
    if (r.status >= 400) throw new Error(`Download fehlgeschlagen (${r.status})`);
    const b64 = String(r.data);
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8.buffer;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download fehlgeschlagen (${res.status})`);
  return res.arrayBuffer();
}

interface Task {
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  progress?: number;
  model_urls?: { stl?: string; glb?: string; obj?: string };
  task_error?: { message?: string };
}

/** Fotos (als data:-URI) → STL-Daten. Dauert je nach Auslastung 1–4 Minuten. */
export async function photoTo3d(images: string[], key: string, opts: { signal?: AbortSignal; onStatus?: (s: string) => void } = {}): Promise<ArrayBuffer> {
  if (!key) throw new Error('Kein Meshy-Schlüssel eingetragen');
  const multi = images.length > 1;
  const ep = multi ? 'multi-image-to-3d' : 'image-to-3d';
  const body = {
    ...(multi ? { image_urls: images.slice(0, 4) } : { image_url: images[0] }),
    ai_model: 'latest',
    should_texture: false,
    should_remesh: true,
    target_polycount: 80000,
    target_formats: ['stl'],
    origin_at: 'bottom',
  };
  opts.onStatus?.('Fotos werden an Meshy gesendet …');
  const { result: id } = await http<{ result: string }>('POST', `${BASE}/${ep}`, key, body);
  const t0 = Date.now();
  for (;;) {
    if (opts.signal?.aborted) throw new Error('Abgebrochen');
    await new Promise((r) => setTimeout(r, 4000));
    const t = await http<Task>('GET', `${BASE}/${ep}/${id}`, key);
    const sec = Math.round((Date.now() - t0) / 1000);
    if (t.status === 'SUCCEEDED') {
      const url = t.model_urls?.stl;
      if (!url) throw new Error('Meshy hat kein STL geliefert');
      opts.onStatus?.('Lade das 3D-Modell herunter …');
      return download(url);
    }
    if (t.status === 'FAILED' || t.status === 'CANCELED') throw new Error(`Meshy konnte kein Modell erzeugen: ${t.task_error?.message ?? t.status}`);
    opts.onStatus?.(`Meshy formt das 3D-Modell … ${t.progress ?? 0} % (${sec} s)`);
    if (Date.now() - t0 > 12 * 60 * 1000) throw new Error('Meshy braucht zu lange – bitte später erneut versuchen');
  }
}

/** Bild verkleinern (max. 1600 px) und als JPEG-data:-URI liefern. */
export function canvasToDataUri(c: HTMLCanvasElement, max = 1600): string {
  const s = Math.min(1, max / Math.max(c.width, c.height));
  if (s >= 1) return c.toDataURL('image/jpeg', 0.9);
  const o = document.createElement('canvas');
  o.width = Math.round(c.width * s);
  o.height = Math.round(c.height * s);
  o.getContext('2d')!.drawImage(c, 0, 0, o.width, o.height);
  return o.toDataURL('image/jpeg', 0.9);
}
