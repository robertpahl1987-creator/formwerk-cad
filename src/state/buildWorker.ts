/**
 * Baut Modelle im Hintergrund (Web Worker), damit die Seite bei großen Modellen
 * (Gewinde, Rändel, viele Löcher) nicht einfriert.
 */
import { registerImported, type ImportedMesh } from '../mesh/importMesh';
import type { ModelDef, Value } from '../cad/types';
import { runPipeline, type PipelineSettings } from './pipeline';

export interface BuildRequest {
  id: number;
  model: ModelDef;
  values: Record<string, Value>;
  settings: PipelineSettings;
  imports: ImportedMesh[];
}

self.onmessage = async (e: MessageEvent<BuildRequest>) => {
  const { id, model, values, settings, imports } = e.data;
  try {
    for (const im of imports) await registerImported(im, false);
    const r = runPipeline(model, values, settings);
    (self as unknown as Worker).postMessage({ id, ok: true, result: r });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, ok: false, error: (err as Error)?.message ?? String(err) });
  }
};
(self as unknown as Worker).postMessage({ ready: true });
