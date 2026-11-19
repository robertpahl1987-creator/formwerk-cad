import { bestOrientation, mergeMeshes, rotateMesh } from '../mesh/mesh';
import { plateJob } from '../state/plateJob';
import { printable } from '../state/pipeline';
import { slicerTools, useSlicerTools, type ToolPanel } from '../state/slicerTools';
import { useStore } from '../state/store';
import { cx } from './ui';
import { useState } from 'react';
import { paint, usePaint, type PaintMode } from '../state/paint';

/**
 * Werkzeugleiste wie in Bambu Studio / OrcaSlicer (links an der 3D-Ansicht):
 * Auto-Ausrichten, Fläche aufs Bett, Skalieren, Spiegeln, Schneiden, Messen, Kopien/Anordnen.
 */
export function SlicerToolbar() {
  const { state, dispatch } = useStore();
  const t = useSlicerTools();
  const b = state.build;
  const m = state.model;
  if (!m || !b) return null;
  const toggleTool = (tool: 'face' | 'measure' | 'paint') => slicerTools.set({ tool: t.tool === tool ? null : tool, panel: null });
  const togglePanel = (panel: ToolPanel) => slicerTools.set({ panel: t.panel === panel ? null : panel, tool: null });
  const autoOrient = () => {
    const merged = mergeMeshes(printable(b.parts).map((p) => p.mesh));
    const unrot = rotateMesh(rotateMesh(merged, 0, -state.orientation.ry), -state.orientation.rx, 0);
    const best = bestOrientation(unrot, state.settings.overhangDeg);
    dispatch({ type: 'orientation', o: { rx: best.rx, ry: best.ry } });
    dispatch({ type: 'toast', kind: 'ok', text: best.rx || best.ry ? `Automatisch ausgerichtet (X ${best.rx}°, Y ${best.ry}°)` : 'Lage ist bereits optimal' });
  };
  const btn = (active: boolean) =>
    cx('w-10 h-10 rounded-lg flex items-center justify-center text-[17px] border backdrop-blur transition-colors', active ? 'bg-[#00ae42]/25 border-[#00ae42] text-white' : 'bg-[#161b22]/90 border-[#30363d] text-slate-300 hover:border-slate-500');
  const items: [string, string, boolean, () => void, boolean?][] = [
    ['🧭', 'Automatisch ausrichten (wenig Überhang)', false, autoOrient],
    ['⬇️', 'Fläche aufs Bett legen – Fläche antippen', t.tool === 'face', () => toggleTool('face'), !!b.pieces],
    ['⤢', 'Skalieren', t.panel === 'scale', () => togglePanel('scale')],
    ['⇋', 'Spiegeln', t.panel === 'mirror', () => togglePanel('mirror')],
    ['✂️', 'Schneiden (mit Verbindern)', t.panel === 'cut', () => togglePanel('cut'), !!m.imports?.length],
    ['📏', 'Messen – zwei Punkte antippen', t.tool === 'measure', () => toggleTool('measure')],
    ['🖌️', 'Malen: Farbe und Stützen aufs Modell pinseln', t.tool === 'paint', () => toggleTool('paint'), !!b.pieces],
    ['⧉', 'Kopien / auf Platte anordnen', t.panel === 'copies', () => togglePanel('copies')],
  ];
  return (
    <div className="absolute left-3 top-[6.5rem] z-10 flex gap-2 items-start pointer-events-none">
      <div className="flex flex-col gap-1.5 pointer-events-auto">
        {items.map(([icon, title, active, fn, disabled]) => (
          <button key={title} title={title} aria-label={title} disabled={disabled} onClick={fn} className={cx(btn(active), disabled && 'opacity-35')}>
            {icon}
          </button>
        ))}
      </div>
      {(t.panel || t.tool) && (
        <div className="pointer-events-auto w-64 rounded-xl bg-[#161b22]/95 border border-[#30363d] p-3 backdrop-blur text-[12.5px] text-slate-200 space-y-2.5 shadow-xl">
          {t.tool === 'face' && <ToolHint title="Fläche aufs Bett legen" text="Tippe auf die Fläche, die unten auf der Druckplatte liegen soll. Das Teil wird sofort gedreht." />}
          {t.tool === 'measure' && <ToolHint title="Messen" text="Tippe nacheinander zwei Punkte auf dem Modell an – Abstand und X/Y/Z-Anteile erscheinen gelb. Dritter Tipp startet neu." />}
          {t.tool === 'paint' && <PaintPanel />}
          {t.panel === 'scale' && <ScalePanel />}
          {t.panel === 'mirror' && <MirrorPanel />}
          {t.panel === 'cut' && <CutPanel />}
          {t.panel === 'copies' && <CopiesPanel />}
          <button className="text-[11.5px] text-slate-500 underline" onClick={() => slicerTools.set({ tool: null, panel: null })}>
            Schließen
          </button>
        </div>
      )}
    </div>
  );
}

function ToolHint({ title, text }: { title: string; text: string }) {
  return (
    <>
      <div className="font-semibold text-white">{title}</div>
      <p className="text-slate-400 leading-snug">{text}</p>
    </>
  );
}

function ScalePanel() {
  const { state, dispatch } = useStore();
  const cur = state.model?.xform?.scale ?? [1, 1, 1];
  const [uniform, setUniform] = useState(Math.abs(Math.abs(cur[0]) - Math.abs(cur[1])) < 1e-9 && Math.abs(Math.abs(cur[1]) - Math.abs(cur[2])) < 1e-9);
  const t = state.build!.total;
  const size = [t.max[0] - t.min[0], t.max[1] - t.min[1], t.max[2] - t.min[2]];
  const setK = (k: number, pct: number) => {
    if (!Number.isFinite(pct) || pct <= 0) return;
    const sign = cur.map((v) => Math.sign(v) || 1);
    const abs = cur.map(Math.abs);
    const f = pct / 100;
    const next = uniform ? abs.map(() => f) : abs.map((v, i) => (i === k ? f : v));
    dispatch({ type: 'xform', scale: next.map((v, i) => Math.round(v * sign[i] * 10000) / 10000) as [number, number, number] });
  };
  return (
    <>
      <div className="font-semibold text-white">Skalieren</div>
      <label className="flex items-center gap-2 text-slate-300">
        <input type="checkbox" checked={uniform} onChange={(e) => setUniform(e.target.checked)} /> Gleichmäßig
      </label>
      {(['X', 'Y', 'Z'] as const).map((l, k) => (
        <div key={l} className="flex items-center gap-2">
          <span className="w-4 text-slate-400">{l}</span>
          <input
            type="number"
            min={1}
            max={2000}
            step={1}
            value={Math.round(Math.abs(cur[k]) * 1000) / 10}
            onChange={(e) => setK(k, Number(e.target.value))}
            className="w-20 h-8 rounded-md bg-[#0d1117] border border-[#30363d] px-2 text-right tabular-nums"
          />
          <span className="text-slate-400">%</span>
          <span className="ml-auto text-slate-500 tabular-nums">{size[k].toFixed(1).replace('.', ',')} mm</span>
        </div>
      ))}
      <div className="flex gap-1.5">
        {[50, 100, 150, 200].map((p) => (
          <button key={p} className="flex-1 h-7 rounded-md border border-[#30363d] text-[11.5px]" onClick={() => dispatch({ type: 'xform', scale: cur.map((v) => (Math.sign(v) || 1) * (p / 100)) as [number, number, number] })}>
            {p} %
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-500">Achtung: Passungen (Löcher, Gewinde, Zapfen) skalieren mit – für Maßteile lieber die Parameter ändern.</p>
    </>
  );
}

function MirrorPanel() {
  const { state, dispatch } = useStore();
  const cur = state.model?.xform?.scale ?? [1, 1, 1];
  return (
    <>
      <div className="font-semibold text-white">Spiegeln</div>
      <div className="grid grid-cols-3 gap-1.5">
        {(['X', 'Y', 'Z'] as const).map((l, k) => (
          <button
            key={l}
            className={cx('h-9 rounded-md border text-[12.5px]', cur[k] < 0 ? 'border-[#00ae42] bg-[#00ae42]/15 text-white' : 'border-[#30363d] text-slate-300')}
            onClick={() => dispatch({ type: 'xform', scale: cur.map((v, i) => (i === k ? -v : v)) as [number, number, number] })}
          >
            ⇋ {l}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-500">Z. B. für linke/rechte Ausführung eines Halters. Nochmal tippen hebt die Spiegelung auf.</p>
    </>
  );
}

function CutPanel() {
  const { state, dispatch } = useStore();
  const t = useSlicerTools();
  const sp = state.settings.split;
  const active = sp.enabled && !!sp.cutAt;
  const b = state.build!;
  const size = [b.total.max[0] - b.total.min[0], b.total.max[1] - b.total.min[1], b.total.max[2] - b.total.min[2]];
  const at = t.cut.frac * size[t.cut.axis];
  const apply = () => {
    dispatch({ type: 'settings', patch: { split: { ...sp, enabled: true, cutAt: { ...t.cut } } } });
    dispatch({ type: 'toast', kind: 'ok', text: 'Geschnitten – die Teile liegen getrennt auf der Platte (mit Verbindern)' });
  };
  const undo = () => {
    const { cutAt: _c, ...rest } = sp;
    void _c;
    dispatch({ type: 'settings', patch: { split: { ...rest, enabled: false } } });
  };
  return (
    <>
      <div className="font-semibold text-white">Schneiden</div>
      <div className="grid grid-cols-3 gap-1.5">
        {(['X', 'Y', 'Z'] as const).map((l, k) => (
          <button
            key={l}
            className={cx('h-8 rounded-md border text-[12px]', t.cut.axis === k ? 'border-[#ff922b] bg-[#ff922b]/15 text-white' : 'border-[#30363d] text-slate-300')}
            onClick={() => slicerTools.set({ cut: { ...t.cut, axis: k as 0 | 1 | 2 } })}
          >
            quer zu {l}
          </button>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-slate-400">
          <span>Position</span>
          <span className="tabular-nums">{at.toFixed(1).replace('.', ',')} mm</span>
        </div>
        <input type="range" min={0.03} max={0.97} step={0.005} value={t.cut.frac} onChange={(e) => slicerTools.set({ cut: { ...t.cut, frac: Number(e.target.value) } })} className="fw-range w-full" />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {(
          [
            ['steck', 'Zapfen'],
            ['duebel', 'Dübel'],
            ['kleben', 'Keine'],
          ] as const
        ).map(([j, l]) => (
          <button
            key={j}
            className={cx('h-8 rounded-md border text-[12px]', sp.joint === j ? 'border-[#00ae42] bg-[#00ae42]/15 text-white' : 'border-[#30363d] text-slate-300')}
            onClick={() => dispatch({ type: 'settings', patch: { split: { ...sp, joint: j } } })}
          >
            {l}
          </button>
        ))}
      </div>
      <button className="w-full h-9 rounded-lg bg-[#ff922b] text-white font-medium" onClick={apply}>
        ✂️ {active ? 'Neu schneiden' : 'Schneiden'}
      </button>
      {active && (
        <button className="w-full h-8 rounded-lg border border-[#30363d] text-slate-300" onClick={undo}>
          Schnitt aufheben
        </button>
      )}
    </>
  );
}

function CopiesPanel() {
  const { state, dispatch } = useStore();
  const [n, setN] = useState(4);
  return (
    <>
      <div className="font-semibold text-white">Kopien & Anordnen</div>
      <p className="text-slate-400 leading-snug">Legt das Teil mehrfach platzsparend auf die Druckplatte (zusammen mit anderen gesammelten Teilen).</p>
      <div className="flex items-center gap-2">
        <button className="h-8 w-8 rounded-md border border-[#30363d]" onClick={() => setN(Math.max(1, n - 1))}>
          −
        </button>
        <span className="w-10 text-center tabular-nums">{n}×</span>
        <button className="h-8 w-8 rounded-md border border-[#30363d]" onClick={() => setN(Math.min(50, n + 1))}>
          +
        </button>
        <button
          className="ml-auto h-8 px-3 rounded-md bg-[#00ae42] text-white"
          onClick={() => {
            if (!state.model) return;
            plateJob.add(state.model.name, state.model, state.values, n);
            slicerTools.set({ panel: null });
            dispatch({ type: 'toast', kind: 'ok', text: `${n}× angeordnet – Export in Schritt 3 unter „Mehrere Teile auf eine Druckplatte“` });
          }}
        >
          Anordnen
        </button>
      </div>
    </>
  );
}

function PaintPanel() {
  const { state } = useStore();
  const p = usePaint();
  const pal = state.settings.palette;
  const modes: [PaintMode, string][] = [
    ['color', '🎨 Farbe'],
    ['enforce', '➕ Stützen'],
    ['block', '⛔ Keine Stützen'],
    ['erase', '🧽 Radierer'],
  ];
  return (
    <>
      <div className="font-semibold text-white">Malen</div>
      <div className="grid grid-cols-2 gap-1.5">
        {modes.map(([m, l]) => (
          <button key={m} onClick={() => paint.set({ mode: m })} className={cx('h-8 rounded-md border text-[12px]', p.mode === m ? 'border-[#00ae42] bg-[#00ae42]/15 text-white' : 'border-[#30363d] text-slate-300')}>
            {l}
          </button>
        ))}
      </div>
      {p.mode === 'color' && (
        <div className="flex flex-wrap gap-1.5">
          {pal.map((f) => (
            <button
              key={f.slot}
              title={f.name}
              onClick={() => paint.set({ slot: f.slot })}
              className={cx('h-8 px-2 rounded-md border text-[12px] flex items-center gap-1.5', p.slot === f.slot ? 'border-white text-white' : 'border-[#30363d] text-slate-400')}
            >
              <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ background: f.color }} />
              {f.slot}
            </button>
          ))}
        </div>
      )}
      <div>
        <div className="flex justify-between text-slate-400">
          <span>Pinselgröße</span>
          <span className="tabular-nums">{p.radius} mm</span>
        </div>
        <input type="range" min={0.5} max={25} step={0.5} value={p.radius} onChange={(e) => paint.set({ radius: Number(e.target.value) })} className="fw-range w-full" />
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Auf dem Modell ziehen = malen. Neben dem Modell ziehen = Ansicht drehen. Wird beim Export ins 3MF übernommen (Bambu Studio / OrcaSlicer). Ändert sich die Form, wird die Bemalung zurückgesetzt.</p>
      <button className="w-full h-8 rounded-md border border-[#5c1d24] text-red-300 text-[12px]" onClick={() => paint.clear()}>
        Bemalung löschen
      </button>
    </>
  );
}
