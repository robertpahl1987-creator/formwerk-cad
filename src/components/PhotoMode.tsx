import { MeshyCard } from './MeshyCard';
import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { generateWithAi, PROVIDER_LABEL, resolveProvider } from '../ai/providers';
import { defaultValues } from '../cad/validate';
import { photoModel } from '../photo/photoModel';
import { PHOTO_EVENT } from '../platform/cloud';
import { contourToMm, findContour, loadImageToCanvas, rectify, segment, type Contour, type Pt, type SegResult } from '../photo/vision';
import { useStore } from '../state/store';
import { abortRef } from './TextMode';
import { Button, cx, NumberInput, SliderRow, Toggle } from './ui';

type Tool = 'line' | 'quad';
const PRESETS: { id: string; label: string; w: number; h: number }[] = [
  { id: 'a4', label: 'A4-Blatt (210 × 297)', w: 210, h: 297 },
  { id: 'a5', label: 'A5-Blatt (148 × 210)', w: 148, h: 210 },
  { id: 'card', label: 'Kreditkarte (85,6 × 53,98)', w: 85.6, h: 53.98 },
  { id: 'letter', label: 'US Letter (215,9 × 279,4)', w: 215.9, h: 279.4 },
  { id: 'custom', label: 'Eigenes Rechteck', w: 100, h: 100 },
];

export function PhotoMode() {
  const { state, dispatch } = useStore();
  const [orig, setOrig] = useState<HTMLCanvasElement | null>(null);
  const [work, setWork] = useState<HTMLCanvasElement | null>(null);
  const [rectified, setRectified] = useState(false);
  const [tool, setTool] = useState<Tool>('line');
  const [pts, setPts] = useState<Pt[]>([]);
  const [refMm, setRefMm] = useState<number | undefined>(undefined);
  const [preset, setPreset] = useState('a4');
  const [rw, setRw] = useState(210);
  const [rh, setRh] = useState(297);
  const [pxPerMm, setPxPerMm] = useState<number | null>(null);
  const [invert, setInvert] = useState(false);
  const [autoThr, setAutoThr] = useState(true);
  const [thr, setThr] = useState(128);
  const [simp, setSimp] = useState(0.25);
  const [seg, setSeg] = useState<SegResult | null>(null);
  const [contour, setContour] = useState<Contour | null>(null);
  const [showMask, setShowMask] = useState(false);
  const [desc, setDesc] = useState('');
  const [depth, setDepth] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<number | null>(null);

  const onFile = async (f: Blob | undefined) => {
    if (!f) return;
    try {
      const c = await loadImageToCanvas(f);
      setOrig(c);
      setWork(c);
      setRectified(false);
      setPts([]);
      setPxPerMm(null);
      setContour(null);
      setSeg(null);
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    }
  };

  // Foto aus der Ablage (Handy ↔ PC)
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent<{ blob: Blob; target: string }>).detail;
      if (d.target === 'photo') void onFile(d.blob);
    };
    window.addEventListener(PHOTO_EVENT, h);
    return () => window.removeEventListener(PHOTO_EVENT, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Maßstab aus Referenzlinie
  useEffect(() => {
    if (rectified) return;
    if (tool === 'line' && pts.length === 2 && refMm && refMm > 0) {
      const d = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
      setPxPerMm(d > 2 ? d / refMm : null);
    } else if (tool === 'line') setPxPerMm(null);
  }, [pts, refMm, tool, rectified]);

  // Segmentierung + Kontur
  useEffect(() => {
    if (!work) return;
    const t = setTimeout(() => {
      try {
        const s = segment(work, { invert, threshold: autoThr ? null : thr });
        setSeg(s);
        if (autoThr) setThr(Math.round(s.threshold));
        setContour(findContour(s));
      } catch {
        setContour(null);
      }
    }, 120);
    return () => clearTimeout(t);
  }, [work, invert, autoThr, thr]);

  // Zeichnen
  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv || !work) return;
    cv.width = work.width;
    cv.height = work.height;
    const g = cv.getContext('2d')!;
    g.drawImage(work, 0, 0);
    const lw = Math.max(2, work.width / 400);
    if (showMask && seg) {
      const m = document.createElement('canvas');
      m.width = seg.w;
      m.height = seg.h;
      const mg = m.getContext('2d')!;
      const id = mg.createImageData(seg.w, seg.h);
      for (let i = 0; i < seg.mask.length; i++) {
        if (!seg.mask[i]) continue;
        id.data[4 * i] = 0;
        id.data[4 * i + 1] = 174;
        id.data[4 * i + 2] = 66;
        id.data[4 * i + 3] = 110;
      }
      mg.putImageData(id, 0, 0);
      g.drawImage(m, 0, 0, work.width, work.height);
    }
    if (contour) {
      g.lineWidth = lw;
      g.strokeStyle = '#00e05a';
      for (const ring of [contour.outer, ...contour.holes]) {
        g.beginPath();
        ring.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
        g.closePath();
        g.stroke();
      }
    }
    if (!rectified && pts.length) {
      g.strokeStyle = tool === 'line' ? '#ffd43b' : '#4dabf7';
      g.fillStyle = g.strokeStyle;
      g.lineWidth = lw * 1.3;
      g.beginPath();
      pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
      if (tool === 'quad' && pts.length === 4) g.closePath();
      g.stroke();
      for (const [i, p] of pts.entries()) {
        g.beginPath();
        g.arc(p[0], p[1], lw * 4, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = '#0d1117';
        g.font = `bold ${lw * 6}px sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(String(i + 1), p[0], p[1]);
        g.fillStyle = g.strokeStyle;
      }
    }
  }, [work, pts, contour, showMask, seg, tool, rectified]);
  useEffect(draw, [draw]);

  const toImg = (e: RPointerEvent): Pt => {
    const cv = canvasRef.current!;
    const r = cv.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * cv.width, ((e.clientY - r.top) / r.height) * cv.height];
  };
  const onDown = (e: RPointerEvent) => {
    if (!work || rectified) return;
    const p = toImg(e);
    const cv = canvasRef.current!;
    const scale = cv.width / cv.getBoundingClientRect().width;
    const near = pts.findIndex((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 26 * scale);
    const max = tool === 'line' ? 2 : 4;
    (e.target as Element).setPointerCapture(e.pointerId);
    if (near >= 0) drag.current = near;
    else if (pts.length < max) {
      setPts([...pts, p]);
      drag.current = pts.length;
    } else {
      let ni = 0;
      pts.forEach((q, i) => {
        if (Math.hypot(q[0] - p[0], q[1] - p[1]) < Math.hypot(pts[ni][0] - p[0], pts[ni][1] - p[1])) ni = i;
      });
      const n = [...pts];
      n[ni] = p;
      setPts(n);
      drag.current = ni;
    }
  };
  const onMove = (e: RPointerEvent) => {
    if (drag.current === null) return;
    const p = toImg(e);
    setPts((ps) => ps.map((q, i) => (i === drag.current ? p : q)));
  };
  const onUp = () => (drag.current = null);

  const doRectify = () => {
    if (!orig || pts.length !== 4) return;
    try {
      const { canvas, pxPerMm: s } = rectify(orig, pts, rw, rh, 0);
      setWork(canvas);
      setPxPerMm(s);
      setRectified(true);
      setPts([]);
      dispatch({ type: 'toast', kind: 'ok', text: 'Perspektive entzerrt – Maßstab ist jetzt exakt bekannt.' });
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    }
  };
  const resetRect = () => {
    setWork(orig);
    setRectified(false);
    setPxPerMm(null);
  };

  const mm = contour && pxPerMm ? contourToMm(contour, pxPerMm, simp) : null;

  const buildLocal = () => {
    if (!mm) return;
    const model = photoModel(mm.outer, mm.holes, mm.width, mm.height);
    const values = defaultValues(model);
    values.depth = depth;
    dispatch({ type: 'setModel', model, values });
    dispatch({ type: 'toast', kind: 'ok', text: `Kontur übernommen: ${mm.width.toFixed(1)} × ${mm.height.toFixed(1)} mm` });
  };

  const buildAi = async () => {
    if (!work) return;
    const p = await resolveProvider(state.settings.ai);
    if (p === 'offline') {
      buildLocal();
      dispatch({ type: 'toast', kind: 'info', text: 'Keine KI eingerichtet – lokale Konturerkennung verwendet (KI-Key in den Einstellungen).' });
      return;
    }
    const blob: Blob | null = await new Promise((res) => work.toBlob((b) => res(b), 'image/jpeg', 0.9));
    if (!blob) return;
    const ac = new AbortController();
    abortRef.current = ac;
    dispatch({ type: 'busy', text: `${PROVIDER_LABEL[p]} analysiert das Foto …` });
    const info = [
      `Bild ${work.width} × ${work.height} px.`,
      pxPerMm ? `Maßstab: ${pxPerMm.toFixed(4)} px/mm (${rectified ? 'perspektivisch entzerrt, Draufsicht' : 'über Referenzlinie bestimmt'}).` : 'Kein Maßstab – schätze Maße aus bekannten Objekten.',
      !rectified && pts.length === 2 && refMm ? `Referenzlinie von (${pts[0].map(Math.round).join(', ')}) nach (${pts[1].map(Math.round).join(', ')}) px = ${refMm} mm.` : '',
      `Nur falls es ein flaches Teil ist: Dicke ${depth} mm. Räumliche Objekte vollständig dreidimensional nachbauen (nicht als flache Extrusion).`,
    ].join(' ');
    const hint = mm ? `Breite ${mm.width.toFixed(2)} mm, Höhe ${mm.height.toFixed(2)} mm\nAußen: ${JSON.stringify(mm.outer.slice(0, 160))}\n${mm.holes.length ? `Löcher: ${JSON.stringify(mm.holes.map((h) => h.slice(0, 60)))}` : ''}` : undefined;
    try {
      const { model, provider } = await generateWithAi(
        { text: desc || 'Erstelle aus dem fotografierten Objekt ein maßhaltiges, druckbares 3D-Modell.', measures: {}, tol: state.settings.tol, multicolor: false, imageInfo: info, contourHint: hint },
        state.settings.ai,
        { image: blob, signal: ac.signal, onStatus: (s) => dispatch({ type: 'busy', text: s }) },
      );
      model.prompt = desc || undefined;
      dispatch({ type: 'setModel', model });
      dispatch({ type: 'toast', kind: 'ok', text: `Modell aus Foto von ${provider} erstellt.` });
    } catch (e) {
      if (!ac.signal.aborted) {
        dispatch({ type: 'toast', kind: 'err', text: `KI-Fehler: ${(e as Error).message.split('\n')[0]}` });
        if (mm) buildLocal();
      }
    } finally {
      dispatch({ type: 'busy', text: null });
      abortRef.current = null;
    }
  };

  const step = !work ? 1 : !pxPerMm ? 2 : 3;
  return (
    <div className="space-y-4">
      <ol className="flex gap-2 text-[11px]">
        {['Foto', 'Maßstab', 'Modell'].map((s, i) => (
          <li key={s} className={cx('flex-1 rounded-md px-2 py-1 border text-center', step > i + 1 ? 'border-[#00ae42]/50 text-[#3ddc84]' : step === i + 1 ? 'border-[#00ae42] text-white' : 'border-[#30363d] text-slate-500')}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-2 gap-2">
        <label className="h-10 rounded-lg border border-[#30363d] bg-[#161b22] hover:border-[#00ae42] text-sm text-slate-200 flex items-center justify-center gap-2 cursor-pointer">
          📷 Kamera
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        <label className="h-10 rounded-lg border border-[#30363d] bg-[#161b22] hover:border-[#00ae42] text-sm text-slate-200 flex items-center justify-center gap-2 cursor-pointer">
          🖼️ Datei
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>
      {!work && (
        <div
          className="rounded-xl border border-dashed border-[#30363d] p-5 text-center text-sm text-slate-400"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
        >
          Foto hierher ziehen oder oben aufnehmen.
          <p className="text-[11px] text-slate-500 mt-2">Tipp: Objekt senkrecht von oben auf ein weißes A4-Blatt legen – dann ist die Messung am genauesten.</p>
        </div>
      )}

      {orig && <MeshyCard photo={orig} />}
      {orig && <div className="text-[11.5px] text-slate-500 text-center">— oder flache/technische Teile genau vermessen —</div>}

      {work && (
        <>
          {!rectified && (
            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#0d1117] border border-[#21262d]">
              {(
                [
                  ['line', '📏 Referenzlinie'],
                  ['quad', '⬚ 4-Punkt-Entzerrung'],
                ] as [Tool, string][]
              ).map(([t, l]) => (
                <button
                  key={t}
                  onClick={() => {
                    setTool(t);
                    setPts([]);
                  }}
                  className={cx('h-8 rounded-md text-[12px]', tool === t ? 'bg-[#1f2630] text-white' : 'text-slate-400')}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
          <canvas
            ref={canvasRef}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="w-full rounded-lg border border-[#30363d] touch-none bg-black"
          />
          {!rectified && tool === 'line' && (
            <div className="space-y-2">
              <p className="text-[12px] text-slate-400">Tippe zwei Punkte an einer bekannten Kante an (Punkte lassen sich verschieben) und gib das echte Maß ein.</p>
              <label className="block">
                <span className="text-[12px] text-slate-400">Echtes Maß der Linie</span>
                <NumberInput value={refMm} onChange={setRefMm} min={0.1} max={5000} step={0.5} unit="mm" placeholder="z. B. 42,5" />
              </label>
            </div>
          )}
          {!rectified && tool === 'quad' && (
            <div className="space-y-2">
              <p className="text-[12px] text-slate-400">Tippe die 4 Ecken eines bekannten Rechtecks an (z. B. A4-Blatt unter dem Objekt). Das entfernt die Perspektivverzerrung.</p>
              <select
                value={preset}
                onChange={(e) => {
                  const p = PRESETS.find((x) => x.id === e.target.value)!;
                  setPreset(p.id);
                  setRw(p.w);
                  setRh(p.h);
                }}
                className="w-full h-9 rounded-md bg-[#0d1117] border border-[#30363d] text-sm text-slate-200 px-2"
              >
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <NumberInput value={rw} onChange={(v) => v && setRw(v)} unit="mm" min={1} />
                <NumberInput value={rh} onChange={(v) => v && setRh(v)} unit="mm" min={1} />
              </div>
              <Button variant="primary" className="w-full" disabled={pts.length !== 4} onClick={doRectify}>
                Entzerren ({pts.length}/4 Punkte)
              </Button>
            </div>
          )}
          {rectified && (
            <div className="flex items-center justify-between text-[12px] text-[#3ddc84]">
              <span>✓ Entzerrt · {pxPerMm?.toFixed(2)} px/mm</span>
              <button className="text-slate-400 underline" onClick={resetRect}>
                Original
              </button>
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-[#21262d] p-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">Konturerkennung</div>
            <Toggle label="Objekt ist heller als Hintergrund" checked={invert} onChange={setInvert} />
            <Toggle label="Schwelle automatisch" checked={autoThr} onChange={setAutoThr} />
            {!autoThr && <SliderRow label="Helligkeits-Schwelle" value={thr} min={1} max={254} step={1} onChange={setThr} />}
            <SliderRow label="Glättung" value={simp} min={0.05} max={2} step={0.05} unit="mm" onChange={setSimp} />
            <Toggle label="Maske anzeigen" checked={showMask} onChange={setShowMask} />
            {mm && pxPerMm ? (
              <p className="text-[12px] text-slate-300">
                Erkannt: <b>{mm.width.toFixed(1)} × {mm.height.toFixed(1)} mm</b>, {mm.outer.length} Punkte, {mm.holes.length} Loch/Löcher · Auflösung ≈ ±{(1 / pxPerMm).toFixed(2)} mm
              </p>
            ) : (
              <p className="text-[12px] text-amber-300/90">{!pxPerMm ? 'Zuerst Maßstab festlegen.' : 'Keine Kontur erkannt – Schwelle/Hell-Dunkel anpassen.'}</p>
            )}
          </div>

          <SliderRow label="Tiefe / Extrusion" value={depth} min={0.4} max={100} step={0.1} unit="mm" onChange={setDepth} />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
            placeholder="Optional für die KI: Was ist das? z. B. „Ersatz-Clip für Rollladen, Lasche 3 mm dick“"
            className="w-full rounded-lg bg-[#0d1117] border border-[#30363d] focus:border-[#00ae42] outline-none p-2.5 text-sm text-slate-100"
          />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={buildLocal} disabled={!mm}>
              Kontur → 3D
            </Button>
            <Button variant="primary" onClick={buildAi} disabled={!!state.busy}>
              ✨ KI-Analyse
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
