import { useEffect, useRef, useState } from 'react';
import { refineModel, generateFromText } from '../ai/generate';
import { PROVIDER_LABEL, resolveProvider } from '../ai/providers';
import { describeMeasures, parseMeasuresFromText, type Measures } from '../cad/templates';
import { insideClaude } from '../platform/claude';
import { useStore } from '../state/store';
import { Button, NumberInput, Toggle } from './ui';

const EXAMPLES = [
  'Wandhalterung für eine Bohrmaschine, Halsdurchmesser 43 mm',
  'Kabelkanal mit Deckel, 200 mm lang, innen 25 x 15 mm',
  'Passgenauer Halter für eine Werkbank mit 2 Schraubenlöchern',
  'Box mit Deckel 120 x 80 x 50 mm, Wandstärke 2',
  'Türschild "Werkstatt" zweifarbig',
  'Distanzhülse Außen 16, Innen M5, Höhe 12',
  'Setzkasten für 12 Figuren, 3 × 4 Fächer, Fach 60 × 60 × 120 mm',
];

export const abortRef: { current: AbortController | null } = { current: null };

/** Bausteine zum Ergänzen der Beschreibung – „…“ fragt einen Wert ab. */
const DETAILS: { group: string; items: { label: string; text: string; ask?: string }[] }[] = [
  {
    group: 'Form',
    items: [
      { label: 'Ecken abgerundet', text: 'mit abgerundeten Ecken (Radius 3 mm)' },
      { label: 'Kanten gefast', text: 'alle Außenkanten 1 mm gefast' },
      { label: 'Wandstärke …', text: 'Wandstärke {} mm', ask: 'Wandstärke in mm' },
      { label: 'Hohl / sparsam', text: 'innen hohl, materialsparend, aber stabil' },
    ],
  },
  {
    group: 'Funktion',
    items: [
      { label: 'Mit Deckel', text: 'mit passendem Deckel zum Aufstecken' },
      { label: 'Schraublöcher …', text: '{} Schraublöcher mit Senkung für M4', ask: 'Wie viele Schraublöcher?' },
      { label: 'Wandmontage', text: 'zur Wandmontage mit 2 Schlüssellöchern' },
      { label: 'Magnete …', text: '{} Magnetlöcher 6 × 2 mm auf der Unterseite', ask: 'Wie viele Magnete?' },
      { label: 'Fächer …', text: 'innen in {} gleich große Fächer unterteilt', ask: 'Wie viele Fächer?' },
      { label: 'Füße', text: 'mit 4 kleinen Füßen (rutschfest)' },
      { label: 'Kabeldurchführung', text: 'mit Kabeldurchführung 10 mm an der Rückseite' },
      { label: 'Aufhänger-Loch', text: 'mit Loch zum Aufhängen (5 mm)' },
    ],
  },
  {
    group: 'Beschriftung',
    items: [
      { label: 'Text darauf …', text: 'mit erhabenem Text „{}“ oben', ask: 'Welcher Text?' },
      { label: 'Text graviert …', text: 'mit eingraviertem Text „{}“', ask: 'Welcher Text?' },
    ],
  },
  {
    group: 'Druck',
    items: [
      { label: 'Ohne Stützen', text: 'so konstruiert, dass es ohne Stützen druckbar ist (Überhänge max. 45°)' },
      { label: 'Extra stabil', text: 'besonders stabil für Belastung' },
      { label: 'Mehrfarbig', text: 'zweifarbig für AMS (Text/Details in Farbe 2)' },
    ],
  },
];

export function TextMode() {
  const { state, dispatch } = useStore();
  const [text, setText] = useState('');
  const [ms, setMs] = useState<Measures>({});
  const [multi, setMulti] = useState(false);
  const [allEx, setAllEx] = useState(false);
  const [provider, setProvider] = useState('…');
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    resolveProvider(state.settings.ai).then((p) => setProvider(PROVIDER_LABEL[p]));
  }, [state.settings.ai]);

  const set = (k: keyof Measures) => (v: number | undefined) => setMs((m) => ({ ...m, [k]: v }));
  const [showDetails, setShowDetails] = useState(false);
  const fromText = state.model?.prompt;
  // Nach dem Erstellen (oder beim Öffnen eines Text-Modells) den Text zum Weiterbearbeiten übernehmen
  useEffect(() => {
    if (fromText && !text.trim()) setText(fromText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.modelVersion]);
  const addDetail = (d: { text: string; ask?: string }) => {
    let t = d.text;
    if (d.ask) {
      const v = window.prompt(d.ask);
      if (!v) return;
      t = t.replace('{}', v.trim());
    }
    setText((cur) => {
      const c = cur.trim().replace(/[.,;]+$/, '');
      return c ? `${c}, ${t}` : t.charAt(0).toUpperCase() + t.slice(1);
    });
    taRef.current?.focus();
  };
  const changed = !!fromText && text.trim() !== fromText.trim();
  // Nur die Ergänzung ins bestehende Modell einbauen (behält alles andere)
  const refine = async () => {
    if (!state.model) return;
    const old = fromText ?? '';
    const change = old && text.startsWith(old) ? text.slice(old.length).replace(/^[\s,;.]+/, '') : `Neue, vollständige Beschreibung: ${text}`;
    const ac = new AbortController();
    abortRef.current = ac;
    dispatch({ type: 'busy', text: 'Details werden eingebaut …' });
    try {
      const r = await refineModel(state.model, state.values, change, { ai: state.settings.ai, signal: ac.signal, onStatus: (t) => dispatch({ type: 'busy', text: t }) });
      if (r.model) dispatch({ type: 'setModel', model: { ...r.model, prompt: text }, values: r.values });
      else for (const [k, v] of Object.entries(r.values)) if (state.values[k] !== v) dispatch({ type: 'param', key: k, value: v });
      dispatch({ type: 'toast', kind: 'ok', text: r.changed?.length ? `Geändert: ${r.changed.join(', ')}` : `Details eingebaut (${r.via}) – mit ↶ rückgängig` });
    } catch (e) {
      if (!ac.signal.aborted) dispatch({ type: 'toast', kind: 'err', text: (e as Error).message.split('\n')[0] });
    } finally {
      dispatch({ type: 'busy', text: null });
      abortRef.current = null;
    }
  };

  const run = async () => {
    const ac = new AbortController();
    abortRef.current = ac;
    dispatch({ type: 'busy', text: 'Modell wird erstellt …' });
    try {
      const r = await generateFromText(text, ms, {
        tol: state.settings.tol,
        multicolor: multi,
        ai: state.settings.ai,
        signal: ac.signal,
        onStatus: (t) => dispatch({ type: 'busy', text: t }),
      });
      dispatch({ type: 'setModel', model: r.model, values: r.values });
      if (multi && !r.model.root.some((n) => n.type === 'color')) dispatch({ type: 'zonesOn', on: true });
      dispatch({ type: 'toast', kind: r.note ? 'info' : 'ok', text: r.note ?? `Erstellt mit ${r.via} – Text und Maße kannst du unten jederzeit ändern.` });
    } catch {
      if (ac.signal.aborted) dispatch({ type: 'toast', kind: 'info', text: 'Abgebrochen.' });
    } finally {
      dispatch({ type: 'busy', text: null });
      abortRef.current = null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] uppercase tracking-wider text-slate-500">Was soll gedruckt werden?</label>
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="z. B. Passgenauer Halter für eine Werkbank mit 2 Schraubenlöchern"
          className="mt-1 w-full rounded-lg bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none p-3 text-sm text-slate-100 resize-y min-h-[84px]"
        />
        {text.trim() && (
          <div className="mt-1.5 text-[11.5px] text-slate-400">
            {(() => {
              const d = describeMeasures({ ...parseMeasuresFromText(text), ...Object.fromEntries(Object.entries(ms).filter(([, v]) => v !== undefined)) });
              return d.length ? (
                <>
                  <span className="text-[#3ddc84]">✓ Verstanden:</span> {d.join(' · ')}
                </>
              ) : (
                <span>Keine Maße erkannt – schreib sie z. B. als „120 x 80 x 50 mm“, „25 cm lang“ oder „Höhe 8 cm“.</span>
              );
            })()}
          </div>
        )}
        <div className="mt-2 rounded-lg border border-[#30363d] bg-[#0d1117]">
          <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-slate-200" onClick={() => setShowDetails(!showDetails)}>
            <span>➕ Details hinzufügen</span>
            <span className="text-slate-500 text-xs">{showDetails ? '▴' : '▾'}</span>
          </button>
          {showDetails && (
            <div className="px-3 pb-3 space-y-2">
              {DETAILS.map((g) => (
                <div key={g.group}>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">{g.group}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((d) => (
                      <button key={d.label} onClick={() => addDetail(d)} className="text-[11.5px] px-2.5 py-1 rounded-full border border-[#30363d] text-slate-300 hover:border-[#00ae42] hover:text-white">
                        + {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-slate-500">Tippen fügt den Baustein an den Text an – danach kannst du alles frei weiter bearbeiten.</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {(allEx ? EXAMPLES : EXAMPLES.slice(0, 4)).map((ex) => (
            <button key={ex} onClick={() => setText(ex)} className="text-left text-[11px] px-2.5 py-1 rounded-full border border-[#30363d] text-slate-400 hover:text-white hover:border-[#00ae42]">
              {ex}
            </button>
          ))}
          <button onClick={() => setAllEx(!allEx)} className="text-[11px] px-2.5 py-1 rounded-full text-[#3ddc84] hover:underline">
            {allEx ? 'weniger' : `+ ${EXAMPLES.length - 4} weitere Beispiele`}
          </button>
        </div>
      </div>

      <details className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 group" open={Object.values(ms).some((v) => v !== undefined)}>
        <summary className="cursor-pointer list-none flex items-center justify-between text-[13px] text-slate-200">
          <span>📏 Genaue Maße angeben <span className="text-slate-500">(optional)</span></span>
          <span className="text-slate-500 group-open:rotate-180 transition-transform text-xs">▾</span>
        </summary>
        <p className="text-[11.5px] text-slate-500 mt-1.5 mb-2">Maße kannst du auch einfach in den Text schreiben, z. B. „120 x 80 x 50 mm“. Leere Felder bestimmt die App.</p>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ['length', 'Länge'],
              ['width', 'Breite'],
              ['height', 'Höhe'],
              ['wall', 'Wandstärke'],
              ['hole', 'Loch-Ø'],
            ] as [keyof Measures, string][]
          ).map(([k, l]) => (
            <label key={k} className="block">
              <span className="text-[12px] text-slate-400">{l}</span>
              <NumberInput value={ms[k]} onChange={set(k)} min={0} max={1000} step={0.5} unit="mm" placeholder="–" />
            </label>
          ))}
          <label className="block">
            <span className="text-[12px] text-slate-400">Anzahl Löcher</span>
            <NumberInput value={ms.count} onChange={set('count')} min={0} max={50} step={1} unit="Stk" placeholder="–" />
          </label>
        </div>
        <label className="block mt-3 mb-1">
          <span className="text-[12px] text-slate-400">Spiel für Steck-Passungen (Standard 0,2 mm)</span>
          <NumberInput value={state.settings.tol} onChange={(v) => v !== undefined && dispatch({ type: 'settings', patch: { tol: v } })} min={0} max={1} step={0.05} unit="mm" />
        </label>
      </details>
      <div>
        <div>
          <Toggle label="Mehrfarbig (AMS)" hint="Farbteile, Beschriftungen oder Farbwechsel nach Höhe" checked={multi} onChange={setMulti} />
        </div>
      </div>

      {fromText && state.model ? (
        <div className="space-y-2">
          <div className="rounded-lg border border-[#00ae42]/40 bg-[#00ae42]/5 p-2.5 text-[12px] text-slate-300">
            {changed ? (
              <>✏️ Text geändert. <b className="text-slate-100">Details einbauen</b> behält dein Modell und ergänzt nur das Neue – <b className="text-slate-100">Neu erstellen</b> baut alles neu nach dem Text.</>
            ) : (
              <>„{state.model.name}“ wurde aus diesem Text erstellt. Ergänze oder ändere den Text oben (oder nutze „➕ Details hinzufügen“).</>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="primary" className="h-11" onClick={refine} disabled={!!state.busy || !changed}>
              ➕ Details einbauen
            </Button>
            <Button className="h-11" onClick={run} disabled={!!state.busy || !text.trim()}>
              🔄 Neu erstellen
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="primary" className="w-full h-11" onClick={run} disabled={!!state.busy || (!text.trim() && !Object.values(ms).some((v) => v !== undefined))}>
          ✨ Modell erstellen
        </Button>
      )}
      {provider === PROVIDER_LABEL.offline && !insideClaude() && (
        <button
          onClick={() => dispatch({ type: 'showSettings', on: true })}
          className="w-full text-left rounded-lg border border-[#4dabf7]/40 bg-[#4dabf7]/5 p-2.5 text-[12px] text-sky-200"
        >
          💡 Ohne KI-Schlüssel nutzt die App die eingebauten Vorlagen. Für freie Konstruktionen einen <b>Claude-API-Key</b> (oder kostenlosen Gemini-Key) in den
          Einstellungen eintragen →
        </button>
      )}
      <p className="text-[11px] text-slate-500 -mt-2">
        KI: <span className="text-slate-300">{provider}</span> · Ergebnis ist immer parametrischer CAD-Code (keine geratenen Meshes).
      </p>
    </div>
  );
}
