/**
 * Erstellen und Nachbearbeiten von Modellen – mit KI (Gemini/OpenAI/Claude) oder
 * komplett offline (Vorlagen + Maßerkennung). Funktioniert in der installierten
 * App und auf GitHub Pages ohne Claude.
 */
import { applyMeasures, matchTemplate, MEASURE_LABEL, parseMeasuresFromText, type Measures } from '../cad/templates';
import type { ModelDef, Value } from '../cad/types';
import { defaultValues, extractJson, validateModel } from '../cad/validate';
import { callProvider, generateWithAi, resolveProvider, type AiSettings } from './providers';
import { systemPrompt } from './prompt';

export interface GenResult {
  model: ModelDef;
  values: Record<string, Value>;
  via: string;
  note?: string;
}

export function offlineGenerate(text: string, measures: Measures): GenResult {
  const tpl = matchTemplate(text);
  const model: ModelDef = { ...structuredClone(tpl.model), prompt: text };
  const values = applyMeasures(model, defaultValues(model), measures);
  const t = text.match(/["„“»]([^"“”«]{1,60})["“”«]/);
  const tp = model.params.find((p) => p.type === 'text');
  if (t && tp) values[tp.key] = t[1];
  return { model, values, via: `Vorlage „${tpl.name}“` };
}

/** Zahlen (in mm bzw. Stück), die der Nutzer genannt hat und die im Modell wiederzufinden sein müssen. */
function requiredNumbers(ms: Measures): { label: string; v: number }[] {
  return (Object.entries(ms) as [keyof Measures, number | undefined][])
    .filter(([k, v]) => v !== undefined && k !== 'count')
    .map(([k, v]) => ({ label: MEASURE_LABEL[k], v: v! }));
}
/** Welche geforderten Werte kommen in keinem Parameter vor? */
function missingIn(model: ModelDef, values: Record<string, Value>, req: { label: string; v: number }[]): { label: string; v: number }[] {
  const have = model.params.map((p) => values[p.key] ?? p.value).filter((x): x is number => typeof x === 'number');
  return req.filter((r) => !have.some((h) => Math.abs(h - r.v) < 0.011));
}

export async function generateFromText(
  text: string,
  manual: Measures,
  opts: { tol: number; multicolor: boolean; ai: AiSettings; signal?: AbortSignal; onStatus?: (s: string) => void },
): Promise<GenResult> {
  const measures: Measures = { ...parseMeasuresFromText(text) };
  const manualOnly: Measures = {};
  for (const [k, v] of Object.entries(manual)) if (v !== undefined) (measures as Record<string, number>)[k] = (manualOnly as Record<string, number>)[k] = v;
  const p = await resolveProvider(opts.ai);
  if (p === 'offline') return offlineGenerate(text, measures);
  try {
    const { model, provider } = await generateWithAi(
      { text, measures: measures as Record<string, number | undefined>, tol: opts.tol, multicolor: opts.multicolor },
      opts.ai,
      { signal: opts.signal, onStatus: opts.onStatus },
    );
    model.prompt = text;
    // Nur ausdrücklich ins Maß-Feld eingetragene Werte erzwingen – Textmaße hat die KI selbst zugeordnet
    let result = model;
    let values = applyMeasures(result, defaultValues(result), manualOnly);
    // Prüfen, ob alle genannten Maße im Modell stecken – sonst einmal nachbessern lassen
    const miss = missingIn(result, values, requiredNumbers(measures));
    if (miss.length) {
      try {
        opts.onStatus?.(`Übernehme fehlende Maße (${miss.map((m) => `${m.label} ${m.v}`).join(', ')}) …`);
        const fix = await callProvider(
          p,
          opts.ai,
          systemPrompt(),
          `Im folgenden Modell fehlen Angaben des Nutzers. Aufgabe war: „${text}“.\nFEHLENDE MASSE (exakt übernehmen und als Parameter mit genau diesem Wert anlegen bzw. den passenden Parameter auf diesen Wert setzen):\n${miss.map((m) => `- ${m.label}: ${m.v}`).join('\n')}\nAntworte nur mit dem vollständigen, korrigierten JSON.\n\n${JSON.stringify({ name: result.name, description: result.description, params: result.params, root: result.root })}`,
          undefined,
          opts.signal,
        );
        const v = validateModel(extractJson(fix), 'ai');
        if (v.ok) {
          const vals = applyMeasures(v.model!, defaultValues(v.model!), manualOnly);
          if (missingIn(v.model!, vals, requiredNumbers(measures)).length < miss.length) {
            result = { ...v.model!, prompt: text };
            values = vals;
          }
        }
      } catch (e) {
        if (opts.signal?.aborted) throw e;
      }
    }
    const still = missingIn(result, values, requiredNumbers(measures));
    return {
      model: result,
      values,
      via: provider,
      note: still.length ? `Hinweis: ${still.map((m) => `${m.label} ${String(m.v).replace('.', ',')} mm`).join(', ')} nicht direkt als Parameter gefunden – bitte in Schritt 2 prüfen.` : undefined,
    };
  } catch (e) {
    if (opts.signal?.aborted) throw e;
    const r = offlineGenerate(text, measures);
    r.note = `KI-Fehler: ${(e as Error).message.split('\n')[0]} – passende Vorlage verwendet (Maße übernommen).`;
    return r;
  }
}

/**
 * Offline-Änderungen per Text: „Länge 150“, „Wandstärke auf 3“, „ohne Senkkopf“,
 * „mit Rahmen“, „Text "Garage"“. Gibt null zurück, wenn nichts erkannt wurde.
 */
export function applyTextEdits(model: ModelDef, values: Record<string, Value>, instruction: string): { values: Record<string, Value>; changed: string[] } | null {
  const s = instruction.toLowerCase();
  const out = { ...values };
  const changed: string[] = [];
  const num = (x: string) => parseFloat(x.replace(',', '.'));
  for (const p of model.params) {
    const names = [p.label.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim(), p.key.toLowerCase()].filter((n) => n.length >= 2);
    for (const n of names) {
      const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (p.type === 'number' || p.type === 'select') {
        const m = s.match(new RegExp(`${esc}\\s*(?:auf|=|:|von|mit)?\\s*(-?\\d+(?:[.,]\\d+)?)`));
        if (m) {
          let v = num(m[1]);
          if (p.min !== undefined) v = Math.max(p.min, v);
          if (p.max !== undefined && v > p.max) p.max = v;
          out[p.key] = v;
          changed.push(`${p.label} = ${v}`);
          break;
        }
      } else if (p.type === 'bool') {
        if (new RegExp(`(ohne|kein[e]?|aus)\\s+${esc}|${esc}\\s+aus`).test(s)) {
          out[p.key] = false;
          changed.push(`${p.label} aus`);
          break;
        }
        if (new RegExp(`(mit|an)\\s+${esc}|${esc}\\s+an`).test(s)) {
          out[p.key] = true;
          changed.push(`${p.label} an`);
          break;
        }
      }
    }
  }
  const t = instruction.match(/["„“»]([^"“”«]{1,60})["“”«]/);
  const tp = model.params.find((p) => p.type === 'text');
  if (t && tp) {
    out[tp.key] = t[1];
    changed.push(`${tp.label} = „${t[1]}“`);
  }
  if (!changed.length) {
    const ms = parseMeasuresFromText(instruction);
    if (Object.values(ms).some((v) => v !== undefined)) {
      const before = JSON.stringify(out);
      const applied = applyMeasures(model, out, ms);
      if (JSON.stringify(applied) !== before) return { values: applied, changed: ['Maße übernommen'] };
    }
    return null;
  }
  return { values: out, changed };
}

/** Änderung eines bestehenden Modells – erst offline versuchen, sonst KI. */
export async function refineModel(
  model: ModelDef,
  values: Record<string, Value>,
  instruction: string,
  opts: { ai: AiSettings; signal?: AbortSignal; onStatus?: (s: string) => void },
): Promise<{ model?: ModelDef; values: Record<string, Value>; via: string; changed?: string[] }> {
  const local = applyTextEdits(model, values, instruction);
  const p = await resolveProvider(opts.ai);
  // Erkannte Maß-/Schalter-Änderungen sofort lokal erledigen (exakt, ohne KI)
  if (local) return { values: local.values, via: 'lokal', changed: local.changed };
  if (p === 'offline') {
    throw new Error('Ohne KI können nur Maße und Schalter geändert werden (z. B. „Länge 150“, „ohne Senkkopf“). Für Form-Änderungen in den Einstellungen einen Gemini-Key eintragen.');
  }
  opts.onStatus?.('KI passt das Modell an …');
  const current = JSON.stringify({
    name: model.name,
    description: model.description,
    params: model.params.map((pp) => ({ ...pp, value: values[pp.key] ?? pp.value })),
    root: model.root,
  });
  const user = `ÄNDERUNGSWUNSCH: ${instruction}\n\nPasse das folgende Modell entsprechend an. Behalte vorhandene Parameter-Schlüssel und alle nicht betroffenen Maße exakt bei. Antworte nur mit dem vollständigen JSON.\n\n${current}`;
  const raw = await callProvider(p, opts.ai, systemPrompt(), user, undefined, opts.signal);
  const v = validateModel(extractJson(raw), model.source);
  if (!v.ok) throw new Error(`KI-Änderung ungültig: ${v.errors.slice(0, 3).join('; ')}`);
  v.model!.prompt = model.prompt ? `${model.prompt}\n– ${instruction}` : instruction;
  return { model: v.model!, values: defaultValues(v.model!), via: 'KI' };
}
