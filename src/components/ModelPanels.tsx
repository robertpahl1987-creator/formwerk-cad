import { useState } from 'react';
import { toScad } from '../cad/scad';
import type { JointType } from '../cad/split';
import { TEMPLATES } from '../cad/templates';
import type { ParamDef } from '../cad/types';
import { stlBinary, stlPerColorZip, threeMf, zipFiles, type ExportObject, type ExportPart } from '../mesh/export';
import { bestOrientation, MATERIALS, mergeMeshes, PATTERN_LABEL, PROFILES, rotateMesh, type InfillPattern, type PrintProfile } from '../mesh/mesh';
import { saveFile } from '../platform/download';
import { optimizePrint, type OptimizePlan } from '../mesh/optimize';
import { myParts, useMyParts, type MyPart } from '../state/myParts';
import { timeline, useTimeline, type Snapshot } from '../state/timeline';
import { paint } from '../state/paint';
import { makeShareLink } from '../platform/share';
import { adaptiveRanges, layerCount, LAYER_STEPS, mergeRanges, type LayerRange } from '../mesh/adaptive';
import { freeBus } from '../state/freeBus';
import type { FreePart } from '../cad/free';
import { hashId, registerImported, weldTriangles } from '../mesh/importMesh';
import { printable, runPipeline } from '../state/pipeline';
import type { PartResult } from '../state/pipeline';
import { useStore } from '../state/store';
import { Button, cx, NumberInput, Section, SliderRow, Stat, Toggle } from './ui';

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'modell';
const g1 = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const hm = (min: number) => `${Math.floor(min / 60)} h ${String(Math.round(min % 60)).padStart(2, '0')} min`;

// ---------------------------------------------------------------- Vorlagen
export function Library() {
  const { dispatch } = useStore();
  return (
    <>
    <MyPartsPanel />
    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">Vorlagen</div>
    <div className="grid grid-cols-2 gap-2">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => {
            dispatch({ type: 'setModel', model: structuredClone(t.model) });
            dispatch({ type: 'toast', kind: 'ok', text: `Vorlage „${t.name}“ geladen` });
          }}
          className="text-left rounded-xl border border-[#30363d] bg-[#0d1117] hover:border-[#00ae42] p-3 transition-colors"
        >
          <div className="text-2xl">{t.icon}</div>
          <div className="text-[13px] font-medium text-slate-100 mt-1 leading-tight">{t.name}</div>
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.model.description}</div>
        </button>
      ))}
    </div>
    </>
  );
}

// ---------------------------------------------------------------- Löschen
/** Objekt entfernen – mit Rückfrage, danach mit ↶ wiederherstellbar. */
function DeleteButton() {
  const { dispatch } = useStore();
  const [armed, setArmed] = useState(false);
  if (!armed)
    return (
      <Button variant="subtle" className="h-8 px-2 text-[12px] text-slate-400 hover:text-red-300 shrink-0" onClick={() => setArmed(true)}>
        🗑 Löschen
      </Button>
    );
  return (
    <span className="flex gap-1.5 shrink-0">
      <Button
        variant="danger"
        className="h-8 px-2.5 text-[12px]"
        onClick={() => {
          setArmed(false);
          dispatch({ type: 'clearModel' });
          dispatch({ type: 'toast', kind: 'info', text: 'Objekt gelöscht – mit „↶ Wiederherstellen“ holst du es zurück' });
        }}
      >
        Ja, löschen
      </Button>
      <Button variant="ghost" className="h-8 px-2.5 text-[12px]" onClick={() => setArmed(false)}>
        Abbrechen
      </Button>
    </span>
  );
}

/** Hinweis, wenn kein Objekt da ist. */
export function EmptyState() {
  const { state, dispatch } = useStore();
  if (state.model) return null;
  return (
    <div className="m-4 rounded-xl border border-dashed border-[#30363d] p-4 text-center space-y-3">
      <p className="text-[13px] text-slate-300">Noch kein Objekt auf dem Druckbett.</p>
      <p className="text-[12px] text-slate-500">Oben beschreiben (Text → CAD), ein Foto nutzen, eine Vorlage wählen oder frei bauen.</p>
      {state.history.length > 0 && (
        <Button className="h-9 text-[12.5px]" onClick={() => dispatch({ type: 'undo' })}>
          ↶ Letztes Objekt wiederherstellen
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Parameter
export function ParamPanel() {
  const { state, dispatch } = useStore();
  const m = state.model;
  if (!m) return null;
  const groups = new Map<string, ParamDef[]>();
  for (const p of m.params) {
    const g = p.group || 'Maße';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(p);
  }
  const set = (key: string, value: number | boolean | string) => dispatch({ type: 'param', key, value });
  return (
    <Section
      title="Parameter"
      right={
        <span className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {state.history.length > 0 && (
            <button className="text-[11px] text-slate-400 hover:text-white px-1.5" onClick={() => dispatch({ type: 'undo' })} title="Vorheriges Modell">
              ↶
            </button>
          )}
          <button className="text-[11px] text-slate-400 hover:text-white px-1.5" onClick={() => dispatch({ type: 'resetParams' })}>
            Zurücksetzen
          </button>
        </span>
      }
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-white">{m.name}</div>
          {m.description && <p className="text-[12px] text-slate-400 mt-0.5">{m.description}</p>}
        </div>
        <DeleteButton />
      </div>
      {[...groups].map(([g, ps]) => (
        <div key={g} className="space-y-3">
          {groups.size > 1 && <div className="text-[11px] text-[#3ddc84] uppercase tracking-wider pt-1">{g}</div>}
          {ps.map((p) => {
            const v = state.values[p.key] ?? p.value;
            if (p.type === 'bool') return <Toggle key={p.key} label={p.label} hint={p.hint} checked={Boolean(v)} onChange={(x) => set(p.key, x)} />;
            if (p.type === 'text')
              return (
                <label key={p.key} className="block">
                  <span className="text-[13px] text-slate-300">{p.label}</span>
                  <input
                    value={String(v)}
                    maxLength={60}
                    onChange={(e) => set(p.key, e.target.value)}
                    className="mt-1 w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none px-2.5 text-sm text-slate-100"
                  />
                </label>
              );
            if (p.type === 'select' && p.options?.length)
              return (
                <label key={p.key} className="block">
                  <span className="text-[13px] text-slate-300">{p.label}</span>
                  <select value={Number(v)} onChange={(e) => set(p.key, Number(e.target.value))} className="mt-1 w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] text-sm text-slate-100 px-2">
                    {p.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            return (
              <SliderRow
                key={p.key}
                label={p.label}
                hint={p.hint}
                value={Number(v)}
                min={p.min ?? 0}
                max={p.max ?? 100}
                step={p.step ?? 0.1}
                unit={p.unit}
                onChange={(x) => set(p.key, x)}
              />
            );
          })}
        </div>
      ))}
      <div className="pt-2 border-t border-[#21262d] space-y-3">
        <SliderRow label="Drucktoleranz (Passungen)" value={state.settings.tol} min={0} max={1} step={0.05} unit="mm" onChange={(v) => dispatch({ type: 'settings', patch: { tol: v } })} />
        <Toggle label="Überhänge entschärfen" hint="Tropfenlöcher & Fasen, wo das Modell es unterstützt" checked={state.settings.fase} onChange={(v) => dispatch({ type: 'settings', patch: { fase: v } })} />
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------- Material & Füllung
export function MaterialPanel() {
  const { state, dispatch } = useStore();
  const pr = state.settings.profile;
  const setPr = (patch: Partial<PrintProfile>) => dispatch({ type: 'settings', patch: { profile: { ...pr, ...patch, id: patch.id ?? 'eigen' } } });
  return (
    <Section title="Material, Hohlraum & Füllung" defaultOpen={false}>
      <div className="grid grid-cols-3 gap-2">
        <label className="block col-span-2">
          <span className="text-[12px] text-slate-400">Material</span>
          <select
            value={state.settings.material}
            onChange={(e) => dispatch({ type: 'settings', patch: { material: e.target.value } })}
            className="mt-1 w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] text-sm text-slate-100 px-2"
          >
            {MATERIALS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.density} g/cm³)
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[12px] text-slate-400">Schicht</span>
          <select
            value={state.settings.layer}
            onChange={(e) => dispatch({ type: 'settings', patch: { layer: Number(e.target.value) } })}
            className="mt-1 w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] text-sm text-slate-100 px-2"
          >
            {[0.08, 0.12, 0.16, 0.2, 0.24, 0.28].map((l) => (
              <option key={l} value={l}>
                {String(l).replace('.', ',')} mm
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <div className="text-[12px] text-slate-400 mb-1.5">Stabilität vs. Materialverbrauch</div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.values(PROFILES).map((p) => (
            <button
              key={p.id}
              onClick={() => dispatch({ type: 'settings', patch: { profile: { id: p.id, infill: p.infill, pattern: p.pattern, walls: p.walls, top: p.top, bottom: p.bottom } } })}
              className={cx('rounded-lg border p-2 text-left', pr.id === p.id ? 'border-[#00ae42] bg-[#00ae42]/10' : 'border-[#30363d] bg-[#0d1117] hover:border-[#4b5563]')}
            >
              <div className="text-[13px] text-slate-100 font-medium">{p.label}</div>
              <div className="text-[10.5px] text-slate-500 leading-snug">{p.info}</div>
            </button>
          ))}
        </div>
      </div>
      <SliderRow label="Füllung (Infill)" value={Math.round(pr.infill * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => setPr({ infill: v / 100 })} />
      <label className="block">
        <span className="text-[12px] text-slate-400">Füllmuster</span>
        <select value={pr.pattern} onChange={(e) => setPr({ pattern: e.target.value as InfillPattern })} className="mt-1 w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] text-sm text-slate-100 px-2">
          {Object.entries(PATTERN_LABEL).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ['walls', 'Wände'],
            ['top', 'Decke'],
            ['bottom', 'Boden'],
          ] as const
        ).map(([k, l]) => (
          <label key={k} className="block">
            <span className="text-[12px] text-slate-400">{l}</span>
            <NumberInput value={pr[k]} onChange={(v) => v !== undefined && setPr({ [k]: Math.round(v) })} min={1} max={20} step={1} unit={k === 'walls' ? 'x' : 'L'} />
          </label>
        ))}
      </div>
      <div className="rounded-lg border border-[#21262d] p-3 space-y-3">
        <Toggle
          label="Hohlraum einbauen"
          hint="Echter, geschlossener Hohlraum im Inneren – spart Material und Gewicht"
          checked={state.settings.hollow.enabled}
          onChange={(v) => dispatch({ type: 'settings', patch: { hollow: { ...state.settings.hollow, enabled: v } } })}
        />
        {state.settings.hollow.enabled && (
          <>
            <SliderRow
              label="Wandstärke rundum"
              value={state.settings.hollow.wall}
              min={0.8}
              max={15}
              step={0.2}
              unit="mm"
              onChange={(v) => dispatch({ type: 'settings', patch: { hollow: { ...state.settings.hollow, wall: v } } })}
            />
            <Toggle
              label="Selbsttragende Decke (45°)"
              hint="Dach-Form innen – druckt ohne Stützmaterial im Hohlraum"
              checked={state.settings.hollow.roof}
              onChange={(v) => dispatch({ type: 'settings', patch: { hollow: { ...state.settings.hollow, roof: v } } })}
            />
            {state.build?.hollowNote && <p className="text-[12px] text-amber-300">⚠ {state.build.hollowNote}</p>}
            <p className="text-[11px] text-slate-500">Zu dünne Stellen bleiben automatisch massiv. Mit „✂ Schnitt“ in der Vorschau siehst du den Hohlraum. Gezielte Hohlräume kannst du unter „Frei bauen“ als Bauteil „Hohlraum“ setzen.</p>
          </>
        )}
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        Das Innere wird automatisch als Hohlraum mit Stützstruktur gedruckt: Nur Wände, Decken und Böden sind massiv, der Rest wird mit der gewählten Füllung
        ausgesteift. Diese Werte stehen im 3MF und werden von Bambu Studio / OrcaSlicer übernommen. Für echte, konstruktive Hohlräume (z. B. „hohl mit 2 mm Wand“)
        einfach in der Beschreibung angeben – die KI plant sie mit selbsttragenden 45°-Decken.
      </p>
    </Section>
  );
}

// ---------------------------------------------------------------- Farben
export function ColorPanel() {
  const { state, dispatch } = useStore();
  const pal = state.settings.palette;
  const used = new Set((state.build?.parts ?? []).map((p) => p.slot));
  const multi = used.size > 1 || state.zonesOn;
  const setPal = (slot: number, patch: Partial<{ name: string; color: string }>) =>
    dispatch({ type: 'settings', patch: { palette: pal.map((p) => (p.slot === slot ? { ...p, ...patch } : p)) } });
  const height = state.build ? state.build.total.max[2] - state.build.total.min[2] : 0;
  return (
    <Section title="Mehrfarbendruck (AMS)" defaultOpen={multi} right={multi ? <span className="text-[11px] text-[#3ddc84]">{state.zonesOn ? 'Zonen' : `${used.size} Farben`}</span> : undefined}>
      <div className="grid grid-cols-2 gap-2">
        {pal.map((p) => (
          <div key={p.slot} className={cx('flex items-center gap-2 rounded-lg border px-2 py-1.5', used.has(p.slot) ? 'border-[#00ae42]/60' : 'border-[#30363d]')}>
            <label className="relative w-7 h-7 rounded-md border border-white/20 shrink-0 overflow-hidden" style={{ background: p.color }}>
              <input type="color" value={p.color} onChange={(e) => setPal(p.slot, { color: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-500">Slot {p.slot}</div>
              <input value={p.name} onChange={(e) => setPal(p.slot, { name: e.target.value })} className="w-full bg-transparent text-[13px] text-slate-100 outline-none" />
            </div>
          </div>
        ))}
      </div>
      {state.build && state.build.parts.length > 0 && (
        <ul className="text-[12px] text-slate-300 space-y-1">
          {state.build.parts.filter((p) => !p.role).map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: p.color }} />
              {p.name} <span className="text-slate-500">· Slot {p.slot}</span>
            </li>
          ))}
        </ul>
      )}
      <Toggle
        label="Farbwechsel nach Höhe"
        hint="Funktioniert mit jedem Modell, z. B. Sockel in Farbe 1, Rest in Farbe 2"
        checked={state.zonesOn}
        onChange={(v) => dispatch({ type: 'zonesOn', on: v })}
      />
      {state.zonesOn && (
        <div className="space-y-2">
          {state.zones.map((z, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              {i === 0 ? (
                <span className="text-[12px] text-slate-400">ab Bett (0 mm)</span>
              ) : (
                <NumberInput
                  value={z.z}
                  onChange={(v) => v !== undefined && dispatch({ type: 'zones', zones: state.zones.map((q, k) => (k === i ? { ...q, z: v } : q)) })}
                  min={0}
                  max={Math.max(1, height)}
                  step={state.settings.layer}
                  unit="mm"
                />
              )}
              <select
                value={z.slot}
                onChange={(e) => dispatch({ type: 'zones', zones: state.zones.map((q, k) => (k === i ? { ...q, slot: Number(e.target.value) } : q)) })}
                className="h-9 rounded-md bg-[#0d1117] border border-[#30363d] text-sm text-slate-100 px-2"
              >
                {pal.map((p) => (
                  <option key={p.slot} value={p.slot}>
                    Slot {p.slot} · {p.name}
                  </option>
                ))}
              </select>
              <button
                disabled={state.zones.length <= 2 || i === 0}
                onClick={() => dispatch({ type: 'zones', zones: state.zones.filter((_, k) => k !== i) })}
                className="w-8 h-9 text-slate-500 hover:text-red-300 disabled:opacity-20"
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            className="w-full h-9"
            onClick={() => {
              const last = state.zones[state.zones.length - 1];
              dispatch({ type: 'zones', zones: [...state.zones, { z: Math.min(height, last.z + Math.max(1, height / 4)), slot: (last.slot % 4) + 1 }] });
            }}
          >
            + Farbwechsel
          </Button>
        </div>
      )}
      {state.build && state.build.swaps > 0 && (
        <p className="text-[12px] text-slate-400">
          ≈ {state.build.swaps} Farbwechsel · ≈ {g1(state.build.purgeGrams)} g Spülmaterial (Slicer berechnet exakt)
        </p>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------- Aufteilen
export function SplitPanel() {
  const { state, dispatch } = useStore();
  const sp = state.settings.split;
  const b = state.build;
  const set = (patch: Partial<typeof sp>) => dispatch({ type: 'settings', patch: { split: { ...sp, ...patch } } });
  const tooBig = b && !b.pieces && !b.fitsBed;
  return (
    <Section title="Aufteilen & Verbinden" defaultOpen={!!tooBig || sp.enabled} right={tooBig ? <span className="text-[11px] text-amber-300">zu groß fürs Bett</span> : undefined}>
      <Toggle label="Auf mehrere Druckplatten aufteilen" hint="Schneidet das Modell in Segmente mit Verbindern" checked={sp.enabled} onChange={(v) => set({ enabled: v })} />
      {sp.enabled && (
        <>
          <div>
            <div className="text-[12px] text-slate-400 mb-1">Schnitte je Achse (0 = automatisch passend zum Bett)</div>
            <div className="grid grid-cols-3 gap-2">
              {['X', 'Y', 'Z'].map((a, i) => (
                <NumberInput
                  key={a}
                  value={sp.cuts[i]}
                  onChange={(v) => {
                    const c = [...sp.cuts] as [number, number, number];
                    c[i] = Math.max(0, Math.round(v ?? 0));
                    set({ cuts: c });
                  }}
                  min={0}
                  max={12}
                  step={1}
                  unit={`${a} Teile`}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] text-slate-400 mb-1">Verbindung</div>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#0d1117] border border-[#21262d]">
              {(
                [
                  ['steck', 'Steckzapfen'],
                  ['duebel', 'Dübel'],
                  ['kleben', 'Kleben'],
                ] as [JointType, string][]
              ).map(([j, l]) => (
                <button key={j} onClick={() => set({ joint: j })} className={cx('h-8 rounded-md text-[12px]', sp.joint === j ? 'bg-[#1f2630] text-white' : 'text-slate-400')}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {sp.joint !== 'kleben' && (
            <div className="grid grid-cols-3 gap-2">
              <label className="block">
                <span className="text-[12px] text-slate-400">Ø</span>
                <NumberInput value={sp.pinD} onChange={(v) => v && set({ pinD: v })} min={2} max={30} step={0.5} unit="mm" />
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-400">Tiefe</span>
                <NumberInput value={sp.depth} onChange={(v) => v && set({ depth: v })} min={2} max={60} step={0.5} unit="mm" />
              </label>
              <label className="block">
                <span className="text-[12px] text-slate-400">je Fläche</span>
                <NumberInput value={sp.perFace} onChange={(v) => set({ perFace: Math.max(0, Math.round(v ?? 0)) })} min={0} max={8} step={1} unit={sp.perFace ? 'Stk' : 'auto'} />
              </label>
            </div>
          )}
          <p className="text-[11px] text-slate-500">
            {sp.joint === 'steck' && 'Zapfen werden an ein Teil angeformt, das Gegenstück bekommt eine Bohrung mit Drucktoleranz.'}
            {sp.joint === 'duebel' && 'Beide Teile erhalten Bohrungen; passende Dübelstifte (mit Fasen) werden als eigene Teile mitgedruckt.'}
            {sp.joint === 'kleben' && 'Glatte Schnittflächen – mit Sekundenkleber (PLA) oder 2K-Kleber verbinden.'} Die Positionen werden im echten Querschnitt mit
            Mindestwand berechnet.
          </p>
          {b?.splitReport && (
            <div className="rounded-lg border border-[#21262d] p-2.5 text-[12px] text-slate-300 space-y-1">
              <div>
                {b.pieces?.filter((p) => p.kind === 'segment').length} Segmente ({b.splitReport.counts.join(' × ')}), {b.splitReport.faces} Schnittflächen, {b.splitReport.joints} Verbinder
                {b.pieces?.some((p) => p.kind === 'pin') ? ` + ${b.pieces.filter((p) => p.kind === 'pin').length} Dübel` : ''}
              </div>
              {b.splitReport.warnings.map((w, i) => (
                <div key={i} className="text-amber-300">
                  ⚠ {w}
                </div>
              ))}
            </div>
          )}
          {b?.plates && (
            <div className="space-y-1.5">
              <button
                onClick={() => dispatch({ type: 'view', patch: { plate: -1 } })}
                className={cx('w-full text-left rounded-lg border px-3 py-2 text-[13px]', state.view.plate === -1 ? 'border-[#00ae42] text-white' : 'border-[#30363d] text-slate-300')}
              >
                🧩 Zusammenbau (Explosionsansicht)
              </button>
              {b.plates.map((pl) => (
                <button
                  key={pl.index}
                  onClick={() => dispatch({ type: 'view', patch: { plate: pl.index } })}
                  className={cx('w-full text-left rounded-lg border px-3 py-2 text-[13px] flex justify-between', state.view.plate === pl.index ? 'border-[#00ae42] text-white' : 'border-[#30363d] text-slate-300')}
                >
                  <span>
                    Platte {pl.index} · {pl.items.length} Teil{pl.items.length > 1 ? 'e' : ''}
                  </span>
                  <span className="text-slate-500 tabular-nums">
                    {g1(pl.estimate.grams)} g · {hm(pl.estimate.minutes)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------- Druck-Check
export function PrintCheck() {
  const { state, dispatch } = useStore();
  const b = state.build;
  if (!b) return null;
  const t = b.total;
  const size = [t.max[0] - t.min[0], t.max[1] - t.min[1], t.max[2] - t.min[2]];
  const overCm2 = t.overhangArea / 100;
  const optimize = () => {
    const merged = mergeMeshes(printable(b.parts).map((p) => p.mesh));
    const unrot = rotateMesh(rotateMesh(merged, 0, -state.orientation.ry), -state.orientation.rx, 0);
    const best = bestOrientation(unrot, state.settings.overhangDeg);
    dispatch({ type: 'orientation', o: { rx: best.rx, ry: best.ry } });
    dispatch({ type: 'toast', kind: 'ok', text: best.rx || best.ry ? `Gedreht (X ${best.rx}°, Y ${best.ry}°) – Überhänge ${g1(best.overhang / 100)} cm²` : 'Aktuelle Lage ist bereits optimal.' });
  };
  return (
    <Section title="100 % Print-Ready Check" right={<span className={cx('text-[11px]', t.manifold && b.fitsBed ? 'text-[#3ddc84]' : 'text-amber-300')}>{t.manifold && b.fitsBed ? '✓ bereit' : 'prüfen'}</span>}>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Wasserdicht (manifold)" value={t.manifold ? '✓ Ja' : `✗ ${t.openEdges + t.nonManifoldEdges} Fehlkanten`} tone={t.manifold ? 'ok' : 'bad'} />
        <Stat label={b.pieces ? 'Teile passen aufs Bett' : 'Passt aufs Bett'} value={b.fitsBed ? `✓ ${state.settings.bedSize} mm` : '✗ zu groß'} tone={b.fitsBed ? 'ok' : 'bad'} />
        <Stat label="Abmessungen" value={`${g1(size[0])} × ${g1(size[1])} × ${g1(size[2])}`} />
        <Stat label="Filament" value={`${g1(b.estimate.grams)} g · ${g1(b.estimate.meters)} m`} />
        <Stat label="Druckzeit (Schätzung)" value={hm(b.estimate.minutes)} />
        <Stat label={`Überhänge > ${state.settings.overhangDeg}°`} value={overCm2 < 0.05 ? '✓ keine' : `${g1(overCm2)} cm²`} tone={overCm2 < 0.05 ? 'ok' : overCm2 < 2 ? 'warn' : 'bad'} />
      </div>
      {b.importNote && <p className="text-[12px] text-amber-300">⚠ {b.importNote}</p>}
      {b.pauses && b.pauses.length > 0 && (
        <div className="rounded-lg border border-[#4dabf7]/50 bg-[#4dabf7]/10 p-2 text-[12px] text-sky-100 space-y-0.5">
          {b.pauses.map((p, i) => (
            <div key={i}>
              ⏸ Druckpause bei {((Math.floor(p.top / state.settings.layer + 1e-6) + 1) * state.settings.layer).toFixed(2).replace('.', ',')} mm: <b>{p.label}</b> einlegen
            </div>
          ))}
          <div className="text-[11px] text-sky-200/70">Steht im 3MF – der Drucker hält an, Teil einlegen, „Weiter“ drücken.</div>
        </div>
      )}
      {!b.fitsBed && !b.pieces && (
        <Button className="w-full" onClick={() => dispatch({ type: 'settings', patch: { split: { ...state.settings.split, enabled: true } } })}>
          ✂️ Automatisch auf mehrere Platten aufteilen
        </Button>
      )}
      {overCm2 >= 0.05 && (
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-2.5 space-y-2">
          <p className="text-[12px] text-amber-200">Rot markierte Flächen brauchen Stützmaterial.</p>
          <div className="grid grid-cols-2 gap-2">
            <Button className="h-9 text-[12px]" onClick={optimize}>
              ↻ Lage optimieren
            </Button>
            <Button className="h-9 text-[12px]" disabled={state.settings.fase} onClick={() => dispatch({ type: 'settings', patch: { fase: true } })}>
              ◢ Fasen hinzufügen
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>
          {t.triangles.toLocaleString('de-DE')} Dreiecke · {t.shells} Körper · {Math.round(b.ms)} ms
        </span>
        {(state.orientation.rx !== 0 || state.orientation.ry !== 0) && (
          <button className="underline" onClick={() => dispatch({ type: 'orientation', o: { rx: 0, ry: 0 } })}>
            Lage zurücksetzen
          </button>
        )}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------- Export
const toExport = (ps: PartResult[]): ExportPart[] => ps.map((p) => ({ name: p.name, slot: p.slot, color: p.color, mesh: p.mesh, role: p.role, infill: p.infill, walls: p.walls }));

export function ExportPanel() {
  const { state, dispatch } = useStore();
  const [working, setWorking] = useState<string | null>(null);
  const b = state.build;
  const m = state.model;
  if (!b || !m) return null;
  const base = slug(m.name);
  const multi = new Set(printable(b.parts).map((p) => p.slot)).size > 1;
  const done = (r: string, what: string) => {
    if (r === 'declined') return;
    dispatch({ type: 'toast', kind: 'ok', text: r === 'zipped' ? `${what} gespeichert (als ZIP verpackt)` : `${what} gespeichert` });
  };
  const run = async (what: string, fn: () => Promise<void>) => {
    if (!b.total.manifold) dispatch({ type: 'toast', kind: 'err', text: 'Achtung: Modell ist nicht vollständig wasserdicht – der Slicer repariert das meist automatisch.' });
    setWorking(what);
    try {
      await fn();
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    } finally {
      setWorking(null);
    }
  };
  const guide = () => {
    const sp = state.settings.split;
    const lines = [
      `${m.name} – Montageanleitung (Formwerk CAD)`,
      '',
      `Segmente: ${b.pieces!.filter((p) => p.kind === 'segment').length}, Verbindung: ${sp.joint === 'steck' ? 'Steckzapfen' : sp.joint === 'duebel' ? 'Dübel' : 'Kleben'}`,
      `Drucktoleranz: ${state.settings.tol} mm${sp.joint !== 'kleben' ? `, Verbinder Ø ${sp.pinD} mm, Tiefe ${sp.depth} mm` : ''}`,
      '',
      'Teile (Raster X/Y/Z – Teil 1/1/1 liegt vorne links unten):',
      ...b.pieces!.map((p) => `  ${p.label}${p.kind === 'pin' ? '' : `  – Platte ${b.plates!.find((pl) => pl.items.some((it) => b.pieces![it.piece] === p))?.index}`}`),
      '',
      'Druckplatten:',
      ...b.plates!.map((pl) => `  Platte ${pl.index}: ${pl.items.map((it) => b.pieces![it.piece].label).join(', ')}  (≈ ${g1(pl.estimate.grams)} g, ${hm(pl.estimate.minutes)})`),
      '',
      sp.joint === 'kleben'
        ? 'Zusammenbau: Schnittflächen leicht anschleifen, Kleber dünn auftragen, Teile im Raster ausrichten und fixieren.'
        : sp.joint === 'duebel'
          ? 'Zusammenbau: Dübel zuerst in ein Teil stecken (ggf. mit einem Tropfen Kleber), dann das Nachbarteil aufschieben.'
          : 'Zusammenbau: Zapfen in die Bohrungen des Nachbarteils stecken. Für dauerhafte Verbindung zusätzlich kleben.',
    ];
    return lines.join('\n');
  };

  const export3mf = () =>
    run('3MF', async () => {
      if (b.plates && b.pieces) {
        const files: { name: string; data: Blob | string }[] = [];
        for (const pl of b.plates) {
          const objs: ExportObject[] = pl.items.map((it) => ({ name: b.pieces![it.piece].label, parts: toExport(it.parts) }));
          files.push({ name: `${base}_platte${pl.index}.3mf`, data: await threeMf(objs, { title: `${m.name} – Platte ${pl.index}`, bedSize: state.settings.bedSize, description: m.description, profile: state.settings.profile, layer: state.settings.layer }) });
        }
        files.push({ name: 'Montageanleitung.txt', data: guide() });
        done(await saveFile(`${base}_${b.plates.length}-platten.zip`, await zipFiles(files)), `${b.plates.length} Platten als 3MF`);
      } else {
        const blob = await threeMf([{ name: m.name, parts: toExport(b.parts).map((p, i) => ({ ...p, ...paint.forExport(b.parts, i) })) }], { title: m.name, bedSize: state.settings.bedSize, description: m.description, profile: state.settings.profile, layer: state.settings.layer, pauses: b.pauses, ranges: rangesFor(state), vase: m.templateId === 'vase' && Number(state.values.wall ?? 0) === 0 });
        done(await saveFile(`${base}.3mf`, blob), '3MF');
      }
    });
  const exportStl = () =>
    run('STL', async () => {
      if (b.pieces) {
        const files = b.pieces.map((p, i) => ({ name: `${base}_${String(i + 1).padStart(2, '0')}_${slug(p.label)}.stl`, data: stlBinary(p.local.map((l) => l.mesh), p.label) }));
        done(await saveFile(`${base}_teile-stl.zip`, await zipFiles([...files, { name: 'Montageanleitung.txt', data: guide() }])), 'STL-Teile');
      } else done(await saveFile(`${base}.stl`, stlBinary(printable(b.parts).map((p) => p.mesh), m.name)), 'STL');
    });
  const exportColors = () => run('Farben', async () => done(await saveFile(`${base}_farben.zip`, await stlPerColorZip(toExport(printable(b.parts)), base)), 'STL je Farbe'));
  const exportScad = () =>
    run('SCAD', async () => {
      let code = toScad(m, state.values, { tol: state.settings.tol, fase: state.settings.fase }, b.placement, state.settings.palette);
      if (state.settings.split.enabled) code = `// Hinweis: Die Aufteilung auf Druckplatten erfolgt in Formwerk CAD und ist hier nicht enthalten.\n${code}`;
      done(await saveFile(`${base}.scad`, code), 'OpenSCAD-Quellcode');
    });

  const big = 'h-12 flex-col gap-0 text-[13px]';
  return (
    <Section title="Export">
      <div className="grid grid-cols-3 gap-2">
        <Button variant="primary" className={big} onClick={export3mf} disabled={!!working}>
          <span className="font-semibold">.3MF</span>
          <span className="text-[10px] opacity-80">{b.plates ? `${b.plates.length} Platten` : 'Bambu/Orca'}</span>
        </Button>
        <Button className={big} onClick={exportStl} disabled={!!working}>
          <span className="font-semibold">.STL</span>
          <span className="text-[10px] opacity-70">{b.pieces ? 'je Teil' : 'binär'}</span>
        </Button>
        <Button className={big} onClick={exportScad} disabled={!!working}>
          <span className="font-semibold">.SCAD</span>
          <span className="text-[10px] opacity-70">Quellcode</span>
        </Button>
      </div>
      {multi && !b.pieces && (
        <Button className="w-full h-9 text-[12px]" onClick={exportColors} disabled={!!working}>
          🎨 STL je Farbe (ZIP, für jeden Slicer)
        </Button>
      )}
      {working && <p className="text-[12px] text-slate-400">Erzeuge {working} …</p>}
      <p className="text-[11px] text-slate-500">
        3MF enthält Millimeter-Einheiten, Metadaten, Farbteile mit AMS-Slot und Füllungs-Einstellungen. Alle Dateien werden lokal im Browser erzeugt.
      </p>
    </Section>
  );
}

// ---------------------------------------------------------------- Schnell & sparsam
export function OptimizePanel() {
  const { state, dispatch } = useStore();
  const [load, setLoad] = useState(false);
  const [fine, setFine] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<(OptimizePlan & { prev: { profile: PrintProfile; layer: number; orientation: { rx: number; ry: number } } }) | null>(null);
  const [busy, setBusy] = useState(false);
  const b = state.build;
  const m = state.model;
  if (!b || !m) return null;
  const hasText = JSON.stringify(m.root).includes('"type":"text"') || !!m.freeParts?.some((p) => (p as { kind?: string }).kind === 'text');
  const isFine = fine ?? hasText;
  const s = state.settings;
  const run = () => {
    setBusy(true);
    setTimeout(() => {
      try {
        const merged = mergeMeshes(printable(b.parts).map((p) => p.mesh));
        const unrot = rotateMesh(rotateMesh(merged, 0, -state.orientation.ry), -state.orientation.rx, 0);
        const density = MATERIALS.find((x) => x.id === s.material)?.density ?? 1.24;
        const prev = { profile: s.profile, layer: s.layer, orientation: state.orientation };
        const p = optimizePrint(unrot, prev, { load, fine: isFine, orient: !b.pieces }, { overhangDeg: s.overhangDeg, density, bedSize: s.bedSize, bedHeight: s.bedHeight });
        dispatch({ type: 'settings', patch: { profile: p.profile, layer: p.layer } });
        if (p.orientation.rx !== state.orientation.rx || p.orientation.ry !== state.orientation.ry) dispatch({ type: 'orientation', o: p.orientation });
        setPlan({ ...p, prev });
        const dg = p.before.grams - p.after.grams,
          dm = p.before.minutes - p.after.minutes;
        dispatch({ type: 'toast', kind: 'ok', text: `Optimiert: ${dg > 0 ? `−${g1(dg)} g` : 'Material gleich'}, ${dm > 0 ? `−${hm(dm)}` : 'Zeit gleich'}` });
      } catch (e) {
        dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
      } finally {
        setBusy(false);
      }
    }, 30);
  };
  const undo = () => {
    if (!plan) return;
    dispatch({ type: 'settings', patch: { profile: plan.prev.profile, layer: plan.prev.layer } });
    dispatch({ type: 'orientation', o: plan.prev.orientation });
    setPlan(null);
    dispatch({ type: 'toast', kind: 'info', text: 'Vorherige Einstellungen wiederhergestellt' });
  };
  const pct = (a: number, z: number) => (a > 0 ? Math.round((1 - z / a) * 100) : 0);
  return (
    <Section title="⚡ Schnell & sparsam drucken">
      <p className="text-[12px] text-slate-400 leading-snug">Ein Klick: beste Lage auf dem Bett (wenig Stützen, wenig Höhe), gröbere Schichten und eine sparsame Füllung. Wird mit ins 3MF geschrieben.</p>
      <Toggle label="Teil muss Kräfte aushalten" hint="z. B. Halter, Haken, Klemmen – dann etwas mehr Füllung und Wände" checked={load} onChange={setLoad} />
      <Toggle label="Feine Details (Schrift)" hint={hasText ? 'Automatisch an, weil Schrift im Modell ist' : 'Dann 0,2 mm statt 0,28 mm Schichten'} checked={isFine} onChange={setFine} />
      <Button variant="primary" className="w-full" disabled={busy} onClick={run}>
        {busy ? 'Rechne …' : '⚡ Automatisch optimieren'}
      </Button>
      {plan && (
        <div className="rounded-lg border border-[#00ae42]/40 bg-[#00ae42]/10 p-3 space-y-2 text-[12.5px]">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div />
            <div className="text-slate-400">vorher</div>
            <div className="text-white font-semibold">jetzt</div>
            <div className="text-left text-slate-400">Filament</div>
            <div className="text-slate-400">{g1(plan.before.grams)} g</div>
            <div className="text-white font-semibold">
              {g1(plan.after.grams)} g <span className="text-[#3ddc84]">−{pct(plan.before.grams, plan.after.grams)} %</span>
            </div>
            <div className="text-left text-slate-400">Druckzeit</div>
            <div className="text-slate-400">{hm(plan.before.minutes)}</div>
            <div className="text-white font-semibold">
              {hm(plan.after.minutes)} <span className="text-[#3ddc84]">−{pct(plan.before.minutes, plan.after.minutes)} %</span>
            </div>
          </div>
          <ul className="text-slate-300 space-y-0.5 list-disc pl-4">
            {plan.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-400">Im Bambu Studio zusätzlich das Druckprofil „0.28mm Extra Draft“ (bzw. 0.20 mm Standard) wählen – die Objekt-Einstellungen aus der Datei werden übernommen.</p>
          <Button className="w-full h-9" onClick={undo}>
            ↶ Rückgängig
          </Button>
        </div>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------- Toleranz kalibrieren
export function ToleranceCalibration({ compact }: { compact?: boolean }) {
  const { state, dispatch } = useStore();
  const tol = state.settings.tol;
  const load = () => {
    const t = TEMPLATES.find((x) => x.id === 'toleranztest');
    if (!t) return;
    dispatch({ type: 'setModel', model: structuredClone(t.model) });
    dispatch({ type: 'showSettings', on: false });
    dispatch({ type: 'toast', kind: 'ok', text: 'Toleranz-Testdruck geladen – drucken, Stift testen, dann hier die passende Zahl antippen' });
  };
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3 space-y-2">
      <div className="text-[13px] text-slate-200 font-medium">🎯 Drucktoleranz: {String(tol).replace('.', ',')} mm</div>
      {!compact && (
        <p className="text-[11.5px] text-slate-400 leading-snug">
          Bestimmt das Spiel aller Steckverbindungen, Dübel, Deckel und Gewinde. Einmal den Testdruck machen, dann passt alles genau zu deinem Drucker und Filament.
        </p>
      )}
      <p className="text-[11.5px] text-slate-400">Welches Loch passt am besten? (Stift lässt sich mit leichtem Druck stecken und sitzt fest)</p>
      <div className="grid grid-cols-6 gap-1">
        {[0.05, 0.1, 0.15, 0.2, 0.25, 0.3].map((v) => (
          <button
            key={v}
            onClick={() => {
              dispatch({ type: 'settings', patch: { tol: v } });
              dispatch({ type: 'toast', kind: 'ok', text: `Toleranz ${String(v).replace('.', ',')} mm übernommen – gilt jetzt für alle Passungen` });
            }}
            className={cx('h-9 rounded-md border text-[13px] tabular-nums', Math.abs(tol - v) < 1e-6 ? 'border-[#00ae42] bg-[#00ae42]/15 text-white' : 'border-[#30363d] text-slate-300')}
          >
            {Math.round(v * 100)}
          </button>
        ))}
      </div>
      {state.model?.templateId !== 'toleranztest' && (
        <Button className="w-full h-9 text-[12.5px]" onClick={load}>
          Testdruck laden
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Meine Teile
export function SaveToMyParts() {
  const { state, dispatch } = useStore();
  const m = state.model;
  if (!m) return null;
  const save = () => {
    const name = window.prompt('Name für „Meine Teile“:', m.name === 'Eigenes Modell' ? '' : m.name);
    if (name === null) return;
    try {
      myParts.add(name, m, state.values);
      dispatch({ type: 'toast', kind: 'ok', text: `„${name || m.name}“ gespeichert – zu finden unter Erstellen → Vorlagen → Meine Teile` });
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    }
  };
  return (
    <div className="px-4 pt-3">
      <Button className="w-full h-9 text-[12.5px]" onClick={save}>
        ⭐ In „Meine Teile“ speichern
      </Button>
    </div>
  );
}

export function MyPartsPanel() {
  const { state, dispatch } = useStore();
  const list = useMyParts();
  const [confirm, setConfirm] = useState<string | null>(null);
  if (!list.length)
    return <p className="text-[12px] text-slate-500 mb-3">⭐ Meine Teile: noch leer. Speichere ein fertiges Teil in Schritt 3 mit „In ‚Meine Teile‘ speichern“, dann kannst du es hier jederzeit öffnen oder in neue Projekte einfügen.</p>;
  const open = (p: MyPart) => {
    dispatch({ type: 'setModel', model: structuredClone(p.model), values: { ...p.values } });
    if (p.model.templateId === 'frei') {
      freeBus.send({ type: 'load', parts: (p.model.freeParts as FreePart[]) ?? [] });
      dispatch({ type: 'mode', mode: 'free' });
      dispatch({ type: 'step', step: 'create' });
    }
    dispatch({ type: 'toast', kind: 'ok', text: `„${p.name}“ geöffnet` });
  };
  const insert = (p: MyPart) => {
    dispatch({ type: 'busy', text: 'Füge ein …' });
    setTimeout(async () => {
      try {
        let parts: FreePart[];
        if (p.model.templateId === 'frei' && p.model.freeParts?.length) parts = structuredClone(p.model.freeParts as FreePart[]);
        else {
          // Fertiges Modell als festes Teil (Netz) übernehmen
          const s = state.settings;
          const r = runPipeline(p.model, p.values, {
            globals: { tol: s.tol, fase: s.fase },
            orientation: { rx: 0, ry: 0 },
            zones: null,
            palette: s.palette,
            material: s.material,
            profile: s.profile,
            layer: s.layer,
            overhangDeg: s.overhangDeg,
            bedSize: s.bedSize,
            bedHeight: s.bedHeight,
            split: { ...s.split, enabled: false },
          });
          const mm = mergeMeshes(printable(r.parts).map((x) => x.mesh));
          const soup = new Float64Array(mm.tri.length * 3);
          for (let i = 0; i < mm.tri.length; i++) for (let k = 0; k < 3; k++) soup[i * 3 + k] = mm.pos[mm.tri[i] * 3 + k];
          const w = weldTriangles(soup);
          const im = { id: hashId(w.mesh), name: p.name, mesh: w.mesh, size: w.size };
          await registerImported(im);
          parts = [{ id: 1, kind: 'import', name: p.name.slice(0, 30), hole: false, slot: 1, pos: [0, 0, w.size[2] / 2], rot: [0, 0, 0], size: w.size, e: { ref: im.id, welded: true }, lock: true }];
        }
        dispatch({ type: 'mode', mode: 'free' });
        dispatch({ type: 'step', step: 'create' });
        setTimeout(() => freeBus.send({ type: 'insert', parts, name: p.name }), 50);
      } catch (e) {
        dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
      } finally {
        dispatch({ type: 'busy', text: null });
      }
    }, 30);
  };
  return (
    <div className="mb-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">⭐ Meine Teile</div>
      <div className="space-y-1.5">
        {list.map((p) => (
          <div key={p.id} className="flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#0d1117] p-2">
            <button className="flex-1 min-w-0 text-left" onClick={() => open(p)} title="Öffnen">
              <div className="text-[13px] text-slate-100 truncate">{p.name}</div>
              <div className="text-[11px] text-slate-500">{new Date(p.created).toLocaleDateString('de-DE')}</div>
            </button>
            <button className="h-8 px-2 rounded-md border border-[#30363d] text-[11.5px] text-slate-300" title="In „Frei bauen“ einfügen" onClick={() => insert(p)}>
              ➕ Einfügen
            </button>
            {confirm === p.id ? (
              <button className="h-8 px-2 rounded-md bg-red-600 text-white text-[11.5px]" onClick={() => (myParts.remove(p.id), setConfirm(null))}>
                Löschen?
              </button>
            ) : (
              <button className="h-8 px-2 rounded-md border border-[#5c1d24] text-red-300 text-[11.5px]" onClick={() => setConfirm(p.id)}>
                🗑
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Objektliste (wie Bambu Studio / OrcaSlicer)
const ROLE_LABEL = { modifier: 'Modifier', blocker: 'Stütz-Blocker', enforcer: 'Stütz-Erzwinger' } as const;
export function ObjectList() {
  const { state, dispatch } = useStore();
  const b = state.build;
  const m = state.model;
  if (!b || !m) return null;
  const xs = m.xform?.scale;
  const free = m.templateId === 'frei' ? ((m.freeParts as FreePart[] | undefined) ?? []) : [];
  const pieces = b.pieces?.filter((p) => p.kind === 'segment').length ?? 0;
  return (
    <Section title="📋 Objektliste" defaultOpen={false}>
      <div className="rounded-lg border border-[#30363d] divide-y divide-[#21262d] text-[12.5px]">
        <div className="px-2.5 py-2 flex items-center gap-2">
          <span className="text-slate-100 font-medium flex-1 truncate">{m.name}</span>
          <span className="text-[11px] text-slate-500">
            {(state.orientation.rx || state.orientation.ry) && `gedreht X ${state.orientation.rx}° Y ${state.orientation.ry}° · `}
            {xs && `skaliert ${xs.map((v) => `${v < 0 ? '⇋' : ''}${Math.round(Math.abs(v) * 100)}%`).join('/')} · `}
            {pieces > 1 && `${pieces} Stücke`}
          </span>
        </div>
        {b.parts.map((p, i) => (
          <div key={i} className="px-2.5 py-1.5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: p.color, opacity: p.role ? 0.6 : 1 }} />
            <span className="flex-1 truncate text-slate-200">{p.name}</span>
            {p.role ? (
              <span className="text-[10.5px] px-1.5 rounded border border-[#30363d] text-slate-300">
                {ROLE_LABEL[p.role]}
                {p.role === 'modifier' && p.infill !== undefined ? ` ${Math.round(p.infill * 100)} %` : ''}
              </span>
            ) : (
              <span className={cx('text-[10.5px]', p.stats.manifold ? 'text-[#3ddc84]' : 'text-amber-300')}>{p.stats.manifold ? '✓' : '⚠'} Slot {p.slot}</span>
            )}
          </div>
        ))}
      </div>
      {free.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {free.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                dispatch({ type: 'mode', mode: 'free' });
                dispatch({ type: 'step', step: 'create' });
                freeBus.send({ type: 'select', ids: [p.id] });
              }}
              className={cx(
                'h-7 px-2 rounded-md border text-[11.5px]',
                p.role === 'modifier' ? 'border-yellow-500/60 text-yellow-200' : p.role === 'blocker' ? 'border-red-400/60 text-red-200' : p.role === 'enforcer' ? 'border-sky-400/60 text-sky-200' : p.hole ? 'border-red-600/60 text-red-300' : 'border-[#30363d] text-slate-300',
              )}
            >
              {p.hole ? '⊖ ' : ''}
              {p.name}
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] text-slate-500">Modifier, Stütz-Blocker und -Erzwinger legst du in „Frei bauen“ an (Teil antippen → Slicer-Teil). Sie landen als solche im 3MF für Bambu Studio und OrcaSlicer.</p>
    </Section>
  );
}

// ---------------------------------------------------------------- Verlauf
export function HistoryPanel() {
  const { state, dispatch } = useStore();
  const list = useTimeline();
  if (list.length < 2) return null;
  const restore = (s: Snapshot) => {
    timeline.mark(s.model, s.values);
    dispatch({ type: 'setModel', model: structuredClone(s.model), values: { ...s.values } });
    if (s.model.templateId === 'frei') freeBus.send({ type: 'load', parts: (s.model.freeParts as FreePart[]) ?? [] });
    dispatch({ type: 'toast', kind: 'ok', text: `Zurück zu: ${s.label}` });
  };
  const cur = JSON.stringify([state.model, state.values]);
  return (
    <Section title="🕘 Verlauf" defaultOpen={false}>
      <ol className="space-y-1 max-h-72 overflow-y-auto">
        {list.map((s, i) => {
          const isCur = JSON.stringify([s.model, s.values]) === cur;
          return (
            <li key={s.id} className={cx('flex items-center gap-2 rounded-lg border px-2 py-1.5', isCur ? 'border-[#00ae42] bg-[#00ae42]/10' : 'border-[#30363d]')}>
              <span className="text-[10.5px] text-slate-500 tabular-nums w-10 shrink-0">{new Date(s.at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="flex-1 min-w-0 truncate text-[12.5px] text-slate-200">{s.label}</span>
              {isCur ? (
                <span className="text-[11px] text-[#3ddc84] shrink-0">{i === 0 ? 'aktuell' : 'geladen'}</span>
              ) : (
                <button className="h-7 px-2 rounded-md border border-[#30363d] text-[11.5px] text-slate-300 shrink-0" onClick={() => restore(s)}>
                  ↩ hierhin
                </button>
              )}
            </li>
          );
        })}
      </ol>
      <p className="text-[11px] text-slate-500">Zwischenstände werden automatisch gespeichert (die letzten 40 in dieser Sitzung).</p>
    </Section>
  );
}

// ---------------------------------------------------------------- Schichthöhe & Höhenbereiche
const adaptiveCache = new WeakMap<object, LayerRange[]>();
function adaptiveFor(b: NonNullable<ReturnType<typeof useStore>['state']['build']>): LayerRange[] {
  let r = adaptiveCache.get(b);
  if (!r) {
    r = adaptiveRanges(mergeMeshes(printable(b.parts).map((p) => p.mesh)));
    adaptiveCache.set(b, r);
  }
  return r;
}
/** Bereiche fürs 3MF: adaptive Schichthöhe (falls an) + eigene Höhenbereiche. */
export function rangesFor(state: ReturnType<typeof useStore>['state']): LayerRange[] | undefined {
  const b = state.build;
  if (!b || b.pieces) return undefined;
  const h = b.total.max[2] - b.total.min[2];
  const base = state.settings.adaptive ? adaptiveFor(b) : [];
  const user = state.model?.ranges ?? [];
  if (!base.length && !user.length) return undefined;
  return mergeRanges(base, user, h);
}

export function LayersPanel() {
  const { state, dispatch } = useStore();
  const b = state.build;
  const m = state.model;
  if (!b || !m) return null;
  const s = state.settings;
  const h = b.total.max[2] - b.total.min[2];
  const ranges = rangesFor(state) ?? [];
  const user = m.ranges ?? [];
  const nBase = Math.round(h / s.layer);
  const nNow = layerCount(h, s.layer, ranges);
  const setUser = (r: LayerRange[]) => dispatch({ type: 'ranges', ranges: r });
  const upd = (i: number, patch: Partial<LayerRange>) => setUser(user.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const col = (lh?: number) => (lh === undefined ? '#30363d' : lh <= 0.1 ? '#4dabf7' : lh <= 0.14 ? '#3ddc84' : lh <= 0.18 ? '#a9e34b' : lh <= 0.22 ? '#ffd43b' : '#ff922b');
  return (
    <Section title="📐 Schichthöhe & Höhenbereiche" defaultOpen={!!(s.adaptive || user.length)}>
      <Toggle
        label="Variable Schichthöhe (adaptiv)"
        hint="Fein (bis 0,08 mm) an flachen Schrägen und Rundungen, grob (bis 0,28 mm) an senkrechten Wänden – schöner und oft schneller"
        checked={!!s.adaptive}
        onChange={(v) => dispatch({ type: 'settings', patch: { adaptive: v } })}
      />
      {ranges.length > 0 && (
        <div className="flex gap-2 items-stretch">
          <div className="w-6 h-40 rounded overflow-hidden flex flex-col-reverse border border-[#30363d] shrink-0">
            {ranges.map((r, i) => (
              <div key={i} style={{ height: `${((r.to - r.from) / h) * 100}%`, background: col(r.layer) }} title={`${r.from.toFixed(1)}–${r.to.toFixed(1)} mm: ${r.layer ?? s.layer} mm`} />
            ))}
          </div>
          <div className="text-[11.5px] text-slate-400 space-y-0.5 overflow-y-auto max-h-40 flex-1">
            {[...ranges].reverse().map((r, i) => (
              <div key={i} className="tabular-nums">
                {r.from.toFixed(1).replace('.', ',')}–{r.to.toFixed(1).replace('.', ',')} mm: <span className="text-slate-200">{String(r.layer ?? s.layer).replace('.', ',')} mm</span>
                {r.infill !== undefined && ` · ${Math.round(r.infill * 100)} %`}
                {r.walls !== undefined && ` · ${r.walls} Wände`}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-[12px] text-slate-300">
        Schichten: <b>{nNow}</b>
        {nNow !== nBase && <span className="text-slate-500"> (statt {nBase} bei {String(s.layer).replace('.', ',')} mm)</span>}
      </div>
      <div className="pt-1">
        <div className="text-[12px] text-slate-300 mb-1">Eigene Höhenbereiche</div>
        {user.map((r, i) => (
          <div key={i} className="rounded-lg border border-[#30363d] p-2 mb-1.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[12px]">
              <NumberInput value={r.from} min={0} max={h} step={0.5} unit="mm" onChange={(v) => v !== undefined && upd(i, { from: v })} />
              <span className="text-slate-500">bis</span>
              <NumberInput value={r.to} min={0} max={h} step={0.5} unit="mm" onChange={(v) => v !== undefined && upd(i, { to: v })} />
              <button className="h-8 px-2 rounded-md border border-[#5c1d24] text-red-300" onClick={() => setUser(user.filter((_, j) => j !== i))}>
                🗑
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] text-slate-400">
              <label>
                Schicht
                <select value={r.layer ?? ''} onChange={(e) => upd(i, { layer: e.target.value ? Number(e.target.value) : undefined })} className="w-full h-8 rounded-md bg-[#0d1117] border border-[#30363d] text-slate-100 px-1">
                  <option value="">wie sonst</option>
                  {LAYER_STEPS.map((l) => (
                    <option key={l} value={l}>
                      {String(l).replace('.', ',')} mm
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Füllung %
                <NumberInput value={r.infill !== undefined ? Math.round(r.infill * 100) : undefined} min={0} max={100} step={5} onChange={(v) => upd(i, { infill: v === undefined ? undefined : v / 100 })} />
              </label>
              <label>
                Wände
                <NumberInput value={r.walls} min={1} max={10} step={1} onChange={(v) => upd(i, { walls: v === undefined ? undefined : Math.round(v) })} />
              </label>
            </div>
          </div>
        ))}
        <Button className="w-full h-9 text-[12.5px]" onClick={() => setUser([...user, { from: Math.round(h * 0.5), to: Math.round(h * 10) / 10, infill: 0.4 }])}>
          ＋ Höhenbereich
        </Button>
      </div>
      <p className="text-[11px] text-slate-500">Wird ins 3MF geschrieben – Bambu Studio und OrcaSlicer übernehmen die Bereiche beim Öffnen (Objekt → Höhenbereich).</p>
    </Section>
  );
}

// ---------------------------------------------------------------- Haftung: Mausohren
export function AdhesionPanel() {
  const { state, dispatch } = useStore();
  const b = state.build;
  if (!b) return null;
  const d = state.settings.ears ?? 0;
  const ears = b.parts.find((p) => p.name.startsWith('Mausohren'));
  return (
    <Section title="🐭 Haftung: Mausohren" defaultOpen={d > 0}>
      <Toggle
        label="Mausohren an spitzen Ecken"
        hint="Dünne runde Scheiben (2 Schichten) an Ecken der ersten Schicht – verhindern, dass sich Ecken hochziehen. Nach dem Druck abbrechen."
        checked={d > 0}
        onChange={(v) => dispatch({ type: 'settings', patch: { ears: v ? 12 : 0 } })}
      />
      {d > 0 && (
        <>
          <SliderRow label="Durchmesser" value={d} min={6} max={25} step={1} unit="mm" onChange={(v) => dispatch({ type: 'settings', patch: { ears: v } })} />
          <p className="text-[12px] text-slate-300">{ears ? `${ears.name.replace(/\D/g, '')} Ecken bekommen ein Mausohr.` : 'Keine spitzen Ecken auf dem Bett gefunden – nichts nötig.'}</p>
        </>
      )}
    </Section>
  );
}

// ---------------------------------------------------------------- Teilen per Link
export function ShareButton() {
  const { state, dispatch } = useStore();
  const [link, setLink] = useState<string | null>(null);
  const m = state.model;
  if (!m) return null;
  const share = async () => {
    try {
      const url = await makeShareLink(m, state.values);
      setLink(url);
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (nav.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await nav.share({ title: `Formwerk: ${m.name}`, text: `Schau dir mein 3D-Druck-Modell „${m.name}“ an – Maße kannst du selbst anpassen:`, url }).catch(() => undefined);
      } else {
        await navigator.clipboard?.writeText(url).catch(() => undefined);
        dispatch({ type: 'toast', kind: 'ok', text: 'Link kopiert – z. B. in WhatsApp einfügen' });
      }
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    }
  };
  return (
    <div className="px-4 pt-3 space-y-1.5">
      <Button className="w-full h-9 text-[12.5px]" onClick={share}>
        🔗 Modell teilen (Link)
      </Button>
      {link && (
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full h-8 rounded-md bg-[#0d1117] border border-[#30363d] px-2 text-[11px] text-slate-400"
        />
      )}
    </div>
  );
}
