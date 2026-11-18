import { useState } from 'react';
import { toScad } from '../cad/scad';
import type { JointType } from '../cad/split';
import { TEMPLATES } from '../cad/templates';
import type { ParamDef } from '../cad/types';
import { stlBinary, stlPerColorZip, threeMf, zipFiles, type ExportObject, type ExportPart } from '../mesh/export';
import { bestOrientation, MATERIALS, mergeMeshes, PATTERN_LABEL, PROFILES, rotateMesh, type InfillPattern, type PrintProfile } from '../mesh/mesh';
import { saveFile } from '../platform/download';
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
      <div>
        <div className="text-[15px] font-semibold text-white">{m.name}</div>
        {m.description && <p className="text-[12px] text-slate-400 mt-0.5">{m.description}</p>}
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
          {state.build.parts.map((p, i) => (
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
    const merged = mergeMeshes(b.parts.map((p) => p.mesh));
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
const toExport = (ps: PartResult[]): ExportPart[] => ps.map((p) => ({ name: p.name, slot: p.slot, color: p.color, mesh: p.mesh }));

export function ExportPanel() {
  const { state, dispatch } = useStore();
  const [working, setWorking] = useState<string | null>(null);
  const b = state.build;
  const m = state.model;
  if (!b || !m) return null;
  const base = slug(m.name);
  const multi = new Set(b.parts.map((p) => p.slot)).size > 1;
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
          files.push({ name: `${base}_platte${pl.index}.3mf`, data: await threeMf(objs, { title: `${m.name} – Platte ${pl.index}`, bedSize: state.settings.bedSize, description: m.description, profile: state.settings.profile }) });
        }
        files.push({ name: 'Montageanleitung.txt', data: guide() });
        done(await saveFile(`${base}_${b.plates.length}-platten.zip`, await zipFiles(files)), `${b.plates.length} Platten als 3MF`);
      } else {
        const blob = await threeMf([{ name: m.name, parts: toExport(b.parts) }], { title: m.name, bedSize: state.settings.bedSize, description: m.description, profile: state.settings.profile });
        done(await saveFile(`${base}.3mf`, blob), '3MF');
      }
    });
  const exportStl = () =>
    run('STL', async () => {
      if (b.pieces) {
        const files = b.pieces.map((p, i) => ({ name: `${base}_${String(i + 1).padStart(2, '0')}_${slug(p.label)}.stl`, data: stlBinary(p.local.map((l) => l.mesh), p.label) }));
        done(await saveFile(`${base}_teile-stl.zip`, await zipFiles([...files, { name: 'Montageanleitung.txt', data: guide() }])), 'STL-Teile');
      } else done(await saveFile(`${base}.stl`, stlBinary(b.parts.map((p) => p.mesh), m.name)), 'STL');
    });
  const exportColors = () => run('Farben', async () => done(await saveFile(`${base}_farben.zip`, await stlPerColorZip(toExport(b.parts), base)), 'STL je Farbe'));
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
