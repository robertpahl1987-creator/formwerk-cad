import { useState } from 'react';
import { canvasToDataUri, photoTo3d } from '../ai/meshy';
import { parseMeshBuffer, readMeshFile, registerImported, type ImportedMesh } from '../mesh/importMesh';
import { isNativeApp, nativeSave, openExternal } from '../platform/native';
import { loadImageToCanvas } from '../photo/vision';
import { useStore } from '../state/store';
import { abortRef } from './TextMode';
import { Button } from './ui';

/**
 * Echte 3D-Form aus 1–4 Fotos (Meshy-KI): für Figuren, Tiere, Deko – alles, was sich
 * nicht aus Grundformen bauen lässt. Ergebnis wird auf die gewünschte Höhe skaliert.
 */
const MAKERLAB = 'https://makerworld.com/makerlab/imageTo3d';
/** Android graut STL/3MF bei festem Dateityp aus → dort alle Dateien zulassen */
const ANDROID = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

export function MeshyCard({ photo }: { photo: HTMLCanvasElement }) {
  const { state, dispatch } = useStore();
  const [extra, setExtra] = useState<HTMLCanvasElement[]>([]);
  const [height, setHeight] = useState(60);
  const [route, setRoute] = useState<'makerworld' | 'meshy'>('makerworld');
  const key = state.settings.ai.meshyKey ?? '';

  /** Fertiges Netz als Modell übernehmen, auf die gewünschte Höhe skaliert */
  const adopt = (im: ImportedMesh, how: string) => {
    const s = height > 0 && im.size[2] > 0 ? height / im.size[2] : 1;
    const size: [number, number, number] = [im.size[0] * s, im.size[1] * s, im.size[2] * s];
    dispatch({
      type: 'setModel',
      model: {
        name: 'Modell aus Foto',
        description: `${how}, ${size.map((v) => Math.round(v)).join(' × ')} mm. Größe über ⤢ Skalieren anpassen.`,
        params: [],
        root: [],
        source: 'photo',
        imports: [{ ref: im.id, name: 'Modell aus Foto', slot: 1, pos: [0, 0, 0], rot: [0, 0, 0], size }],
      },
      values: {},
    });
    dispatch({ type: 'toast', kind: 'ok', text: 'Echte 3D-Form übernommen – im Schritt „Drucken“ prüfen (Stützen meist nötig)' });
  };

  const savePhoto = async () => {
    const blob: Blob = await new Promise((res) => photo.toBlob((b) => res(b!), 'image/jpeg', 0.92));
    if (isNativeApp()) return nativeSave('foto-fuer-makerworld.jpg', blob);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'foto-fuer-makerworld.jpg';
    a.click();
  };
  const importFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      adopt(await readMeshFile(f), `Aus MakerWorld „Image to 3D“ übernommen (${f.name})`);
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    }
  };

  const addPhoto = async (f: File | undefined) => {
    if (!f) return;
    try {
      const c = await loadImageToCanvas(f);
      setExtra((x) => [...x, c].slice(0, 3));
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    }
  };

  const run = async () => {
    const ac = new AbortController();
    abortRef.current = ac;
    dispatch({ type: 'busy', text: 'Fotos werden vorbereitet …' });
    try {
      const imgs = [photo, ...extra].map((c) => canvasToDataUri(c));
      const buf = await photoTo3d(imgs, key, { signal: ac.signal, onStatus: (t) => dispatch({ type: 'busy', text: t }) });
      const im = await parseMeshBuffer('Foto-Modell', 'stl', buf);
      await registerImported(im);
      adopt(im, `Aus ${imgs.length} Foto${imgs.length > 1 ? 's' : ''} mit Meshy-KI erzeugt`);
    } catch (e) {
      if (!ac.signal.aborted) dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    } finally {
      dispatch({ type: 'busy', text: null });
      abortRef.current = null;
    }
  };

  return (
    <div className="rounded-xl border border-[#00ae42]/60 bg-[#00ae42]/5 p-3 space-y-2.5">
      <div className="text-[13.5px] font-medium text-white">🪄 Echte 3D-Form aus dem Foto</div>
      <p className="text-[12px] text-slate-300 leading-snug">
        Für Figuren, Tiere, Deko und alles Organische: eine 3D-KI formt das Objekt so nach, wie es auf dem Foto aussieht.
      </p>
      <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#0d1117] border border-[#21262d]">
        {(
          [
            ['makerworld', '🟢 MakerWorld'],
            ['meshy', '🔑 Meshy direkt'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} className={`h-8 rounded-md text-[12px] ${route === id ? 'bg-[#00ae42] text-white' : 'text-slate-300'}`} onClick={() => setRoute(id)}>
            {label}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-[12.5px] text-slate-300">
        Höhe des Gegenstands
        <input
          inputMode="decimal"
          className="w-20 h-8 rounded-md bg-[#0d1117] border border-[#30363d] px-2 text-[13px] text-slate-100"
          value={height}
          onChange={(e) => setHeight(Math.max(5, Math.min(250, parseFloat(e.target.value.replace(',', '.')) || 0)))}
        />
        mm
      </label>
      {route === 'makerworld' ? (
        <div className="space-y-2">
          <p className="text-[12px] text-slate-300 leading-snug">
            Bambu Labs MakerWorld wandelt das Foto um (Tripo, Hunyuan, Meshy u. a. zur Auswahl). Jedes Konto hat Gratis-Versuche, danach kostet es MakerLab-Credits.
          </p>
          <ol className="text-[12px] text-slate-300 space-y-1.5 list-decimal pl-4">
            <li>
              <button className="underline text-[#3ddc84]" onClick={savePhoto}>
                Foto speichern
              </button>{' '}
              (falls es nicht schon in der Galerie ist)
            </li>
            <li>
              <button className="underline text-[#3ddc84]" onClick={() => openExternal(MAKERLAB)}>
                MakerWorld „Image to 3D“ öffnen
              </button>
              , anmelden, Foto hochladen, Modell erzeugen und als STL oder 3MF herunterladen
            </li>
            <li>Zurück hierher und die Datei übernehmen:</li>
          </ol>
          <label className="h-10 rounded-lg bg-[#00ae42] text-white text-[13.5px] font-medium flex items-center justify-center gap-2 cursor-pointer">
            📥 Fertiges Modell übernehmen
            <input type="file" accept={ANDROID ? undefined : '.stl,.3mf,.obj'} className="hidden" onChange={(e) => (importFile(e.target.files?.[0]), (e.target.value = ''))} />
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[12px] text-slate-300 leading-snug">Läuft direkt in der App, ohne Umweg – braucht aber einen Meshy-API-Schlüssel (nur mit bezahltem Meshy-Abo). Mit Fotos von der Seite und hinten wird es genauer.</p>
          <div className="flex gap-1.5 items-center">
            {[photo, ...extra].map((c, i) => (
              <img key={i} src={c.toDataURL('image/jpeg', 0.5)} alt="" className="w-12 h-12 object-cover rounded-md border border-[#30363d]" />
            ))}
            {extra.length < 3 && (
              <label className="w-12 h-12 rounded-md border border-dashed border-[#30363d] text-slate-400 text-[20px] flex items-center justify-center cursor-pointer" title="Weiteres Foto (andere Seite)">
                +
                <input type="file" accept="image/*" className="hidden" onChange={(e) => (addPhoto(e.target.files?.[0]), (e.target.value = ''))} />
              </label>
            )}
            {extra.length > 0 && (
              <button className="text-[11px] text-slate-400 ml-auto" onClick={() => setExtra([])}>
                Zusatzfotos weg
              </button>
            )}
          </div>
          {key ? (
            <Button variant="primary" className="w-full" onClick={run} disabled={!!state.busy}>
              🪄 3D-Form erzeugen (1–4 Min.)
            </Button>
          ) : (
            <Button className="w-full" onClick={() => dispatch({ type: 'showSettings', on: true })}>
              🔑 Meshy-Schlüssel eintragen
            </Button>
          )}
        </div>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">Tipp: Gegenstand vor ruhigem Hintergrund, gut ausgeleuchtet, ganz im Bild.</p>
    </div>
  );
}
