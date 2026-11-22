import { useState } from 'react';
import { refineModel } from '../ai/generate';
import { resolveProvider } from '../ai/providers';
import type { ParamDef } from '../cad/types';
import { useStore } from '../state/store';
import { abortRef } from './TextMode';
import { Button, Section } from './ui';

type Kind = 'hinein' | 'durch' | 'in';
const FITS = [
  { id: 'fest', label: 'Stramm', c: 0.1, hint: 'hält ohne Kleber, schwer zu lösen' },
  { id: 'normal', label: 'Normal', c: 0.25, hint: 'leicht rein und raus' },
  { id: 'locker', label: 'Locker', c: 0.5, hint: 'viel Luft, z. B. für ungenaue Teile' },
] as const;

const fmt = (v: number) => String(Math.round(v * 100) / 100).replace('.', ',');
const has = (p: ParamDef, re: RegExp) => re.test(p.label) || re.test(p.key);
const INNER = /innen|fach|aufnahme|öffnung|oeffnung|schlitz|tasche|einsatz|gegenstand|handy|gerät|geraet/i;
const OUTER = /außen|aussen/i;

/** Passende Maße finden: Innenmaße direkt, sonst Außenmaße (+ Wand), sonst nichts. */
function plan(params: ParamDef[], kind: Kind, dims: { L?: number; B?: number; H?: number; D?: number }, c: number) {
  const nums = params.filter((p) => p.type === 'number');
  const changes: { key: string; label: string; from: number; to: number }[] = [];
  let tol: number | undefined;
  const wall = nums.find((p) => p.role === 'wall');
  const floor = nums.find((p) => /boden/i.test(p.label));
  const set = (p: ParamDef | undefined, to: number) => {
    if (!p) return false;
    const v = Math.round(Math.min(p.max ?? to, Math.max(p.min ?? to, to)) * 100) / 100;
    changes.push({ key: p.key, label: p.label, from: p.value as number, to: v });
    return true;
  };
  if (kind === 'durch') {
    // Bohrungen rechnen im Modell schon „Ø + 2 × Toleranz“ → Nennmaß eintragen, Spiel über die Toleranz
    const holes = nums.filter((p) => p.role === 'hole' || /loch|bohrung|ø|durchmesser/i.test(p.label));
    if (dims.D) for (const h of holes.slice(0, 3)) set(h, dims.D);
    tol = c;
    return { changes, tol };
  }
  const axes: [keyof typeof dims, NonNullable<ParamDef['role']>][] = [
    ['L', 'length'],
    ['B', 'width'],
    ['H', 'height'],
  ];
  for (const [k, role] of axes) {
    const v = dims[k];
    if (!v) continue;
    const ofRole = nums.filter((p) => p.role === role);
    if (kind === 'hinein') {
      const inner = ofRole.find((p) => has(p, INNER)) ?? (ofRole.length && !ofRole.some((p) => has(p, OUTER)) && /innen/i.test(ofRole[0].label) ? ofRole[0] : undefined);
      if (inner) set(inner, k === 'H' ? v + c : v + 2 * c);
      else {
        const outer = ofRole.find((p) => has(p, OUTER)) ?? ofRole[0];
        if (outer && wall) set(outer, k === 'H' ? v + c + ((floor?.value as number) ?? (wall.value as number)) : v + 2 * c + 2 * (wall.value as number));
      }
    } else {
      // Teil soll in eine Öffnung: Außenmaß = Öffnung − Spiel
      const outer = ofRole.find((p) => has(p, OUTER)) ?? ofRole.find((p) => !has(p, INNER));
      set(outer, k === 'H' ? v - c : v - 2 * c);
    }
  }
  return { changes, tol };
}

/** „Passt in“-Assistent: gemessenes Gegenstück eingeben → Maße und Spiel werden passend gesetzt. */
export function FitAssistant() {
  const { state, dispatch } = useStore();
  const m = state.model;
  const [kind, setKind] = useState<Kind>('hinein');
  const [fit, setFit] = useState<(typeof FITS)[number]['id']>('normal');
  const [dims, setDims] = useState<{ L?: number; B?: number; H?: number; D?: number }>({});
  const [what, setWhat] = useState('');
  if (!m || m.templateId === 'frei') return null;
  const c = FITS.find((f) => f.id === fit)!.c;
  const params = m.params.map((p) => ({ ...p, value: state.values[p.key] ?? p.value }));
  const ready = kind === 'durch' ? !!dims.D : !!(dims.L || dims.B || dims.H);

  const apply = async () => {
    const pl = plan(params, kind, dims, c);
    if (pl.changes.length) {
      for (const ch of pl.changes) dispatch({ type: 'param', key: ch.key, value: ch.to });
      if (pl.tol !== undefined) dispatch({ type: 'settings', patch: { tol: pl.tol } });
      dispatch({
        type: 'toast',
        kind: 'ok',
        text: `Angepasst: ${pl.changes.map((x) => `${x.label} ${fmt(x.from)} → ${fmt(x.to)} mm`).join(', ')}${pl.tol !== undefined ? ` · Spiel ${fmt(pl.tol)} mm` : ''}`,
      });
      return;
    }
    // Keine passenden Regler → KI baut die Aufnahme passend um
    if ((await resolveProvider(state.settings.ai)) === 'offline') {
      dispatch({ type: 'toast', kind: 'info', text: 'Dieses Modell hat keine passenden Maß-Regler. Mit KI-Schlüssel (⚙) baut die App die Aufnahme automatisch passend um.' });
      return;
    }
    const dimText =
      kind === 'durch'
        ? `ein Stift/Rohr/Schraube mit Ø ${fmt(dims.D!)} mm soll hindurchpassen`
        : `${kind === 'hinein' ? 'ein Gegenstand soll hineinpassen' : 'das Teil soll in eine Öffnung passen'}: ${[dims.L && `Länge ${fmt(dims.L)}`, dims.B && `Breite ${fmt(dims.B)}`, dims.H && `Höhe ${fmt(dims.H)}`].filter(Boolean).join(', ')} mm`;
    const instruction = `Passung: ${dimText}${what ? ` (${what})` : ''}, Spiel ${fmt(c)} mm pro Seite. Passe die betroffenen Maße exakt so an und lege dafür Parameter an.`;
    const ac = new AbortController();
    abortRef.current = ac;
    dispatch({ type: 'busy', text: 'Passe das Modell an das Gegenstück an …' });
    try {
      const r = await refineModel(m, state.values, instruction, { ai: state.settings.ai, signal: ac.signal, onStatus: (t) => dispatch({ type: 'busy', text: t }) });
      if (r.model) dispatch({ type: 'setModel', model: r.model, values: r.values });
      else for (const [k, v] of Object.entries(r.values)) if (state.values[k] !== v) dispatch({ type: 'param', key: k, value: v });
      dispatch({ type: 'toast', kind: 'ok', text: `Passung eingebaut (${r.via}) – mit ↶ rückgängig` });
    } catch (e) {
      if (!ac.signal.aborted) dispatch({ type: 'toast', kind: 'err', text: (e as Error).message.split('\n')[0] });
    } finally {
      dispatch({ type: 'busy', text: null });
      abortRef.current = null;
    }
  };

  const numIn = (k: keyof typeof dims, label: string) => (
    <label className="block min-w-0">
      <span className="text-[11px] text-slate-400">{label}</span>
      <input
        inputMode="decimal"
        className="mt-0.5 w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none px-2 text-[13px] text-slate-100"
        placeholder="mm"
        value={dims[k] ?? ''}
        onChange={(e) => {
          const v = parseFloat(e.target.value.replace(',', '.'));
          setDims({ ...dims, [k]: Number.isFinite(v) && v > 0 ? v : undefined });
        }}
      />
    </label>
  );
  const chip = (on: boolean) => `h-8 px-2 rounded-md border text-[12px] ${on ? 'border-[#00ae42] bg-[#00ae42]/15 text-white' : 'border-[#30363d] text-slate-300'}`;
  return (
    <Section title="🧩 Passt-in-Assistent" defaultOpen={false}>
      <p className="text-[12px] text-slate-400 leading-snug">Miss das Gegenstück mit dem Messschieber – die App stellt die Maße mit dem richtigen Spiel ein.</p>
      <div className="grid grid-cols-3 gap-1.5">
        <button className={chip(kind === 'hinein')} onClick={() => setKind('hinein')}>
          Etwas soll hinein
        </button>
        <button className={chip(kind === 'durch')} onClick={() => setKind('durch')}>
          Etwas soll durch
        </button>
        <button className={chip(kind === 'in')} onClick={() => setKind('in')}>
          Teil soll hinein
        </button>
      </div>
      <input
        className="w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] px-2 text-[12.5px] text-slate-100"
        placeholder={kind === 'durch' ? 'Was? z. B. Besenstiel, M8-Schraube, Luftschlauch' : kind === 'hinein' ? 'Was? z. B. Handy, Batterien, Akkuschrauber-Bit' : 'Wohin? z. B. Schublade, Rohr, Regalloch'}
        value={what}
        onChange={(e) => setWhat(e.target.value)}
      />
      {kind === 'durch' ? (
        <div className="grid grid-cols-3 gap-1.5">{numIn('D', 'Ø gemessen')}</div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {numIn('L', kind === 'in' ? 'Öffnung Länge' : 'Länge')}
          {numIn('B', kind === 'in' ? 'Öffnung Breite' : 'Breite')}
          {numIn('H', kind === 'in' ? 'Öffnung Tiefe' : 'Höhe')}
        </div>
      )}
      <div className="grid grid-cols-3 gap-1.5">
        {FITS.map((f) => (
          <button key={f.id} className={chip(fit === f.id)} onClick={() => setFit(f.id)} title={f.hint}>
            {f.label} {fmt(f.c)}
          </button>
        ))}
      </div>
      <Button className="w-full" onClick={apply} disabled={!ready || !!state.busy}>
        ✓ Passend machen
      </Button>
    </Section>
  );
}
