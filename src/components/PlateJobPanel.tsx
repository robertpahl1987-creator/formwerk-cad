import { useMemo, useState } from 'react';
import { threeMf, zipFiles, type ExportPart } from '../mesh/export';
import { saveFile } from '../platform/download';
import { asmSettings } from '../state/assemblyBuild';
import { useMyParts } from '../state/myParts';
import { packPlates, plateJob, usePlateJob } from '../state/plateJob';
import type { PartResult } from '../state/pipeline';
import { useStore } from '../state/store';
import { Button, cx, Section } from './ui';

const toExport = (ps: PartResult[]): ExportPart[] => ps.map((p) => ({ name: p.name, slot: p.slot, color: p.color, mesh: p.mesh, role: p.role, infill: p.infill, walls: p.walls }));
const g1 = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const hm = (min: number) => `${Math.floor(min / 60)} h ${String(Math.round(min % 60)).padStart(2, '0')} min`;

/** Packergebnis (wird von Ansicht und Panel gemeinsam genutzt). */
export function usePacked() {
  const { state } = useStore();
  const job = usePlateJob();
  const S = asmSettings(state.settings);
  return useMemo(() => {
    if (!job.items.length) return null;
    try {
      return packPlates(job.items, S);
    } catch (e) {
      console.error(e);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.items, state.settings]);
}

export function PlateJobPanel() {
  const { state, dispatch } = useStore();
  const job = usePlateJob();
  const mine = useMyParts();
  const packed = usePacked();
  const [copies, setCopies] = useState(1);
  const [working, setWorking] = useState(false);
  const S = asmSettings(state.settings);

  const exportAll = async () => {
    if (!packed?.plates.length) return;
    setWorking(true);
    try {
      const files: { name: string; data: Blob }[] = [];
      for (let i = 0; i < packed.plates.length; i++) {
        const pl = packed.plates[i];
        files.push({
          name: `sammelplatte_${i + 1}.3mf`,
          data: await threeMf(
            pl.objects.map((o) => ({ name: o.name, parts: toExport(o.parts) })),
            { title: `Sammelplatte ${i + 1}`, bedSize: S.bedSize, profile: S.profile, layer: S.layer },
          ),
        });
      }
      const r = files.length === 1 ? await saveFile(files[0].name, files[0].data) : await saveFile(`sammelplatten_${files.length}.zip`, await zipFiles(files));
      if (r !== 'declined') dispatch({ type: 'toast', kind: 'ok', text: `${files.length} Druckplatte${files.length > 1 ? 'n' : ''} gespeichert` });
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    } finally {
      setWorking(false);
    }
  };

  return (
    <Section title="🧲 Mehrere Teile auf eine Druckplatte" defaultOpen={job.items.length > 0}>
      <p className="text-[12px] text-slate-400 leading-snug">Sammle verschiedene Teile (auch mehrfach) – die App legt sie platzsparend aufs Bett. Passt nicht alles drauf, entstehen automatisch weitere Platten.</p>
      <div className="flex gap-2">
        <div className="flex items-center rounded-lg border border-[#30363d] shrink-0">
          <button className="h-10 w-8 text-slate-300" onClick={() => setCopies(Math.max(1, copies - 1))}>
            −
          </button>
          <span className="w-7 text-center text-[13px] tabular-nums">{copies}×</span>
          <button className="h-10 w-8 text-slate-300" onClick={() => setCopies(Math.min(50, copies + 1))}>
            +
          </button>
        </div>
        <Button
          variant="primary"
          className="flex-1"
          disabled={!state.model}
          onClick={() => {
            if (!state.model) return;
            plateJob.add(state.model.name, state.model, state.values, copies);
            dispatch({ type: 'toast', kind: 'ok', text: `${copies}× „${state.model.name}“ zur Sammelplatte hinzugefügt` });
          }}
        >
          ➕ Aktuelles Teil
        </Button>
      </div>
      {mine.length > 0 && (
        <select
          value=""
          onChange={(e) => {
            const p = mine.find((x) => x.id === e.target.value);
            if (p) plateJob.add(p.name, p.model, p.values, copies);
          }}
          className="w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] text-sm text-slate-100 px-2"
        >
          <option value="">➕ Aus „Meine Teile“ hinzufügen …</option>
          {mine.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
      {job.items.length > 0 && (
        <>
          <div className="space-y-1.5">
            {job.items.map((it) => (
              <div key={it.id} className="flex items-center gap-2 rounded-lg border border-[#30363d] p-2">
                <span className="flex-1 min-w-0 truncate text-[13px] text-slate-200">{it.name}</span>
                <button className="h-7 w-7 rounded border border-[#30363d]" onClick={() => plateJob.update(it.id, { copies: Math.max(1, it.copies - 1) })}>
                  −
                </button>
                <span className="w-7 text-center text-[12.5px] tabular-nums">{it.copies}×</span>
                <button className="h-7 w-7 rounded border border-[#30363d]" onClick={() => plateJob.update(it.id, { copies: Math.min(50, it.copies + 1) })}>
                  +
                </button>
                <button className="h-7 px-2 rounded border border-[#5c1d24] text-red-300 text-[12px]" onClick={() => plateJob.remove(it.id)}>
                  🗑
                </button>
              </div>
            ))}
          </div>
          {packed && (
            <div className="rounded-lg bg-[#0d1117] border border-[#30363d] p-2.5 text-[12.5px] space-y-1.5">
              <div className="text-slate-200">
                {packed.plates.length} Druckplatte{packed.plates.length === 1 ? '' : 'n'} · {g1(packed.plates.reduce((a, p) => a + p.grams, 0))} g · {hm(packed.plates.reduce((a, p) => a + p.minutes, 0))}
              </div>
              {packed.tooBig.length > 0 && <div className="text-amber-300">⚠ Zu groß fürs Bett (einzeln aufteilen): {packed.tooBig.join(', ')}</div>}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => plateJob.show(!job.show)}
                  className={cx('h-8 px-2.5 rounded-md border text-[12px]', job.show ? 'border-[#00ae42] bg-[#00ae42]/15 text-white' : 'border-[#30363d] text-slate-300')}
                >
                  {job.show ? '👁 Platte wird angezeigt' : '👁 Platte ansehen'}
                </button>
                {packed.plates.length > 1 &&
                  packed.plates.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => (plateJob.plate(i), plateJob.show(true))}
                      className={cx('h-8 px-2.5 rounded-md border text-[12px]', job.show && job.plate === i ? 'border-[#00ae42] text-white' : 'border-[#30363d] text-slate-400')}
                    >
                      Platte {i + 1}
                    </button>
                  ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button disabled={working || !packed?.plates.length} onClick={exportAll}>
              {working ? 'Exportiere …' : '⬇ 3MF speichern'}
            </Button>
            <Button variant="danger" onClick={() => plateJob.clear()}>
              Leeren
            </Button>
          </div>
        </>
      )}
    </Section>
  );
}
