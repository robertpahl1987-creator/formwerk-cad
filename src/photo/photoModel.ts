import type { ModelDef } from '../cad/types';
import type { Pt } from './vision';

/** Erzeugt aus einer gemessenen Kontur ein parametrisches Modell (Teil oder Negativform). */
export function photoModel(outer: Pt[], holes: Pt[][], width: number, height: number, name = 'Teil aus Foto'): ModelDef {
  const W = Math.round(width * 100) / 100;
  const H = Math.round(height * 100) / 100;
  return {
    name,
    description: `Aus Foto vermessene Kontur (${W} × ${H} mm).`,
    source: 'photo',
    params: [
      {
        key: 'mode',
        label: 'Art',
        type: 'select',
        value: 0,
        options: [
          { value: 0, label: 'Teil (Kontur extrudiert)' },
          { value: 1, label: 'Negativform / Einsatz mit Aussparung' },
        ],
      },
      { key: 'depth', label: 'Tiefe / Extrusion', type: 'number', value: 5, min: 0.4, max: 150, step: 0.1, unit: 'mm', role: 'depth' },
      { key: 'korr', label: 'Maßkorrektur Kontur', type: 'number', value: 0, min: -3, max: 3, step: 0.05, unit: 'mm', hint: 'Positiv = größer. Gleicht Schatten/Kanten im Foto aus.' },
      { key: 'skala', label: 'Skalierung', type: 'number', value: 100, min: 50, max: 200, step: 0.1, unit: '%' },
      { key: 'plateT', label: 'Bodenstärke (Negativform)', type: 'number', value: 2, min: 0.6, max: 20, step: 0.1, unit: 'mm', group: 'Negativform' },
      { key: 'rand', label: 'Rand um Aussparung', type: 'number', value: 5, min: 1, max: 50, step: 0.5, unit: 'mm', group: 'Negativform' },
    ],
    root: [
      {
        type: 'scale',
        v: ['skala/100', 'skala/100', 1],
        children: [
          {
            type: 'if',
            cond: 'mode == 0',
            then: [{ type: 'extrude', h: 'depth', shape: { type: 'polygon', points: outer, holes, offset: 'korr' } }],
            else: [
              {
                type: 'difference',
                children: [
                  { type: 'extrude', h: 'depth + plateT', shape: { type: 'rect', size: [`${W} + 2*rand`, `${H} + 2*rand`], r: 3, center: true } },
                  {
                    type: 'translate',
                    v: [0, 0, 'plateT'],
                    children: [{ type: 'extrude', h: 'depth + 1', shape: { type: 'polygon', points: outer, offset: 'tol + korr' } }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}
