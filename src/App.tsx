import { Component, useEffect, useMemo, useRef, useState, useSyncExternalStore, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { repairWithAi } from './ai/providers';
import { CodeDialog, SettingsDialog } from './components/Dialogs';
import { ColorPanel, EmptyState, ExportPanel, Library, MaterialPanel, OptimizePanel, ParamPanel, PrintCheck, SplitPanel, ToleranceCalibration } from './components/ModelPanels';
import { ContextMenu } from './components/ContextMenu';
import { AssemblyPanel, PlateBar } from './components/AssemblyPanel';
import { asmSettings, assembledParts } from './state/assemblyBuild';
import { EditPanel } from './components/EditPanel';
import { freeBus, useFreeSnapshot } from './state/freeBus';
import { FreeMode } from './components/FreeMode';
import { PhotoMode } from './components/PhotoMode';
import { abortRef, TextMode } from './components/TextMode';
import { Button, cx, SliderRow, useMedia } from './components/ui';
import { checkApkUpdate, isNativeApp, openApkDownload } from './platform/native';
import { explodedParts, runPipeline } from './state/pipeline';
import { useStore, type Mode, type Step } from './state/store';
import { Viewer } from './viewer/Viewer';
import { importVersion, loadImported, subscribeImports } from './mesh/importMesh';

// ------------------------------------------------------------ Installation (PWA)
interface BIPEvent extends Event {
  prompt: () => Promise<void>;
}
function useInstall() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  return evt;
}

function TopBar() {
  const { state, dispatch } = useStore();
  const install = useInstall();
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(navigator as { standalone?: boolean }).standalone;
  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-3 sm:px-4 border-b border-[#21262d] bg-[#0d1117]/95 backdrop-blur z-20" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden>
          <path d="M32 4 58 18v28L32 60 6 46V18Z" fill="#00ae42" />
          <path d="M32 4 58 18 32 32 6 18Z" fill="#3ddc84" />
          <path d="M32 32v28L6 46V18Z" fill="#008f36" />
        </svg>
        <div className="leading-tight">
          <div className="text-[15px] font-bold text-white tracking-tight">Formwerk CAD</div>
          <div className="text-[10px] text-slate-500 hidden sm:block">parametrisch · wasserdicht · millimetergenau</div>
        </div>
      </div>
      <div className="flex-1 min-w-0 text-center hidden md:block">
        <span className="text-[13px] text-slate-400 truncate">{state.model?.name}</span>
        {state.building && <span className="ml-2 text-[11px] text-[#3ddc84] animate-pulse">berechne …</span>}
      </div>
      <div className="flex-1 md:hidden" />
      {install && (
        <button onClick={() => install.prompt()} className="h-9 px-3 rounded-lg bg-[#00ae42] text-white text-[13px] font-medium">
          ⤓ Installieren
        </button>
      )}
      {ios && !install && (
        <button
          onClick={() => dispatch({ type: 'toast', kind: 'info', text: 'Installieren auf iPhone/iPad: Teilen-Symbol ⬆︎ → „Zum Home-Bildschirm“.' })}
          className="h-9 px-3 rounded-lg border border-[#30363d] text-slate-300 text-[13px]"
        >
          ⤓ App
        </button>
      )}
      <button onClick={() => dispatch({ type: 'showCode', on: true })} className="h-9 px-3 rounded-lg border border-[#30363d] text-slate-300 hover:text-white text-[13px]" title="Code anzeigen">
        {'</>'}
      </button>
      <button onClick={() => dispatch({ type: 'showSettings', on: true })} className="h-9 w-9 rounded-lg border border-[#30363d] text-slate-300 hover:text-white" title="Einstellungen">
        ⚙
      </button>
    </header>
  );
}

const MODES: { m: Mode; icon: string; label: string; sub: string }[] = [
  { m: 'text', icon: '✍️', label: 'Beschreiben', sub: 'In Worten sagen, was du brauchst' },
  { m: 'photo', icon: '📷', label: 'Foto', sub: 'Teil abfotografieren & nachbauen' },
  { m: 'library', icon: '📚', label: 'Vorlagen', sub: 'Fertige Modelle anpassen' },
  { m: 'free', icon: '✏️', label: 'Frei bauen', sub: 'Aus Formen zusammensetzen' },
];

const STEPS: { s: Step; n: number; label: string }[] = [
  { s: 'create', n: 1, label: 'Erstellen' },
  { s: 'adjust', n: 2, label: 'Anpassen' },
  { s: 'print', n: 3, label: 'Drucken' },
];

/** Kopfzeile mit den drei Schritten: Erstellen → Anpassen → Drucken */
function StepNav() {
  const { state, dispatch } = useStore();
  const has = !!state.model;
  return (
    <div className="sticky top-0 z-10 bg-[#161b22]/95 backdrop-blur border-b border-[#21262d] px-3 py-2.5">
      <div className="grid grid-cols-3 gap-1.5">
        {STEPS.map(({ s, n, label }) => {
          const active = state.step === s;
          const disabled = s !== 'create' && !has;
          const done = has && ((s === 'create' && state.step !== 'create') || (s === 'adjust' && state.step === 'print'));
          return (
            <button
              key={s}
              disabled={disabled}
              onClick={() => dispatch({ type: 'step', step: s })}
              className={cx(
                'h-11 rounded-xl border flex items-center justify-center gap-2 text-[13.5px] font-semibold transition-colors disabled:opacity-35',
                active ? 'bg-[#00ae42] border-[#00ae42] text-white' : 'bg-[#0d1117] border-[#30363d] text-slate-300 hover:border-[#4b5563]',
              )}
            >
              <span className={cx('w-5 h-5 rounded-full text-[11px] flex items-center justify-center', active ? 'bg-white/25' : done ? 'bg-[#00ae42] text-white' : 'bg-[#30363d]')}>
                {done && !active ? '✓' : n}
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Kurze Anleitung beim ersten Öffnen */
function Welcome() {
  const [show, setShow] = useState(() => {
    try {
      return !localStorage.getItem('formwerk-cad:welcome');
    } catch {
      return true;
    }
  });
  if (!show) return null;
  const close = () => {
    setShow(false);
    try {
      localStorage.setItem('formwerk-cad:welcome', '1');
    } catch {
      /* egal */
    }
  };
  return (
    <div className="mx-4 mt-4 rounded-xl border border-[#00ae42]/50 bg-[#00ae42]/5 p-3.5 text-[13px] text-slate-200 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <b className="text-white">So einfach geht's</b>
        <button onClick={close} className="text-slate-400 hover:text-white -mt-0.5">
          ✕
        </button>
      </div>
      <ol className="space-y-1 text-[12.5px] text-slate-300">
        <li>
          <b className="text-white">1 Erstellen</b> – beschreiben, Foto, Vorlage oder frei bauen
        </li>
        <li>
          <b className="text-white">2 Anpassen</b> – Maße mit Reglern einstellen
        </li>
        <li>
          <b className="text-white">3 Drucken</b> – prüfen und als 3MF für Bambu Studio speichern
        </li>
      </ol>
      <button onClick={close} className="text-[12px] text-[#3ddc84] underline">
        Verstanden
      </button>
    </div>
  );
}

function NextButton({ to, label }: { to: Step; label: string }) {
  const { dispatch } = useStore();
  return (
    <div className="p-4">
      <Button variant="primary" className="w-full h-11" onClick={() => dispatch({ type: 'step', step: to })}>
        {label}
      </Button>
    </div>
  );
}

function PanelContent() {
  const { state, dispatch } = useStore();
  const [repairing, setRepairing] = useState(false);
  const isFree = state.model?.templateId === 'frei';
  const step = state.step;
  const repair = async () => {
    if (!state.model || !state.buildError) return;
    setRepairing(true);
    try {
      const m = await repairWithAi(state.model, state.buildError, state.settings.ai);
      dispatch({ type: 'setModel', model: m });
      dispatch({ type: 'toast', kind: 'ok', text: 'Modell repariert' });
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    } finally {
      setRepairing(false);
    }
  };
  const current = MODES.find((x) => x.m === state.mode)!;
  return (
    <>
      <StepNav />
      <PlateBar />
      {state.buildError && (
        <div className="m-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-[13px] text-red-200 space-y-2">
          <div>
            <b>Modell kann nicht gebaut werden:</b> {state.buildError}
          </div>
          {state.model && state.model.source !== 'template' && state.model.templateId !== 'frei' && (
            <button onClick={repair} disabled={repairing} className="text-[12px] underline text-red-100">
              {repairing ? 'KI repariert …' : 'Von der KI reparieren lassen'}
            </button>
          )}
        </div>
      )}

      {/* ---------- Schritt 1: Erstellen (Inhalte bleiben eingehängt, damit nichts verloren geht) ---------- */}
      <div className={step === 'create' ? '' : 'hidden'}>
        <Welcome />
        <div className="px-4 pt-4 pb-4">
          <div className="text-[12px] text-slate-400 mb-2">Wie möchtest du dein Teil erstellen?</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {MODES.map((x) => (
              <button
                key={x.m}
                onClick={() => dispatch({ type: 'mode', mode: x.m })}
                className={cx(
                  'text-left rounded-xl border p-2.5 transition-colors',
                  state.mode === x.m ? 'border-[#00ae42] bg-[#00ae42]/10' : 'border-[#30363d] bg-[#0d1117] hover:border-[#4b5563]',
                )}
              >
                <div className="text-[14px] font-semibold text-white">
                  {x.icon} {x.label}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug mt-0.5">{x.sub}</div>
              </button>
            ))}
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3ddc84] mb-3">
            {current.icon} {current.label}
          </div>
          <div className={state.mode === 'text' ? '' : 'hidden'}>
            <TextMode />
          </div>
          <div className={state.mode === 'photo' ? '' : 'hidden'}>
            <PhotoMode />
          </div>
          <div className={state.mode === 'library' ? '' : 'hidden'}>
            <Library />
          </div>
          <div className={state.mode === 'free' ? '' : 'hidden'}>
            <FreeMode />
          </div>
        </div>
        {state.model && state.mode !== 'free' && <NextButton to="adjust" label="Weiter: Anpassen →" />}
        {state.model && state.mode === 'free' && <NextButton to="print" label="Weiter: Drucken →" />}
      </div>

      {/* ---------- Schritt 2: Anpassen ---------- */}
      {step === 'adjust' && (
        <>
          <EmptyState />
          {isFree ? (
            <div className="m-4 rounded-xl border border-[#30363d] p-4 text-[13px] text-slate-300 space-y-3">
              <p>Dieses Modell ist frei gebaut. Teile, Maße und Position änderst du direkt im Baukasten.</p>
              <Button
                className="w-full"
                onClick={() => {
                  dispatch({ type: 'mode', mode: 'free' });
                  dispatch({ type: 'step', step: 'create' });
                }}
              >
                ✏️ Zum Baukasten
              </Button>
            </div>
          ) : (
            <>
              {state.model?.templateId === 'toleranztest' && (
                <div className="px-4 pt-3">
                  <ToleranceCalibration compact />
                </div>
              )}
              <ParamPanel />
              <EditPanel />
            </>
          )}
          {state.model && <NextButton to="print" label="Weiter: Drucken →" />}
        </>
      )}

      {/* ---------- Schritt 3: Drucken ---------- */}
      {step === 'print' && (
        <>
          <EmptyState />
          <PrintCheck />
          <OptimizePanel />
          <ExportPanel />
          <AssemblyPanel />
          <div className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Erweitert (optional)</div>
          <MaterialPanel />
          <ColorPanel />
          <SplitPanel />
        </>
      )}
      <div className="h-24 lg:h-6" />
    </>
  );
}

function ViewToggles() {
  const { state, dispatch } = useStore();
  const v = state.view;
  const t = (k: 'dims' | 'xray' | 'section' | 'overhangs', label: string) => (
    <button
      onClick={() => dispatch({ type: 'view', patch: { [k]: !v[k] } })}
      className={cx('h-8 px-2.5 rounded-lg border text-[12px] backdrop-blur', v[k] ? 'bg-[#00ae42]/20 border-[#00ae42] text-white' : 'bg-[#161b22]/90 border-[#30363d] text-slate-400')}
    >
      {label}
    </button>
  );
  return (
    <div className="absolute top-3 left-3 z-10 space-y-2 max-w-[calc(100%-5rem)]">
      <div className="flex flex-wrap gap-1.5">
        {t('dims', '📏 Maße')}
        {t('xray', '🩻 X-Ray')}
        {t('section', '✂ Schnitt')}
        {t('overhangs', '⚠ Überhänge')}
        {state.asm.items.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'asmView', view: state.asm.view === 'off' ? 'assembled' : state.asm.view === 'assembled' ? 'exploded' : 'off' })}
            className={cx('h-8 px-2.5 rounded-lg border text-[12px] backdrop-blur', state.asm.view !== 'off' ? 'bg-[#00ae42]/20 border-[#00ae42] text-white' : 'bg-[#161b22]/90 border-[#30363d] text-slate-400')}
          >
            {state.asm.view === 'exploded' ? '💥 Auseinander' : state.asm.view === 'assembled' ? '🧩 Zusammen' : `🧩 Baugruppe (${state.asm.items.length})`}
          </button>
        )}
      </div>
      {v.section && (
        <div className="w-64 rounded-lg bg-[#161b22]/95 border border-[#30363d] p-2.5 space-y-2 backdrop-blur">
          <div className="grid grid-cols-3 gap-1">
            {(['x', 'y', 'z'] as const).map((a) => (
              <button
                key={a}
                onClick={() => dispatch({ type: 'view', patch: { sectionAxis: a } })}
                className={cx('h-7 rounded-md text-[12px] uppercase', v.sectionAxis === a ? 'bg-[#1f2630] text-white' : 'text-slate-400')}
              >
                {a}
              </button>
            ))}
          </div>
          <SliderRow label="Position" value={Math.round(v.sectionPos * 100)} min={0} max={100} step={1} unit="%" onChange={(x) => dispatch({ type: 'view', patch: { sectionPos: x / 100 } })} />
        </div>
      )}
      {state.build?.plates && (
        <div className="inline-flex rounded-lg bg-[#161b22]/95 border border-[#30363d] text-[12px] px-2.5 py-1.5 text-slate-300">
          {v.plate > 0 ? `Druckplatte ${v.plate} / ${state.build.plates.length}` : `Zusammenbau · ${state.build.plates.length} Platten`}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------ Bottom-Sheet (Smartphone)
function BottomSheet({ children }: { children: ReactNode }) {
  const snaps = () => [150, window.innerHeight * 0.55, window.innerHeight * 0.9];
  const [h, setH] = useState(() => snaps()[1]);
  const drag = useRef<{ y: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const onDown = (e: RPointerEvent) => {
    drag.current = { y: e.clientY, h };
    setDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: RPointerEvent) => {
    if (!drag.current) return;
    setH(Math.max(110, Math.min(window.innerHeight * 0.94, drag.current.h + (drag.current.y - e.clientY))));
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    const s = snaps();
    setH(s.reduce((a, b) => (Math.abs(b - h) < Math.abs(a - h) ? b : a)));
  };
  return (
    <div
      className={cx('fixed left-0 right-0 bottom-0 z-30 bg-[#161b22] border-t border-[#30363d] rounded-t-2xl shadow-[0_-12px_40px_rgba(0,0,0,.5)] flex flex-col', !dragging && 'transition-[height] duration-200')}
      style={{ height: h, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="shrink-0 pt-2 pb-1.5 cursor-grab touch-none" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onDoubleClick={() => setH(h > snaps()[1] ? snaps()[0] : snaps()[2])}>
        <div className="mx-auto w-11 h-1.5 rounded-full bg-[#4b5563]" />
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </div>
  );
}

/** Web-Inhalte aktualisieren sich automatisch; eine neue APK wird hier angeboten. */
function UpdateBanner() {
  const [build, setBuild] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!isNativeApp()) return;
    checkApkUpdate().then(setBuild);
  }, []);
  if (!build || hidden) return null;
  return (
    <div className="fixed left-3 right-3 top-16 z-[58] rounded-xl border border-[#00ae42] bg-[#0d1117]/95 backdrop-blur p-3 flex items-center gap-3 shadow-xl">
      <div className="flex-1 text-[13px] text-slate-200">
        <b>App-Update verfügbar</b> (Build {build}). Android fragt einmal nach Bestätigung, deine Einstellungen bleiben erhalten.
      </div>
      <button onClick={() => openApkDownload()} className="h-9 px-3 rounded-lg bg-[#00ae42] text-white text-[13px] font-medium shrink-0">
        Installieren
      </button>
      <button onClick={() => setHidden(true)} className="text-slate-500 px-1">
        ✕
      </button>
    </div>
  );
}

function Toast() {
  const { state, dispatch } = useStore();
  if (!state.toast) return null;
  const c = { ok: 'border-[#00ae42] text-[#d3f9e0]', err: 'border-red-500 text-red-100', info: 'border-[#4dabf7] text-sky-100' }[state.toast.kind];
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-16 z-[60] max-w-[92vw] w-max">
      <div className={cx('rounded-xl border bg-[#0d1117]/95 backdrop-blur px-4 py-2.5 text-[13px] shadow-xl', c)} onClick={() => dispatch({ type: 'clearToast' })}>
        {state.toast.text}
      </div>
    </div>
  );
}

function Busy() {
  const { state } = useStore();
  if (!state.busy) return null;
  return (
    <div className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-6">
      <div className="rounded-2xl bg-[#161b22] border border-[#30363d] p-6 w-full max-w-sm text-center space-y-4">
        <div className="mx-auto w-10 h-10 rounded-full border-4 border-[#30363d] border-t-[#00ae42] animate-spin" />
        <p className="text-sm text-slate-200">{state.busy}</p>
        <button className="text-[13px] text-slate-400 underline" onClick={() => abortRef.current?.abort()}>
          Abbrechen
        </button>
      </div>
    </div>
  );
}

/** Fängt Fehler der 3D-Ansicht ab (z. B. kein WebGL), damit Eingabe & Export weiter funktionieren. */
class ViewerBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  render() {
    if (this.state.error)
      return (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-400">
          <div>
            <p className="text-slate-200 font-medium">3D-Vorschau nicht verfügbar</p>
            <p className="mt-1">WebGL wird von diesem Gerät/Browser nicht unterstützt ({this.state.error}). Parameter, Druck-Check und Export funktionieren trotzdem.</p>
          </div>
        </div>
      );
    return this.props.children;
  }
}

export function App() {
  const { state, dispatch } = useStore();
  const desktop = useMedia('(min-width: 1024px)');
  const s = state.settings;
  // Importierte Dateien (STL/3MF) aus dem Gerätespeicher laden; danach neu bauen
  const importVer = useSyncExternalStore(subscribeImports, importVersion, importVersion);
  useEffect(() => {
    void loadImported();
  }, []);

  // Zu groß fürs Druckbett → automatisch auf mehrere Platten teilen (mit Verbindern).
  // Schaltet der Nutzer das Teilen selbst aus, wird es für dieses Modell nicht erneut erzwungen.
  const autoSplit = useRef(false);
  const ourToggle = useRef(false);
  const dismissedFor = useRef(-1);
  useEffect(() => {
    if (!s.split.enabled && autoSplit.current) {
      if (!ourToggle.current) dismissedFor.current = state.modelVersion;
      autoSplit.current = false;
    }
    ourToggle.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.split.enabled]);
  useEffect(() => {
    const b = state.build;
    if (!b || !state.model || state.building) return;
    if (!s.split.enabled && !b.fitsBed && !state.model.imports?.length && dismissedFor.current !== state.modelVersion) {
      const t = b.total;
      autoSplit.current = true;
      ourToggle.current = true;
      dispatch({ type: 'settings', patch: { split: { ...s.split, enabled: true, cuts: [0, 0, 0] } } });
      const j = s.split.joint === 'duebel' ? 'Dübeln' : s.split.joint === 'kleben' ? 'Klebeflächen' : 'Steckzapfen';
      dispatch({
        type: 'toast',
        kind: 'info',
        text: `Zu groß fürs Druckbett (${Math.round(t.max[0] - t.min[0])} × ${Math.round(t.max[1] - t.min[1])} × ${Math.round(t.max[2] - t.min[2])} mm) – automatisch geteilt, mit ${j}. Ändern in Schritt 3 „Aufteilen“.`,
      });
    } else if (s.split.enabled && autoSplit.current && b.pieces && b.pieces.filter((p) => p.kind === 'segment').length <= 1) {
      // passt wieder aufs Bett → Teilen wieder aus
      ourToggle.current = true;
      dispatch({ type: 'settings', patch: { split: { ...s.split, enabled: false } } });
      dispatch({ type: 'toast', kind: 'ok', text: 'Passt wieder aufs Druckbett – Aufteilen ausgeschaltet' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.build]);

  // Modell bei jeder Änderung neu berechnen (entprellt)
  useEffect(() => {
    if (!state.model) return;
    dispatch({ type: 'buildStart' });
    const t = setTimeout(() => {
      try {
        const r = runPipeline(state.model!, state.values, {
          globals: { tol: s.tol, fase: s.fase },
          orientation: state.orientation,
          zones: state.zonesOn ? state.zones : null,
          palette: s.palette,
          material: s.material,
          profile: s.profile,
          layer: s.layer,
          overhangDeg: s.overhangDeg,
          bedSize: s.bedSize,
          bedHeight: s.bedHeight,
          split: s.split,
          hollow: s.hollow,
        });
        dispatch({ type: 'buildOk', build: r });
      } catch (e) {
        console.error(e);
        dispatch({ type: 'buildErr', error: (e as Error).message });
      }
    }, 90);
    return () => clearTimeout(t);
  }, [importVer, state.model, state.values, state.orientation, state.zonesOn, state.zones, s.tol, s.fase, s.palette, s.material, s.profile, s.layer, s.overhangDeg, s.bedSize, s.bedHeight, s.split, s.hollow, dispatch]);

  const b = state.build;
  const asmOn = state.asm.view !== 'off' && state.asm.items.length > 0;
  const asmDisplay = useMemo(() => {
    if (!asmOn) return null;
    try {
      return assembledParts(state.asm.items, asmSettings(s), state.asm.view === 'exploded' ? 30 : 0);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [asmOn, state.asm.items, state.asm.view, s, importVer]);
  const display = useMemo(() => {
    if (asmDisplay) return asmDisplay;
    if (!b) return null;
    if (b.plates && state.view.plate > 0) return b.plates.find((p) => p.index === state.view.plate)?.items.flatMap((it) => it.parts) ?? null;
    if (b.pieces) return explodedParts(b.pieces);
    return b.parts;
  }, [b, state.view.plate, asmDisplay]);
  // Frei bauen: Teile in der 3D-Ansicht anklickbar machen
  const freeSnap = useFreeSnapshot();
  const overlay = useMemo(() => {
    if (asmOn || state.mode !== 'free' || state.model?.templateId !== 'frei' || !b || b.pieces || state.orientation.rx || state.orientation.ry) return null;
    return { parts: freeSnap.parts, sel: freeSnap.sel, offset: b.placement.t };
  }, [state.mode, state.model, b, freeSnap, state.orientation, asmOn]);
  const viewKey = state.modelVersion * 100 + state.view.plate + 1 + (b?.pieces ? 50 : 0) + (asmOn ? 30 + (state.asm.view === 'exploded' ? 10 : 0) + state.asm.items.length * 1000 : 0);

  return (
    <div className="h-[100dvh] flex flex-col bg-[#0d1117] text-slate-200 overflow-hidden">
      <TopBar />
      <div className="flex-1 min-h-0 flex">
        {desktop && (
          <aside className="w-[420px] xl:w-[460px] shrink-0 border-r border-[#21262d] bg-[#161b22] overflow-y-auto">
            <PanelContent />
          </aside>
        )}
        <main className="flex-1 min-w-0 relative">
          <ViewerBoundary>
            <Viewer
              parts={display}
              view={state.view}
              bedSize={s.bedSize}
              modelVersion={viewKey}
              overlay={overlay}
              onPick={(id, additive) => freeBus.send({ type: 'select', ids: id === null ? [] : [id], additive })}
              onTransform={(t) => freeBus.send({ type: 'transform', ...t })}
              onMenu={(id, x, y, at) => {
                if (id !== null && !freeBus.get().sel.includes(id)) freeBus.send({ type: 'select', ids: [id] });
                freeBus.openMenu({ x, y, id, at });
              }}
            />
          </ViewerBoundary>
          <ViewToggles />
        </main>
      </div>
      {!desktop && (
        <BottomSheet>
          <PanelContent />
        </BottomSheet>
      )}
      <SettingsDialog />
      <CodeDialog />
      <Busy />
      <UpdateBanner />
      <ContextMenu />
      <Toast />
    </div>
  );
}
