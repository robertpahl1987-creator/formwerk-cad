import type { FreePart } from '../cad/free';
import { freeBus } from '../state/freeBus';
import { myParts } from '../state/myParts';
import { discardSavedProject, useStore } from '../state/store';

const ago = (t?: number) => {
  if (!t) return '';
  const s = (Date.now() - t) / 1000;
  if (s < 3600) return `vor ${Math.max(1, Math.round(s / 60))} min`;
  if (s < 86400) return `vor ${Math.round(s / 3600)} h`;
  return `am ${new Date(t).toLocaleDateString('de-DE')}`;
};

/** Beim Öffnen: letztes Projekt fortsetzen, sichern oder neu beginnen. */
export function ResumeDialog() {
  const { state, dispatch } = useStore();
  const r = state.resume;
  if (!r) return null;
  const clearFree = () => {
    if (r.model.templateId === 'frei') freeBus.send({ type: 'load', parts: [] as FreePart[] });
  };
  const fresh = () => {
    discardSavedProject();
    clearFree();
    dispatch({ type: 'resumeDismiss' });
  };
  const saveAndFresh = () => {
    const name = window.prompt('Name für „Meine Teile“:', r.model.name);
    if (name === null) return;
    try {
      myParts.add(name, r.model, r.values);
      dispatch({ type: 'toast', kind: 'ok', text: `„${name || r.model.name}“ gespeichert – unter Erstellen → Vorlagen → Meine Teile` });
      fresh();
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    }
  };
  const btn = 'w-full h-11 rounded-lg text-[14px] font-medium';
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#30363d] bg-[#161b22] p-5 space-y-3 shadow-2xl">
        <div className="text-[16px] font-semibold text-white">Letztes Projekt gefunden</div>
        <p className="text-[13px] text-slate-300 leading-snug">
          „{r.model.name}“ {ago(r.at)} – möchtest du daran weiterarbeiten oder neu beginnen?
        </p>
        <button className={`${btn} bg-[#00ae42] text-white`} onClick={() => dispatch({ type: 'resumeAccept' })}>
          ▶ Weiterarbeiten
        </button>
        <button className={`${btn} border border-[#30363d] text-slate-200`} onClick={saveAndFresh}>
          ⭐ In „Meine Teile“ speichern & neu beginnen
        </button>
        <button className={`${btn} border border-[#30363d] text-slate-400`} onClick={fresh}>
          Neu beginnen (nicht speichern)
        </button>
      </div>
    </div>
  );
}
