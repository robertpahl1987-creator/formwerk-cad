/**
 * Optionale Laufzeit-Fähigkeiten, wenn die App als Claude-Artifact läuft
 * (Claude als KI ohne eigenen API-Key, Downloads aus dem Sandbox-Frame).
 * Außerhalb von Claude (z. B. GitHub Pages / installierte PWA) ist das alles null.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    claude?: { use(name: string): Promise<any> };
  }
}

const cache = new Map<string, Promise<any>>();

export function capability(name: string): Promise<any> {
  if (typeof window === 'undefined' || !window.claude?.use) return Promise.resolve(null);
  let p = cache.get(name);
  if (!p) {
    p = window.claude.use(name).catch(() => null);
    cache.set(name, p);
  }
  return p;
}

export const insideClaude = () => typeof window !== 'undefined' && !!window.claude?.use;
