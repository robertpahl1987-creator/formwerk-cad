import { useEffect, useRef, useState } from 'react';
import { freeToModel, KINDS, localExtent, newPart, PRESETS, worldBox, type FreePart, type Preset } from '../cad/free';
import { outlineKey, outlineText } from '../cad/textOutline';
import { saveFile } from '../platform/download';
import { useStore } from '../state/store';
import { Button, cx, SliderRow, Toggle } from './ui';

const STORE_KEY = 'formwerk-cad:frei:v1';
interface Saved {
  parts: FreePart[];
  next: number;
}
function load(): Saved {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const d = JSON.parse(raw) as Saved;
      if (Array.isArray(d.parts)) return { parts: d.parts, next: d.next || d.parts.length + 1 };
    }
  } catch {
    /* kein Speicher – egal */
  }
  return { parts: [], next: 1 };
}
const round = (v: number) => Math.round(v * 100) / 100;

/** Schrift-Umriss aktualisieren, wenn sich Text, Schriftart oder „Fett“ geändert haben. */
function withOutline(p: FreePart): FreePart {
  if (p.kind !== 'text' || p.e.font === 'einstrich') return p;
  const text = String(p.e.text ?? ''),
    font = String(p.e.font ?? 'sans'),
    bold = !!p.e.fett;
  if (p.outline && p.outline.key === outlineKey(text, font, bold)) return p;
  return { ...p, outline: outlineText(text, font, bold) };
}

/**
 * Frei bauen: Grundformen, Löcher, Text und Gelenke zusammenstecken.
 * Alles wird als normales Formwerk-Modell gebaut (Vorschau, Check, Export).
 */
export function FreeMode() {
  const { state, dispatch } = useStore();
  const [data, setData] = useState<Saved>(() => {
    const d = load();
    return { ...d, parts: d.parts.map(withOutline) };
  });
  const [sel, setSel] = useState<number | null>(null);
  const undoStack = useRef<Saved[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const active = state.mode === 'free';
  const parts = data.parts;
  const part = parts.find((p) => p.id === sel) ?? null;

  // Änderungen speichern und (entprellt) als Modell bauen lassen
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch {
      /* egal */
    }
    if (!active) return;
    const t = setTimeout(() => {
      const m = freeToModel(data.parts);
      if (m) dispatch({ type: 'freeModel', model: m });
    }, 150);
    return () => clearTimeout(t);
  }, [data, active, dispatch]);

  /** Änderung mit Rückgängig-Schritt (für Knöpfe und das Ende einer Eingabe). */
  const commit = (next: Saved) => {
    undoStack.current = [...undoStack.current.slice(-39), data];
    setData(next);
  };
  /** Laufende Regler-Bewegung: ein Rückgängig-Schritt pro Teil und Eigenschaft. */
  const lastKey = useRef('');
  const edit = (id: number, key: string, fn: (p: FreePart) => FreePart) => {
    const k = `${id}:${key}`;
    if (lastKey.current !== k) undoStack.current = [...undoStack.current.slice(-39), data];
    lastKey.current = k;
    setData((d) => ({ ...d, parts: d.parts.map((p) => (p.id === id ? withOutline(fn(structuredClone(p))) : p)) }));
  };
  const undo = () => {
    const prev = undoStack.current.pop();
    lastKey.current = '';
    if (prev) setData(prev);
    else dispatch({ type: 'toast', kind: 'info', text: 'Nichts zum Rückgängigmachen' });
  };

  const add = (pr: Preset) => {
    const p = withOutline(newPart(pr, data.next));
    const ext = localExtent(p);
    const bodies = parts.filter((x) => !x.hole);
    if (bodies.length && !p.hole) {
      const maxX = Math.max(...bodies.map((b) => worldBox(b).max[0]));
      p.pos[0] = Math.round(maxX + ext[0] / 2 + 5);
    }
    p.pos[2] = round(ext[2] / 2);
    commit({ parts: [...parts, p], next: data.next + 1 });
    setSel(p.id);
    lastKey.current = '';
  };

  const replace = (p: FreePart) => commit({ ...data, parts: parts.map((x) => (x.id === p.id ? p : x)) });

  const dropToBed = (p0: FreePart) => {
    const p = structuredClone(p0);
    p.pos[2] = round(p.pos[2] - worldBox(p).min[2]);
    replace(p);
  };
  const placeOnTop = (p0: FreePart) => {
    const p = structuredClone(p0);
    const b = worldBox(p);
    let top: number | null = null;
    let below: FreePart | null = null;
    for (const x of parts) {
      if (x.id === p.id || x.hole) continue;
      const o = worldBox(x);
      if (o.max[0] > b.min[0] && o.min[0] < b.max[0] && o.max[1] > b.min[1] && o.min[1] < b.max[1] && o.max[2] > (top ?? -Infinity)) {
        top = o.max[2];
        below = x;
      }
    }
    if (top === null) {
      p.pos[2] = round(p.pos[2] - b.min[2]);
      dispatch({ type: 'toast', kind: 'info', text: 'Darunter liegt kein Teil – auf das Druckbett gesetzt' });
    } else if (p.hole) {
      p.pos[2] = round(p.pos[2] + (top + 0.2 - b.max[2]));
      dispatch({ type: 'toast', kind: 'ok', text: 'Als Gravur in die Oberfläche gesetzt' });
    } else {
      // gleiche Farbe: 0,2 mm eintauchen, damit es sicher verschmilzt; andere Farbe: genau aufsetzen
      const sink = below && (below.slot || 1) !== (p.slot || 1) ? 0 : 0.2;
      p.pos[2] = round(p.pos[2] + (top - sink - b.min[2]));
      dispatch({ type: 'toast', kind: 'ok', text: 'Auf das Teil darunter gesetzt' });
    }
    replace(p);
  };
  const duplicate = (p0: FreePart, asHole: boolean) => {
    const p = structuredClone(p0);
    p.id = data.next;
    if (asHole) {
      const t = state.settings.tol;
      p.hole = true;
      p.name = `Loch für ${p0.name}`;
      if (KINDS[p.kind].size) p.size = [round(p.size[0] + 2 * t), round(p.size[1] + 2 * t), round(p.size[2] + 0.5)];
      dispatch({ type: 'toast', kind: 'info', text: `Loch mit ${String(t).replace('.', ',')} mm Spiel pro Seite – an die Stelle des Gegenstücks schieben` });
    } else {
      p.name = `${p0.name} Kopie`;
      p.pos = [p.pos[0] + 5, p.pos[1] + 5, p.pos[2]];
    }
    commit({ parts: [...parts, p], next: data.next + 1 });
    setSel(p.id);
    lastKey.current = '';
  };
  const remove = (p: FreePart) => {
    commit({ ...data, parts: parts.filter((x) => x.id !== p.id) });
    setSel(null);
  };
  const clearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    setConfirmClear(false);
    commit({ parts: [], next: 1 });
    setSel(null);
  };
  const saveProject = async () => {
    try {
      const r = await saveFile('mein-formwerk-projekt.json', JSON.stringify(data, null, 1));
      if (r !== 'declined') dispatch({ type: 'toast', kind: 'ok', text: 'Projekt gespeichert' });
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    }
  };
  const loadProject = async (f: File | undefined) => {
    if (!f) return;
    try {
      const d = JSON.parse(await f.text()) as Saved;
      if (!Array.isArray(d.parts)) throw new Error('kein Projekt');
      commit({ parts: d.parts.map(withOutline), next: d.next || d.parts.length + 1 });
      setSel(null);
      dispatch({ type: 'toast', kind: 'ok', text: 'Projekt geladen' });
    } catch {
      dispatch({ type: 'toast', kind: 'err', text: 'Diese Datei ist kein Formwerk-Projekt' });
    }
  };

  const palette = state.settings.palette;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">Form hinzufügen</div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          {PRESETS.map((pr) => (
            <button
              key={pr.label}
              onClick={() => add(pr)}
              className={cx(
                'flex flex-col items-center gap-0.5 rounded-lg border py-2 px-1 text-[11.5px] transition-colors',
                pr.hole ? 'border-red-500/40 bg-red-500/5 text-red-200 hover:bg-red-500/15' : 'border-[#30363d] bg-[#0d1117] text-slate-300 hover:border-[#00ae42] hover:text-white',
              )}
            >
              <span className="text-lg leading-none">{pr.icon}</span>
              {pr.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">Deine Teile</div>
        {!parts.length && <p className="text-[13px] text-slate-500">Noch leer – tippe oben auf eine Form. Dein Projekt wird automatisch gemerkt.</p>}
        <div className="flex flex-wrap gap-1.5">
          {parts.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSel(p.id === sel ? null : p.id);
                lastKey.current = '';
              }}
              className={cx(
                'h-8 px-3 rounded-full border text-[12.5px] transition-colors',
                p.hole ? 'border-dashed border-red-500/60' : 'border-[#30363d]',
                p.id === sel ? (p.hole ? 'bg-red-600 text-white border-red-600' : 'bg-[#00ae42] text-white border-[#00ae42]') : 'bg-[#0d1117] text-slate-300',
              )}
            >
              {p.hole ? '⊖ ' : ''}
              {p.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          <Button onClick={undo} className="h-9 text-[12.5px]">
            ↶ Rückgängig
          </Button>
          <Button onClick={saveProject} className="h-9 text-[12.5px]" disabled={!parts.length}>
            💾 Speichern
          </Button>
          <Button onClick={() => fileRef.current?.click()} className="h-9 text-[12.5px]">
            📂 Laden
          </Button>
        </div>
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => (loadProject(e.target.files?.[0]), (e.target.value = ''))} />
        {parts.length > 0 && (
          <button onClick={clearAll} className="mt-2 text-[12px] text-slate-500 hover:text-red-300 underline">
            {confirmClear ? 'Wirklich alles löschen? Nochmal tippen' : 'Alles löschen und neu anfangen'}
          </button>
        )}
      </div>

      {part && <PartEditor key={part.id} part={part} edit={edit} onDone={() => (lastKey.current = '')} palette={palette} />}

      {part && (
        <div className="grid grid-cols-2 gap-1.5">
          <Button className="h-9 text-[12.5px]" onClick={() => placeOnTop(part)}>
            ⤒ Auf Teil setzen
          </Button>
          <Button className="h-9 text-[12.5px]" onClick={() => dropToBed(part)}>
            ⬇ Aufs Druckbett
          </Button>
          <Button className="h-9 text-[12.5px]" onClick={() => duplicate(part, false)}>
            ⧉ Kopieren
          </Button>
          <Button className="h-9 text-[12.5px]" onClick={() => duplicate(part, true)}>
            ⊖ Passendes Loch
          </Button>
          <Button variant="danger" className="h-9 text-[12.5px] col-span-2" onClick={() => remove(part)}>
            🗑 Teil löschen
          </Button>
        </div>
      )}

      <details className="text-[12.5px] text-slate-400 leading-relaxed">
        <summary className="cursor-pointer text-slate-300">So funktioniert's</summary>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            <b>Körper</b> sind fest. <b>Löcher</b> werden aus allen Körpern herausgeschnitten. Jede Form kann beides sein.
          </li>
          <li>Teile, die sich berühren oder überlappen, verschmelzen zu einem Stück.</li>
          <li>
            <b>Passendes Loch</b> macht aus einem Zapfen ein Loch mit Spiel (Drucktoleranz aus den Einstellungen) – ideal für Steckverbindungen.
          </li>
          <li>
            <b>Text</b> als Loch wird eingraviert. Mit <b>Auf Teil setzen</b> landet er direkt auf der Platte darunter.
          </li>
          <li>
            <b>Scharnier</b> und <b>Kugelgelenk</b> werden in einem Stück beweglich gedruckt.
          </li>
          <li>
            Mit <b>Farbe</b> bekommt ein Teil einen eigenen AMS-Slot (Mehrfarbendruck).
          </li>
        </ul>
      </details>
    </div>
  );
}

function PartEditor({
  part,
  edit,
  onDone,
  palette,
}: {
  part: FreePart;
  edit: (id: number, key: string, fn: (p: FreePart) => FreePart) => void;
  onDone: () => void;
  palette: { slot: number; name: string; color: string }[];
}) {
  const kd = KINDS[part.kind];
  const set = (key: string, fn: (p: FreePart) => void) =>
    edit(part.id, key, (p) => {
      fn(p);
      return p;
    });
  const head = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 pt-2';
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-3 space-y-3" onPointerUp={onDone} onBlur={onDone}>
      <div className="flex gap-2 items-center">
        <input
          value={part.name}
          onChange={(e) => set('name', (p) => (p.name = e.target.value))}
          className="flex-1 min-w-0 h-9 rounded-md bg-[#161b22] border border-[#30363d] focus:border-[#00ae42] outline-none px-2.5 text-sm font-semibold text-slate-100"
        />
        <div className="flex rounded-lg border border-[#30363d] overflow-hidden shrink-0">
          <button onClick={() => set('mode', (p) => (p.hole = false))} className={cx('h-9 px-3 text-[12.5px]', !part.hole ? 'bg-[#00ae42] text-white' : 'text-slate-400')}>
            Körper
          </button>
          <button onClick={() => set('mode', (p) => (p.hole = true))} className={cx('h-9 px-3 text-[12.5px]', part.hole ? 'bg-red-600 text-white' : 'text-slate-400')}>
            Loch
          </button>
        </div>
      </div>

      {!part.hole && palette.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] text-slate-300 mr-1">Farbe</span>
          {palette.map((f) => (
            <button
              key={f.slot}
              title={f.name}
              onClick={() => set('slot', (p) => (p.slot = f.slot))}
              className={cx('h-8 px-2 rounded-lg border text-[12px] flex items-center gap-1.5', (part.slot || 1) === f.slot ? 'border-[#00ae42] text-white' : 'border-[#30363d] text-slate-400')}
            >
              <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ background: f.color }} />
              {f.slot}
            </button>
          ))}
        </div>
      )}

      {kd.size && (
        <>
          <div className={head}>Größe</div>
          <Toggle label="Seitenverhältnis beibehalten" checked={!!part.lock} onChange={(v) => set('lock', (p) => (p.lock = v))} />
          {(['Breite X', 'Tiefe Y', 'Höhe Z'] as const).map((lab, i) => (
            <SliderRow
              key={lab}
              label={lab}
              value={part.size[i]}
              min={0.4}
              max={250}
              step={0.1}
              unit="mm"
              onChange={(v) =>
                set('size', (p) => {
                  v = Math.max(0.2, v);
                  if (p.lock && p.size[i] > 0) {
                    const k = v / p.size[i];
                    for (let j = 0; j < 3; j++) if (j !== i) p.size[j] = round(p.size[j] * k);
                  }
                  p.size[i] = v;
                })
              }
            />
          ))}
        </>
      )}

      {kd.fields.length > 0 && <div className={head}>{part.kind === 'scharnier' || part.kind === 'kugelgelenk' ? 'Gelenk' : part.kind === 'text' ? 'Schrift' : 'Form'}</div>}
      {kd.fields.map((f) =>
        f.type === 'text' ? (
          <label key={f.key} className="block">
            <span className="text-[13px] text-slate-300">{f.label}</span>
            <textarea
              value={String(part.e[f.key] ?? '')}
              maxLength={120}
              rows={2}
              onChange={(e) => set(f.key, (p) => (p.e[f.key] = e.target.value))}
              className="mt-1 w-full rounded-md bg-[#161b22] border border-[#30363d] focus:border-[#00ae42] outline-none p-2.5 text-sm text-slate-100 resize-y"
            />
          </label>
        ) : f.type === 'select' ? (
          <label key={f.key} className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-slate-300">{f.label}</span>
            <select
              value={String(part.e[f.key] ?? f.options?.[0]?.value ?? '')}
              onChange={(e) => set(f.key, (p) => (p.e[f.key] = e.target.value))}
              className="h-9 rounded-md bg-[#161b22] border border-[#30363d] focus:border-[#00ae42] outline-none px-2 text-sm text-slate-100"
            >
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ) : f.type === 'bool' ? (
          <Toggle key={f.key} label={f.label} checked={!!part.e[f.key]} onChange={(v) => set(f.key, (p) => (p.e[f.key] = v))} />
        ) : (
          <SliderRow
            key={f.key}
            label={f.label}
            value={Number(part.e[f.key] ?? 0)}
            min={f.min ?? 0}
            max={f.max ?? 100}
            step={f.step ?? 1}
            unit={f.unit}
            onChange={(v) => set(f.key, (p) => (p.e[f.key] = v))}
          />
        ),
      )}

      <div className={head}>Position</div>
      {(['X', 'Y', 'Z (Höhe)'] as const).map((lab, i) => (
        <SliderRow key={lab} label={lab} value={part.pos[i]} min={i === 2 ? -50 : -150} max={i === 2 ? 250 : 150} step={0.5} unit="mm" onChange={(v) => set('pos' + i, (p) => (p.pos[i] = v))} />
      ))}
      <div className={head}>Drehung</div>
      {(['um X', 'um Y', 'um Z'] as const).map((lab, i) => (
        <SliderRow key={lab} label={lab} value={part.rot[i]} min={-180} max={180} step={5} unit="°" onChange={(v) => set('rot' + i, (p) => (p.rot[i] = v))} />
      ))}
      {kd.hint && <p className="text-[12px] text-slate-500 leading-relaxed">{kd.hint}</p>}
    </div>
  );
}
