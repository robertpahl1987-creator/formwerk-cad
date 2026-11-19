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
          { value: 2, label: 'Etui mit Deckel (Gegenstand liegt passgenau drin)' },
        ],
      },
      { key: 'depth', label: 'Tiefe / Extrusion', type: 'number', value: 5, min: 0.4, max: 150, step: 0.1, unit: 'mm', role: 'depth' },
      { key: 'korr', label: 'Maßkorrektur Kontur', type: 'number', value: 0, min: -3, max: 3, step: 0.05, unit: 'mm', hint: 'Positiv = größer. Gleicht Schatten/Kanten im Foto aus.' },
      { key: 'skala', label: 'Skalierung', type: 'number', value: 100, min: 50, max: 200, step: 0.1, unit: '%' },
      { key: 'plateT', label: 'Bodenstärke (Negativform)', type: 'number', value: 2, min: 0.6, max: 20, step: 0.1, unit: 'mm', group: 'Negativform' },
      { key: 'rand', label: 'Rand um Aussparung', type: 'number', value: 5, min: 1, max: 50, step: 0.5, unit: 'mm', group: 'Negativform' },
      { key: 'luft', label: 'Platz über dem Gegenstand (Etui)', type: 'number', value: 2, min: 0, max: 30, step: 0.5, unit: 'mm', group: 'Etui' },
      { key: 'mulde', label: 'Griffmulden (Etui)', type: 'bool', value: true, group: 'Etui' },
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
                type: 'if',
                cond: 'mode == 2',
                then: [
                  // Etui: Wanne mit passgenauer Mulde, Absatz für den Deckel, Deckel daneben
                  {
                    type: 'difference',
                    children: [
                      { type: 'extrude', h: 'plateT + depth + luft + 4', shape: { type: 'rect', size: [`${W} + 2*rand`, `${H} + 2*rand`], r: 4, center: true } },
                      { type: 'translate', v: [0, 0, 'plateT'], children: [{ type: 'extrude', h: 'depth + luft + 10', shape: { type: 'polygon', points: outer, offset: 'tol + korr' } }] },
                      { type: 'translate', v: [0, 0, 'plateT + depth + luft'], children: [{ type: 'extrude', h: 10, shape: { type: 'rect', size: [`${W} + 2*rand - 4.8`, `${H} + 2*rand - 4.8`], r: 2, center: true } }] },
                      {
                        type: 'if',
                        cond: 'mulde',
                        then: [
                          { type: 'translate', v: [`-(${W})/2 - rand/2`, 0, 'plateT + depth + 6'], children: [{ type: 'sphere', r: 'min(rand + 6, depth + 4)' }] },
                          { type: 'translate', v: [`(${W})/2 + rand/2`, 0, 'plateT + depth + 6'], children: [{ type: 'sphere', r: 'min(rand + 6, depth + 4)' }] },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'translate',
                    v: [0, `${H} + 2*rand + 8`, 0],
                    children: [
                      {
                        type: 'union',
                        children: [
                          { type: 'extrude', h: 2, shape: { type: 'rect', size: [`${W} + 2*rand`, `${H} + 2*rand`], r: 4, center: true } },
                          {
                            type: 'difference',
                            children: [
                              { type: 'translate', v: [0, 0, 1.99], children: [{ type: 'extrude', h: 3.5, shape: { type: 'rect', size: [`${W} + 2*rand - 4.8 - 2*tol`, `${H} + 2*rand - 4.8 - 2*tol`], r: 2, center: true } }] },
                              { type: 'translate', v: [0, 0, 1.5], children: [{ type: 'extrude', h: 5, shape: { type: 'rect', size: [`${W} + 2*rand - 8`, `${H} + 2*rand - 8`], r: 1, center: true } }] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
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
      },
    ],
  };
}
