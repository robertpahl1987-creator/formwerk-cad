/**
 * Startet Modell-Berechnungen im Hintergrund-Worker. Kommt eine neue Anfrage, während
 * noch gerechnet wird, wird die alte Berechnung abgebrochen (Worker neu gestartet) –
 * so bleibt die App auch bei sehr aufwendigen Modellen bedienbar.
 * Wenn kein Worker verfügbar ist, wird wie bisher direkt gerechnet.
 */
import type { FreePart } from '../cad/free';
import type { ModelDef, Value } from '../cad/types';
import { getImported, type ImportedMesh } from '../mesh/importMesh';
import { runPipeline, type BuildResult, type PipelineSettings } from './pipeline';

declare const __FW_WORKER__: string | undefined;

let worker: Worker | null = null;
let broken = false;
let busy = false;
let seq = 0;
let pending: { id: number; resolve: (r: BuildResult) => void; reject: (e: Error) => void } | null = null;

function spawn(): Worker | null {
  if (broken || typeof Worker === 'undefined') return null;
  try {
    const w =
      typeof __FW_WORKER__ !== 'undefined'
        ? new Worker(new URL(__FW_WORKER__, import.meta.url), { type: 'module' })
        : new Worker(new URL('./buildWorker.ts', import.meta.url), { type: 'module' });
    w.onmessage = (e) => {
      const d = e.data as { id?: number; ok?: boolean; result?: BuildResult; error?: string; ready?: boolean };
      if (d.ready || d.id === undefined) return;
      if (!pending || pending.id !== d.id) return;
      const p = pending;
      pending = null;
      busy = false;
      if (d.ok) p.resolve(d.result!);
      else p.reject(new Error(d.error));
    };
    w.onerror = (e) => {
      // Worker ließ sich nicht laden (z. B. gesperrt) → künftig direkt rechnen
      e.preventDefault?.();
      broken = true;
      const p = pending;
      pending = null;
      busy = false;
      w.terminate();
      worker = null;
      if (p) p.reject(Object.assign(new Error('worker'), { workerFailed: true }));
    };
    return w;
  } catch {
    broken = true;
    return null;
  }
}

function importsOf(m: ModelDef): ImportedMesh[] {
  const refs = new Set<string>([...(m.imports ?? []).map((i) => i.ref), ...((m.freeParts as FreePart[] | undefined) ?? []).filter((p) => p.kind === 'import').map((p) => String(p.e.ref))]);
  return [...refs].map((r) => getImported(r)).filter((x): x is ImportedMesh => !!x);
}

/** Modell bauen; eine laufende ältere Berechnung wird verworfen. */
export function buildModel(model: ModelDef, values: Record<string, Value>, settings: PipelineSettings): Promise<BuildResult> {
  const id = ++seq;
  if (pending) {
    pending.reject(Object.assign(new Error('abgelöst'), { superseded: true }));
    pending = null;
  }
  // läuft noch eine (lange) Berechnung → Worker abbrechen und neu starten
  if (busy && worker) {
    worker.terminate();
    worker = null;
  }
  if (!worker) worker = spawn();
  if (!worker) return new Promise((res, rej) => setTimeout(() => (id === seq ? (() => { try { res(runPipeline(model, values, settings)); } catch (e) { rej(e as Error); } })() : rej(Object.assign(new Error('abgelöst'), { superseded: true }))), 0));
  return new Promise<BuildResult>((resolve, reject) => {
    pending = { id, resolve, reject };
    busy = true;
    try {
      worker!.postMessage({ id, model, values, settings, imports: importsOf(model) });
    } catch (e) {
      // nicht übertragbar → direkt rechnen
      pending = null;
      busy = false;
      try {
        resolve(runPipeline(model, values, settings));
      } catch (err) {
        reject(err as Error);
      }
      void e;
    }
  }).catch((e: Error & { workerFailed?: boolean }) => {
    if (e.workerFailed && id === seq) return runPipeline(model, values, settings);
    throw e;
  });
}
