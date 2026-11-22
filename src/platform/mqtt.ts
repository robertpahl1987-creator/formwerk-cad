/**
 * Kleiner MQTT-3.1.1-Client über WebSocket (nur QoS 0) – reicht, um mehrere Geräte
 * über einen öffentlichen Vermittler (Broker) zu verbinden. Inhalte werden vorher
 * Ende-zu-Ende verschlüsselt (siehe team.ts), der Broker sieht nur Datensalat.
 */

export const BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt', 'wss://test.mosquitto.org:8081/mqtt'];

const enc = new TextEncoder();
const dec = new TextDecoder();

function str(s: string): Uint8Array {
  const b = enc.encode(s);
  const out = new Uint8Array(b.length + 2);
  out[0] = b.length >> 8;
  out[1] = b.length & 255;
  out.set(b, 2);
  return out;
}
function varint(n: number): number[] {
  const out: number[] = [];
  do {
    let d = n % 128;
    n = Math.floor(n / 128);
    if (n > 0) d |= 128;
    out.push(d);
  } while (n > 0);
  return out;
}
function packet(first: number, ...parts: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const len = parts.reduce((s, p) => s + p.length, 0);
  const head = [first, ...varint(len)];
  const out = new Uint8Array(head.length + len);
  out.set(head, 0);
  let o = head.length;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

export interface MqttHandlers {
  onMessage: (topic: string, payload: Uint8Array, retained: boolean) => void;
  onStatus: (s: 'connecting' | 'online' | 'offline', info?: string) => void;
}

/** Verbindung, die sich bei Abbruch selbst neu aufbaut (mit Ausweich-Brokern). */
export class Mqtt {
  private ws: WebSocket | null = null;
  private buf = new Uint8Array(0);
  private ping: ReturnType<typeof setInterval> | null = null;
  private retry: ReturnType<typeof setTimeout> | null = null;
  private broker = 0;
  private fails = 0;
  private closed = false;
  private online = false;
  private pid = 1;
  private subs: string[] = [];
  private queue: Uint8Array[] = [];
  private will: { topic: string; payload: Uint8Array } | null = null;

  constructor(
    private clientId: string,
    private h: MqttHandlers,
  ) {}

  setWill(topic: string, payload: Uint8Array) {
    this.will = { topic, payload };
  }

  connect() {
    this.closed = false;
    this.open();
  }

  private open() {
    if (this.closed) return;
    const url = BROKERS[this.broker % BROKERS.length];
    this.h.onStatus('connecting', url.replace(/^wss:\/\/|:\d+.*$/g, ''));
    let ws: WebSocket;
    try {
      ws = new WebSocket(url, ['mqtt']);
    } catch {
      return this.scheduleRetry();
    }
    this.ws = ws;
    ws.binaryType = 'arraybuffer';
    const timeout = setTimeout(() => ws.readyState !== WebSocket.OPEN && ws.close(), 8000);
    ws.onopen = () => {
      clearTimeout(timeout);
      let flags = 0x02; // clean session
      const payload: Uint8Array[] = [str(this.clientId)];
      if (this.will) {
        flags |= 0x04 | 0x20; // Will, Will-Retain
        payload.push(str(this.will.topic));
        const w = new Uint8Array(this.will.payload.length + 2);
        w[0] = this.will.payload.length >> 8;
        w[1] = this.will.payload.length & 255;
        w.set(this.will.payload, 2);
        payload.push(w);
      }
      ws.send(packet(0x10, str('MQTT'), new Uint8Array([4, flags, 0, 30]), ...payload) as Uint8Array<ArrayBuffer>);
    };
    ws.onmessage = (e) => this.feed(new Uint8Array(e.data as ArrayBuffer));
    ws.onclose = ws.onerror = () => {
      clearTimeout(timeout);
      if (this.ws !== ws) return;
      this.ws = null;
      this.buf = new Uint8Array(0);
      if (this.ping) clearInterval(this.ping);
      this.ping = null;
      if (!this.online) this.broker++; // nie verbunden gewesen → nächsten Broker probieren
      this.online = false;
      this.h.onStatus('offline');
      this.scheduleRetry();
    };
  }

  private scheduleRetry() {
    if (this.closed || this.retry) return;
    this.fails++;
    this.retry = setTimeout(() => {
      this.retry = null;
      this.open();
    }, Math.min(15000, 600 * this.fails));
  }

  private feed(chunk: Uint8Array) {
    const b = new Uint8Array(this.buf.length + chunk.length);
    b.set(this.buf);
    b.set(chunk, this.buf.length);
    this.buf = b;
    for (;;) {
      if (this.buf.length < 2) return;
      let len = 0,
        mul = 1,
        i = 1;
      for (; ; i++) {
        if (i >= this.buf.length) return;
        const d = this.buf[i];
        len += (d & 127) * mul;
        mul *= 128;
        if (!(d & 128)) break;
        if (i > 4) return this.ws?.close();
      }
      const start = i + 1;
      if (this.buf.length < start + len) return;
      const first = this.buf[0];
      const body = this.buf.slice(start, start + len);
      this.buf = this.buf.slice(start + len);
      this.handle(first, body);
    }
  }

  private handle(first: number, body: Uint8Array) {
    const type = first >> 4;
    if (type === 2) {
      // CONNACK
      if (body[1] !== 0) {
        this.h.onStatus('offline', 'Broker lehnt ab');
        this.ws?.close();
        return;
      }
      this.online = true;
      this.fails = 0;
      this.h.onStatus('online', BROKERS[this.broker % BROKERS.length].replace(/^wss:\/\/|:\d+.*$/g, ''));
      if (this.subs.length) this.sendSub(this.subs);
      this.ping = setInterval(() => this.raw(new Uint8Array([0xc0, 0])), 20000);
      const q = this.queue;
      this.queue = [];
      q.forEach((p) => this.raw(p));
    } else if (type === 3) {
      // PUBLISH
      const qos = (first >> 1) & 3;
      const tl = (body[0] << 8) | body[1];
      const topic = dec.decode(body.subarray(2, 2 + tl));
      const off = 2 + tl + (qos > 0 ? 2 : 0);
      this.h.onMessage(topic, body.subarray(off), !!(first & 1));
    }
  }

  private raw(p: Uint8Array) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(p as Uint8Array<ArrayBuffer>);
  }

  private sendSub(topics: string[]) {
    const id = this.pid++ & 0xffff || 1;
    const parts: Uint8Array[] = [new Uint8Array([id >> 8, id & 255])];
    for (const t of topics) parts.push(str(t), new Uint8Array([0]));
    this.raw(packet(0x82, ...parts));
  }

  subscribe(topic: string) {
    if (!this.subs.includes(topic)) this.subs.push(topic);
    if (this.online) this.sendSub([topic]);
  }

  publish(topic: string, payload: Uint8Array, retain = false) {
    const p = packet(0x30 | (retain ? 1 : 0), str(topic), payload);
    if (this.online) this.raw(p);
    else if (retain) {
      // nur der letzte Stand je Thema zählt
      this.queue = [...this.queue.filter((x) => !(x[0] & 1) || !sameTopic(x, topic)), p];
    }
  }

  get isOnline() {
    return this.online;
  }

  close() {
    this.closed = true;
    if (this.retry) clearTimeout(this.retry);
    if (this.ping) clearInterval(this.ping);
    this.retry = this.ping = null;
    const ws = this.ws;
    this.ws = null;
    this.online = false;
    if (ws) {
      try {
        if (ws.readyState === WebSocket.OPEN) ws.send(new Uint8Array([0xe0, 0])); // DISCONNECT (kein Will)
        ws.close();
      } catch {
        /* egal */
      }
    }
  }
}

function sameTopic(p: Uint8Array, topic: string): boolean {
  let i = 1;
  while (p[i] & 128) i++;
  i++;
  const tl = (p[i] << 8) | p[i + 1];
  return dec.decode(p.subarray(i + 2, i + 2 + tl)) === topic;
}
