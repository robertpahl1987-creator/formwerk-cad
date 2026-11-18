import { useEffect, useState } from 'react';
import { generateFromText, refineModel } from '../ai/generate';
import { useStore } from '../state/store';
import { abortRef } from './TextMode';
import { Button, Section } from './ui';

/**
 * Nachbearbeiten: die ursprüngliche Beschreibung ändern und neu erstellen,
 * oder eine Änderung in Worten beschreiben („Löcher 6 mm“, „ohne Senkkopf“,
 * „Haken doppelt so breit und mit Rundung“).
 */
export function EditPanel() {
  const { state, dispatch } = useStore();
  const m = state.model;
  const [text, setText] = useState('');
  const [change, setChange] = useState('');
  useEffect(() => {
    setText(m?.prompt ?? m?.description ?? '');
    // nur bei neuem Modell übernehmen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.modelVersion]);
  if (!m) return null;

  const busy = async (label: string, fn: (signal: AbortSignal) => Promise<void>) => {
    const ac = new AbortController();
    abortRef.current = ac;
    dispatch({ type: 'busy', text: label });
    try {
      await fn(ac.signal);
    } catch (e) {
      if (!ac.signal.aborted) dispatch({ type: 'toast', kind: 'err', text: (e as Error).message.split('\n')[0] });
    } finally {
      dispatch({ type: 'busy', text: null });
      abortRef.current = null;
    }
  };

  const regenerate = () =>
    busy('Modell wird neu erstellt …', async (signal) => {
      const multi = m.root.some((n) => n.type === 'color');
      const r = await generateFromText(text, {}, { tol: state.settings.tol, multicolor: multi, ai: state.settings.ai, signal, onStatus: (t) => dispatch({ type: 'busy', text: t }) });
      dispatch({ type: 'setModel', model: r.model, values: r.values });
      dispatch({ type: 'toast', kind: r.note ? 'info' : 'ok', text: r.note ?? `Neu erstellt mit ${r.via}` });
    });

  const apply = () =>
    busy('Änderung wird umgesetzt …', async (signal) => {
      const r = await refineModel(m, state.values, change, { ai: state.settings.ai, signal, onStatus: (t) => dispatch({ type: 'busy', text: t }) });
      if (r.model) {
        dispatch({ type: 'setModel', model: r.model, values: r.values });
        setText(r.model.prompt ?? text);
      } else for (const [k, v] of Object.entries(r.values)) if (state.values[k] !== v) dispatch({ type: 'param', key: k, value: v });
      dispatch({ type: 'toast', kind: 'ok', text: r.changed?.length ? `Geändert: ${r.changed.join(', ')}` : `Änderung umgesetzt (${r.via}) – mit ↶ rückgängig machen` });
      setChange('');
    });

  return (
    <Section title="Beschreibung & Änderungen">
      <label className="block">
        <span className="text-[12px] text-slate-400">Beschreibung (bearbeitbar)</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none p-2.5 text-sm text-slate-100 resize-y"
        />
      </label>
      <Button className="w-full" onClick={regenerate} disabled={!text.trim() || !!state.busy}>
        ↻ Mit diesem Text neu erstellen
      </Button>
      <label className="block pt-1">
        <span className="text-[12px] text-slate-400">Oder nur etwas ändern</span>
        <div className="mt-1 flex gap-2">
          <input
            value={change}
            onChange={(e) => setChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && change.trim() && apply()}
            placeholder="z. B. Länge 150, ohne Senkkopf, Löcher 6 mm"
            className="flex-1 min-w-0 h-10 rounded-lg bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none px-3 text-sm text-slate-100"
          />
          <Button variant="primary" onClick={apply} disabled={!change.trim() || !!state.busy}>
            Anwenden
          </Button>
        </div>
      </label>
      <p className="text-[11px] text-slate-500">
        Maße und Schalter werden direkt und exakt übernommen. Form-Änderungen („mit Rundung“, „zweiter Haken“) setzt die KI um. Jede Änderung lässt sich mit ↶ bei
        „Parameter“ rückgängig machen.
      </p>
    </Section>
  );
}
