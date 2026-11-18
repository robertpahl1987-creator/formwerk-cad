/**
 * KI-Anbindung: übersetzt Text/Foto in das parametrische FWCAD-DSL.
 *  - Google Gemini (API-Key in den Einstellungen)
 *  - OpenAI (API-Key in den Einstellungen)
 *  - Claude (automatisch, wenn die App in Claude läuft – ohne Key)
 * Die Antwort wird streng validiert; bei Fehlern gibt es genau eine
 * automatische Korrekturrunde.
 */
import { extractJson, validateModel } from '../cad/validate';
import type { ModelDef } from '../cad/types';
import { capability } from '../platform/claude';
import { repairPrompt, systemPrompt, userPrompt, type UserRequest } from './prompt';

export type ProviderId = 'auto' | 'anthropic' | 'claude' | 'gemini' | 'openai' | 'offline';

export interface AiSettings {
  provider: ProviderId;
  anthropicKey: string;
  anthropicModel: string;
  geminiKey: string;
  geminiModel: string;
  openaiKey: string;
  openaiModel: string;
}

export const DEFAULT_AI: AiSettings = {
  provider: 'auto',
  anthropicKey: '', // ← Claude-API-Key (console.anthropic.com) – in der App unter „Einstellungen“
  anthropicModel: 'claude-sonnet-5-5',
  geminiKey: '', // ← Hier oder in der App unter „Einstellungen“ den Gemini-API-Key eintragen
  geminiModel: 'gemini-3.8-flash',
  openaiKey: '',
  openaiModel: 'gpt-4.1',
};

export async function resolveProvider(s: AiSettings): Promise<Exclude<ProviderId, 'auto'>> {
  if (s.provider !== 'auto') return s.provider;
  // In Claude sind externe API-Aufrufe gesperrt → dort Claude selbst nutzen
  if (await capability('sample')) return 'claude';
  if (s.anthropicKey?.trim()) return 'anthropic';
  if (s.geminiKey.trim()) return 'gemini';
  if (s.openaiKey.trim()) return 'openai';
  return 'offline';
}

export const PROVIDER_LABEL: Record<ProviderId, string> = {
  auto: 'Automatisch',
  anthropic: 'Claude (API-Key)',
  claude: 'Claude (in Claude.ai)',
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  offline: 'Offline (Vorlagen)',
};

async function blobToBase64(b: Blob): Promise<string> {
  const buf = new Uint8Array(await b.arrayBuffer());
  let s = '';
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

async function callGemini(s: AiSettings, system: string, user: string, image: Blob | undefined, signal?: AbortSignal, modelOverride?: string): Promise<string> {
  if (!s.geminiKey.trim()) throw new Error('Kein Gemini-API-Key hinterlegt (Einstellungen).');
  const model = modelOverride || s.geminiModel || DEFAULT_AI.geminiModel;
  const parts: unknown[] = [{ text: user }];
  if (image) parts.push({ inline_data: { mime_type: image.type || 'image/jpeg', data: await blobToBase64(image) } });
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': s.geminiKey.trim() },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 32000 },
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg: string = j?.error?.message ?? res.statusText;
    // Google zieht ältere Modelle zurück und nennt den Nachfolger in der Fehlermeldung → einmal automatisch wechseln
    const next = msg.match(/use\s+models\/([\w.\-]+)/i)?.[1];
    if (!modelOverride && next && next !== model) {
      try {
        localStorage.setItem('formwerk-cad:gemini-model-hint', next);
      } catch {
        /* egal */
      }
      return callGemini(s, system, user, image, signal, next);
    }
    if (!modelOverride && /permission|not found|no longer available/i.test(msg) && model !== DEFAULT_AI.geminiModel)
      return callGemini(s, system, user, image, signal, DEFAULT_AI.geminiModel);
    throw new Error(`Gemini (${model}): ${msg}`);
  }
  const text = j?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  if (!text) throw new Error('Gemini hat keine Antwort geliefert.');
  return text;
}

async function callAnthropic(s: AiSettings, system: string, user: string, image: Blob | undefined, signal?: AbortSignal): Promise<string> {
  if (!s.anthropicKey?.trim()) throw new Error('Kein Claude-API-Key hinterlegt (Einstellungen).');
  const content: unknown[] = [];
  if (image) content.push({ type: 'image', source: { type: 'base64', media_type: image.type || 'image/jpeg', data: await blobToBase64(image) } });
  content.push({ type: 'text', text: user });
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      'x-api-key': s.anthropicKey.trim(),
      'anthropic-version': '2023-06-01',
      // Erlaubt den direkten Aufruf aus dem Browser/der App mit dem eigenen Schlüssel
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: s.anthropicModel || 'claude-sonnet-5-5',
      max_tokens: 16000,
      system,
      messages: [{ role: 'user', content }],
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Claude: ${j?.error?.message ?? res.statusText}`);
  const text = (j?.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('');
  if (!text) throw new Error('Claude hat keine Antwort geliefert.');
  if (j?.stop_reason === 'max_tokens') throw new Error('Antwort zu lang – bitte die Beschreibung vereinfachen.');
  return text;
}

async function callOpenAI(s: AiSettings, system: string, user: string, image: Blob | undefined, signal?: AbortSignal): Promise<string> {
  if (!s.openaiKey.trim()) throw new Error('Kein OpenAI-API-Key hinterlegt (Einstellungen).');
  const content: unknown[] = [{ type: 'text', text: user }];
  if (image) content.push({ type: 'image_url', image_url: { url: `data:${image.type || 'image/jpeg'};base64,${await blobToBase64(image)}` } });
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.openaiKey.trim()}` },
    body: JSON.stringify({
      model: s.openaiModel || 'gpt-4.1',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content },
      ],
    }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI: ${j?.error?.message ?? res.statusText}`);
  const text = j?.choices?.[0]?.message?.content ?? '';
  if (!text) throw new Error('OpenAI hat keine Antwort geliefert.');
  return text;
}

const CLAUDE_ERR: Record<string, string> = {
  not_granted: 'Claude-Zugriff wurde nicht erlaubt.',
  rate_limited: 'Zu viele Anfragen – bitte später erneut versuchen.',
  images_unavailable: 'Bilder können hier nicht an Claude gesendet werden.',
  image_rejected: 'Das Bild wurde abgelehnt – bitte ein anderes Foto wählen.',
  session_expired: 'Bitte bei Claude neu anmelden.',
  refused: 'Claude hat die Anfrage abgelehnt.',
  cancelled: 'Abgebrochen.',
};

async function callClaude(system: string, user: string, image: Blob | undefined, signal?: AbortSignal, onText?: (t: string) => void): Promise<string> {
  const sample = await capability('sample');
  if (!sample) throw new Error('Claude ist hier nicht verfügbar.');
  try {
    const r = await sample(`${system}\n\n---\n\n${user}`, {
      signal,
      images: image ? [image] : undefined,
      modelTier: 'default',
      onText: onText ? ({ text }: { text: string }) => onText(text) : undefined,
    });
    return r.text as string;
  } catch (e) {
    const code = (e as { code?: string }).code ?? '';
    throw new Error(CLAUDE_ERR[code] ?? `Claude: ${(e as { message?: string }).message ?? code}`);
  }
}

export interface GenerateOptions {
  image?: Blob;
  signal?: AbortSignal;
  onStatus?: (s: string) => void;
}

export async function generateWithAi(req: UserRequest, settings: AiSettings, opts: GenerateOptions = {}): Promise<{ model: ModelDef; provider: string; raw: string }> {
  const provider = await resolveProvider(settings);
  if (provider === 'offline') throw new Error('offline');
  const system = systemPrompt();
  const call = (user: string, img?: Blob) => {
    if (provider === 'claude') return callClaude(system, user, img, opts.signal, (t) => opts.onStatus?.(`Claude schreibt … (${t.length} Zeichen)`));
    return callProvider(provider, settings, system, user, img, opts.signal);
  };
  opts.onStatus?.(`${PROVIDER_LABEL[provider]} konstruiert das Modell …`);
  let raw = await call(userPrompt(req), opts.image);
  let parsed: unknown;
  let errors: string[] = [];
  try {
    parsed = extractJson(raw);
    const v = validateModel(parsed, opts.image ? 'photo' : 'ai');
    if (v.ok) return { model: v.model!, provider: PROVIDER_LABEL[provider], raw };
    errors = v.errors;
  } catch (e) {
    errors = [(e as Error).message];
  }
  opts.onStatus?.('Korrigiere KI-Antwort …');
  raw = await call(repairPrompt(raw, errors));
  const v2 = validateModel(extractJson(raw), opts.image ? 'photo' : 'ai');
  if (!v2.ok) throw new Error(`KI-Modell ungültig:\n${v2.errors.slice(0, 6).join('\n')}`);
  return { model: v2.model!, provider: PROVIDER_LABEL[provider], raw };
}

/** Einzelner Aufruf beim gewählten Anbieter (Text, optional Bild). */
export async function callProvider(
  provider: Exclude<ProviderId, 'auto' | 'offline'>,
  settings: AiSettings,
  system: string,
  user: string,
  image?: Blob,
  signal?: AbortSignal,
): Promise<string> {
  if (provider === 'gemini') return callGemini(settings, system, user, image, signal);
  if (provider === 'openai') return callOpenAI(settings, system, user, image, signal);
  if (provider === 'anthropic') return callAnthropic(settings, system, user, image, signal);
  return callClaude(system, user, image, signal);
}

/** Lässt die KI ein Modell reparieren, das beim Bauen fehlschlägt. */
export async function repairWithAi(model: ModelDef, buildError: string, settings: AiSettings, signal?: AbortSignal): Promise<ModelDef> {
  const provider = await resolveProvider(settings);
  if (provider === 'offline') throw new Error('Keine KI eingerichtet.');
  const system = systemPrompt();
  const json = JSON.stringify({ name: model.name, description: model.description, params: model.params, root: model.root });
  const user = `Dieses Modell erzeugt beim Bauen den Fehler: "${buildError}". Behebe den Fehler, behalte die Parameter bei und antworte nur mit dem korrigierten JSON.\n\n${json}`;
  const raw = await callProvider(provider, settings, system, user, undefined, signal);
  const v = validateModel(extractJson(raw), model.source);
  if (!v.ok) throw new Error(`Reparatur ungültig: ${v.errors.slice(0, 4).join('; ')}`);
  return v.model!;
}
