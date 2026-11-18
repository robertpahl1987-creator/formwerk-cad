import { useEffect, useRef, useState } from 'react';
import { hashId, registerImported, weldTriangles } from '../mesh/importMesh';
import { DEFAULT_LITHO, lithoSoup, sampleImage, type LithoOptions } from '../photo/litho';
import { useStore } from '../state/store';
import { PHOTO_EVENT } from '../platform/cloud';
import { Button, SliderRow, Toggle } from './ui';

/** Lithophanie: Foto wählen, Größe/Stärke einstellen, als druckbares Relief erzeugen. */
export function LithoMode() {
  const { state, dispatch } = useStore();
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [o, setO] = useState<LithoOptions>(DEFAULT_LITHO);
  const [standing, setStanding] = useState(true);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url]);
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent<{ blob: Blob; target: string }>).detail;
      if (d.target === 'litho') pick(d.blob);
    };
    window.addEventListener(PHOTO_EVENT, h);
    return () => window.removeEventListener(PHOTO_EVENT, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (f: Blob | undefined) => {
    if (!f) return;
    const u = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      setImg(im);
      setUrl(u);
    };
    im.onerror = () => dispatch({ type: 'toast', kind: 'err', text: 'Bild konnte nicht geladen werden' });
    im.src = u;
  };
  const set = <K extends keyof LithoOptions>(k: K) => (v: LithoOptions[K]) => setO((x) => ({ ...x, [k]: v }));

  const build = () => {
    if (!img) return;
    setBusy(true);
    setTimeout(async () => {
      try {
        const g = sampleImage(img, o);
        const w = weldTriangles(lithoSoup(g, o));
        const im = { id: hashId(w.mesh), name: 'Lithophanie', mesh: w.mesh, size: w.size };
        await registerImported(im);
        const lying = !standing && o.arc <= 0;
        dispatch({
          type: 'setModel',
          model: {
            name: 'Lithophanie',
            description: `Lithophanie ${Math.round(w.size[0])} × ${Math.round(w.size[2])} mm, ${String(o.tMin).replace('.', ',')}–${String(o.tMax).replace('.', ',')} mm stark${o.arc > 0 ? `, ${o.arc}° gebogen` : ''}`,
            params: [],
            root: [],
            source: 'photo',
            templateId: 'litho',
            imports: [{ ref: im.id, name: 'Lithophanie', slot: 1, pos: [0, 0, 0], rot: lying ? [90, 0, 0] : [0, 0, 0], size: w.size }],
          },
          values: {},
        });
        dispatch({ type: 'toast', kind: 'ok', text: 'Lithophanie erstellt – mit weißem PLA und 100 % Füllung drucken, dann gegen Licht halten' });
      } catch (e) {
        dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
      } finally {
        setBusy(false);
      }
    }, 30);
  };

  const heightMm = img ? Math.round((o.width - 2 * o.border) * (img.height / img.width) + 2 * o.border) : 0;
  return (
    <div className="space-y-4">
      <p className="text-[12px] text-slate-400 leading-snug">
        Aus einem Foto wird ein dünnes Relief: dunkle Stellen werden dicker. Gegen Licht gehalten (Fenster, LED, Lampe) erscheint das Bild – auch als gebogener Lampenschirm.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => camRef.current?.click()}>📷 Foto aufnehmen</Button>
        <Button onClick={() => fileRef.current?.click()}>🖼️ Bild wählen</Button>
      </div>
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => (pick(e.target.files?.[0]), (e.target.value = ''))} />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => (pick(e.target.files?.[0]), (e.target.value = ''))} />
      {url && (
        <>
          <img src={url} alt="Vorschau" className="w-full max-h-56 object-contain rounded-lg border border-[#30363d] bg-black" style={{ filter: `grayscale(1) contrast(${o.contrast})${o.invert ? ' invert(1)' : ''}` }} />
          <SliderRow label="Breite" value={o.width} min={30} max={250} step={1} unit="mm" onChange={set('width')} hint={`Höhe ergibt sich aus dem Bild: ca. ${heightMm} mm`} />
          <SliderRow label="Dünnste Stelle (hell)" value={o.tMin} min={0.4} max={2} step={0.1} unit="mm" onChange={set('tMin')} />
          <SliderRow label="Dickste Stelle (dunkel)" value={o.tMax} min={1.5} max={6} step={0.1} unit="mm" onChange={set('tMax')} />
          <SliderRow label="Rahmen" value={o.border} min={0} max={10} step={0.5} unit="mm" onChange={set('border')} />
          <SliderRow label="Kontrast" value={o.contrast} min={0.5} max={2} step={0.05} onChange={set('contrast')} />
          <SliderRow label="Biegung (0 = flach, bis 330° = Lampenschirm)" value={o.arc} min={0} max={330} step={5} unit="°" onChange={set('arc')} />
          <SliderRow label="Detail (mm je Bildpunkt)" value={o.res} min={0.15} max={0.6} step={0.05} unit="mm" onChange={set('res')} hint="Kleiner = feiner, aber größere Datei" />
          <Toggle label="Negativ (helle Stellen dick)" checked={o.invert} onChange={set('invert')} />
          {o.arc <= 0 && <Toggle label="Stehend drucken (schärfstes Bild)" hint="Liegend druckt schneller, zeigt aber Schichtlinien im Bild" checked={standing} onChange={setStanding} />}
          <Button variant="primary" className="w-full h-11" disabled={busy || !!state.busy} onClick={build}>
            {busy ? 'Erzeuge Relief …' : '✨ Lithophanie erstellen'}
          </Button>
        </>
      )}
    </div>
  );
}
