import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PROVIDER_LABEL, type ProviderId } from '../ai/providers';
import { toScad } from '../cad/scad';
import { validateModel } from '../cad/validate';
import { insideClaude } from '../platform/claude';
import { useStore } from '../state/store';
import { Button, NumberInput, cx } from './ui';

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className={cx('w-full bg-[#161b22] border border-[#30363d] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col', wide ? 'sm:max-w-3xl' : 'sm:max-w-lg')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#21262d]">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d]">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

const field = 'mt-1 w-full h-10 rounded-md bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none px-3 text-sm text-slate-100';

export function SettingsDialog() {
  const { state, dispatch } = useStore();
  const ai = state.settings.ai;
  const setAi = (patch: Partial<typeof ai>) => dispatch({ type: 'settings', patch: { ai: { ...ai, ...patch } } });
  if (!state.showSettings) return null;
  return (
    <Modal title="Einstellungen" onClose={() => dispatch({ type: 'showSettings', on: false })}>
      <section className="space-y-3">
        <h3 className="text-[11px] uppercase tracking-wider text-slate-500">KI (Text & Foto → CAD)</h3>
        <label className="block">
          <span className="text-[13px] text-slate-300">Anbieter</span>
          <select value={ai.provider} onChange={(e) => setAi({ provider: e.target.value as ProviderId })} className={field}>
            {(['auto', 'gemini', 'openai', 'claude', 'offline'] as ProviderId[]).map((p) => (
              <option key={p} value={p}>
                {PROVIDER_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
        {insideClaude() && <p className="text-[12px] text-[#3ddc84]">In Claude geöffnet: „Automatisch“ nutzt Claude direkt – kein API-Key nötig.</p>}
        <label className="block">
          <span className="text-[13px] text-slate-300">Google Gemini API-Key</span>
          <input type="password" autoComplete="off" value={ai.geminiKey} onChange={(e) => setAi({ geminiKey: e.target.value })} placeholder="AIza… (aistudio.google.com/apikey)" className={field} />
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">Gemini-Modell</span>
          <input value={ai.geminiModel} onChange={(e) => setAi({ geminiModel: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">OpenAI API-Key (optional)</span>
          <input type="password" autoComplete="off" value={ai.openaiKey} onChange={(e) => setAi({ openaiKey: e.target.value })} placeholder="sk-…" className={field} />
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">OpenAI-Modell</span>
          <input value={ai.openaiModel} onChange={(e) => setAi({ openaiModel: e.target.value })} className={field} />
        </label>
        <p className="text-[11px] text-slate-500">
          Schlüssel werden nur lokal in diesem Browser gespeichert und direkt an den gewählten Anbieter gesendet. Ohne KI arbeitet die App mit den eingebauten Vorlagen und der
          lokalen Konturerkennung.
        </p>
      </section>
      <section className="space-y-3 pt-2 border-t border-[#21262d]">
        <h3 className="text-[11px] uppercase tracking-wider text-slate-500 pt-2">Drucker</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[13px] text-slate-300">Bett (X/Y)</span>
            <NumberInput value={state.settings.bedSize} onChange={(v) => v && dispatch({ type: 'settings', patch: { bedSize: v } })} min={50} max={1000} step={1} unit="mm" />
          </label>
          <label className="block">
            <span className="text-[13px] text-slate-300">Max. Höhe (Z)</span>
            <NumberInput value={state.settings.bedHeight} onChange={(v) => v && dispatch({ type: 'settings', patch: { bedHeight: v } })} min={50} max={1000} step={1} unit="mm" />
          </label>
          <label className="block">
            <span className="text-[13px] text-slate-300">Kritischer Überhang</span>
            <NumberInput value={state.settings.overhangDeg} onChange={(v) => v && dispatch({ type: 'settings', patch: { overhangDeg: v } })} min={20} max={80} step={1} unit="°" />
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            ['Bambu P1S/X1/P1P', 256, 256],
            ['Bambu A1', 256, 256],
            ['Bambu A1 mini', 180, 180],
            ['Prusa MK4', 250, 210],
            ['Ender 3', 220, 250],
          ].map(([n, s, h]) => (
            <button
              key={n as string}
              onClick={() => dispatch({ type: 'settings', patch: { bedSize: s as number, bedHeight: h as number } })}
              className="text-[11px] px-2.5 py-1 rounded-full border border-[#30363d] text-slate-400 hover:text-white hover:border-[#00ae42]"
            >
              {n}
            </button>
          ))}
        </div>
      </section>
    </Modal>
  );
}

export function CodeDialog() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState<'scad' | 'json'>('scad');
  const m = state.model;
  const scad = useMemo(
    () => (m ? toScad(m, state.values, { tol: state.settings.tol, fase: state.settings.fase }, state.build?.placement, state.settings.palette) : ''),
    [m, state.values, state.settings.tol, state.settings.fase, state.build?.placement, state.settings.palette],
  );
  const [json, setJson] = useState('');
  const [err, setErr] = useState<string[]>([]);
  useEffect(() => {
    if (m) setJson(JSON.stringify({ name: m.name, description: m.description, params: m.params, root: m.root }, null, 2));
  }, [m, state.showCode]);
  if (!state.showCode || !m) return null;
  const apply = () => {
    try {
      const v = validateModel(JSON.parse(json), 'custom');
      if (!v.ok) return setErr(v.errors);
      setErr([]);
      dispatch({ type: 'setModel', model: v.model! });
      dispatch({ type: 'showCode', on: false });
      dispatch({ type: 'toast', kind: 'ok', text: 'Modellcode übernommen' });
    } catch (e) {
      setErr([(e as Error).message]);
    }
  };
  return (
    <Modal title="Parametrischer Code" wide onClose={() => dispatch({ type: 'showCode', on: false })}>
      <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#0d1117] border border-[#21262d]">
        {(
          [
            ['scad', 'OpenSCAD'],
            ['json', 'Modell (FWCAD-JSON, editierbar)'],
          ] as const
        ).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={cx('h-8 rounded-md text-[12px]', tab === k ? 'bg-[#1f2630] text-white' : 'text-slate-400')}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'scad' ? (
        <>
          <pre className="text-[11.5px] leading-relaxed text-slate-300 bg-[#0d1117] border border-[#21262d] rounded-lg p-3 overflow-auto max-h-[55vh] whitespace-pre">{scad}</pre>
          <Button
            onClick={() =>
              navigator.clipboard
                .writeText(scad)
                .then(() => dispatch({ type: 'toast', kind: 'ok', text: 'Kopiert' }))
                .catch(() => dispatch({ type: 'toast', kind: 'err', text: 'Kopieren nicht möglich' }))
            }
          >
            📋 Kopieren
          </Button>
        </>
      ) : (
        <>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
            className="w-full h-[50vh] text-[11.5px] font-mono leading-relaxed text-slate-200 bg-[#0d1117] border border-[#30363d] rounded-lg p-3 outline-none focus:border-[#00ae42]"
          />
          {err.length > 0 && (
            <ul className="text-[12px] text-red-300 space-y-0.5">
              {err.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          )}
          <Button variant="primary" onClick={apply}>
            Übernehmen & neu bauen
          </Button>
        </>
      )}
    </Modal>
  );
}
