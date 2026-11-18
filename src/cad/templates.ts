/**
 * Geprüfte parametrische Vorlagen. Sie funktionieren offline (ohne KI) und
 * dienen der KI gleichzeitig als Beispiele für das DSL-Format.
 */
import type { CadNode, ModelDef, ParamDef, ParamRole } from './types';

const num = (
  key: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step = 0.5,
  extra: Partial<ParamDef> = {},
): ParamDef => ({ key, label, type: 'number', value, min, max, step, unit: 'mm', ...extra });
const cnt = (key: string, label: string, value: number, min: number, max: number, extra: Partial<ParamDef> = {}): ParamDef => ({
  key,
  label,
  type: 'number',
  value,
  min,
  max,
  step: 1,
  unit: 'Stk',
  role: 'count',
  ...extra,
});
const flag = (key: string, label: string, value: boolean, extra: Partial<ParamDef> = {}): ParamDef => ({ key, label, type: 'bool', value, ...extra });

const T = (v: [string | number, string | number, string | number], ...children: CadNode[]): CadNode => ({ type: 'translate', v, children });
const R = (a: [number, number, number], ...children: CadNode[]): CadNode => ({ type: 'rotate', a, children });
const diff = (...children: CadNode[]): CadNode => ({ type: 'difference', children });
const uni = (...children: CadNode[]): CadNode => ({ type: 'union', children });
const rrect = (w: string | number, h: string | number, r: string | number, height: string | number): CadNode => ({
  type: 'extrude',
  h: height,
  shape: { type: 'rect', size: [w, h], r, center: true },
});

/** Senkbohrung, Kopf oben bei z = top. */
const countersunkHole = (d: string, head: string, top: string, through: string, withSink: string): CadNode[] => [
  { type: 'cylinder', d: `${d} + 2*tol`, h: through, center: true },
  {
    type: 'if',
    cond: withSink,
    then: [T([0, 0, `${top} - (${head} - ${d})/2 + 0.01`], { type: 'cylinder', r1: `${d}/2 + tol`, r2: `${head}/2 + tol`, h: `(${head} - ${d})/2` })],
  },
];

export interface Template {
  id: string;
  name: string;
  icon: string;
  keywords: string[];
  model: ModelDef;
}

const t = (id: string, name: string, icon: string, keywords: string[], description: string, params: ParamDef[], root: CadNode[]): Template => ({
  id,
  name,
  icon,
  keywords,
  model: { name, description, params, root, source: 'template', templateId: id },
});

export const TEMPLATES: Template[] = [
  t(
    'box',
    'Box mit Steckdeckel',
    '📦',
    ['box', 'dose', 'kiste', 'schachtel', 'behälter', 'behaelter', 'gehäuse', 'gehaeuse', 'deckel', 'aufbewahrung'],
    'Gerundete Box mit passgenauem Steckdeckel (Spiel = Drucktoleranz).',
    [
      num('L', 'Länge (außen)', 80, 20, 250, 0.5, { role: 'length' }),
      num('B', 'Breite (außen)', 60, 20, 250, 0.5, { role: 'width' }),
      num('H', 'Höhe (außen)', 40, 8, 250, 0.5, { role: 'height' }),
      num('wall', 'Wandstärke', 2, 1.2, 6, 0.1, { role: 'wall' }),
      num('floor', 'Boden-/Deckelstärke', 2, 0.8, 6, 0.1),
      num('r', 'Eckenradius', 4, 0, 20, 0.5),
      num('lidH', 'Deckel-Steckrand', 6, 2, 20, 0.5),
      num('gap', 'Abstand Deckel', 10, 2, 40, 1, { group: 'Anordnung' }),
    ],
    [
      diff(rrect('L', 'B', 'r', 'H'), T([0, 0, 'floor'], rrect('L - 2*wall', 'B - 2*wall', 'max(r - wall, 0)', 'H'))),
      T(
        [0, 'B + gap', 0],
        uni(
          rrect('L', 'B', 'r', 'floor'),
          T(
            [0, 0, 'floor - 0.01'],
            diff(
              rrect('L - 2*wall - 2*tol', 'B - 2*wall - 2*tol', 'max(r - wall - tol, 0)', 'lidH + 0.01'),
              T([0, 0, -1], rrect('L - 4*wall - 2*tol', 'B - 4*wall - 2*tol', 'max(r - 2*wall - tol, 0)', 'lidH + 2')),
            ),
          ),
        ),
      ),
    ],
  ),
  t(
    'channel',
    'Kabelkanal mit Deckel',
    '🔌',
    ['kabel', 'kanal', 'kabelkanal', 'leitung', 'kabelführung', 'kabelfuehrung'],
    'U-Kabelkanal mit Senkbohrungen und aufsteckbarem Klemmdeckel.',
    [
      num('L', 'Länge', 150, 20, 250, 1, { role: 'length' }),
      num('wi', 'Innenbreite', 20, 5, 120, 0.5, { role: 'width' }),
      num('hi', 'Innenhöhe', 15, 5, 120, 0.5, { role: 'height' }),
      num('wall', 'Wandstärke', 2, 1.2, 5, 0.1, { role: 'wall' }),
      cnt('n', 'Anzahl Schraubenlöcher', 3, 0, 12),
      num('hd', 'Schrauben-Ø', 3.5, 2, 8, 0.1, { role: 'hole' }),
      flag('senk', 'Senkkopf', true),
      num('lipH', 'Klemmrand Deckel', 4, 2, 15, 0.5),
      num('gap', 'Abstand Deckel', 8, 2, 40, 1, { group: 'Anordnung' }),
    ],
    [
      diff(
        T([0, 0, '(hi + wall)/2'], { type: 'cube', size: ['L', 'wi + 2*wall', 'hi + wall'], center: true }),
        T([0, 0, 'wall + (hi + 1)/2'], { type: 'cube', size: ['L + 2', 'wi', 'hi + 1'], center: true }),
        {
          type: 'if',
          cond: 'n > 0',
          then: [
            {
              type: 'for',
              var: 'i',
              from: 0,
              to: 'n - 1',
              children: [T(['-L/2 + L/n*(i + 0.5)', 0, 0], ...countersunkHole('hd', '2*hd', 'wall', 'wall*4', 'senk'))],
            },
          ],
        },
      ),
      T(
        [0, 'wi + 2*wall + gap', 0],
        uni(
          T([0, 0, 'wall/2'], { type: 'cube', size: ['L', 'wi + 2*wall', 'wall'], center: true }),
          T([0, 'wi/2 - tol - wall/2', 'wall + lipH/2 - 0.01'], { type: 'cube', size: ['L', 'wall', 'lipH + 0.02'], center: true }),
          T([0, '-(wi/2 - tol - wall/2)', 'wall + lipH/2 - 0.01'], { type: 'cube', size: ['L', 'wall', 'lipH + 0.02'], center: true }),
        ),
      ),
    ],
  ),
  t(
    'wallholder',
    'Wandhalterung (Werkzeug/Bohrmaschine)',
    '🛠️',
    ['wandhalter', 'wandhalterung', 'halterung', 'halter', 'bohrmaschine', 'akkuschrauber', 'werkzeug', 'werkbank', 'gabel'],
    'Wandplatte mit Gabelarm für Werkzeuge (z. B. Bohrmaschinen-Hals), Stützrippen und Senkbohrungen. Wird flach liegend gedruckt.',
    [
      num('slot', 'Gabelweite (Hals-Ø)', 30, 8, 120, 0.5, { role: 'hole', group: 'Gabel' }),
      num('armW', 'Gabelarm-Breite', 45, 15, 160, 0.5, { role: 'width', group: 'Gabel' }),
      num('armL', 'Auslage', 55, 20, 200, 0.5, { role: 'length', group: 'Gabel' }),
      num('armT', 'Armstärke', 8, 4, 20, 0.5, { role: 'wall', group: 'Gabel' }),
      num('pw', 'Plattenbreite', 60, 20, 200, 0.5, { group: 'Wandplatte' }),
      num('ph', 'Plattenhöhe', 80, 30, 200, 0.5, { role: 'height', group: 'Wandplatte' }),
      num('pt', 'Plattenstärke', 5, 2, 15, 0.5, { group: 'Wandplatte' }),
      num('g', 'Stützrippe', 15, 0, 60, 0.5, { group: 'Wandplatte' }),
      num('sd', 'Schrauben-Ø', 4.5, 2, 8, 0.1, { group: 'Befestigung' }),
      num('sk', 'Senkkopf-Ø', 9, 4, 16, 0.1, { group: 'Befestigung' }),
      flag('senk', 'Senkkopf', true, { group: 'Befestigung' }),
    ],
    [
      diff(
        uni(
          T(['-pw/2', '-ph/2', 0], { type: 'cube', size: ['pw', 'ph', 'pt'] }),
          T(['-armW/2', 'ph/2 - armT', 'pt - 0.01'], { type: 'cube', size: ['armW', 'armT', 'armL + 0.01'] }),
          {
            type: 'if',
            cond: 'g > 0',
            then: [
              T(
                ['-armW/2', 'ph/2 - armT + 0.01', 'pt - 0.01'],
                R([90, 0, 90], { type: 'extrude', h: 'min(armT, armW/4)', shape: { type: 'polygon', points: [[0, 0], ['-g', 0], [0, 'g']] } }),
              ),
              T(
                ['armW/2 - min(armT, armW/4)', 'ph/2 - armT + 0.01', 'pt - 0.01'],
                R([90, 0, 90], { type: 'extrude', h: 'min(armT, armW/4)', shape: { type: 'polygon', points: [[0, 0], ['-g', 0], [0, 'g']] } }),
              ),
            ],
          },
        ),
        T([0, 'ph/2 - armT/2', 'pt + armL - slot/2 - tol'], R([90, 0, 0], { type: 'cylinder', r: 'slot/2 + tol', h: 'armT + 2', center: true })),
        T([0, 'ph/2 - armT/2', 'pt + armL - slot/4 - tol/2 + 1'], { type: 'cube', size: ['slot + 2*tol', 'armT + 2', 'slot/2 + tol + 2'], center: true }),
        T([0, '-ph/2 + 14', 0], ...countersunkHole('sd', 'sk', 'pt', 'pt*4', 'senk')),
        T([0, 'ph/2 - armT - g - 8', 0], ...countersunkHole('sd', 'sk', 'pt', 'pt*4', 'senk')),
      ),
    ],
  ),
  t(
    'spacer',
    'Distanzhülse',
    '🔩',
    ['hülse', 'huelse', 'distanz', 'spacer', 'abstandshalter', 'abstand', 'buchse', 'rolle', 'ring', 'unterlegscheibe', 'scheibe'],
    'Distanzhülse mit Innenfasen; Innenmaß inkl. Drucktoleranz.',
    [
      num('od', 'Außen-Ø', 12, 3, 150, 0.1, { role: 'width' }),
      num('id', 'Innen-Ø (Bohrung)', 5, 0.5, 140, 0.1, { role: 'hole' }),
      num('h', 'Höhe', 10, 0.6, 200, 0.1, { role: 'height' }),
      num('c', 'Fase innen', 0.6, 0, 3, 0.1),
    ],
    [
      diff(
        { type: 'cylinder', r: 'od/2', h: 'h' },
        T([0, 0, -1], { type: 'cylinder', d: 'id + 2*tol', h: 'h + 2' }),
        {
          type: 'if',
          cond: 'c > 0',
          then: [
            T([0, 0, -0.01], { type: 'cylinder', r1: 'id/2 + tol + c', r2: 'id/2 + tol', h: 'c' }),
            T([0, 0, 'h - c + 0.01'], { type: 'cylinder', r1: 'id/2 + tol', r2: 'id/2 + tol + c', h: 'c' }),
          ],
        },
      ),
    ],
  ),
  t(
    'plate',
    'Montageplatte mit Lochraster',
    '🔲',
    ['platte', 'lochplatte', 'montageplatte', 'grundplatte', 'blende', 'abdeckung', 'adapterplatte', 'schraubenlöcher', 'löcher'],
    'Flache Platte mit gerundeten Ecken und frei wählbarem Lochraster (optional Senkkopf).',
    [
      num('L', 'Länge', 100, 10, 250, 0.5, { role: 'length' }),
      num('B', 'Breite', 60, 10, 250, 0.5, { role: 'width' }),
      num('T', 'Stärke', 4, 1, 30, 0.1, { role: 'height' }),
      num('r', 'Eckenradius', 4, 0, 30, 0.5),
      cnt('nx', 'Löcher in X', 2, 1, 20),
      cnt('ny', 'Löcher in Y', 1, 1, 20),
      num('hd', 'Loch-Ø', 4.5, 1, 40, 0.1, { role: 'hole' }),
      num('m', 'Randabstand', 8, 2, 60, 0.5),
      flag('senk', 'Senkkopf', true),
      num('sk', 'Senkkopf-Ø', 9, 3, 30, 0.1),
    ],
    [
      diff(rrect('L', 'B', 'r', 'T'), {
        type: 'for',
        var: 'i',
        from: 0,
        to: 'nx - 1',
        children: [
          {
            type: 'for',
            var: 'j',
            from: 0,
            to: 'ny - 1',
            children: [
              T(
                ['nx == 1 ? 0 : -L/2 + m + i*(L - 2*m)/(nx - 1)', 'ny == 1 ? 0 : -B/2 + m + j*(B - 2*m)/(ny - 1)', 0],
                ...countersunkHole('hd', 'sk', 'T', 'T*4', 'senk && sk > hd'),
              ),
            ],
          },
        ],
      }),
    ],
  ),
  t(
    'hook',
    'Wandhaken',
    '🪝',
    ['haken', 'wandhaken', 'aufhänger', 'aufhaenger', 'garderobe', 'kleiderhaken', 'schlüssel', 'jacke'],
    'J-Haken, seitlich liegend gedruckt (maximale Festigkeit). Bei aktivierten Fasen werden die Schraubenlöcher als überhangfreie Tropfenlöcher erzeugt.',
    [
      num('W', 'Breite', 20, 6, 120, 0.5, { role: 'width' }),
      num('H', 'Rückenhöhe', 70, 20, 250, 0.5, { role: 'height' }),
      num('T', 'Materialstärke', 5, 2, 20, 0.5, { role: 'wall' }),
      num('armL', 'Auslage', 35, 10, 150, 0.5, { role: 'length' }),
      num('tipH', 'Spitzenhöhe', 15, 4, 100, 0.5),
      num('hd', 'Schrauben-Ø', 4, 2, 8, 0.1, { role: 'hole' }),
    ],
    [
      diff(
        uni(
          { type: 'extrude', h: 'W', shape: { type: 'rect', size: ['T', 'H'] } },
          { type: 'extrude', h: 'W', shape: { type: 'rect', size: ['armL', 'T'] } },
          T(['armL - T', 0, 0], { type: 'extrude', h: 'W', shape: { type: 'rect', size: ['T', 'tipH'] } }),
        ),
        ...['H - 10', 'H/2 + 2'].map((y) =>
          T(['T/2', y, 'W/2'], {
            type: 'if',
            cond: 'fase',
            then: [{ type: 'teardrop', d: 'hd + 2*tol', h: 'T*4', axis: 'x' }],
            else: [R([0, 90, 0], { type: 'cylinder', d: 'hd + 2*tol', h: 'T*4', center: true })],
          } as CadNode),
        ),
      ),
    ],
  ),
  t(
    'angle',
    'L-Winkel mit Stützrippen',
    '📐',
    ['winkel', 'l-winkel', 'eckwinkel', 'regalwinkel', 'regal', 'konsole', 'verbinder', 'ecke'],
    'Winkelverbinder, seitlich liegend gedruckt. Löcher werden bei aktivierten Fasen als Tropfenlöcher erzeugt.',
    [
      num('a', 'Schenkel A', 40, 10, 200, 0.5, { role: 'length' }),
      num('b', 'Schenkel B', 40, 10, 200, 0.5, { role: 'height' }),
      num('w', 'Breite', 20, 6, 150, 0.5, { role: 'width' }),
      num('t', 'Materialstärke', 4, 1.5, 15, 0.1, { role: 'wall' }),
      num('hd', 'Loch-Ø', 4.5, 1, 12, 0.1, { role: 'hole' }),
      flag('rippe', 'Stützrippen', true),
      num('g', 'Rippengröße', 15, 3, 150, 0.5),
    ],
    [
      diff(
        uni(
          { type: 'extrude', h: 'w', shape: { type: 'rect', size: ['a', 't'] } },
          { type: 'extrude', h: 'w', shape: { type: 'rect', size: ['t', 'b'] } },
          {
            type: 'if',
            cond: 'rippe',
            then: [
              { type: 'extrude', h: 'min(3, w/4)', shape: { type: 'polygon', points: [['t - 0.01', 't - 0.01'], ['min(t + g, a)', 't - 0.01'], ['t - 0.01', 'min(t + g, b)']] } },
              T([0, 0, 'w - min(3, w/4)'], {
                type: 'extrude',
                h: 'min(3, w/4)',
                shape: { type: 'polygon', points: [['t - 0.01', 't - 0.01'], ['min(t + g, a)', 't - 0.01'], ['t - 0.01', 'min(t + g, b)']] },
              }),
            ],
          },
        ),
        T(['t + (a - t)/2', 't/2', 'w/2'], {
          type: 'if',
          cond: 'fase',
          then: [{ type: 'teardrop', d: 'hd + 2*tol', h: 't*4', axis: 'y' }],
          else: [R([90, 0, 0], { type: 'cylinder', d: 'hd + 2*tol', h: 't*4', center: true })],
        }),
        T(['t/2', 't + (b - t)/2', 'w/2'], {
          type: 'if',
          cond: 'fase',
          then: [{ type: 'teardrop', d: 'hd + 2*tol', h: 't*4', axis: 'x' }],
          else: [R([0, 90, 0], { type: 'cylinder', d: 'hd + 2*tol', h: 't*4', center: true })],
        }),
      ),
    ],
  ),
  t(
    'organizer',
    'Sortiereinsatz / Organizer',
    '🗂️',
    ['organizer', 'sortier', 'sortiereinsatz', 'einsatz', 'schublade', 'fach', 'fächer', 'faecher', 'tray', 'ablage'],
    'Schubladeneinsatz mit frei wählbarer Fächeraufteilung.',
    [
      num('L', 'Länge', 120, 20, 250, 0.5, { role: 'length' }),
      num('B', 'Breite', 80, 20, 250, 0.5, { role: 'width' }),
      num('H', 'Höhe', 40, 5, 200, 0.5, { role: 'height' }),
      num('wall', 'Wandstärke', 1.6, 0.8, 5, 0.1, { role: 'wall' }),
      num('floor', 'Bodenstärke', 1.2, 0.6, 5, 0.1),
      num('r', 'Eckenradius', 3, 0, 20, 0.5),
      cnt('nx', 'Fächer in X', 3, 1, 12),
      cnt('ny', 'Fächer in Y', 2, 1, 12),
    ],
    [
      diff(rrect('L', 'B', 'r', 'H'), T([0, 0, 'floor'], rrect('L - 2*wall', 'B - 2*wall', 'max(r - wall, 0)', 'H'))),
      {
        type: 'if',
        cond: 'nx > 1',
        then: [
          {
            type: 'for',
            var: 'i',
            from: 1,
            to: 'nx - 1',
            children: [T(['-L/2 + i*L/nx', 0, 'floor + (H - floor)/2 - 0.005'], { type: 'cube', size: ['wall', 'B - wall', 'H - floor + 0.01'], center: true })],
          },
        ],
      },
      {
        type: 'if',
        cond: 'ny > 1',
        then: [
          {
            type: 'for',
            var: 'j',
            from: 1,
            to: 'ny - 1',
            children: [T([0, '-B/2 + j*B/ny', 'floor + (H - floor)/2 - 0.005'], { type: 'cube', size: ['L - wall', 'wall', 'H - floor + 0.01'], center: true })],
          },
        ],
      },
    ],
  ),
  t(
    'nameplate',
    'Namensschild (mehrfarbig)',
    '🏷️',
    ['schild', 'namensschild', 'türschild', 'tuerschild', 'beschriftung', 'text', 'name', 'mehrfarbig', 'mehrfarben', 'label', 'logo'],
    'Zweifarbiges Schild: Grundplatte in Slot 1, erhabene Schrift und Rahmen in Slot 2 (AMS-Mehrfarbendruck).',
    [
      { key: 'txt', label: 'Text', type: 'text', value: 'Werkstatt' },
      num('L', 'Länge', 120, 30, 250, 0.5, { role: 'length' }),
      num('B', 'Breite', 35, 10, 150, 0.5, { role: 'width' }),
      num('T', 'Plattenstärke', 3, 1, 10, 0.1, { role: 'height' }),
      num('r', 'Eckenradius', 5, 0, 20, 0.5),
      num('size', 'Schriftgröße', 12, 3, 80, 0.5, { group: 'Schrift', hint: 'Zu langer Text wird automatisch auf die Schildbreite verkleinert.' }),
      num('th', 'Schrift erhaben', 1.2, 0.2, 5, 0.1, { group: 'Schrift' }),
      num('stroke', 'Strichstärke', 2.2, 0.6, 8, 0.1, { group: 'Schrift' }),
      flag('rand', 'Rahmen in Schriftfarbe', true, { group: 'Schrift' }),
      flag('holes', 'Befestigungslöcher', true),
    ],
    [
      {
        type: 'color',
        slot: 1,
        name: 'Grundplatte',
        children: [
          diff(rrect('L', 'B', 'r', 'T'), {
            type: 'if',
            cond: 'holes',
            then: [
              T(['-L/2 + 6', 0, 0], { type: 'cylinder', d: '3.5 + 2*tol', h: 'T*4', center: true }),
              T(['L/2 - 6', 0, 0], { type: 'cylinder', d: '3.5 + 2*tol', h: 'T*4', center: true }),
            ],
          }),
        ],
      },
      {
        type: 'color',
        slot: 2,
        name: 'Schrift',
        children: [
          T([0, 0, 'T'], { type: 'text', text: '{txt}', size: 'size', h: 'th', stroke: 'stroke', maxW: 'L - 26' }),
          {
            type: 'if',
            cond: 'rand',
            then: [
              T([0, 0, 'T'], diff(rrect('L - 2', 'B - 2', 'max(r - 1, 0)', 'th'), T([0, 0, -1], rrect('L - 5', 'B - 5', 'max(r - 2.5, 0)', 'th + 2')))),
            ],
          },
        ],
      },
    ],
  ),
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((x) => x.id === id);
}

export interface Measures {
  length?: number;
  width?: number;
  height?: number;
  wall?: number;
  hole?: number;
  count?: number;
}

/** Offline-Zuordnung: Text → beste Vorlage. */
export function matchTemplate(text: string): Template {
  const s = text.toLowerCase();
  let best = TEMPLATES[0];
  let bestScore = -1;
  for (const tp of TEMPLATES) {
    let score = 0;
    for (const k of tp.keywords) if (s.includes(k)) score += k.length;
    if (score > bestScore) {
      bestScore = score;
      best = tp;
    }
  }
  return bestScore > 0 ? best : getTemplate('plate')!;
}

/** Liest Maße aus Freitext („120 x 40 x 20 mm“, „Ø 8“, „2 Schraubenlöcher“). */
export function parseMeasuresFromText(text: string): Measures {
  const m: Measures = {};
  const n = (x: string) => parseFloat(x.replace(',', '.'));
  const dims = text.match(/(\d+(?:[.,]\d+)?)\s*(?:mm)?\s*[x×*]\s*(\d+(?:[.,]\d+)?)(?:\s*(?:mm)?\s*[x×*]\s*(\d+(?:[.,]\d+)?))?/i);
  if (dims) {
    m.length = n(dims[1]);
    m.width = n(dims[2]);
    if (dims[3]) m.height = n(dims[3]);
  }
  const lab = (re: RegExp) => {
    const r = text.match(re);
    return r ? n(r[1]) : undefined;
  };
  m.length ??= lab(/länge\s*(?:von)?\s*(\d+(?:[.,]\d+)?)/i);
  m.width ??= lab(/breite\s*(?:von)?\s*(\d+(?:[.,]\d+)?)/i);
  m.height ??= lab(/höhe\s*(?:von)?\s*(\d+(?:[.,]\d+)?)/i);
  m.wall ??= lab(/wand(?:stärke)?\s*(?:von)?\s*(\d+(?:[.,]\d+)?)/i);
  m.hole ??= lab(/(?:ø|⌀|durchmesser|loch(?:durchmesser)?|bohrung|m)\s*(\d+(?:[.,]\d+)?)/i);
  const c = text.match(/(\d+|zwei|drei|vier|fünf|sechs)\s*(?:schrauben)?(?:löcher|loecher|schrauben|bohrungen|fächer|faecher)/i);
  if (c) {
    const words: Record<string, number> = { zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6 };
    m.count = words[c[1].toLowerCase()] ?? parseInt(c[1], 10);
  }
  return m;
}

/** Überträgt Maße per Rolle auf die Parameter eines Modells. */
export function applyMeasures(model: ModelDef, values: Record<string, number | boolean | string>, ms: Measures): Record<string, number | boolean | string> {
  const out = { ...values };
  const roleMap: Record<string, ParamRole> = { length: 'length', width: 'width', height: 'height', wall: 'wall', hole: 'hole', count: 'count' };
  for (const [k, v] of Object.entries(ms)) {
    if (v === undefined || !Number.isFinite(v)) continue;
    const role = roleMap[k];
    const p = model.params.find((x) => x.role === role);
    if (!p) continue;
    let val = v as number;
    if (p.min !== undefined) val = Math.max(p.min, val);
    if (p.max !== undefined && val > p.max) p.max = val;
    out[p.key] = val;
  }
  return out;
}
