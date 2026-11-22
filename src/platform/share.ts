/**
 * Modell per Link teilen: nur die Bauanleitung (Vorlage + Werte bzw. CAD-Beschreibung) wird
 * komprimiert in den Link geschrieben – der Empfänger öffnet ihn und kann alle Maße ändern.
 */
import { TEMPLATES } from '../cad/templates';
import type { ModelDef, Value } from '../cad/types';

export const SHARE_BASE = 'https://robertpahl1987-creator.github.io/formwerk-cad/';

interface Payload {
  t?: string; // Vorlagen-ID
  m?: ModelDef; // eigenes Modell
  v: Record<string, Value>;
}

const b64url = (u8: Uint8Array) => {
  let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function pipe(data: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Blob([data as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

export async function makeShareLink(model: ModelDef, values: Record<string, Value>): Promise<string> {
  if (model.imports?.length || (model.freeParts as { kind?: string }[] | undefined)?.some((p) => p.kind === 'import'))
    throw new Error('Modelle mit importierten STL-Dateien lassen sich nicht per Link teilen – bitte als 3MF schicken');
  const tpl = model.templateId ? TEMPLATES.find((t) => t.id === model.templateId) : undefined;
  const plain = { ...model, prompt: undefined };
  const p: Payload = tpl && JSON.stringify(tpl.model.root) === JSON.stringify(plain.root) && JSON.stringify(tpl.model.params) === JSON.stringify(plain.params) ? { t: tpl.id, v: values } : { m: plain, v: values };
  const raw = new TextEncoder().encode(JSON.stringify(p));
  const z = typeof CompressionStream !== 'undefined' ? await pipe(raw, new CompressionStream('deflate-raw')) : raw;
  const code = (typeof CompressionStream !== 'undefined' ? 'z' : 'r') + b64url(z);
  const url = `${SHARE_BASE}#m=${code}`;
  if (url.length > 60000) throw new Error('Das Modell ist zu groß für einen Link – bitte als 3MF-Datei schicken');
  return url;
}

export async function readShareHash(hash: string): Promise<{ model: ModelDef; values: Record<string, Value> } | null> {
  const m = hash.match(/[#&]m=([zr])([A-Za-z0-9_-]+)/);
  if (!m) return null;
  let bytes: Uint8Array = fromB64url(m[2]);
  if (m[1] === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  const p = JSON.parse(new TextDecoder().decode(bytes)) as Payload;
  if (p.t) {
    const tpl = TEMPLATES.find((t) => t.id === p.t);
    if (!tpl) throw new Error('Diese Vorlage gibt es in deiner App-Version nicht – bitte neu laden');
    return { model: structuredClone(tpl.model), values: p.v };
  }
  if (!p.m || !Array.isArray(p.m.root)) throw new Error('Link ist beschädigt');
  return { model: p.m, values: p.v };
}
