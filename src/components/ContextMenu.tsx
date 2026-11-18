import { useEffect, useRef, type ReactNode } from 'react';
import { PRESETS } from '../cad/free';
import { freeBus, useFreeMenu, useFreeSnapshot, type FreeAction } from '../state/freeBus';
import { useStore } from '../state/store';
import { cx } from './ui';

/**
 * Rechtsklick-Menü wie im Slicer (Bambu Studio / Orca): auf Teile in der 3D-Ansicht
 * oder in der Teileliste. Am Handy: lange drücken.
 */
export function ContextMenu() {
  const menu = useFreeMenu();
  const snap = useFreeSnapshot();
  const { state } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: Event) => {
      if (ref.current && e.target instanceof Node && ref.current.contains(e.target)) return;
      freeBus.openMenu(null);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && freeBus.openMenu(null);
    setTimeout(() => {
      window.addEventListener('pointerdown', close);
      window.addEventListener('keydown', esc);
      window.addEventListener('resize', close);
    });
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', esc);
      window.removeEventListener('resize', close);
    };
  }, [menu]);

  if (!menu) return null;
  const part = menu.id !== null ? snap.parts.find((p) => p.id === menu.id) ?? null : null;
  // Ziel: ganze Auswahl, wenn das angeklickte Teil dazugehört – sonst nur dieses Teil
  const ids = part ? (snap.sel.includes(part.id) ? snap.sel : [part.id]) : snap.sel;
  const targets = snap.parts.filter((p) => ids.includes(p.id));
  const multi = targets.length > 1;
  const grouped = targets.some((t) => t.group);
  const allHoles = targets.length > 0 && targets.every((t) => t.hole);

  const run = (action: FreeAction, arg?: string | number) => {
    freeBus.send({ type: 'action', action, ids, arg, at: menu.at ?? undefined });
    freeBus.openMenu(null);
  };
  const addToSelection = () => {
    if (part) freeBus.send({ type: 'select', ids: [part.id], additive: true });
    freeBus.openMenu(null);
  };

  const shapes = PRESETS.filter((p) => !p.hole && ['Quader', 'Zylinder', 'Kugel', 'Kegel', 'Rohr', 'Keil', 'Text', 'Sechskant'].includes(p.label));
  const negShapes = PRESETS.filter((p) => ['Quader', 'Zylinder', 'Kugel', 'Keil', 'Text', 'Hohlraum', 'Loch', 'Schraubloch', 'Magnetloch'].includes(p.label));

  // Position im Fenster halten
  const W = 250;
  const left = Math.min(menu.x, window.innerWidth - W - 8);
  const top = Math.min(menu.y, window.innerHeight - 40);

  const Item = ({ label, onClick, danger, disabled }: { label: string; onClick: () => void; danger?: boolean; disabled?: boolean }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cx('w-full text-left px-3 py-1.5 text-[13px] rounded-md disabled:opacity-35', danger ? 'text-red-300 hover:bg-red-500/15' : 'text-slate-200 hover:bg-[#1f2630]')}
    >
      {label}
    </button>
  );
  const Sub = ({ label, children }: { label: string; children: ReactNode }) => (
    <details className="group">
      <summary className="list-none cursor-pointer px-3 py-1.5 text-[13px] text-slate-200 rounded-md hover:bg-[#1f2630] flex justify-between">
        {label}
        <span className="text-slate-500 group-open:rotate-90 transition-transform">›</span>
      </summary>
      <div className="pl-2 border-l border-[#30363d] ml-3 my-1">{children}</div>
    </details>
  );
  const Sep = () => <div className="h-px bg-[#30363d] my-1" />;

  return (
    <div
      ref={ref}
      className="fixed z-[70] rounded-xl border border-[#30363d] bg-[#161b22]/98 backdrop-blur shadow-2xl p-1.5 max-h-[80vh] overflow-y-auto"
      style={{ left, top: Math.max(8, Math.min(top, window.innerHeight - 420)), width: W }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="px-3 pt-1 pb-1.5 text-[11px] uppercase tracking-wider text-slate-500 truncate">
        {targets.length ? (multi ? `${targets.length} Teile ausgewählt` : targets[0].name) : 'Druckbett'}
      </div>
      {targets.length > 0 && (
        <>
          {part && !snap.sel.includes(part.id) && snap.sel.length > 0 && <Item label="➕ Zur Auswahl hinzufügen" onClick={addToSelection} />}
          {multi && <Item label="🔗 Zusammenfügen (gemeinsam bewegen)" onClick={() => run('group')} />}
          {grouped && <Item label="✂ Trennen (Gruppe auflösen)" onClick={() => run('ungroup')} />}
          {allHoles ? <Item label="■ In Körper umwandeln" onClick={() => run('body')} /> : <Item label="⊖ In negatives Teil umwandeln" onClick={() => run('hole')} />}
          {!multi && !allHoles && <Item label="⊖ Passendes Loch mit Spiel erzeugen" onClick={() => run('matchHole')} />}
          {!multi && (
            <Item label={allHoles ? '▦ In gleiche Stücke teilen…' : '▦ In gleiche Fächer aufteilen…'} onClick={() => run('raster')} />
          )}
          <Sub label="⊖ Negatives Teil hinzufügen">
            {negShapes.map((p) => (
              <Item key={p.label} label={`${p.icon} ${p.label}`} onClick={() => run('addHole', p.label)} />
            ))}
          </Sub>
          <Sep />
          <Item label="⧉ Duplizieren" onClick={() => run('duplicate')} />
          <Sub label="↻ Drehen um 90°">
            <Item label="um Z (liegend drehen)" onClick={() => run('rotZ')} />
            <Item label="um X (kippen)" onClick={() => run('rotX')} />
            <Item label="um Y (kippen)" onClick={() => run('rotY')} />
          </Sub>
          <Item label="⬇ Aufs Druckbett legen" onClick={() => run('drop')} />
          {!multi && <Item label="⤒ Auf Teil darunter setzen" onClick={() => run('onTop')} />}
          {!allHoles && state.settings.palette.length > 1 && (
            <Sub label="🎨 Filament / Farbe">
              {state.settings.palette.map((f) => (
                <Item key={f.slot} label={`● ${f.slot} · ${f.name}`} onClick={() => run('color', f.slot)} />
              ))}
            </Sub>
          )}
          <Sep />
          <Item label="🗑 Löschen" danger onClick={() => run('delete')} />
        </>
      )}
      {!targets.length && (
        <>
          <Sub label="＋ Teil hinzufügen">
            {shapes.map((p) => (
              <Item key={p.label} label={`${p.icon} ${p.label}`} onClick={() => run('add', p.label)} />
            ))}
          </Sub>
          <Sub label="⊖ Negatives Teil hinzufügen">
            {negShapes.map((p) => (
              <Item key={p.label} label={`${p.icon} ${p.label}`} onClick={() => run('addHole', p.label)} />
            ))}
          </Sub>
          <Item label="▣ Alles auswählen" onClick={() => run('selectAll')} disabled={!snap.parts.length} />
          <Item label="↶ Rückgängig" onClick={() => run('undo')} />
        </>
      )}
    </div>
  );
}
