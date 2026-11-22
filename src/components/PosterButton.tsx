import { useState } from 'react';
import { SHARE_BASE } from '../platform/share';
import { useStore } from '../state/store';
import { viewerShot } from '../viewer/shot';
import { Button } from './ui';

const W = 1080,
  H = 1350;
const fmt = (v: number, d = 0) => v.toFixed(d).replace('.', ',');

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function rounded(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Vorschaubild zum Posten (Instagram/WhatsApp/MakerWorld): Modell + Maße, Gewicht, Druckzeit. */
export function PosterButton() {
  const { state, dispatch } = useStore();
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const m = state.model;
  const b = state.build;
  if (!m || !b) return null;

  const make = async () => {
    const shot = viewerShot.take?.(W, 1000);
    if (!shot) {
      dispatch({ type: 'toast', kind: 'err', text: 'Vorschaubild geht nur mit sichtbarer 3D-Ansicht' });
      return;
    }
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const g = cv.getContext('2d')!;
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0d1117');
    bg.addColorStop(1, '#0f2a1b');
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.drawImage(await loadImg(shot), 0, 0, W, 1000);
    // weicher Übergang Bild → Textbereich
    const fade = g.createLinearGradient(0, 860, 0, 1000);
    fade.addColorStop(0, 'rgba(13,17,23,0)');
    fade.addColorStop(1, 'rgba(14,32,23,1)');
    g.fillStyle = fade;
    g.fillRect(0, 860, W, 140);
    // Markenzeichen oben links
    g.fillStyle = '#00ae42';
    g.beginPath();
    g.moveTo(64, 40);
    g.lineTo(100, 60);
    g.lineTo(100, 100);
    g.lineTo(64, 120);
    g.lineTo(28, 100);
    g.lineTo(28, 60);
    g.closePath();
    g.fill();
    g.fillStyle = '#ffffff';
    g.font = '700 34px system-ui, sans-serif';
    g.fillText('Formwerk CAD', 118, 92);
    // Titel
    g.fillStyle = '#ffffff';
    // Titel: erst kleiner schreiben, erst dann kürzen
    let fs = 64;
    g.font = `800 ${fs}px system-ui, sans-serif`;
    while (g.measureText(m.name).width > W - 120 && fs > 44) g.font = `800 ${(fs -= 2)}px system-ui, sans-serif`;
    let title = m.name;
    while (g.measureText(title).width > W - 120 && title.length > 4) title = title.slice(0, -2);
    if (title !== m.name) title = title.trimEnd() + '…';
    g.fillText(title, 60, 1060);
    // Kennzahlen als Chips
    const mn = b.total.min,
      mx = b.total.max;
    const size = `${fmt(mx[0] - mn[0])} × ${fmt(mx[1] - mn[1])} × ${fmt(mx[2] - mn[2])} mm`;
    const h = Math.floor(b.estimate.minutes / 60),
      min = Math.round(b.estimate.minutes % 60);
    const chips = [`📏 ${size}`, `⚖️ ${fmt(b.estimate.grams)} g`, `⏱️ ${h ? `${h} h ` : ''}${min} min`, ...(b.parts.length > 1 ? [`🎨 ${b.parts.length} Teile`] : [])];
    g.font = '600 34px system-ui, sans-serif';
    let x = 60,
      y = 1110;
    for (const c of chips) {
      const w = g.measureText(c).width + 44;
      if (x + w > W - 60) {
        x = 60;
        y += 78;
      }
      rounded(g, x, y, w, 62, 31);
      g.fillStyle = 'rgba(255,255,255,0.08)';
      g.fill();
      g.strokeStyle = 'rgba(0,174,66,0.6)';
      g.lineWidth = 2;
      g.stroke();
      g.fillStyle = '#e6edf3';
      g.fillText(c, x + 22, y + 43);
      x += w + 16;
    }
    // Fußzeile
    g.fillStyle = '#8b949e';
    let ff = 28;
    const foot = 'Selbst anpassen & drucken: ' + SHARE_BASE.replace(/^https:\/\//, '').replace(/\/$/, '');
    g.font = `500 ${ff}px system-ui, sans-serif`;
    while (g.measureText(foot).width > W - 120 && ff > 18) g.font = `500 ${(ff -= 1)}px system-ui, sans-serif`;
    g.fillText(foot, 60, H - 50);
    const bl: Blob = await new Promise((res) => cv.toBlob((x) => res(x!), 'image/png'));
    setBlob(bl);
    setUrl(URL.createObjectURL(bl));
  };

  const fileName = `${m.name.replace(/[^\wäöüÄÖÜß -]+/g, '').trim() || 'modell'}.png`;
  const share = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: m.name, text: `Mein 3D-Druck-Modell „${m.name}“ – erstellt mit Formwerk CAD` }).catch(() => undefined);
    } else {
      const a = document.createElement('a');
      a.href = url!;
      a.download = fileName;
      a.click();
      dispatch({ type: 'toast', kind: 'ok', text: 'Bild gespeichert' });
    }
  };

  return (
    <div className="px-4 pt-3">
      <Button className="w-full h-9 text-[12.5px]" onClick={make}>
        🖼️ Vorschaubild zum Posten
      </Button>
      {url && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4" onClick={() => setUrl(null)}>
          <div className="max-w-sm w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <img src={url} alt="Vorschaubild" className="w-full rounded-xl border border-[#30363d]" />
            <div className="grid grid-cols-2 gap-2">
              <Button className="h-11" onClick={share}>
                📤 Teilen / Speichern
              </Button>
              <Button variant="ghost" className="h-11" onClick={() => setUrl(null)}>
                Schließen
              </Button>
            </div>
            <p className="text-[11.5px] text-slate-400 text-center">Das Bild zeigt das Modell in den aktuell gewählten Filamentfarben.</p>
          </div>
        </div>
      )}
    </div>
  );
}
