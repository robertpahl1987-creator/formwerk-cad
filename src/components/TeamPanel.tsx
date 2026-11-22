import { useEffect, useRef, useState } from 'react';
import type { FreePart } from '../cad/free';
import type { ModelDef, Value } from '../cad/types';
import { getImported, meshFromJson, meshToJson, registerImported } from '../mesh/importMesh';
import { freeBus } from '../state/freeBus';
import { useStore, type State } from '../state/store';
import { COLORS, readTeamHash, team, useTeam, type TeamMsg } from '../state/team';
import { Button } from './ui';

interface Payload {
  model: ModelDef | null;
  values: Record<string, Value>;
  orientation: { rx: number; ry: number };
  zonesOn: boolean;
  zones: State['zones'];
}

/** Schrift-Umrisse lassen sich beim Empfänger neu berechnen – nicht mitschicken. */
function slim(m: ModelDef | null): ModelDef | null {
  if (!m?.freeParts) return m;
  return { ...m, freeParts: (m.freeParts as FreePart[]).map((p) => (p.outline ? { ...p, outline: undefined } : p)) };
}
/** Vergleichsschlüssel: „Ist das inhaltlich derselbe Stand?“ */
function sig(p: Payload): string {
  const m = p.model;
  const core = !m ? null : m.templateId === 'frei' ? { f: slim(m)!.freeParts, x: m.xform, mods: m.mods } : { ...m, prompt: undefined };
  return JSON.stringify([core, m?.templateId === 'frei' ? null : p.values, p.orientation, p.zonesOn, p.zonesOn ? p.zones : null]);
}
function importRefs(m: ModelDef | null): string[] {
  if (!m) return [];
  return [...new Set([...(m.imports ?? []).map((i) => i.ref), ...((m.freeParts as FreePart[] | undefined) ?? []).filter((p) => p.kind === 'import').map((p) => String(p.e.ref))])];
}

/** Hält das Projekt mit dem Team-Raum synchron (immer eingehängt). */
export function useTeamSync() {
  const { state, dispatch } = useStore();
  const t = useTeam();
  const lastSig = useRef('');
  const lastTs = useRef(0);
  const gotState = useRef(false);
  const sentMeshes = useRef(new Set<string>());
  const stateRef = useRef(state);
  stateRef.current = state;

  // Einladungslink öffnen bzw. nach Neuladen wieder in den Raum
  useEffect(() => {
    const inv = readTeamHash(location.hash);
    if (inv) {
      history.replaceState(null, '', location.pathname + location.search);
      team
        .join(inv.room, inv.k)
        .then(() => dispatch({ type: 'toast', kind: 'ok', text: '👥 Team-Raum betreten – das gemeinsame Projekt wird geladen' }))
        .catch((e) => dispatch({ type: 'toast', kind: 'err', text: (e as Error).message }));
    } else void team.resume()?.catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Eingehende Änderungen übernehmen
  useEffect(
    () =>
      team.onReceive((m: TeamMsg, retained) => {
        if (m.k === 'mesh') {
          void registerImported(meshFromJson(m.mesh as never)).catch(() => {});
          return;
        }
        if (m.k !== 'state') return;
        gotState.current = true;
        if (m.ts < lastTs.current) return; // veraltet
        lastTs.current = m.ts;
        const p = m.p as Payload;
        const s = sig(p);
        if (s === lastSig.current) return;
        const cur = stateRef.current;
        if (s === sig({ model: cur.model, values: cur.values, orientation: cur.orientation, zonesOn: cur.zonesOn, zones: cur.zones })) {
          lastSig.current = s;
          return;
        }
        lastSig.current = s;
        if (p.model?.templateId === 'frei') freeBus.send({ type: 'load', parts: (p.model.freeParts as FreePart[]) ?? [] });
        dispatch({ type: 'teamApply', model: p.model, values: p.values ?? {}, orientation: p.orientation ?? { rx: 0, ry: 0 }, zonesOn: !!p.zonesOn, zones: p.zones ?? cur.zones });
        if (retained) dispatch({ type: 'toast', kind: 'info', text: `👥 Gemeinsames Projekt geladen${p.model ? `: „${p.model.name}“` : ''}` });
      }),
    [dispatch],
  );

  // Neuer Raum ohne gespeicherten Stand → eigenes Projekt als Startstand hochladen
  useEffect(() => {
    if (t.status !== 'online') return;
    // Ersteller: sofort eigenes Projekt hochladen. Beitretende: auf den Raum-Stand warten;
    // kommt keiner (leerer Raum), ab dann eigene Änderungen ganz normal teilen.
    const tm = setTimeout(
      () => {
        if (gotState.current) return;
        lastSig.current = '';
        if (team.isCreator()) void push(stateRef.current);
        else gotState.current = true;
      },
      team.isCreator() ? 300 : 8000,
    );
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.status, t.room]);
  useEffect(() => {
    gotState.current = false;
    sentMeshes.current = new Set();
  }, [t.room]);

  const push = async (cur: State) => {
    const p: Payload = { model: slim(cur.model), values: cur.values, orientation: cur.orientation, zonesOn: cur.zonesOn, zones: cur.zones };
    const s = sig(p);
    if (s === lastSig.current) return;
    lastSig.current = s;
    try {
      for (const ref of importRefs(cur.model)) {
        if (sentMeshes.current.has(ref)) continue;
        const im = getImported(ref);
        if (!im) continue;
        sentMeshes.current.add(ref);
        await team.sendMesh(ref, meshToJson(im)).catch(() => {
          team.setError('Eine importierte STL ist zu groß für die Live-Übertragung – die anderen sehen sie nicht');
        });
      }
      const ts = Math.max(Date.now(), lastTs.current + 1);
      lastTs.current = ts;
      gotState.current = true;
      await team.sendState(p, ts);
      if (team.get().error) team.setError(null);
    } catch (e) {
      team.setError((e as Error).message);
    }
  };

  // Eigene Änderungen (entprellt) an alle schicken
  useEffect(() => {
    if (t.status !== 'online' || !gotState.current) return;
    const tm = setTimeout(() => void push(stateRef.current), 350);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.model, state.values, state.orientation, state.zonesOn, state.zones, t.status]);
}

const ago = (t: number) => {
  const s = (Date.now() - t) / 1000;
  return s < 10 ? 'gerade eben' : s < 90 ? `vor ${Math.round(s)} s` : `vor ${Math.round(s / 60)} min`;
};

/** Kleines Abzeichen oben in der Leiste, solange man in einem Team-Raum ist. */
export function TeamBadge() {
  const t = useTeam();
  const [, tick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => tick((x) => x + 1), 1500);
    return () => clearInterval(i);
  }, []);
  if (!t.room) return null;
  const editing = t.members.filter((m) => Date.now() - m.edit < 4000);
  const dot = t.status === 'online' ? 'bg-emerald-400' : t.status === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-red-400';
  return (
    <div className="h-9 px-2 rounded-lg border border-[#30363d] flex items-center gap-1.5 text-[12px] text-slate-300" title={`Team: ${[t.me.name || 'Ich', ...t.members.map((m) => m.name)].join(', ')}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <span>👥 {t.members.length + 1}</span>
      {editing.length > 0 && (
        <span className="hidden sm:inline truncate max-w-[110px]" style={{ color: editing[0].color }}>
          ✎ {editing[0].name}
        </span>
      )}
    </div>
  );
}

/** Zusammenarbeiten: Raum erstellen, Link teilen, Mitglieder sehen. */
export function TeamPanel() {
  const { dispatch } = useStore();
  const t = useTeam();
  const [open, setOpen] = useState(!!t.room);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [, tick] = useState(0);
  useEffect(() => {
    if (t.room) setOpen(true);
  }, [t.room]);
  useEffect(() => {
    const i = setInterval(() => tick((x) => x + 1), 5000);
    return () => clearInterval(i);
  }, []);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      dispatch({ type: 'toast', kind: 'err', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };
  const share = async () => {
    const url = team.link();
    const text = `Lass uns zusammen an meinem 3D-Projekt in Formwerk CAD arbeiten: ${url}`;
    try {
      if (navigator.share) return void (await navigator.share({ title: 'Formwerk CAD – Team', text, url }));
    } catch {
      /* abgebrochen → kopieren */
    }
    try {
      await navigator.clipboard.writeText(url);
      dispatch({ type: 'toast', kind: 'ok', text: 'Einladungslink kopiert – an deine Mitstreiter schicken' });
    } catch {
      window.prompt('Einladungslink kopieren:', url);
    }
  };
  const joinCode = () =>
    run(async () => {
      const inv = readTeamHash(code.includes('#') ? code.slice(code.indexOf('#')) : '#team=' + code.trim());
      if (!inv) throw new Error('Das ist kein gültiger Einladungslink');
      if (!window.confirm('Dem Team beitreten? Dein aktuelles Projekt wird durch das gemeinsame Projekt ersetzt.')) return;
      await team.join(inv.room, inv.k);
      setCode('');
    });

  const statusText = t.status === 'online' ? `verbunden` : t.status === 'connecting' ? 'verbinde …' : t.status === 'offline' ? 'getrennt – verbinde neu …' : '';
  const small = 'h-9 text-[12px]';
  return (
    <div className="mx-4 mt-3 rounded-xl border border-[#30363d] bg-[#0d1117]">
      <button className="w-full flex items-center justify-between px-3 py-2.5 text-left" onClick={() => setOpen(!open)}>
        <span className="text-[13px] text-slate-200">👥 Zusammenarbeiten</span>
        <span className="text-[11px] text-slate-500">
          {t.room ? `${t.members.length + 1} im Raum · ${statusText}` : ''} {open ? '▴' : '▾'}
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <input
              className="flex-1 min-w-0 h-9 rounded-md bg-[#161b22] border border-[#30363d] px-2 text-[13px] text-slate-100"
              placeholder="Dein Name (sehen die anderen)"
              value={t.me.name}
              maxLength={24}
              onChange={(e) => team.setName(e.target.value)}
            />
            {COLORS.map((c) => (
              <button key={c} onClick={() => team.setColor(c)} className={`w-5 h-5 rounded-full shrink-0 ${t.me.color === c ? 'ring-2 ring-white' : ''}`} style={{ background: c }} aria-label="Farbe" />
            ))}
          </div>
          {!t.room ? (
            <>
              <p className="text-[12px] text-slate-400 leading-snug">
                Mit anderen gleichzeitig am selben Projekt bauen – von mehreren PCs oder Handys. Jede Änderung (Maße, Teile verschieben, Farben …) erscheint sofort bei allen. Verschlüsselt, ohne Anmeldung.
              </p>
              <Button className="w-full" onClick={() => run(team.create)} disabled={busy}>
                ➕ Team-Raum mit meinem Projekt starten
              </Button>
              <div className="flex gap-1.5">
                <input
                  className="flex-1 min-w-0 h-9 rounded-md bg-[#161b22] border border-[#30363d] px-2 text-[12px] text-slate-100"
                  placeholder="Einladungslink einfügen"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button className={small} onClick={joinCode} disabled={busy || !code.trim()}>
                  Beitreten
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Row color={t.me.color} name={`${t.me.name || 'Ich'} (du)`} info={statusText} />
                {t.members.map((m) => (
                  <Row key={m.id} color={m.color} name={m.name} info={m.edit ? `ändert ${ago(m.edit)}` : 'schaut zu'} />
                ))}
                {!t.members.length && t.status === 'online' && <div className="text-[12px] text-slate-500">Noch niemand da – Link teilen, dann sehen dich die anderen hier.</div>}
              </div>
              {t.error && <div className="text-[12px] text-amber-300">⚠ {t.error}</div>}
              <div className="grid grid-cols-2 gap-1.5">
                <Button className={small} onClick={share}>
                  🔗 Einladen
                </Button>
                <Button className={small} onClick={() => window.confirm('Team-Raum verlassen? Dein Projekt bleibt auf diesem Gerät erhalten.') && team.leave()}>
                  🚪 Verlassen
                </Button>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Wer den Link hat, kann mitbauen – nur an Vertraute schicken. Der letzte Stand bleibt im Raum, auch wenn gerade niemand online ist.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ color, name, info }: { color: string; name: string; info: string }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px]">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-slate-200 truncate">{name}</span>
      <span className="ml-auto text-[11px] text-slate-500 shrink-0">{info}</span>
    </div>
  );
}
