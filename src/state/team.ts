/**
 * Zusammenarbeiten: mehrere Geräte bearbeiten gleichzeitig dasselbe Projekt.
 *
 * Ein „Team-Raum“ besteht aus einer zufälligen Raum-ID und einem geheimen Schlüssel,
 * beides steckt im Einladungslink (#team=raum.schlüssel). Alle Nachrichten werden mit
 * AES-GCM verschlüsselt über einen öffentlichen MQTT-Broker verteilt; der letzte Projekt-
 * stand bleibt dort (verschlüsselt) liegen, so dass später Dazukommende ihn sofort sehen.
 */
import { useSyncExternalStore } from 'react';
import { BROKERS, Mqtt } from '../platform/mqtt';
import { SHARE_BASE } from '../platform/share';

const KEY = 'formwerk-cad:team';
const ME_KEY = 'formwerk-cad:team-ich';
export const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#e11d48', '#a855f7', '#eab308', '#14b8a6', '#ec4899'];

export interface Member {
  id: string;
  name: string;
  color: string;
  seen: number;
  /** zuletzt etwas geändert */
  edit: number;
}
export interface TeamState {
  room: string | null;
  status: 'aus' | 'connecting' | 'online' | 'offline';
  broker: string;
  members: Member[];
  me: { id: string; name: string; color: string };
  /** zuletzt eingegangene Änderung */
  last: { name: string; at: number } | null;
  error: string | null;
}

/** Nachrichten im Raum */
export type TeamMsg =
  | { k: 'hi'; id: string; name: string; color: string }
  | { k: 'bye'; id: string }
  | { k: 'state'; id: string; name: string; ts: number; p: unknown }
  | { k: 'mesh'; id: string; mesh: unknown };

const b64url = (u8: Uint8Array) => {
  let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const rnd = (n: number) => crypto.getRandomValues(new Uint8Array(n));

async function pipe(data: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Blob([data as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

function loadMe(): TeamState['me'] {
  try {
    const m = JSON.parse(localStorage.getItem(ME_KEY) ?? 'null');
    if (m?.id && m?.name) return m;
  } catch {
    /* neu */
  }
  const id = b64url(rnd(6));
  return { id, name: '', color: COLORS[rnd(1)[0] % COLORS.length] };
}

let st: TeamState = { room: null, status: 'aus', broker: '', members: [], me: loadMe(), last: null, error: null };
const listeners = new Set<() => void>();
const set = (p: Partial<TeamState>) => {
  st = { ...st, ...p };
  listeners.forEach((l) => l());
};

let mqs: Mqtt[] = [];
const online = new Set<number>();
let key: CryptoKey | null = null;
let secret = '';
let hb: ReturnType<typeof setInterval> | null = null;
let creator = false;
const receivers = new Set<(m: TeamMsg, retained: boolean) => void>();

async function encrypt(obj: unknown, k: CryptoKey | null = key): Promise<Uint8Array> {
  const raw = new TextEncoder().encode(JSON.stringify(obj));
  const z = await pipe(raw, new CompressionStream('deflate-raw'));
  const iv = rnd(12);
  const c = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k!, z as BufferSource));
  const out = new Uint8Array(12 + c.length);
  out.set(iv);
  out.set(c, 12);
  return out;
}
async function decrypt(u8: Uint8Array): Promise<TeamMsg | null> {
  if (!key || u8.length < 13) return null;
  try {
    const z = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u8.slice(0, 12) }, key, u8.slice(12)));
    return JSON.parse(new TextDecoder().decode(await pipe(z, new DecompressionStream('deflate-raw')))) as TeamMsg;
  } catch {
    return null; // fremder Schlüssel / kaputt
  }
}

const topic = (t: string) => `formwerk-team/${st.room}/${t}`;

function touch(id: string, patch: Partial<Member>) {
  if (id === st.me.id) return;
  const now = Date.now();
  const cur = st.members.find((m) => m.id === id);
  const next: Member = { id, name: '?', color: '#888', seen: now, edit: 0, ...cur, ...patch, ...(cur ? {} : {}) };
  next.seen = now;
  set({ members: [...st.members.filter((m) => m.id !== id), next].sort((a, b) => a.name.localeCompare(b.name)) });
}

async function onMessage(t: string, payload: Uint8Array, retained: boolean) {
  if (!payload.length) return;
  const m = await decrypt(payload);
  if (!m || m.id === st.me.id) return;
  if (m.k === 'hi') {
    const known = st.members.some((x) => x.id === m.id);
    touch(m.id, { name: m.name, color: m.color });
    if (!known) sayHi(); // Neuling soll uns auch sehen
  } else if (m.k === 'bye') set({ members: st.members.filter((x) => x.id !== m.id) });
  else if (m.k === 'state') {
    if (!retained) {
      touch(m.id, { name: m.name, edit: Date.now() });
      set({ last: { name: m.name, at: Date.now() } });
    }
  }
  void t;
  receivers.forEach((r) => r(m, retained));
}

let lastHi = 0;
function sayHi() {
  if (Date.now() - lastHi < 1500) return;
  lastHi = Date.now();
  void send({ k: 'hi', id: st.me.id, name: st.me.name || 'Gast', color: st.me.color });
}

async function send(m: TeamMsg, retainTopic?: string) {
  if (!mqs.length || !key) return;
  const data = await encrypt(m);
  if (data.length > 900_000) throw new Error('Projekt ist zu groß für die Live-Übertragung');
  for (const mq of mqs) mq.publish(retainTopic ? topic(retainTopic) : topic('ev'), data, !!retainTopic);
}

export const team = {
  get: () => st,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
  onReceive(r: (m: TeamMsg, retained: boolean) => void) {
    receivers.add(r);
    return () => void receivers.delete(r);
  },
  setName(name: string) {
    const me = { ...st.me, name: name.trim().slice(0, 24) };
    try {
      localStorage.setItem(ME_KEY, JSON.stringify(me));
    } catch {
      /* egal */
    }
    set({ me });
    if (st.status === 'online') {
      lastHi = 0;
      sayHi();
    }
  },
  setColor(color: string) {
    const me = { ...st.me, color };
    try {
      localStorage.setItem(ME_KEY, JSON.stringify(me));
    } catch {
      /* egal */
    }
    set({ me });
    lastHi = 0;
    if (st.status === 'online') sayHi();
  },
  /** neuen Raum anlegen und betreten */
  async create() {
    await team.join(b64url(rnd(9)), b64url(rnd(16)));
    creator = true;
  },
  /** Raum gerade selbst angelegt → eigenes Projekt ist der Startstand */
  isCreator: () => creator,
  async join(room: string, k: string) {
    team.leave(false);
    creator = false;
    if (!/^[A-Za-z0-9_-]{6,40}$/.test(room)) throw new Error('Ungültiger Einladungslink');
    if (typeof CompressionStream === 'undefined' || !crypto?.subtle) throw new Error('Dieser Browser ist zu alt für Zusammenarbeiten');
    key = await crypto.subtle.importKey('raw', fromB64url(k) as BufferSource, 'AES-GCM', false, ['encrypt', 'decrypt']);
    secret = k;
    try {
      localStorage.setItem(KEY, JSON.stringify({ room, k }));
    } catch {
      /* egal */
    }
    set({ room, status: 'connecting', members: [], last: null, error: null });
    online.clear();
    const cid = `fw-${st.me.id}-${b64url(rnd(3))}`;
    mqs = BROKERS.map((b, i) => {
      const mq = new Mqtt(cid, b, {
        onMessage: (t, p, r) => void onMessage(t, p, r),
        onStatus: (s) => {
          if (s === 'online') online.add(i);
          else online.delete(i);
          const any = online.size > 0;
          set({ status: any ? 'online' : s === 'offline' && st.status !== 'connecting' ? 'offline' : 'connecting', broker: `${online.size}/${BROKERS.length}` });
          if (s === 'online') {
            lastHi = 0;
            sayHi();
          }
        },
      });
      mq.subscribe(topic('state'));
      mq.subscribe(topic('ev'));
      mq.subscribe(topic('mesh/+'));
      mq.connect();
      return mq;
    });
    if (hb) clearInterval(hb);
    hb = setInterval(() => {
      if (st.status === 'online') {
        lastHi = 0;
        sayHi();
      }
      const cutoff = Date.now() - 45000;
      if (st.members.some((m) => m.seen < cutoff)) set({ members: st.members.filter((m) => m.seen >= cutoff) });
    }, 15000);
  },
  /** Raum verlassen (forget: nicht mehr automatisch wieder verbinden) */
  leave(forget = true) {
    const old = mqs;
    const oldTopic = topic('ev');
    mqs = [];
    online.clear();
    if (old.length && key && st.status === 'online') {
      encrypt({ k: 'bye', id: st.me.id })
        .then((d) => old.forEach((m) => m.publish(oldTopic, d)))
        .catch(() => {})
        .finally(() => setTimeout(() => old.forEach((m) => m.close()), 150));
    } else old.forEach((m) => m.close());
    if (hb) clearInterval(hb);
    hb = null;
    key = null;
    if (forget) {
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* egal */
      }
    }
    set({ room: null, status: 'aus', members: [], last: null });
  },
  /** nach dem Neuladen automatisch wieder in den Raum */
  resume() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) ?? 'null');
      if (s?.room && s?.k) return team.join(s.room, s.k);
    } catch {
      /* egal */
    }
  },
  link: () => (st.room ? `${SHARE_BASE}#team=${st.room}.${secret}` : ''),
  /** Projektstand an alle (und als letzter Stand im Raum liegen lassen) */
  sendState(p: unknown, ts: number) {
    return send({ k: 'state', id: st.me.id, name: st.me.name || 'Gast', ts, p }, 'state');
  },
  sendMesh(ref: string, mesh: unknown) {
    return send({ k: 'mesh', id: st.me.id, mesh }, `mesh/${ref}`);
  },
  setError: (e: string | null) => set({ error: e }),
};

export function readTeamHash(hash: string): { room: string; k: string } | null {
  const m = hash.match(/[#&]team=([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/);
  return m ? { room: m[1], k: m[2] } : null;
}

export function useTeam(): TeamState {
  return useSyncExternalStore(team.subscribe, team.get, team.get);
}
