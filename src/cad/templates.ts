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


/** Kugelschale (Halbkugel, Rand auf z=0, Öffnung unten) als Rotationsprofil – ohne Boolesche Operationen. */
const domeShell = (R: string, w: string, K = 24): CadNode => {
  const outer: [string, string][] = [];
  const inner: [string, string][] = [];
  for (let i = 0; i <= K; i++) {
    const a = (90 * i) / K;
    const c = i === K ? '0' : `cos(${a})`;
    outer.push([i === K ? '0' : `(${R})*${c}`, `(${R})*sin(${a})`]);
  }
  for (let i = K; i >= 0; i--) {
    const a = (90 * i) / K;
    inner.push([i === K ? '0' : `(${R} - ${w})*cos(${a})`, `(${R} - ${w})*sin(${a})`]);
  }
  return { type: 'revolve', fn: 96, shape: { type: 'polygon', points: [...outer, ...inner] } };
};
/** Ring von n radialen Löchern (Polwinkel von oben gemessen) durch eine Kugelschale mit Mittelpunkt im Ursprung. */
const sphereHoles = (R: string, w: string, d: string, n: string, polar: number, offset: string | number = 0): CadNode => ({
  type: 'for',
  var: 'i',
  from: 0,
  to: `${n} - 1`,
  children: [{ type: 'rotate', a: [0, polar, `i*360/(${n}) + ${offset}`], children: [T([0, 0, `${R} - ${w}/2`], { type: 'cylinder', d, h: `4*${w} + 4`, center: true })] }],
});

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
    ['organizer', 'sortier', 'sortiereinsatz', 'einsatz', 'schublade', 'fach', 'fächer', 'faecher', 'tray', 'ablage', 'setzkasten', 'vitrine', 'figuren'],
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
  // ------------------------------------------------------------ Gridfinity
  t(
    'gridfinity',
    'Gridfinity-Behälter',
    '🧱',
    ['gridfinity', 'grid finity', 'raster-behälter', 'rasterbehälter', 'kiste raster', 'bin'],
    'Kompatibel mit dem Gridfinity-System (42-mm-Raster, 7-mm-Höheneinheiten): Füße passen in jede Gridfinity-Grundplatte, optional Stapelrand, Magnetlöcher und Fächer.',
    [
      cnt('gx', 'Breite (Raster-Einheiten)', 2, 1, 6, { unit: '× 42 mm', role: undefined }),
      cnt('gy', 'Tiefe (Raster-Einheiten)', 1, 1, 6, { unit: '× 42 mm', role: undefined }),
      cnt('gz', 'Höhe (Einheiten à 7 mm)', 6, 2, 20, { unit: '× 7 mm', role: undefined }),
      cnt('cx', 'Fächer in X', 2, 1, 12, { role: undefined }),
      cnt('cy', 'Fächer in Y', 1, 1, 12, { role: undefined }),
      num('wall', 'Wandstärke', 1.2, 0.8, 3, 0.1, { role: 'wall' }),
      flag('lip', 'Stapelrand', true, { hint: 'Behälter lassen sich aufeinander stapeln' }),
      flag('magnets', 'Magnetlöcher (6 × 2 mm)', false),
    ],
    (() => {
      const slab = (w: string, d: string, r: string, z: string): CadNode => T([0, 0, z], rrect(w, d, r, 0.01));
      const W = '42*gx - 0.5',
        D = '42*gy - 0.5',
        Ht = '7*gz';
      const foot: CadNode = {
        type: 'hull',
        children: [slab('35.6', '35.6', '0.8', '0'), slab('37.2', '37.2', '1.6', '0.79'), slab('37.2', '37.2', '1.6', '2.6'), slab('41.3', '41.3', '3.65', '4.85')],
      };
      const perUnit = (...kids: CadNode[]): CadNode => ({
        type: 'for',
        var: 'i',
        from: 0,
        to: 'gx - 1',
        children: [{ type: 'for', var: 'j', from: 0, to: 'gy - 1', children: [T(['-(gx-1)*21 + 42*i', '-(gy-1)*21 + 42*j', 0], ...kids)] }],
      });
      const fl = '5.95';
      const cavity: CadNode = {
        type: 'if',
        cond: 'lip',
        then: [
          {
            type: 'hull',
            children: [slab(`${W} - 2*wall`, `${D} - 2*wall`, 'max(3.75 - wall, 0.5)', fl), slab(`${W} - 2*wall`, `${D} - 2*wall`, 'max(3.75 - wall, 0.5)', `${Ht} - 1.6`), slab(`${W} - 5.2`, `${D} - 5.2`, '1.15', `${Ht}`)],
          },
          { type: 'hull', children: [slab(`${W} - 5.0`, `${D} - 5.0`, '1.25', `${Ht} - 0.6`), slab(`${W} - 1.4`, `${D} - 1.4`, '3.05', `${Ht} + 4.41`)] },
        ],
        else: [T([0, 0, fl], rrect(`${W} - 2*wall`, `${D} - 2*wall`, 'max(3.75 - wall, 0.5)', `${Ht} + 2`))],
      };
      const dividers: CadNode[] = [
        {
          type: 'for',
          var: 'k',
          from: 1,
          to: 'cx - 1',
          children: [T([`-(${W})/2 + wall + k*((${W}) - 2*wall)/cx`, 0, `${fl} - 0.3`], { type: 'cube', size: ['1.2', `${D} - wall`, `${Ht} - ${fl} - (lip ? 1.9 : 0) + 0.3`], center: false })],
        },
        {
          type: 'for',
          var: 'k',
          from: 1,
          to: 'cy - 1',
          children: [T([0, `-(${D})/2 + wall + k*((${D}) - 2*wall)/cy`, `${fl} - 0.3`], { type: 'cube', size: [`${W} - wall`, '1.2', `${Ht} - ${fl} - (lip ? 1.9 : 0) + 0.3`], center: false })],
        },
      ];
      // Trennwände mittig auf die Koordinate setzen (cube mit center:false → um halbe Stärke/Länge versetzen)
      const centeredDividers = dividers.map((d) => {
        const f = d as { type: 'for'; children: CadNode[] };
        const tr = f.children[0] as { type: 'translate'; v: [string, string, string]; children: CadNode[] };
        const isX = tr.v[0] !== '0';
        return {
          ...f,
          children: [T(isX ? [`${tr.v[0]} - 0.6`, `-(${D} - wall)/2`, tr.v[2]] : [`-(${W} - wall)/2`, `${tr.v[1]} - 0.6`, tr.v[2]], ...tr.children)],
        } as CadNode;
      });
      return [
        diff(
          uni(perUnit(foot), T([0, 0, 4.74], rrect(W, D, '3.75', `${Ht} - 4.74 + (lip ? 4.4 : 0)`))),
          cavity,
          { type: 'if', cond: 'magnets', then: [perUnit(...[-13, 13].flatMap((x) => [-13, 13].map((y) => T([x, y, -1], { type: 'cylinder', d: '6.5 + 2*tol', h: 3.4 } as CadNode)))) ] },
        ),
        ...centeredDividers,
      ];
    })(),
  ),
  t(
    'gridfinity_platte',
    'Gridfinity-Grundplatte',
    '🟩',
    ['gridfinity grundplatte', 'gridfinity platte', 'grundplatte', 'baseplate'],
    'Grundplatte im 42-mm-Gridfinity-Raster – die Behälter rasten darin ein. Größere Flächen aus mehreren Platten legen.',
    [cnt('gx', 'Breite (Raster-Einheiten)', 4, 1, 6, { unit: '× 42 mm', role: undefined }), cnt('gy', 'Tiefe (Raster-Einheiten)', 3, 1, 6, { unit: '× 42 mm', role: undefined })],
    (() => {
      const slab = (w: number, r: number, z: number): CadNode => T([0, 0, z], rrect(w, w, r, 0.01));
      return [
        diff(rrect('42*gx', '42*gy', 4, 4.65), {
          type: 'for',
          var: 'i',
          from: 0,
          to: 'gx - 1',
          children: [
            {
              type: 'for',
              var: 'j',
              from: 0,
              to: 'gy - 1',
              children: [
                T(['-(gx-1)*21 + 42*i', '-(gy-1)*21 + 42*j', 0], {
                  type: 'hull',
                  children: [slab(36.3, 1.15, -1), slab(36.3, 1.15, 0), slab(37.7, 1.85, 0.7), slab(37.7, 1.85, 2.5), slab(41.6, 3.8, 4.64), slab(41.6, 3.8, 5.7)],
                }),
              ],
            },
          ],
        }),
      ];
    })(),
  ),
  // ------------------------------------------------------------ Toleranztest
  t(
    'toleranztest',
    'Toleranz-Testdruck',
    '🎯',
    ['toleranz', 'kalibrier', 'passungstest', 'testdruck', 'passung'],
    'Einmal drucken: Stift in die Löcher stecken. Die Zahl unter dem Loch, das sich mit leichtem Druck stecken lässt, ist deine Toleranz in Hundertstel mm (z. B. 15 = 0,15 mm) – in den Einstellungen übernehmen.',
    [num('Dn', 'Nenn-Durchmesser', 10, 4, 20, 0.5)],
    [
      diff(
        T([0, 0, 0], rrect(104, 26, 3, 4)),
        ...[0.05, 0.1, 0.15, 0.2, 0.25, 0.3].flatMap((tv, i): CadNode[] => [
          T([-40 + i * 16, 4, 0], { type: 'cylinder', d: `Dn + ${2 * tv}`, h: 20, center: true }),
          T([-40 + i * 16, -8, 3.4], { type: 'text', text: String(Math.round(tv * 100)), size: 5, h: 2, stroke: 1 }),
        ]),
      ),
      T([66, 0, 0], { type: 'hull', children: [{ type: 'cylinder', d: 'Dn', h: 11.5 }, { type: 'cylinder', d: 'Dn - 1', h: 12 }] }),
    ],
  ),
  // ------------------------------------------------------------ Schnappdeckel
  t(
    'schnappbox',
    'Box mit Schnappdeckel',
    '🫙',
    ['schnapp', 'schnappdeckel', 'clip', 'klick', 'einrast', 'rastdeckel'],
    'Deckel rastet hörbar ein: umlaufende Rastnase am Deckel, passende Nut in der Box – beides mit 45°-Flanken, ohne Stützen druckbar. Deckel wird umgedreht daneben gedruckt.',
    [
      num('L', 'Länge', 80, 30, 200, 0.5, { role: 'length' }),
      num('B', 'Breite', 60, 30, 200, 0.5, { role: 'width' }),
      num('H', 'Höhe', 40, 15, 200, 0.5, { role: 'height' }),
      num('wall', 'Wandstärke', 2, 1.2, 5, 0.1, { role: 'wall' }),
      num('r', 'Eckenradius', 6, 2, 20, 0.5),
      num('lipH', 'Rand am Deckel', 7, 4, 20, 0.5),
      num('g', 'Rastnase', 0.5, 0.2, 1.2, 0.05, { hint: 'Größer = fester. 0,4–0,6 mm für PLA.' }),
    ],
    (() => {
      const slab = (w: string, d: string, r: string, z: string): CadNode => T([0, 0, z], rrect(w, d, r, 0.01));
      const iw = 'L - 2*wall',
        ib = 'B - 2*wall',
        ir = 'max(r - wall, 1)';
      const zc = 'H - lipH/2';
      const box = diff(
        rrect('L', 'B', 'r', 'H'),
        T([0, 0, 'wall'], rrect(iw, ib, ir, 'H')),
        // Nut (Raute 45°) innen umlaufend
        { type: 'hull', children: [slab(iw, ib, ir, `${zc} - g - tol`), slab(`${iw} + 2*(g + tol)`, `${ib} + 2*(g + tol)`, `${ir} + g + tol`, zc), slab(iw, ib, ir, `${zc} + g + tol`)] },
      );
      const lw = `${iw} - 2*tol`,
        lb = `${ib} - 2*tol`,
        lr = `max(${ir} - tol, 0.8)`;
      const zl = '2 + lipH/2';
      const lid = diff(
        uni(
          rrect('L', 'B', 'r', 2),
          T([0, 0, 1.99], rrect(lw, lb, lr, 'lipH + 0.01')),
          { type: 'hull', children: [slab(lw, lb, lr, `${zl} - g`), slab(`${lw} + 2*g`, `${lb} + 2*g`, `${lr} + g`, zl), slab(lw, lb, lr, `${zl} + g`)] },
        ),
        T([0, 0, 2], rrect(`${lw} - 3.2`, `${lb} - 3.2`, `max(${lr} - 1.6, 0.5)`, 'lipH + 5')),
      );
      return [box, T([0, 'B + 8', 0], lid)];
    })(),
  ),
  // ------------------------------------------------------------ Gewinde
  t(
    'schraubdose',
    'Dose mit Schraubdeckel',
    '🥫',
    ['gewinde', 'schraubdeckel', 'schraubdose', 'dose', 'schraubglas', 'drehverschluss', 'behälter rund', 'dose mit deckel'],
    'Runde Dose mit druckoptimiertem Gewinde (45°-Flanken, ohne Stützen druckbar) und passendem Schraubdeckel daneben.',
    [
      num('D', 'Innen-Ø', 50, 15, 200, 0.5, { role: 'width' }),
      num('H', 'Höhe', 60, 20, 200, 0.5, { role: 'height' }),
      num('wall', 'Wandstärke', 2, 1.2, 5, 0.1, { role: 'wall' }),
      num('p', 'Gewinde-Steigung', 3, 1.5, 6, 0.25),
      num('thl', 'Gewindelänge', 10, 5, 30, 0.5),
    ],
    (() => {
      const dm = 'D + 3.2 + 0.75*p';
      const Dl = `${dm} + 2*tol + 4.8`;
      return [
        diff(
          uni(
            { type: 'cylinder', d: Dl, h: 'H - thl + 0.01' },
            { type: 'cylinder', d: 'D + 3.0', h: 'H' },
            T([0, 0, 'H - thl + 0.5'], { type: 'thread', d: dm, pitch: 'p', h: 'thl - 0.5', chamfer: true }),
          ),
          T([0, 0, 'wall'], { type: 'cylinder', d: 'D', h: 'H' }),
        ),
        T([`${Dl} + 8`, 0, 0], { type: 'thread', internal: true, d: `${dm} + 2*tol`, pitch: 'p', h: 'thl + 2.4', od: Dl, floor: 2.4 }),
      ];
    })(),
  ),
  t(
    'schraube',
    'Schraube + Mutter (metrisch)',
    '🔧',
    ['schraube', 'mutter', 'bolzen', 'gewindestange', 'm6', 'm8', 'm10', 'm12', 'sechskant'],
    'Metrisches ISO-Gewinde (M6–M20) – druckbare Sechskantschraube mit passender Mutter. Ab M8 passen auch gekaufte Muttern/Schrauben.',
    [
      {
        key: 'M',
        label: 'Gewinde',
        type: 'select',
        value: 10,
        options: [6, 8, 10, 12, 16, 20].map((m) => ({ value: m, label: `M${m}` })),
      },
      num('L', 'Schraubenlänge', 30, 8, 150, 1, { role: 'length' }),
      flag('nut', 'Mutter dazu', true),
    ],
    (() => {
      const pitch = 'M==6 ? 1 : M==8 ? 1.25 : M==10 ? 1.5 : M==12 ? 1.75 : M==16 ? 2 : 2.5';
      const s = 'M==6 ? 10 : M==8 ? 13 : M==10 ? 16 : M==12 ? 18 : M==16 ? 24 : 30';
      return [
        { type: 'cylinder', d: `(${s}) * 1.1547`, h: 'M*0.65', fn: 6 },
        T([0, 0, 'M*0.65 - 0.6'], { type: 'thread', d: 'M - 2*tol', pitch, h: 'L + 0.6', iso: true, chamfer: true }),
        {
          type: 'if',
          cond: 'nut',
          then: [
            T([`(${s}) * 1.2 + 8`, 0, 0], { type: 'thread', internal: true, d: 'M + 2*tol', pitch, h: 'M*0.8', iso: true, od: `(${s}) * 1.1547`, odfn: 6 }),
          ],
        },
      ];
    })(),
  ),
  // ------------------------------------------------------------ Vasen-Generator
  t(
    'vase',
    'Vase (Vasenmodus)',
    '🏺',
    ['vase', 'vasenmodus', 'blumenvase', 'übertopf', 'stiftebecher', 'lampenschirm vase', 'spiralvase'],
    'Gedrehte, gewellte oder eckige Vase. Wand 0 = Vasenmodus (der Slicer druckt nur eine Außenwand in einer Spirale – schnell, sehr wenig Material). Mit Wand > 0 wird sie normal hohl gedruckt.',
    [
      num('H', 'Höhe', 150, 30, 250, 1, { role: 'height' }),
      num('Ru', 'Radius unten', 35, 10, 120, 0.5),
      num('Ro', 'Radius oben', 45, 10, 120, 0.5),
      num('bauch', 'Bauch', 12, -30, 40, 0.5),
      { key: 'ecken', label: 'Form', type: 'select', value: 0, options: [{ value: 0, label: 'Rund' }, { value: 3, label: 'Dreieck' }, { value: 4, label: 'Viereck' }, { value: 5, label: 'Fünfeck' }, { value: 6, label: 'Sechseck' }, { value: 8, label: 'Achteck' }] },
      cnt('wellen', 'Wellen', 8, 0, 40, { role: undefined }),
      num('amp', 'Wellentiefe', 3, 0, 15, 0.5),
      num('dreh', 'Verdrehung', 60, -360, 360, 5, { unit: '°' }),
      { key: 'muster', label: 'Oberfläche', type: 'select', value: 0, options: [{ value: 0, label: 'Glatt' }, { value: 1, label: 'Rillen' }, { value: 2, label: 'Spiralwellen' }, { value: 3, label: 'Waben' }] },
      num('wall', 'Wand (0 = Vasenmodus)', 0, 0, 4, 0.2, { role: 'wall' }),
    ],
    (['none', 'rillen', 'wellen', 'waben'] as const).map(
      (pat, i): CadNode => ({
        type: 'if',
        cond: `muster == ${i}`,
        then: [{ type: 'radial', h: 'H', r0: 'Ru', r1: 'Ro', bulge: 'bauch', sides: 'ecken', waves: 'wellen', amp: 'amp', twist: 'dreh', pattern: pat, depth: 1.2, count: 'round(2*PI*max(Ru,Ro)/8)', pitch: 10, wall: 'wall', floor: 1.6 }],
      }),
    ),
  ),
  // ------------------------------------------------------------ Drehknopf mit Rändel
  t(
    'drehknopf',
    'Drehknopf mit Rändel',
    '🎛️',
    ['drehknopf', 'knopf', 'rändel', 'raendel', 'griff', 'potiknopf', 'regler', 'muster', 'griffig'],
    'Griffiger Drehknopf mit Rändel- oder Rillenmuster und D-Wellenaufnahme (z. B. für Potentiometer 6 mm). Muster direkt ins Netz eingearbeitet – keine Stützen nötig.',
    [
      num('D', 'Durchmesser', 30, 10, 120, 0.5, { role: 'width' }),
      num('H', 'Höhe', 16, 6, 80, 0.5, { role: 'height' }),
      { key: 'muster', label: 'Muster', type: 'select', value: 1, options: [{ value: 1, label: 'Rändel (Rauten)' }, { value: 2, label: 'Längsrillen' }, { value: 3, label: 'Waben' }] },
      num('tiefe', 'Mustertiefe', 0.8, 0.3, 2, 0.1),
      num('welle', 'Wellen-Ø (D-Form)', 6, 3, 12, 0.5, { role: 'hole' }),
    ],
    [
      diff(
        uni(
          ...(['raendel', 'rillen', 'waben'] as const).map(
            (pat, i): CadNode => ({ type: 'if', cond: `muster == ${i + 1}`, then: [{ type: 'radial', h: 'H - 1.5', r0: 'D/2', r1: 'D/2 - 0.5', pattern: pat, depth: 'tiefe', count: 'round(PI*D/3.2)', pitch: 6 }] }),
          ),
          // Deckel mit Fase
          T([0, 0, 'H - 2.13'], { type: 'cylinder', r1: 'D/2 - 0.55 - tiefe', r2: 'D/2 - 0.5 - tiefe - 1.2', h: 2.13 }),
        ),
        T([0, 0, -1], { type: 'intersection', children: [{ type: 'cylinder', d: 'welle + 2*tol', h: 'H - 2' }, T(['-welle/2 - 1 + 0.5', 0, 0], { type: 'cube', size: ['welle + 2', 'welle + 2', 'H'], center: false } as CadNode)] }),
      ),
    ],
  ),
  // ------------------------------------------------------------ Print-in-place
  t(
    'flexikette',
    'Flexi-Kette (print-in-place)',
    '⛓️',
    ['kette', 'flexi', 'print in place', 'print-in-place', 'gelenkkette', 'armband', 'gelenk', 'beweglich'],
    'Bewegliche Kette in einem Stück gedruckt: jedes Glied dreht sich auf einem Stift mit Haltekappe im nächsten Glied. Ohne Stützen drucken, danach Glieder vorsichtig lösen.',
    [
      cnt('N', 'Glieder', 8, 2, 30, { role: 'count' }),
      num('L', 'Gliedlänge', 30, 18, 60, 0.5, { role: 'length' }),
      num('W', 'Breite', 12, 8, 30, 0.5, { role: 'width' }),
      num('T', 'Dicke', 6, 4, 12, 0.5, { role: 'height' }),
      num('g', 'Spiel', 0.4, 0.25, 0.8, 0.05, { hint: 'Abstand zwischen beweglichen Teilen – bei P1S 0,3–0,4 mm' }),
    ],
    [
      {
        type: 'for',
        var: 'i',
        from: 0,
        to: 'N - 1',
        children: [
          T(['i*((max(L, 2*W + 2)) - W)', '-W/2', 0], {
            type: 'union',
            children: [
              // Mittelteil, volle Höhe
              T(['W', 0, 0], { type: 'cube', size: ['(max(L, 2*W + 2)) - 2*W', 'W', 'T'], center: false } as CadNode),
              // linke, obere Lasche mit Loch (sitzt auf dem Stift des vorigen Glieds)
              diff(T(['g', 0, 'T/2 + g/2'], { type: 'cube', size: ['W - g', 'W', 'T/2 - g/2'], center: false } as CadNode), T(['W/2', 'W/2', -1], { type: 'cylinder', r: 'W*0.22 + g', h: 'T + 2' })),
              // rechte, untere Lasche mit Stift + Haltekappe
              T(['(max(L, 2*W + 2)) - W', 0, 0], { type: 'cube', size: ['W - g', 'W', 'T/2 - g/2'], center: false } as CadNode),
              {
                type: 'if',
                cond: 'i < N - 1',
                then: [
                  T(['(max(L, 2*W + 2)) - W/2', 'W/2', 0], { type: 'cylinder', r: 'W*0.22', h: 'T + g + 0.01' }),
                  T(['(max(L, 2*W + 2)) - W/2', 'W/2', 'T + g'], { type: 'cylinder', r1: 'W*0.22', r2: 'W*0.22 + 0.9', h: 0.9 }),
                  T(['(max(L, 2*W + 2)) - W/2', 'W/2', 'T + g + 0.89'], { type: 'cylinder', r: 'W*0.22 + 0.9', h: 0.6 }),
                ],
              },
            ],
          }),
        ],
      },
    ],
  ),
  t(
    'spinner',
    'Dreh-Anhänger (print-in-place)',
    '🌀',
    ['spinner', 'dreh', 'anhänger', 'schlüsselanhänger', 'fidget', 'drehteil', 'lager'],
    'Schlüsselanhänger mit drehbarer Scheibe – in einem Stück gedruckt: ein umlaufender 45°-Keil hält die Scheibe im Ring, ohne Stützen. Optional Text auf der Scheibe.',
    [
      num('R', 'Außenradius', 22, 14, 50, 0.5, { role: 'width' }),
      num('T', 'Dicke', 7, 5, 14, 0.5, { role: 'height' }),
      num('g', 'Spiel', 0.45, 0.3, 0.8, 0.05),
      flag('mitText', 'Text auf der Scheibe', false),
      { key: 'txt', label: 'Text', type: 'text', value: 'HALLO' },
    ],
    (() => {
      const r1 = 'R - 6';
      const k = 'min(1.5, T/4)';
      return [
        // drehbare Scheibe mit Keil
        {
          type: 'revolve',
          fn: 128,
          shape: { type: 'polygon', points: [[0, 0], [r1, 0], [r1, `T/2 - ${k}`], [`${r1} + ${k}`, 'T/2'], [r1, `T/2 + ${k}`], [r1, 'T'], [0, 'T']] },
        },
        // Ring mit passender Nut (Spiel g)
        {
          type: 'revolve',
          fn: 128,
          shape: {
            type: 'polygon',
            points: [
              [`${r1} + g`, 0],
              ['R', 0],
              ['R', 'T'],
              [`${r1} + g`, 'T'],
              [`${r1} + g`, `T/2 + ${k} + g*0.42`],
              [`${r1} + ${k} + g`, 'T/2'],
              [`${r1} + g`, `T/2 - ${k} - g*0.42`],
            ],
          },
        },
        // Öse
        diff(T(['R + 4', 0, 0], rrect(14, 12, 4, 'T/2')), T(['R + 6', 0, -1], { type: 'cylinder', d: 5, h: 'T' })),
        { type: 'if', cond: 'mitText', then: [T([0, 0, 'T - 0.01'], { type: 'text', text: '{txt}', size: 'R/3.2', h: 0.8, maxW: '2*(R - 8)' } as CadNode)] },
      ];
    })(),
  ),

  // ------------------------------------------------------------ Gelenke & beweglich
  t(
    'scharnier',
    'Scharnier (in einem Stück gedruckt)',
    '🚪',
    ['scharnier', 'gelenk', 'klappe', 'tür', 'tuer', 'print in place', 'drehgelenk', 'hinge', 'deckelscharnier'],
    'Fertig bewegliches Scharnier, in einem Stück gedruckt: Kegelzapfen (45°) zwischen den Gelenkaugen halten es zusammen – ohne Stift, ohne Stützen. Mit Senkbohrungen.',
    [
      num('L', 'Länge', 60, 25, 200, 1, { role: 'length' }),
      num('W', 'Flügelbreite', 25, 10, 80, 1, { role: 'width' }),
      num('t', 'Flügelstärke', 3, 2, 6, 0.1, { role: 'height' }),
      num('D', 'Gelenk-Ø', 8, 6, 16, 0.5),
      cnt('k', 'Gelenkaugen', 5, 3, 9, { hint: 'ungerade Zahl' }),
      num('g', 'Spiel im Gelenk', 0.4, 0.25, 0.8, 0.05, { hint: 'Größer, falls es nach dem Druck klemmt' }),
      flag('holes', 'Schraubenlöcher', true),
      num('hd', 'Schrauben-Ø', 3.5, 2, 6, 0.1, { role: 'hole' }),
    ],
    (() => {
      const kl = '(L - (k - 1)*g)/k';
      const xi = `-L/2 + i*(${kl} + g)`;
      const rc = 'D/2 - 1.2';
      const side = '(i % 2 == 0 ? -1 : 1)';
      const knuckle: CadNode = {
        type: 'for',
        var: 'i',
        from: 0,
        to: 'k - 1',
        children: [
          diff(
            uni(
              T([xi, 0, 'D/2'], R([0, 90, 0], { type: 'cylinder', r: 'D/2', h: kl })),
              // Kegelzapfen rechts (nicht beim letzten Auge)
              {
                type: 'if',
                cond: 'i < k - 1',
                then: [T([`${xi} + ${kl} - 0.01`, 0, 'D/2'], R([0, 90, 0], { type: 'cylinder', r1: rc, r2: 0.3, h: `${rc} - 0.3` }))],
              },
              // Steg zum eigenen Flügel
              T([`${xi} + ${kl}/2`, `${side}*(D/2 + g + 0.5)/2`, 't/2'], { type: 'cube', size: [`${kl}`, 'D/2 + g + 0.5', 't'], center: true }),
            ),
            // Kegel-Aufnahme links (nicht beim ersten Auge) – zuletzt abziehen, damit der Steg sie nicht füllt
            {
              type: 'if',
              cond: 'i > 0',
              then: [T([`${xi} - 0.01`, 0, 'D/2'], R([0, 90, 0], { type: 'cylinder', r1: `${rc} + 0.414*g`, r2: '0.3 + 0.414*g', h: `${rc} - 0.3` }))],
            },
          ),
        ],
      };
      const leaf = (sgn: 1 | -1): CadNode =>
        diff(
          T([0, `${sgn}*(D/2 + g + W/2)`, 't/2'], { type: 'roundedCube', size: ['L', 'W', 't'], r: 'min(1, t/3)', center: true }),
          {
            type: 'if',
            cond: 'holes',
            then: [-1, 1].map((sx) => T([`${sx}*L/4`, `${sgn}*(D/2 + g + W/2)`, 0], ...countersunkHole('hd', 'hd*2', 't', '3*t', 'true'))),
          },
        );
      // Flügel A gehört zu den geraden Augen (y < 0), Flügel B zu den ungeraden (y > 0)
      return [
        uni(leaf(-1), { type: 'for', var: 'i', from: 0, to: 'k - 1', step: 2, children: (knuckle as { children: CadNode[] }).children }),
        uni(leaf(1), { type: 'for', var: 'i', from: 1, to: 'k - 1', step: 2, children: (knuckle as { children: CadNode[] }).children }),
      ];
    })(),
  ),
  t(
    'kugelgelenk',
    'Kugelgelenk (Kugel + Pfanne)',
    '🦴',
    ['kugelgelenk', 'gelenk', 'kugel', 'pfanne', 'halterung', 'kamerahalter', 'schwenkbar', 'ball joint', 'drehbar'],
    'Kugel auf Stiel und geschlitzte Pfanne zum Einschnappen – für schwenkbare Halter (Kamera, Lampe, Handy). Beide Teile mit Grundplatte und Senkbohrungen, ohne Stützen druckbar.',
    [
      num('kd', 'Kugel-Ø', 16, 8, 40, 0.5, { role: 'width' }),
      num('sl', 'Stiel-Länge', 15, 4, 60, 0.5, { role: 'height' }),
      num('P', 'Grundplatte', 30, 16, 80, 1, { role: 'length' }),
      num('wall', 'Pfannen-Wand', 3, 2, 6, 0.1, { role: 'wall' }),
      num('lip', 'Einschnapp-Rand', 0.28, 0.15, 0.4, 0.01, { unit: '× Ø', hint: 'Wie weit die Pfanne über die Kugelmitte greift: mehr = fester' }),
      cnt('slits', 'Schlitze', 4, 2, 8),
      flag('holes', 'Schraubenlöcher', true),
    ],
    (() => {
      const plate = (x: string): CadNode =>
        T(
          [x, 0, 0],
          diff(rrect('P', 'P', 4, 4), {
            type: 'if',
            cond: 'holes',
            then: [-1, 1].map((sx) => T([`${sx}*(P/2 - 5)`, `${sx}*(P/2 - 5)`, 0], ...countersunkHole('3.5', '7', '4', '12', 'true'))),
          }),
        );
      const zb = '4 + sl + kd/2';
      return [
        // Kugel auf Stiel, mit 45°-Kegel unter der Kugel
        uni(
          plate('0'),
          // Stiel bis zur Kugelmitte (sauberer Schnitt statt Berührung am Pol)
          T([0, 0, 3.99], { type: 'cylinder', d: 'kd*0.5', h: 'sl + kd/2 + 0.01' }),
          // 45°-Stützkegel, leicht in die Kugel geschoben (nicht tangential)
          T([0, 0, `${zb} - 0.607*kd/2 - 0.207*kd/2`], { type: 'cylinder', r1: 'kd*0.25', r2: '0.707*kd/2', h: '0.207*kd/2' }),
          T([0, 0, zb], { type: 'sphere', r: 'kd/2', fn: 48 }),
        ),
        // Pfanne
        uni(
          plate('P + 10'),
          T(
            ['P + 10', 0, 3.99],
            diff(
              { type: 'cylinder', d: 'kd + 2*wall', h: `kd/2 + 1 + kd*lip + 0.01` },
              T([0, 0, 'kd/2 + 1 - 0.01'], { type: 'sphere', r: 'kd/2 + tol', fn: 48 }),
              {
                type: 'for',
                var: 'i',
                from: 0,
                to: 'slits - 1',
                children: [R([0, 0, 0], { type: 'rotate', a: [0, 0, 'i*360/slits'], children: [T(['kd/2 + wall/2', 0, 'kd/2 + 1 + kd*lip/2 + 1'], { type: 'cube', size: ['wall*2 + 2', 1.4, 'kd*lip + kd*0.3 + 2'], center: true })] })],
              },
            ),
          ),
        ),
      ];
    })(),
  ),
  t(
    'flexifisch',
    'Flexi-Fisch (beweglich, in einem Stück)',
    '🐠',
    ['flexi', 'fisch', 'flexifisch', 'beweglich', 'gelenkig', 'print in place', 'spielzeug', 'gelenkfigur', 'flexi fisch', 'schlange'],
    'Gelenkiger Fisch, fertig beweglich aus dem Drucker: jedes Glied hängt mit einem Doppelkegel-Zapfen (45°, ohne Stützen) im nächsten. Anzahl Glieder, Größe und Spiel einstellbar.',
    [
      cnt('n', 'Glieder', 7, 3, 14),
      num('Ls', 'Gliedlänge', 14, 10, 30, 0.5, { role: 'length' }),
      num('W', 'Breite', 26, 14, 60, 0.5, { role: 'width' }),
      num('H', 'Höhe', 8, 6, 15, 0.5, { role: 'height' }),
      num('g', 'Spiel in den Gelenken', 0.4, 0.25, 0.7, 0.05, { hint: 'Größer, falls Glieder zusammenkleben' }),
    ],
    (() => {
      const r = 2.6;
      const re = `${r} - 1.2`;
      const R2 = `${r} + 1.414*g + 1.6`;
      const xk = 'k*Ls';
      const xn = '(k + 1)*Ls';
      const wk = `max(W*(0.42 + 0.58*sin(180*(k + 0.7)/(n + 0.6))), 2*(${R2}) + 3)`;
      // Zapfen (Doppelkegel) und passende Aufnahme als Rotationsprofile
      const pin: CadNode = {
        type: 'revolve',
        fn: 48,
        shape: { type: 'polygon', points: [[0, 0], [re, 0], [re, 'H/2 - 1.2'], [r, 'H/2'], [re, 'H/2 + 1.2'], [re, 'H'], [0, 'H']] },
      };
      const hole: CadNode = {
        type: 'revolve',
        fn: 48,
        shape: {
          type: 'polygon',
          points: [[0, -1], [`${re} + g`, -1], [`${re} + g`, 'H/2 - 1.2 - 0.414*g'], [`${r} + 1.414*g`, 'H/2'], [`${re} + g`, 'H/2 + 1.2 + 0.414*g'], [`${re} + g`, 'H + 1'], [0, 'H + 1']],
        },
      };
      // Keil-Ausschnitt für den Hals (±25° Bewegung)
      const wedge: CadNode = {
        type: 'extrude',
        h: 'H + 2',
        shape: { type: 'polygon', points: [[0, 0], [`2*(${R2}) + 4`, `-(2*(${R2}) + 4)*1.6`], [`2*(${R2}) + 4`, `(2*(${R2}) + 4)*1.6`]] },
      };
      const bodyStart = `${xk} + ${R2} + g`;
      return [
        {
          type: 'for',
          var: 'k',
          from: 0,
          to: 'n - 1',
          children: [
            diff(
              uni(
                // Körper des Glieds (beim Kopf länger und vorn rund)
                {
                  type: 'if',
                  cond: 'k < n - 1',
                  then: [T([`(${bodyStart} + ${xn})/2`, 0, 0], rrect(`${xn} - (${bodyStart}) + 0.01`, wk, `min(${wk}/2 - 0.5, 3)`, 'H'))],
                  else: [T([`${bodyStart} + Ls*0.8`, 0, 0], rrect('Ls*1.6', wk, `${wk}/2 - 0.01`, 'H'))],
                },
                // Gelenkscheibe vorn
                { type: 'if', cond: 'k < n - 1', then: [T([xn, 0, 0], { type: 'cylinder', r: R2, h: 'H' })] },
                // Zapfen + Hals hinten
                {
                  type: 'if',
                  cond: 'k > 0',
                  then: [T([xk, 0, 0], pin), T([`${xk} + (${R2} + g + 0.6)/2`, 0, 'H/2'], { type: 'cube', size: [`${R2} + g + 0.6`, r, 'H'], center: true })],
                },
                // Schwanzflosse
                {
                  type: 'if',
                  cond: 'k == 0',
                  then: [
                    {
                      type: 'extrude',
                      h: 'H*0.6',
                      shape: {
                        type: 'polygon',
                        points: [
                          [`${bodyStart} + 1`, `-${wk}*0.3`],
                          [`${bodyStart} + 1`, `${wk}*0.3`],
                          [`${bodyStart} - W*0.55`, 'W*0.42'],
                          [`${bodyStart} - W*0.35`, 0],
                          [`${bodyStart} - W*0.55`, '-W*0.42'],
                        ],
                      },
                    },
                  ],
                },
              ),
              { type: 'if', cond: 'k < n - 1', then: [T([xn, 0, 0], hole), T([xn, 0, -1], wedge)] },
              // Augen
              {
                type: 'if',
                cond: 'k == n - 1',
                then: [-1, 1].map((sy) => T([`${bodyStart} + Ls*1.05`, `${sy}*${wk}*0.22`, -1], { type: 'cylinder', d: `max(2, ${wk}*0.12)`, h: 'H + 2' })),
              },
            ),
          ],
        },
      ];
    })(),
  ),
  // ------------------------------------------------------------ Aquaristik
  t(
    'mooskugel',
    'Mooskugel zum Verschrauben',
    '🟢',
    ['mooskugel', 'moos', 'moosball', 'aquarium', 'aquaristik', 'kugel', 'garnelen', 'schraubkugel', 'moos kugel'],
    'Hohle Kugel aus zwei Hälften mit Schraubgewinde – Moos hineinlegen, zuschrauben, fertig. Große Löcher, damit Moos herauswächst und Fische nicht hängen bleiben. Kuppel nach oben drucken (PETG); bei großen Kugeln Baumstützen innen.',
    [
      num('D', 'Kugel-Ø', 60, 35, 140, 1, { role: 'width' }),
      num('wall', 'Wandstärke', 2, 1.2, 4, 0.1, { role: 'wall' }),
      num('hd', 'Loch-Ø', 10, 4, 22, 0.5, { role: 'hole', hint: 'Groß genug, damit kleine Fische nicht stecken bleiben' }),
      cnt('n', 'Löcher pro Reihe', 6, 3, 12),
      cnt('reihen', 'Lochreihen', 2, 1, 4),
      flag('top', 'Loch oben', true),
      num('p', 'Gewinde-Steigung', 3, 2, 5, 0.25, { group: 'Gewinde' }),
      num('thl', 'Gewindelänge', 6, 4, 12, 0.5, { group: 'Gewinde' }),
      num('gap', 'Abstand der Hälften', 10, 4, 30, 1, { group: 'Anordnung' }),
    ],
    (() => {
      const dm = 'D - 2*wall - 2*tol - 1.5';
      const ct = `(D - (${dm}))/2`;
      const dome: CadNode = { type: 'dome', r: 'D/2', wall: 'wall', rows: 'reihen', holes: 'n', hole: 'hd', top: 'top ? hd*1.4 : 0' };
      return [
        // Hälfte mit Außengewinde
        uni(
          diff(
            { type: 'thread', d: dm, pitch: 'p', h: 'thl', chamfer: true },
            T([0, 0, -1], { type: 'cylinder', d: `${dm} - 1.25*p - 2*wall`, h: 'thl + 2' }),
          ),
          T(
            [0, 0, 'thl - 0.01'],
            diff(
              { type: 'cylinder', r1: `(${dm})/2 - 0.3`, r2: 'D/2 - 0.1', h: ct },
              T([0, 0, -0.01], { type: 'cylinder', r1: `(${dm})/2 - 0.62*p - wall`, r2: 'D/2 - wall + 0.1', h: `${ct} + 0.02` }),
            ),
          ),
          T([0, 0, `thl + ${ct} - 0.3`], dome),
        ),
        // Hälfte mit Innengewinde (Ring 0,3 mm breiter als die Kugel → keine deckungsgleichen Flächen)
        T(
          ['D + gap', 0, 0],
          uni(
            { type: 'thread', internal: true, d: `${dm} + 2*tol`, pitch: 'p', h: 'thl', od: 'D + 0.6' },
            T([0, 0, 'thl - 0.5'], dome),
          ),
        ),
      ];
    })(),
  ),
  t(
    'garnelenhoehle',
    'Garnelen- & Welshöhle',
    '🦐',
    ['garnelen', 'garnele', 'höhle', 'hoehle', 'versteck', 'welshöhle', 'welshoehle', 'aquarium', 'aquaristik', 'unterschlupf'],
    'Kuppelhöhle als Versteck für Garnelen, Welse und Krebse: spitzbogige Eingänge (ohne Stützen druckbar) und kleine Lüftungslöcher.',
    [
      num('D', 'Durchmesser', 60, 30, 140, 1, { role: 'width' }),
      num('wall', 'Wandstärke', 2.5, 1.6, 5, 0.1, { role: 'wall' }),
      num('de', 'Eingang-Ø', 14, 6, 35, 0.5, { role: 'hole' }),
      cnt('ne', 'Eingänge', 2, 1, 4),
      num('hl', 'Lüftungsloch-Ø', 4, 0, 10, 0.5, { hint: '0 = keine Lüftungslöcher' }),
      cnt('nl', 'Lüftungslöcher', 6, 0, 12),
    ],
    [
      diff(
        domeShell('D/2', 'wall'),
        {
          type: 'for',
          var: 'k',
          from: 0,
          to: 'ne - 1',
          children: [
            {
              type: 'rotate',
              a: [0, 0, 'k*360/ne'],
              children: [
                T(['D/2 - wall/2', 0, 'de/2'], { type: 'teardrop', d: 'de', h: '4*wall + 6', axis: 'x' }),
                T(['D/2 - wall/2', 0, 'de/4 - 0.5'], { type: 'cube', size: ['4*wall + 6', 'de', 'de/2 + 1'], center: true }),
              ],
            },
          ],
        },
        { type: 'if', cond: 'hl > 0 && nl > 0', then: [sphereHoles('D/2', 'wall', 'hl', 'nl', 40, '90/ne')] },
      ),
    ],
  ),
  t(
    'pflanzkorb',
    'Pflanzkorb für Saugnapf',
    '🌿',
    ['pflanzkorb', 'pflanzen', 'pflanze', 'aquarium', 'aquaristik', 'saugnapf', 'emers', 'pflanzenhalter', 'korb'],
    'Pflanzkorb für Aquarienpflanzen mit Schlitzen und Ablauflöchern. Hinten zwei Schlüssellöcher für handelsübliche Saugnäpfe mit Pilzkopf: Kopf ins große Loch, Korb nach unten schieben.',
    [
      num('W', 'Breite', 60, 30, 160, 1, { role: 'length' }),
      num('T', 'Tiefe', 45, 25, 100, 1, { role: 'width' }),
      num('H', 'Höhe', 50, 20, 120, 1, { role: 'height' }),
      num('wall', 'Wandstärke', 2, 1.6, 4, 0.1, { role: 'wall' }),
      flag('slots', 'Schlitze vorne', true),
      num('sk', 'Saugnapf-Kopf-Ø', 7.5, 4, 14, 0.1, { group: 'Saugnapf', hint: 'Pilzkopf des Saugnapfs messen' }),
      num('sh', 'Saugnapf-Hals-Ø', 4, 2, 9, 0.1, { group: 'Saugnapf' }),
    ],
    [
      diff(
        rrect('W', 'T', 4, 'H'),
        T([0, 0, 'wall'], rrect('W - 2*wall', 'T - 2*wall', 'max(4 - wall, 0.5)', 'H')),
        // Ablaufschlitze im Boden
        {
          type: 'for',
          var: 'j',
          from: 0,
          to: 'max(floor((T - 2*wall - 6)/7), 1) - 1',
          children: [T([0, '(j - (max(floor((T - 2*wall - 6)/7), 1) - 1)/2)*7', 'wall/2'], { type: 'cube', size: ['W - 2*wall - 10', 2.5, 'wall + 2'], center: true })],
        },
        // Schlitze vorne
        {
          type: 'if',
          cond: 'slots',
          then: [
            {
              type: 'for',
              var: 'i',
              from: 0,
              to: 'max(floor((W - 16)/7), 1) - 1',
              children: [
                T(['(i - (max(floor((W - 16)/7), 1) - 1)/2)*7', '-T/2', 'wall + 4 + (H - wall - 10)/2'], { type: 'cube', size: [2.5, '4*wall', 'H - wall - 10'], center: true }),
              ],
            },
          ],
        },
        // Schlüssellöcher hinten (Kopf unten, Schlitz nach oben)
        {
          type: 'for',
          var: 'k',
          from: 0,
          to: 1,
          children: [
            T(['(k - 0.5)*W/2', 'T/2', 'H*0.55'], { type: 'teardrop', d: 'sk + 2*tol', h: '4*wall', axis: 'y' }),
            T(['(k - 0.5)*W/2', 'T/2', 'H*0.55 + 4'], { type: 'cube', size: ['sh + 2*tol', '4*wall', 8], center: true }),
            T(['(k - 0.5)*W/2', 'T/2', 'H*0.55 + 8'], { type: 'teardrop', d: 'sh + 2*tol', h: '4*wall', axis: 'y' }),
          ],
        },
      ),
    ],
  ),
  t(
    'schlauchhalter',
    'Schlauchhalter für den Beckenrand',
    '🧷',
    ['schlauch', 'schlauchhalter', 'aquarium', 'aquaristik', 'filter', 'luftschlauch', 'beckenrand', 'halter', 'klemme'],
    'Klemmt auf den Glasrand und hält Filter- oder Luftschlauch per Schnappring. Liegt flach auf dem Bett – ohne Stützen, sehr stabil.',
    [
      num('g', 'Glasstärke', 6, 3, 19, 0.5, { hint: 'Dicke der Aquarienscheibe' }),
      num('L', 'Bügeltiefe', 25, 12, 60, 1, { role: 'length' }),
      num('d', 'Schlauch-Ø außen', 16, 4, 32, 0.5, { role: 'hole' }),
      num('b', 'Breite', 12, 6, 30, 0.5, { role: 'height' }),
      num('w', 'Materialstärke', 3, 2, 6, 0.1, { role: 'wall' }),
    ],
    (() => {
      const gg = 'g + tol';
      const cx = '-w - d/2 - w + 0.6';
      const cy = '-L + d/2 + w';
      return [
        uni(
          T(['-w', 0, 0], { type: 'cube', size: [`${gg} + 2*w`, 'w', 'b'] }),
          T(['-w', '-L', 0], { type: 'cube', size: ['w', 'L + 0.01', 'b'] }),
          T([gg, '-L*0.6', 0], { type: 'cube', size: ['w', 'L*0.6 + 0.01', 'b'] }),
          diff(
            T([cx, cy, 0], { type: 'cylinder', r: 'd/2 + w', h: 'b' }),
            T([cx, cy, -1], { type: 'cylinder', r: 'd/2', h: 'b + 2' }),
            T([`${cx} - d/2`, cy, 'b/2'], { type: 'cube', size: ['d*0.6', 'd*0.75', 'b + 2'], center: true }),
          ),
        ),
      ];
    })(),
  ),
  t(
    'futterring',
    'Schwimmender Futterring',
    '🐟',
    ['futterring', 'futter', 'fütterung', 'fuetterung', 'aquarium', 'aquaristik', 'schwimmring', 'flockenfutter', 'ring'],
    'Schwimmt dank geschlossener Luftkammer (45°-Dach, ohne Stützen druckbar) und hält Flockenfutter an einer Stelle. Mit 100 % geschlossenen Wänden drucken.',
    [
      num('Di', 'Innen-Ø', 60, 30, 160, 1, { role: 'width' }),
      num('b', 'Ringbreite', 12, 8, 25, 0.5),
      num('h', 'Höhe', 10, 6, 20, 0.5, { role: 'height' }),
      num('wall', 'Wandstärke', 1.6, 1.2, 3, 0.1, { role: 'wall' }),
    ],
    (() => {
      const x0 = 'Di/2 + wall',
        x1 = 'Di/2 + b - wall',
        xc = 'Di/2 + b/2',
        hw = 'min((b - 2*wall)/2, (h - 2*wall)/2 - 0.4)';
      return [
        {
          type: 'revolve',
          fn: 128,
          shape: {
            type: 'polygon',
            points: [['Di/2', 0], ['Di/2 + b', 0], ['Di/2 + b', 'h'], ['Di/2', 'h']],
            holes: [[[x0, `wall + ${hw}`], [xc, 'wall'], [x1, `wall + ${hw}`], [x1, `h - wall - ${hw}`], [xc, 'h - wall'], [x0, `h - wall - ${hw}`]]],
          },
        },
      ];
    })(),
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
  /** Fächer-Raster (Setzkasten, Organizer) */
  cols?: number;
  rows?: number;
  /** Innenmaß eines Fachs */
  cellL?: number;
  cellW?: number;
  cellH?: number;
}

export const MEASURE_LABEL: Record<keyof Measures, string> = {
  length: 'Länge',
  width: 'Breite',
  height: 'Höhe',
  wall: 'Wandstärke',
  hole: 'Loch-Ø',
  count: 'Anzahl',
  cols: 'Fächer in X',
  rows: 'Fächer in Y',
  cellL: 'Fach-Länge',
  cellW: 'Fach-Breite',
  cellH: 'Fach-Höhe',
};

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

const WORDS: Record<string, number> = { ein: 1, eine: 1, einem: 1, zwei: 2, drei: 3, vier: 4, 'fünf': 5, fuenf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, 'zwölf': 12, zwoelf: 12 };
const NUM = String.raw`(\d+(?:[.,]\d+)?)`;
const UNIT = String.raw`\s*(?:(mm|cm|m)\b)?`;

/**
 * Liest Maße aus Freitext, z. B. „120 x 80 x 50 mm“, „25 cm lang“, „Höhe: 8 cm“, „Ø 8“, „M5“,
 * „2 Schraubenlöcher“, „3 × 4 Fächer, Fach 60 × 60 × 120 mm“. Einheiten werden in mm umgerechnet.
 */
export function parseMeasuresFromText(text: string): Measures {
  const m: Measures = {};
  let s = ' ' + text.toLowerCase().replace(/[×✕✖*]/g, 'x').replace(/(\d)\s*,\s*(\d)/g, '$1.$2') + ' ';
  for (const [w, v] of Object.entries(WORDS)) s = s.replace(new RegExp(`(^|[^a-zäöüß])${w}(?=\\s)`, 'g'), `$1${v}`);
  const mm = (v: string, unit?: string) => {
    const x = parseFloat(v);
    return Math.round((unit === 'cm' ? x * 10 : unit === 'm' ? x * 1000 : x) * 100) / 100;
  };
  const used: [number, number][] = [];
  const take = (re: RegExp, fn: (r: RegExpExecArray) => void) => {
    re.lastIndex = 0;
    let r: RegExpExecArray | null;
    while ((r = re.exec(s))) {
      const st = r.index,
        en = r.index + r[0].length;
      if (used.some(([a, b]) => st < b && en > a)) continue;
      used.push([st, en]);
      fn(r);
    }
  };
  // 1) Fächer-Raster: „3 x 4 Fächer“, „Raster 3x4“
  take(new RegExp(String.raw`(\d+)\s*x\s*(\d+)\s*(?:fächer|faecher|fach|felder|zellen|kästchen)`, 'g'), (r) => {
    m.cols = +r[1];
    m.rows = +r[2];
    m.count = m.cols * m.rows;
  });
  take(new RegExp(String.raw`(?:raster|aufteilung|unterteilung)\s*:?\s*(\d+)\s*x\s*(\d+)`, 'g'), (r) => {
    m.cols = +r[1];
    m.rows = +r[2];
    m.count = m.cols * m.rows;
  });
  // 2) Fach-/Innenmaß: „Fach 60 x 60 x 120 mm“, „je Fach 50x50“, „Fächer à 40 x 40“
  take(new RegExp(String.raw`(?:fach|fächer|faecher|fachgröße|innenmaß(?:e)?\s+(?:je|pro)\s+fach)\s*(?:je|à|a|von|mit|:|größe)?\s*${NUM}${UNIT}\s*x\s*${NUM}${UNIT}(?:\s*x\s*${NUM}${UNIT})?`, 'g'), (r) => {
    const u = r[2] ?? r[4] ?? r[6];
    m.cellL = mm(r[1], r[2] ?? u);
    m.cellW = mm(r[3], r[4] ?? u);
    if (r[5]) m.cellH = mm(r[5], r[6] ?? u);
  });
  // 3) Gesamtmaße „L x B (x H)“ – erstes freies Tripel/Paar
  let gotDims = false;
  take(new RegExp(String.raw`${NUM}${UNIT}\s*x\s*${NUM}${UNIT}(?:\s*x\s*${NUM}${UNIT})?`, 'g'), (r) => {
    if (gotDims) return;
    gotDims = true;
    const u = r[6] ?? r[4] ?? r[2];
    m.length = mm(r[1], r[2] ?? u);
    m.width = mm(r[3], r[4] ?? u);
    if (r[5]) m.height = mm(r[5], r[6] ?? u);
  });
  // 4) Benannte Maße vor oder nach der Zahl
  const named: [keyof Measures, string, string][] = [
    ['length', 'länge|laenge|lang', 'lang|länge'],
    ['width', 'breite|tiefe|breit|tief', 'breit|tief|breite|tiefe'],
    ['height', 'höhe|hoehe|hoch|dicke|stärke|staerke', 'hoch|höhe|dick|stark'],
  ];
  // Wandstärke zuerst, damit „Wandstärke 2“ nicht als Höhe zählt
  take(new RegExp(String.raw`wand(?:stärke|staerke|dicke)?\s*(?:von|=|:)?\s*${NUM}${UNIT}`, 'g'), (r) => {
    m.wall = mm(r[1], r[2]);
  });
  take(new RegExp(String.raw`bodenstärke\s*(?:von|=|:)?\s*${NUM}${UNIT}`, 'g'), () => {});
  for (const [k, before, after] of named) {
    take(new RegExp(String.raw`(?:${before})\s*(?:von|=|:|ca\.?|etwa)?\s*${NUM}${UNIT}`, 'g'), (r) => {
      if (m[k] === undefined) (m as Record<string, number>)[k] = mm(r[1], r[2]);
    });
    take(new RegExp(String.raw`${NUM}${UNIT}\s*(?:${after})\b`, 'g'), (r) => {
      if (m[k] === undefined) (m as Record<string, number>)[k] = mm(r[1], r[2]);
    });
  }
  // 5) Loch / Durchmesser / Schraube
  take(new RegExp(String.raw`(?:ø|⌀|durchmesser|loch(?:durchmesser)?|bohrung|innen-?ø|d\s*=)\s*(?:von|=|:)?\s*${NUM}${UNIT}`, 'g'), (r) => {
    m.hole ??= mm(r[1], r[2]);
  });
  take(new RegExp(String.raw`${NUM}${UNIT}\s*(?:durchmesser|ø)`, 'g'), (r) => {
    m.hole ??= mm(r[1], r[2]);
  });
  take(/\bm(\d{1,2})\b/g, (r) => {
    m.hole ??= +r[1];
  });
  // 6) Anzahl Löcher / Fächer
  take(/(\d+)\s*(?:schrauben)?(?:löcher|loecher|löchern|schrauben|bohrungen|befestigungslöcher)/g, (r) => {
    if (m.cols === undefined) m.count = +r[1];
  });
  take(/(\d+)\s*(?:fächer|faecher|fächern|fächer|felder|figuren)/g, (r) => {
    if (m.cols === undefined && m.count === undefined) m.count = +r[1];
  });
  for (const k of Object.keys(m) as (keyof Measures)[]) if (m[k] === undefined || !Number.isFinite(m[k]!)) delete m[k];
  return m;
}

/** Kurzbeschreibung, wie die Angaben verstanden wurden (für die Anzeige). */
export function describeMeasures(ms: Measures): string[] {
  const out: string[] = [];
  const f = (v: number) => String(v).replace('.', ',');
  if (ms.length !== undefined || ms.width !== undefined || ms.height !== undefined)
    out.push(`Außen ${[ms.length, ms.width, ms.height].map((v) => (v === undefined ? '?' : f(v))).join(' × ')} mm`);
  if (ms.cols !== undefined) out.push(`${ms.cols} × ${ms.rows} Fächer`);
  else if (ms.count !== undefined) out.push(`Anzahl ${ms.count}`);
  if (ms.cellL !== undefined) out.push(`Fach ${f(ms.cellL)} × ${f(ms.cellW ?? ms.cellL)}${ms.cellH !== undefined ? ` × ${f(ms.cellH)}` : ''} mm`);
  if (ms.wall !== undefined) out.push(`Wand ${f(ms.wall)} mm`);
  if (ms.hole !== undefined) out.push(`Loch Ø ${f(ms.hole)} mm`);
  return out;
}

/** Überträgt Maße per Rolle auf die Parameter eines Modells. */
export function applyMeasures(model: ModelDef, values: Record<string, number | boolean | string>, ms: Measures): Record<string, number | boolean | string> {
  const out = { ...values };
  const roleMap: Record<string, ParamRole> = { length: 'length', width: 'width', height: 'height', wall: 'wall', hole: 'hole', count: 'count' };
  const byKey = (k: string) => model.params.find((x) => x.key === k);
  const setKey = (k: string, v: number) => {
    const p = byKey(k);
    if (!p) return false;
    if (p.min !== undefined) v = Math.max(p.min, v);
    if (p.max !== undefined && v > p.max) p.max = v;
    out[p.key] = v;
    return true;
  };
  // Fächer-Raster und Fachmaße (Organizer/Setzkasten): Außenmaß aus Fächern berechnen
  const hasGrid = !!(byKey('nx') && byKey('ny'));
  if (hasGrid) {
    let nx = ms.cols,
      ny = ms.rows;
    if (nx === undefined && ms.count !== undefined) {
      // n Fächer → möglichst quadratisch aufteilen
      nx = Math.ceil(Math.sqrt(ms.count));
      ny = Math.ceil(ms.count / nx);
    }
    if (nx !== undefined) setKey('nx', nx);
    if (ny !== undefined) setKey('ny', ny);
    const w = ms.wall ?? (out['wall'] as number) ?? 1.6;
    const fl = (out['floor'] as number) ?? 1.2;
    const cx = (out['nx'] as number) ?? 1,
      cy = (out['ny'] as number) ?? 1;
    if (ms.cellL !== undefined && ms.length === undefined) setKey('L', Math.round((cx * ms.cellL + (cx + 1) * w) * 10) / 10);
    if (ms.cellW !== undefined && ms.width === undefined) setKey('B', Math.round((cy * ms.cellW + (cy + 1) * w) * 10) / 10);
    if (ms.cellH !== undefined && ms.height === undefined) setKey('H', Math.round((ms.cellH + fl) * 10) / 10);
  }
  for (const [k, v] of Object.entries(ms)) {
    if (v === undefined || !Number.isFinite(v)) continue;
    if (hasGrid && k === 'count') continue;
    const role = roleMap[k];
    if (!role) continue;
    const p = model.params.find((x) => x.role === role);
    if (!p) continue;
    let val = v as number;
    if (p.min !== undefined) val = Math.max(p.min, val);
    if (p.max !== undefined && val > p.max) p.max = val;
    out[p.key] = val;
  }
  return out;
}
