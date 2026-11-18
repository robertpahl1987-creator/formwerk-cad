import { useEffect, useRef, useState } from 'react';
import { generateFromText } from '../ai/generate';
import { PROVIDER_LABEL, resolveProvider } from '../ai/providers';
import type { Measures } from '../cad/templates';
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
];

export const abortRef: { current: AbortController | null } = { current: null };

export function TextMode() {
  const { state, dispatch } = useStore();
  const [text, setText] = useState('');
  const [ms, setMs] = useState<Measures>({});
  const [multi, setMulti] = useState(false);
  const [provider, setProvider] = useState('…');
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    resolveProvider(state.settings.ai).then((p) => setProvider(PROVIDER_LABEL[p]));
  }, [state.settings.ai]);

  const set = (k: keyof Measures) => (v: number | undefined) => setMs((m) => ({ ...m, [k]: v }));

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
        <div className="flex gap-1.5 overflow-x-auto pb-1 mt-1 fw-noscroll">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => setText(ex)} className="shrink-0 text-[11px] px-2.5 py-1 rounded-full border border-[#30363d] text-slate-400 hover:text-white hover:border-[#00ae42]">
              {ex.length > 34 ? ex.slice(0, 32) + '…' : ex}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">Pflicht- &amp; Wunschmaße (mm)</div>
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
        <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-3">
          <label className="block">
            <span className="text-[12px] text-slate-400">Drucktoleranz (Spiel für Passungen)</span>
            <NumberInput value={state.settings.tol} onChange={(v) => v !== undefined && dispatch({ type: 'settings', patch: { tol: v } })} min={0} max={1} step={0.05} unit="mm" />
          </label>
        </div>
        <div className="mt-3">
          <Toggle label="Mehrfarbig (AMS)" hint="Farbteile, Beschriftungen oder Farbwechsel nach Höhe" checked={multi} onChange={setMulti} />
        </div>
      </div>

      <Button variant="primary" className="w-full h-11" onClick={run} disabled={!!state.busy || (!text.trim() && !Object.values(ms).some((v) => v !== undefined))}>
        ✨ Modell erstellen
      </Button>
      {provider === PROVIDER_LABEL.offline && !insideClaude() && (
        <button
          onClick={() => dispatch({ type: 'showSettings', on: true })}
          className="w-full text-left rounded-lg border border-[#4dabf7]/40 bg-[#4dabf7]/5 p-2.5 text-[12px] text-sky-200"
        >
          💡 Ohne KI-Schlüssel nutzt die App die eingebauten Vorlagen. Für freie Konstruktionen einen <b>kostenlosen Gemini-Key</b> in den Einstellungen
          eintragen →
        </button>
      )}
      <p className="text-[11px] text-slate-500 -mt-2">
        KI: <span className="text-slate-300">{provider}</span> · Ergebnis ist immer parametrischer CAD-Code (keine geratenen Meshes).
      </p>
    </div>
  );
}
