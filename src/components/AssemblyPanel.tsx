import { useState } from 'react';
import { pinsModel, planJoints, type AsmItem, type AsmJoint, type V3 } from '../cad/assembly';
import { stlBinary, threeMf, zipFiles, type ExportPart } from '../mesh/export';
import { saveFile } from '../platform/download';
import { asmSettings, assembledParts, buildItem, itemPolys, itemWorldBox } from '../state/assemblyBuild';
import type { PartResult } from '../state/pipeline';
import { useStore } from '../state/store';
import { Button, cx, NumberInput, Section } from './ui';

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30) || 'teil';
const toExport = (ps: PartResult[]): ExportPart[] => ps.map((p) => ({ name: p.name, slot: p.slot, color: p.color, mesh: p.mesh }));
const r1 = (n: number) => Math.round(n * 10) / 10;
const tick = () => new Promise((r) => setTimeout(r, 30));

type Side = 'rechts' | 'links' | 'hinten' | 'vorne' | 'oben' | 'unten';
const SIDES: { s: Side; label: string }[] = [
  { s: 'rechts', label: '→ rechts' },
  { s: 'links', label: '← links' },
  { s: 'hinten', label: '↑ hinten' },
  { s: 'vorne', label: '↓ vorne' },
  { s: 'oben', label: '⤒ oben drauf' },
  { s: 'unten', label: '⤓ unten drunter' },
];
const JOINTS: { j: AsmJoint; label: string; sub: string }[] = [
  { j: 'duebel', label: '🔩 Dübel', sub: 'Löcher in beiden Teilen + Dübelstifte' },
  { j: 'steck', label: '🧷 Steckzapfen', sub: 'Zapfen am einen, Loch am anderen Teil' },
  { j: 'kleben', label: '🧴 Kleben', sub: 'nur bündige Flächen' },
];

export function AssemblyPanel() {
  const { state, dispatch } = useStore();
  const asm = state.asm;
  const [open, setOpen] = useState<number | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const S = asmSettings(state.settings);
  const items = asm.items.filter((i) => !i.auto);
  const editingItem = items.find((i) => i.id === asm.editing);

  const run = async (what: string, fn: () => Promise<void> | void) => {
    setWorking(what);
    await tick();
    try {
      await fn();
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    } finally {
      setWorking(null);
    }
  };

  /** Neue Platte bündig rechts an die bisherige Baugruppe setzen. */
  const addCurrent = () =>
    run('Füge hinzu …', () => {
      if (!state.model) return;
      const probe: AsmItem = { id: -1, name: state.model.name, model: { ...state.model, mods: undefined }, values: state.values, pos: [0, 0, 0], rot: [0, 0, 0] };
      const lb = itemWorldBox(probe, S);
      let pos: V3 = [0, 0, -lb.min[2]];
      if (items.length) {
        const min: V3 = [Infinity, Infinity, Infinity],
          max: V3 = [-Infinity, -Infinity, -Infinity];
        for (const it of items) {
          const b = itemWorldBox(it, S);
          for (let k = 0; k < 3; k++) {
            min[k] = Math.min(min[k], b.min[k]);
            max[k] = Math.max(max[k], b.max[k]);
          }
        }
        pos = [r1(max[0] - lb.min[0]), r1(min[1] - lb.min[1]), r1(min[2] - lb.min[2])];
      }
      const n = items.length + 1;
      dispatch({ type: 'asmAdd', item: { name: `Platte ${n}: ${state.model.name}`, model: probe.model, values: state.values, pos, rot: [0, 0, 0] } });
      dispatch({ type: 'toast', kind: 'ok', text: `Platte ${n} hinzugefügt – Ansicht „Zusammengebaut“` });
    });

  const snap = (it: AsmItem, target: AsmItem, side: Side) =>
    run('Lege an …', () => {
      const a = itemWorldBox({ ...it, pos: [0, 0, 0] }, S);
      const b = itemWorldBox(target, S);
      const mid = (k: number) => (b.min[k] + b.max[k]) / 2 - (a.min[k] + a.max[k]) / 2;
      const pos: V3 = [mid(0), mid(1), b.min[2] - a.min[2]];
      if (side === 'rechts') pos[0] = b.max[0] - a.min[0];
      if (side === 'links') pos[0] = b.min[0] - a.max[0];
      if (side === 'hinten') pos[1] = b.max[1] - a.min[1];
      if (side === 'vorne') pos[1] = b.min[1] - a.max[1];
      if (side === 'oben') pos[2] = b.max[2] - a.min[2];
      if (side === 'unten') pos[2] = b.min[2] - a.max[2];
      dispatch({ type: 'asmUpdate', id: it.id, patch: { pos: pos.map(r1) as V3 } });
      if (asm.view === 'off') dispatch({ type: 'asmView', view: 'assembled' });
    });

  const connect = () =>
    run('Berechne Verbindungen …', () => {
      const geo = items.map((it) => ({ id: it.id, polys: itemPolys(it, S) }));
      const res = planJoints(items, geo, asm.joints, state.settings.tol);
      const mods: Record<number, AsmItem['model']['mods']> = {};
      for (const it of items) {
        const m = res.mods.get(it.id);
        mods[it.id] = m && (m.sub.length || m.add.length) ? m : undefined;
      }
      const name = (id: number) => items.find((i) => i.id === id)?.name.replace(/^Platte (\d+):.*/, 'Platte $1') ?? '?';
      const what = asm.joints.type === 'duebel' ? 'Dübel' : asm.joints.type === 'steck' ? 'Zapfen' : '';
      const report: string[] = [];
      if (!res.contacts.length) report.push('Keine Berührungsflächen gefunden. Lege die Platten mit „Anlegen an“ bündig aneinander und versuche es erneut.');
      for (const c of res.contacts) report.push(asm.joints.type === 'kleben' ? `${name(c.a)} ↔ ${name(c.b)}: Klebefläche` : `${name(c.a)} ↔ ${name(c.b)}: ${c.joints} ${what}`);
      report.push(...res.warnings);
      if (res.pins) report.push(`→ ${res.pins} Dübelstifte Ø ${asm.joints.d} mm werden als eigene Platte mitgedruckt.`);
      dispatch({ type: 'asmApply', mods, pins: res.pins ? { count: res.pins, d: asm.joints.d, depth: asm.joints.depth } : null, report });
      dispatch({ type: 'toast', kind: res.contacts.length ? 'ok' : 'info', text: res.contacts.length ? 'Alle Platten passen jetzt zusammen' : 'Keine Berührungsflächen gefunden' });
    });

  const exportAll = () =>
    run('Exportiere …', async () => {
      const files: { name: string; data: Blob | Uint8Array | string }[] = [];
      const lines = ['Baugruppe – Montageanleitung (Formwerk CAD)', '', `Drucktoleranz: ${state.settings.tol} mm`, ''];
      let i = 0;
      for (const it of items) {
        i++;
        const r = buildItem(it, S);
        const fname = `${String(i).padStart(2, '0')}_${slug(it.model.name)}.3mf`;
        files.push({ name: fname, data: await threeMf([{ name: it.name, parts: toExport(r.parts) }], { title: it.name, bedSize: S.bedSize, description: it.model.description, profile: S.profile }) });
        lines.push(`${it.name}: ${fname}${r.fitsBed ? '' : '  ⚠ passt nicht aufs Druckbett – im Slicer teilen oder hier „Auf Platten aufteilen“ nutzen'}`);
      }
      if (asm.pins) {
        const pm = pinsModel(asm.pins.count, asm.pins.d, asm.pins.depth);
        const r = buildItem({ id: -2, name: pm.name, model: pm, values: {}, pos: [0, 0, 0], rot: [0, 0, 0] }, S);
        files.push({ name: '99_duebel.3mf', data: await threeMf([{ name: pm.name, parts: toExport(r.parts) }], { title: pm.name, bedSize: S.bedSize, description: pm.description, profile: S.profile }) });
        lines.push(`Dübelstifte: 99_duebel.3mf (${asm.pins.count} Stück, Ø ${asm.pins.d} mm)`);
      }
      lines.push('', 'Verbindungen:', ...(asm.report ?? ['(noch nicht berechnet)']), '');
      lines.push('Zusammenbau: Dübel in die Löcher des einen Teils stecken (ggf. mit etwas Kleber), dann das Nachbarteil aufschieben.');
      lines.push('Vorschau aller Teile in Endlage: zusammengebaut_vorschau.stl (nur zum Ansehen, nicht drucken).');
      files.push({ name: 'Montageanleitung.txt', data: lines.join('\n') });
      files.push({ name: 'zusammengebaut_vorschau.stl', data: stlBinary(assembledParts(items, S).map((p) => p.mesh), 'Formwerk Baugruppe') });
      const r = await saveFile(`baugruppe_${items.length}-platten.zip`, await zipFiles(files));
      if (r !== 'declined') dispatch({ type: 'toast', kind: 'ok', text: `${items.length} Platten als ZIP gespeichert` });
    });

  const view = (v: typeof asm.view, label: string) => (
    <button
      onClick={() => dispatch({ type: 'asmView', view: v })}
      className={cx('h-9 rounded-lg border text-[12px]', asm.view === v ? 'border-[#00ae42] bg-[#00ae42]/15 text-white' : 'border-[#30363d] text-slate-400')}
    >
      {label}
    </button>
  );

  return (
    <Section title="🧩 Baugruppe – mehrere Platten" defaultOpen={items.length > 0}>
      <p className="text-[12px] text-slate-400 leading-snug">
        Baue ein Objekt aus mehreren Teilen: jedes Teil wird eine eigene Druckplatte. Du siehst alles <b className="text-slate-200">zusammengebaut</b>, und die App setzt auf Knopfdruck <b className="text-slate-200">Dübel oder Zapfen</b> genau dort, wo sich die Teile berühren.
      </p>

      {editingItem && (
        <div className="rounded-lg border border-[#00ae42]/50 bg-[#00ae42]/10 p-2.5 text-[12px] text-slate-200 flex items-center justify-between gap-2">
          <span>✏️ Du bearbeitest „{editingItem.name}“ – Änderungen landen automatisch in der Baugruppe.</span>
          <Button variant="subtle" className="h-8 shrink-0" onClick={() => dispatch({ type: 'asmEdit', id: null })}>
            Fertig
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="primary" disabled={!state.model || !!working} onClick={addCurrent}>
          ➕ {editingItem ? 'Als Kopie hinzufügen' : 'Aktuelles Teil hinzufügen'}
        </Button>
        <Button
          disabled={!!working}
          onClick={() => {
            dispatch({ type: 'asmEdit', id: null });
            dispatch({ type: 'step', step: 'create' });
            dispatch({ type: 'toast', kind: 'info', text: 'Neues Teil erstellen, dann in Schritt 3 „Aktuelles Teil hinzufügen“' });
          }}
        >
          ✨ Neues Teil bauen
        </Button>
      </div>

      {items.length > 0 && (
        <>
          <div>
            <div className="text-[12px] text-slate-400 mb-1.5">Ansicht</div>
            <div className="grid grid-cols-3 gap-1.5">
              {view('off', '🔹 Einzelteil')}
              {view('assembled', '🧩 Zusammen')}
              {view('exploded', '💥 Auseinander')}
            </div>
          </div>

          <div className="space-y-2">
            {items.map((it, idx) => {
              const isOpen = open === it.id;
              const others = items.filter((o) => o.id !== it.id);
              const holes = (it.model.mods?.sub.length ?? 0) + (it.model.mods?.add.length ?? 0);
              return (
                <div key={it.id} className={cx('rounded-xl border', asm.editing === it.id ? 'border-[#00ae42]' : 'border-[#30363d]')}>
                  <div className="flex items-center gap-2 p-2.5">
                    <span className="w-6 h-6 rounded-md bg-[#1f2630] text-[12px] text-slate-300 flex items-center justify-center shrink-0">{idx + 1}</span>
                    <button className="flex-1 min-w-0 text-left" onClick={() => setOpen(isOpen ? null : it.id)}>
                      <div className="text-[13px] text-slate-100 truncate">{it.model.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Lage {r1(it.pos[0])} / {r1(it.pos[1])} / {r1(it.pos[2])} mm{holes ? ` · ${holes} Verbinder` : ''}
                      </div>
                    </button>
                    <button
                      title="Bearbeiten"
                      className="h-8 px-2 rounded-md border border-[#30363d] text-[12px]"
                      onClick={() => {
                        dispatch({ type: 'asmEdit', id: it.id });
                        dispatch({ type: 'step', step: 'adjust' });
                      }}
                    >
                      ✏️
                    </button>
                    <button title="Entfernen" className="h-8 px-2 rounded-md border border-[#5c1d24] text-red-300 text-[12px]" onClick={() => dispatch({ type: 'asmRemove', id: it.id })}>
                      🗑
                    </button>
                  </div>
                  {isOpen && (
                    <div className="px-2.5 pb-3 space-y-2.5 border-t border-[#21262d] pt-2.5">
                      <div>
                        <div className="text-[12px] text-slate-400 mb-1">Position (mm)</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['X', 'Y', 'Z'] as const).map((l, k) => (
                            <NumberInput
                              key={l}
                              unit={l}
                              value={it.pos[k]}
                              step={1}
                              onChange={(v) => v !== undefined && dispatch({ type: 'asmUpdate', id: it.id, patch: { pos: it.pos.map((p, j) => (j === k ? v : p)) as V3 } })}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[12px] text-slate-400 mb-1">Drehen (90°)</div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['X', 'Y', 'Z'] as const).map((l, k) => (
                            <button
                              key={l}
                              className="h-8 rounded-md border border-[#30363d] text-[12px] text-slate-300"
                              onClick={() => dispatch({ type: 'asmUpdate', id: it.id, patch: { rot: it.rot.map((r, j) => (j === k ? (r + 90) % 360 : r)) as V3 } })}
                            >
                              ⟳ um {l} {it.rot[k] ? `(${it.rot[k]}°)` : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                      {others.length > 0 && (
                        <div>
                          <div className="text-[12px] text-slate-400 mb-1">Bündig anlegen an</div>
                          {others.map((o) => (
                            <div key={o.id} className="mb-1.5">
                              <div className="text-[11px] text-slate-500 mb-1 truncate">{o.name}</div>
                              <div className="grid grid-cols-3 gap-1">
                                {SIDES.map((sd) => (
                                  <button key={sd.s} disabled={!!working} className="h-8 rounded-md border border-[#30363d] text-[11px] text-slate-300" onClick={() => snap(it, o, sd.s)}>
                                    {sd.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {items.length >= 2 && (
            <div className="rounded-xl border border-[#30363d] p-3 space-y-2.5">
              <div className="text-[13px] font-semibold text-white">Alle Platten passend verbinden</div>
              <div className="grid grid-cols-3 gap-1.5">
                {JOINTS.map((x) => (
                  <button
                    key={x.j}
                    title={x.sub}
                    onClick={() => dispatch({ type: 'asmJoints', patch: { type: x.j } })}
                    className={cx('rounded-lg border p-1.5 text-[12px]', asm.joints.type === x.j ? 'border-[#00ae42] bg-[#00ae42]/15 text-white' : 'border-[#30363d] text-slate-400')}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500">{JOINTS.find((x) => x.j === asm.joints.type)?.sub}</div>
              {asm.joints.type !== 'kleben' && (
                <div className="grid grid-cols-3 gap-1.5">
                  <label className="text-[11px] text-slate-400">
                    Ø
                    <NumberInput value={asm.joints.d} min={2} max={20} step={0.5} unit="mm" onChange={(v) => v !== undefined && dispatch({ type: 'asmJoints', patch: { d: v } })} />
                  </label>
                  <label className="text-[11px] text-slate-400">
                    Tiefe
                    <NumberInput value={asm.joints.depth} min={2} max={40} step={0.5} unit="mm" onChange={(v) => v !== undefined && dispatch({ type: 'asmJoints', patch: { depth: v } })} />
                  </label>
                  <label className="text-[11px] text-slate-400">
                    Je Fläche
                    <NumberInput value={asm.joints.perFace} min={0} max={9} step={1} unit={asm.joints.perFace ? 'St.' : 'auto'} onChange={(v) => v !== undefined && dispatch({ type: 'asmJoints', patch: { perFace: Math.round(v) } })} />
                  </label>
                </div>
              )}
              <Button variant="primary" className="w-full" disabled={!!working} onClick={connect}>
                {working === 'Berechne Verbindungen …' ? 'Berechne …' : '🔩 Alle Platten passend bauen'}
              </Button>
              {asm.report && (
                <ul className="text-[12px] text-slate-300 space-y-0.5">
                  {asm.report.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button disabled={!!working} onClick={exportAll}>
              {working === 'Exportiere …' ? 'Exportiere …' : `⬇ Alle ${items.length + (asm.pins ? 1 : 0)} Platten (ZIP)`}
            </Button>
            <Button variant="danger" disabled={!!working} onClick={() => dispatch({ type: 'asmClear' })}>
              Baugruppe leeren
            </Button>
          </div>
          {working && <div className="text-[12px] text-slate-400">{working}</div>}
        </>
      )}
    </Section>
  );
}
