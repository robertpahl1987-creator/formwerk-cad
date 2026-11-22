import { defaultValues } from '../cad/validate';
import { TEMPLATES } from '../cad/templates';
import type { Value } from '../cad/types';
import { useStore } from '../state/store';
import { PrinterSelect } from './Dialogs';

/** Beliebte Modelle: ein Tipp → sofort ein fertiges 3D-Modell zum Anpassen. */
const PICKS: { id: string; title: string; sub: string; icon: string; bg: string; v?: Record<string, Value> }[] = [
  { id: 'vase', title: 'Gedrehte Vase', sub: 'Vasenmodus, kaum Material', icon: '🏺', bg: 'from-fuchsia-600/40 to-purple-900/40' },
  { id: 'gridfinity', title: 'Gridfinity-Kiste', sub: 'passt ins Rastersystem', icon: '🧱', bg: 'from-emerald-600/40 to-teal-900/40' },
  { id: 'nameplate', title: 'Namensschild', sub: 'zweifarbig mit AMS', icon: '🏷️', bg: 'from-amber-500/40 to-orange-900/40' },
  { id: 'flexikette', title: 'Flexi-Kette', sub: 'beweglich, in einem Stück', icon: '⛓️', bg: 'from-sky-600/40 to-blue-900/40' },
  { id: 'spinner', title: 'Dreh-Anhänger', sub: 'Schlüsselanhänger, dreht sich', icon: '🌀', bg: 'from-cyan-500/40 to-indigo-900/40' },
  { id: 'organizer', title: 'Setzkasten', sub: 'Fächer nach Maß', icon: '🗃️', bg: 'from-lime-600/40 to-green-900/40' },
  { id: 'schraubdose', title: 'Schraubdose', sub: 'Deckel mit Gewinde', icon: '🥫', bg: 'from-rose-600/40 to-red-900/40' },
  { id: 'drehknopf', title: 'Drehknopf', sub: 'mit Rändel-Muster', icon: '🎛️', bg: 'from-slate-500/40 to-slate-900/40' },
  { id: 'schnappbox', title: 'Box mit Klickdeckel', sub: 'Deckel rastet ein', icon: '🫙', bg: 'from-yellow-500/40 to-amber-900/40' },
  { id: 'hook', title: 'Wandhaken', sub: 'stabil, ohne Stützen', icon: '🪝', bg: 'from-orange-600/40 to-stone-900/40' },
  { id: 'schraube', title: 'Schraube + Mutter', sub: 'echtes M10-Gewinde', icon: '🔩', bg: 'from-zinc-500/40 to-zinc-900/40' },
  { id: 'mooskugel', title: 'Mooskugel', sub: 'fürs Aquarium, verschraubbar', icon: '🟢', bg: 'from-green-600/40 to-cyan-900/40' },
  { id: 'garnelenhoehle', title: 'Garnelenhöhle', sub: 'Versteck fürs Aquarium', icon: '🦐', bg: 'from-orange-500/40 to-cyan-900/40' },
  { id: 'toleranztest', title: 'Toleranz-Test', sub: 'einmal drucken, alles passt', icon: '🎯', bg: 'from-green-500/40 to-emerald-900/40' },
];

export function Gallery() {
  const { state, dispatch } = useStore();
  if (state.model) return null;
  const open = (id: string, v?: Record<string, Value>) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    const model = structuredClone(t.model);
    dispatch({ type: 'setModel', model, values: { ...defaultValues(model), ...(v ?? {}) } });
    dispatch({ type: 'toast', kind: 'ok', text: `„${t.model.name}“ – jetzt mit den Reglern anpassen` });
  };
  const surprise = () => {
    const p = PICKS[Math.floor(Math.random() * PICKS.length)];
    const t = TEMPLATES.find((x) => x.id === p.id)!;
    // Zahlenwerte zufällig innerhalb sinnvoller Grenzen variieren
    const v: Record<string, Value> = {};
    for (const par of t.model.params)
      if (par.type === 'number' && typeof par.value === 'number' && par.min !== undefined && par.max !== undefined) {
        const span = (par.max - par.min) * 0.25;
        const x = par.value + (Math.random() * 2 - 1) * span;
        const step = par.step ?? 1;
        v[par.key] = Math.min(par.max, Math.max(par.min, Math.round(x / step) * step));
      }
    open(p.id, v);
  };
  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[15px] font-semibold text-white">Loslegen mit einem Tipp</div>
          <div className="text-[12px] text-slate-400">Beliebte Modelle – sofort druckbar, alle Maße anpassbar</div>
        </div>
        <button onClick={surprise} className="h-8 px-3 rounded-lg border border-[#00ae42] text-[12px] text-[#3ddc84] hover:bg-[#00ae42]/10 shrink-0">
          🎲 Überrasch mich
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
        {PICKS.filter((p) => TEMPLATES.some((t) => t.id === p.id)).map((p) => (
          <button
            key={p.id}
            onClick={() => open(p.id, p.v)}
            className={`rounded-xl border border-[#30363d] hover:border-[#00ae42] bg-gradient-to-br ${p.bg} p-2.5 text-left transition-colors`}
          >
            <div className="text-[26px] leading-none mb-1.5">{p.icon}</div>
            <div className="text-[12.5px] font-semibold text-white leading-tight">{p.title}</div>
            <div className="text-[10.5px] text-slate-300/80 leading-tight mt-0.5">{p.sub}</div>
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-2.5">
        <div className="text-[12px] text-slate-400 mb-1">🖨️ Dein Drucker</div>
        <PrinterSelect compact />
      </div>
      <div className="text-[12px] text-slate-500 pt-1">… oder selbst erstellen:</div>
    </div>
  );
}
