import { useEffect, useRef, useState } from 'react';
import type { FreePart } from '../cad/free';
import type { ModelDef, Value } from '../cad/types';
import { getImported, meshFromJson, meshToJson, registerImported } from '../mesh/importMesh';
import { b64ToBlob, cloudDelete, cloudGet, cloudList, cloudPut, cloudToken, photoToB64, sendPhoto, type CloudEntry } from '../platform/cloud';
import { freeBus } from '../state/freeBus';
import { useStore } from '../state/store';
import { Button } from './ui';

const ago = (t: number) => {
  const s = (Date.now() - t) / 1000;
  if (s < 90) return 'gerade eben';
  if (s < 3600) return `vor ${Math.round(s / 60)} min`;
  if (s < 86400) return `vor ${Math.round(s / 3600)} h`;
  return new Date(t).toLocaleDateString('de-DE');
};
const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1).replace('.', ',')} MB` : `${Math.round(n / 1000)} KB`);

interface ProjectFile {
  v: 1;
  model: ModelDef;
  values: Record<string, Value>;
  meshes?: ReturnType<typeof meshToJson>[];
}

/** Fotos und Projekte zwischen Handy und PC austauschen (privater GitHub-Gist als Zwischenablage). */
export function CloudPanel() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<CloudEntry[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const hasToken = !!cloudToken.get();

  const run = async (what: string, fn: () => Promise<void>) => {
    setBusy(what);
    setErr(null);
    try {
      await fn();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(null);
    }
  };
  const refresh = () => run('Lade Liste …', async () => setList(await cloudList()));
  useEffect(() => {
    if (open && hasToken) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hasToken, state.showSettings]);

  const uploadPhoto = (f: File | undefined) =>
    f &&
    run('Lade Foto hoch …', async () => {
      await cloudPut('foto', f.name.replace(/\.[^.]+$/, '') || 'Foto', await photoToB64(f));
      dispatch({ type: 'toast', kind: 'ok', text: 'Foto in der Ablage – am PC unter „☁️ Ablage“ öffnen' });
      setList(await cloudList());
    });
  const uploadProject = () =>
    run('Lade Projekt hoch …', async () => {
      const m = state.model;
      if (!m) return;
      const refs = new Set<string>([...(m.imports ?? []).map((i) => i.ref), ...((m.freeParts as FreePart[] | undefined) ?? []).filter((p) => p.kind === 'import').map((p) => String(p.e.ref))]);
      const meshes = [...refs].map((r) => getImported(r)).filter((x) => !!x).map((x) => meshToJson(x!));
      const data: ProjectFile = { v: 1, model: m, values: state.values, ...(meshes.length ? { meshes } : {}) };
      const name = window.prompt('Name in der Ablage:', m.name);
      if (name === null) return;
      await cloudPut('projekt', name || m.name, JSON.stringify(data));
      dispatch({ type: 'toast', kind: 'ok', text: 'Projekt in der Ablage – auf dem anderen Gerät öffnen' });
      setList(await cloudList());
    });
  const openEntry = (e: CloudEntry, target?: 'photo' | 'litho') =>
    run('Öffne …', async () => {
      const txt = await cloudGet(e);
      if (e.kind === 'foto') {
        const blob = b64ToBlob(txt);
        dispatch({ type: 'mode', mode: target ?? 'photo' });
        dispatch({ type: 'step', step: 'create' });
        setTimeout(() => sendPhoto(blob, target ?? 'photo'), 60);
        dispatch({ type: 'toast', kind: 'ok', text: `Foto „${e.name}“ geöffnet` });
        return;
      }
      const p = JSON.parse(txt) as ProjectFile;
      for (const m of p.meshes ?? []) await registerImported(meshFromJson(m));
      dispatch({ type: 'setModel', model: p.model, values: p.values });
      if (p.model.templateId === 'frei') {
        freeBus.send({ type: 'load', parts: (p.model.freeParts as FreePart[]) ?? [] });
        dispatch({ type: 'mode', mode: 'free' });
        dispatch({ type: 'step', step: 'create' });
      }
      dispatch({ type: 'toast', kind: 'ok', text: `Projekt „${e.name}“ geöffnet` });
    });
  const del = (e: CloudEntry) =>
    window.confirm(`„${e.name}“ aus der Ablage löschen?`) &&
    run('Lösche …', async () => {
      await cloudDelete(e);
      setList(await cloudList());
    });

  const small = 'h-8 px-2 rounded-md border border-[#30363d] text-[11.5px] text-slate-200 whitespace-nowrap';
  return (
    <div className="mx-4 mt-3 rounded-xl border border-[#30363d] bg-[#0d1117]">
      <button className="w-full flex items-center justify-between px-3 py-2.5 text-left" onClick={() => setOpen(!open)}>
        <span className="text-[13px] text-slate-200">☁️ Ablage – Handy ↔ PC</span>
        <span className="text-[11px] text-slate-500">{list ? `${list.length} Einträge` : ''} {open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2.5">
          {!hasToken ? (
            <>
              <p className="text-[12px] text-slate-400 leading-snug">
                Am Handy fotografieren, am PC weiterarbeiten (und umgekehrt). Gespeichert wird in einem <b className="text-slate-200">privaten</b> Speicher in deinem GitHub-Konto. Dafür einmal auf beiden Geräten
                denselben GitHub-Schlüssel eintragen.
              </p>
              <Button className="w-full" onClick={() => dispatch({ type: 'showSettings', on: true })}>
                🔑 Schlüssel in den Einstellungen eintragen
              </Button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1.5">
                <Button className="h-9 text-[12px]" onClick={() => camRef.current?.click()} disabled={!!busy}>
                  📷 Foto → Ablage
                </Button>
                <Button className="h-9 text-[12px]" onClick={() => fileRef.current?.click()} disabled={!!busy}>
                  🖼️ Bild → Ablage
                </Button>
                <Button className="h-9 text-[12px]" onClick={uploadProject} disabled={!!busy || !state.model}>
                  💾 Projekt → Ablage
                </Button>
                <Button className="h-9 text-[12px]" onClick={refresh} disabled={!!busy}>
                  🔄 Aktualisieren
                </Button>
              </div>
              <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => (uploadPhoto(e.target.files?.[0]), (e.target.value = ''))} />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => (uploadPhoto(e.target.files?.[0]), (e.target.value = ''))} />
              {busy && <div className="text-[12px] text-slate-400">{busy}</div>}
              {err && <div className="text-[12px] text-red-300">⚠ {err}</div>}
              {list && !list.length && <div className="text-[12px] text-slate-500">Noch leer.</div>}
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {list?.map((e) => (
                  <div key={e.file} className="rounded-lg border border-[#30363d] p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{e.kind === 'foto' ? '📷' : '📦'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] text-slate-100 truncate">{e.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {ago(e.time)} · {kb(e.size)}
                        </div>
                      </div>
                      <button className="h-8 px-2 rounded-md border border-[#5c1d24] text-red-300 text-[11.5px]" onClick={() => del(e)} disabled={!!busy}>
                        🗑
                      </button>
                    </div>
                    <div className="flex gap-1.5 mt-1.5">
                      {e.kind === 'foto' ? (
                        <>
                          <button className={small} onClick={() => openEntry(e, 'photo')} disabled={!!busy}>
                            📐 Nachbauen
                          </button>
                          <button className={small} onClick={() => openEntry(e, 'litho')} disabled={!!busy}>
                            🖼️ Lithophanie
                          </button>
                        </>
                      ) : (
                        <button className={small} onClick={() => openEntry(e)} disabled={!!busy}>
                          📂 Öffnen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
