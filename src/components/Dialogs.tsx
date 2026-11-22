import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PROVIDER_LABEL, type ProviderId } from '../ai/providers';
import { toScad } from '../cad/scad';
import { validateModel } from '../cad/validate';
import { insideClaude } from '../platform/claude';
import { APK_URL, isNativeApp } from '../platform/native';
import { useStore } from '../state/store';
import { Button, NumberInput, cx } from './ui';
import { ToleranceCalibration } from './ModelPanels';
import { PRINTERS, printerById } from '../state/printers';
import { cloudList, cloudToken } from '../platform/cloud';

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
            {(['auto', 'anthropic', 'gemini', 'openai', 'claude', 'offline'] as ProviderId[]).map((p) => (
              <option key={p} value={p}>
                {PROVIDER_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
        {insideClaude() && <p className="text-[12px] text-[#3ddc84]">In Claude geöffnet: „Automatisch“ nutzt Claude direkt – kein API-Key nötig.</p>}
        <label className="block">
          <span className="text-[13px] text-slate-300">Detailgrad der KI-Modelle</span>
          <select value={ai.detail ?? 'hoch'} onChange={(e) => setAi({ detail: e.target.value as 'einfach' | 'normal' | 'hoch' })} className={field}>
            <option value="hoch">Hoch – möglichst realistisch, alle passenden Details</option>
            <option value="normal">Normal – typische Funktionsdetails</option>
            <option value="einfach">Einfach – schlicht, schnell gedruckt</option>
          </select>
        </label>
        <label className="flex items-start gap-2 text-[13px] text-slate-300">
          <input type="checkbox" className="mt-1" checked={ai.review !== false} onChange={(e) => setAi({ review: e.target.checked })} />
          <span>
            Zweiter Prüf-Durchgang
            <span className="block text-[11.5px] text-slate-500">Die KI prüft ihr Modell Punkt für Punkt gegen deine Beschreibung und ergänzt Fehlendes. Genauer, dauert etwa doppelt so lange.</span>
          </span>
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">Claude API-Key (Anthropic)</span>
          <input type="password" autoComplete="off" value={ai.anthropicKey} onChange={(e) => setAi({ anthropicKey: e.target.value })} placeholder="sk-ant-… (console.anthropic.com)" className={field} />
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">Claude-Modell</span>
          <select value={ai.anthropicModel} onChange={(e) => setAi({ anthropicModel: e.target.value })} className={field}>
            <option value="claude-sonnet-5-5">Claude Sonnet 5.5 (empfohlen)</option>
            <option value="claude-opus-5-5">Claude Opus 5.5 (stärkste Konstruktion)</option>
            <option value="claude-haiku-5-5">Claude Haiku 5.5 (schnell, günstig)</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">Google Gemini API-Key</span>
          <input type="password" autoComplete="off" value={ai.geminiKey} onChange={(e) => setAi({ geminiKey: e.target.value })} placeholder="AIza… (aistudio.google.com/apikey)" className={field} />
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">Gemini-Modell</span>
          <input value={ai.geminiModel} onChange={(e) => setAi({ geminiModel: e.target.value })} list="fw-gemini-models" className={field} />
          <datalist id="fw-gemini-models">
            <option value="gemini-3.8-flash" />
            <option value="gemini-3.7-flash" />
            <option value="gemini-3.5-flash-lite" />
          </datalist>
          <span className="text-[11px] text-slate-500">Zieht Google ein Modell zurück, wechselt die App automatisch auf den genannten Nachfolger.</span>
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">OpenAI API-Key (optional)</span>
          <input type="password" autoComplete="off" value={ai.openaiKey} onChange={(e) => setAi({ openaiKey: e.target.value })} placeholder="sk-…" className={field} />
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">OpenAI-Modell</span>
          <input value={ai.openaiModel} onChange={(e) => setAi({ openaiModel: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className="text-[13px] text-slate-300">Meshy API-Key (Foto → echte 3D-Form)</span>
          <input type="password" autoComplete="off" value={ai.meshyKey ?? ''} onChange={(e) => setAi({ meshyKey: e.target.value.trim() })} placeholder="msy_… (meshy.ai → API)" className={field} />
          <span className="block text-[11px] text-slate-500 mt-1">Optional: für „Foto → echte 3D-Form“ direkt in der App. API-Schlüssel gibt es bei meshy.ai nur mit bezahltem Abo – kostenlos geht es über MakerWorld.</span>
        </label>
        <p className="text-[11px] text-slate-500">
          Schlüssel werden nur lokal in diesem Browser gespeichert und direkt an den gewählten Anbieter gesendet. Ohne KI arbeitet die App mit den eingebauten Vorlagen und der
          lokalen Konturerkennung.
        </p>
      </section>
      {!isNativeApp() && (
        <section className="space-y-2 pt-2 border-t border-[#21262d]">
          <h3 className="text-[11px] uppercase tracking-wider text-slate-500 pt-2">Android-App</h3>
          <a
            href={APK_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 h-10 rounded-lg bg-[#00ae42] text-white text-sm font-medium"
          >
            ⤓ APK herunterladen
          </a>
          <p className="text-[11px] text-slate-500">Auf dem Handy öffnen und installieren (einmalig „Installation aus unbekannten Quellen“ erlauben). Link: {APK_URL}</p>
        </section>
      )}
      <CloudSettings />
      <p className="text-[11px] text-slate-500">App-Stand: {new Date(__BUILD__).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}</p>
      <section className="space-y-3 pt-2 border-t border-[#21262d]">
        <h3 className="text-[11px] uppercase tracking-wider text-slate-500 pt-2">Drucker</h3>
        <PrinterSelect />
        <ToleranceCalibration />
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

function CloudSettings() {
  const [tok, setTok] = useState(cloudToken.get());
  const [msg, setMsg] = useState<string | null>(null);
  const test = async () => {
    cloudToken.set(tok);
    setMsg('Prüfe …');
    try {
      const l = await cloudList();
      setMsg(`✓ Verbunden – ${l.length} Einträge in der Ablage`);
    } catch (e) {
      setMsg(`⚠ ${(e as Error).message}`);
    }
  };
  return (
    <section className="space-y-2 pt-2 border-t border-[#21262d]">
      <h3 className="text-[11px] uppercase tracking-wider text-slate-500 pt-2">☁️ Ablage Handy ↔ PC</h3>
      <p className="text-[12px] text-slate-400 leading-snug">
        Speichert Fotos und Projekte in einem <b className="text-slate-200">privaten</b> Gist in deinem GitHub-Konto. Schlüssel einmal erstellen und auf Handy <i>und</i> PC eintragen:{' '}
        <a className="text-[#3ddc84] underline" href="https://github.com/settings/tokens/new?scopes=gist&description=Formwerk%20CAD%20Ablage" target="_blank" rel="noreferrer">
          Schlüssel erstellen
        </a>{' '}
        (nur Haken bei „gist“, Ablauf z. B. „No expiration“) → „Generate token“ → kopieren.
      </p>
      <input
        type="password"
        value={tok}
        onChange={(e) => setTok(e.target.value)}
        placeholder="ghp_…"
        autoComplete="off"
        className="w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none px-2.5 text-sm text-slate-100"
      />
      <div className="flex gap-2">
        <Button className="flex-1 h-9 text-[12.5px]" onClick={test}>
          Speichern & prüfen
        </Button>
        {tok && (
          <Button
            variant="subtle"
            className="h-9 text-[12.5px]"
            onClick={() => {
              setTok('');
              cloudToken.set('');
              setMsg('Schlüssel entfernt');
            }}
          >
            Entfernen
          </Button>
        )}
      </div>
      {msg && <p className="text-[12px] text-slate-300">{msg}</p>}
      <p className="text-[11px] text-slate-500">Der Schlüssel bleibt nur auf diesem Gerät gespeichert.</p>
    </section>
  );
}

/** Drucker wählen – setzt Bauraum und zeigt den passenden Slicer an. */
export function PrinterSelect({ compact }: { compact?: boolean }) {
  const { state, dispatch } = useStore();
  const cur = printerById(state.settings.printer);
  const vendors = [...new Set(PRINTERS.map((p) => p.vendor))];
  return (
    <label className="block">
      {!compact && <span className="text-[13px] text-slate-300">Mein Drucker</span>}
      <select
        value={state.settings.printer ?? 'bambu-p1s'}
        onChange={(e) => {
          const p = printerById(e.target.value);
          dispatch({ type: 'settings', patch: { printer: p.id, ...(p.bed ? { bedSize: p.bed, bedHeight: p.height } : {}) } });
          if (p.bed) dispatch({ type: 'toast', kind: 'ok', text: `${p.name}: Bauraum ${p.bed} × ${p.bed} × ${p.height} mm – Dateien für ${p.slicer}` });
        }}
        className="mt-1 w-full h-10 rounded-md bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none px-2 text-sm text-slate-100"
      >
        {vendors.map((v) => (
          <optgroup key={v} label={v}>
            {PRINTERS.filter((p) => p.vendor === v).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {!compact && <span className="text-[11px] text-slate-500">Slicer: {cur.slicer}. 3MF öffnet sich in Bambu Studio, OrcaSlicer, PrusaSlicer und Creality Print.</span>}
    </label>
  );
}
