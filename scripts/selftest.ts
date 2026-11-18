/**
 * Selbsttest mit der echten Geometrie-Bibliothek (läuft in GitHub Actions):
 * baut alle Vorlagen (mit/ohne Fasen, Mehrfarben, Farbzonen, Aufteilung mit
 * allen Verbindungsarten) und prüft jedes Teil auf Wasserdichtigkeit.
 */
import { buildParts } from '../src/cad/build';
import { DEFAULT_SPLIT, type JointType } from '../src/cad/split';
import { TEMPLATES } from '../src/cad/templates';
import { defaultValues } from '../src/cad/validate';
import type { ModelDef, Value } from '../src/cad/types';
import { analyzeMesh, meshFromPolygons, suppressSupportedOverhangs } from '../src/mesh/mesh';
import { photoModel } from '../src/photo/photoModel';
import { pinsModel, planJoints, DEFAULT_ASM_JOINTS, type AsmItem } from '../src/cad/assembly';
import { parseMeshBuffer, registerImported, meshToJson, meshFromJson } from '../src/mesh/importMesh';
import { stlBinary } from '../src/mesh/export';
import { runPipeline } from '../src/state/pipeline';
import { DEFAULT_HOLLOW } from '../src/cad/build';
import { PROFILES } from '../src/mesh/mesh';
import { optimizePrint } from '../src/mesh/optimize';
import { freeToModel, newPart, PRESETS, type FreePart } from '../src/cad/free';

let fails = 0;
let checks = 0;
function check(
  label: string,
  model: ModelDef,
  values: Record<string, Value>,
  opts: Parameters<typeof buildParts>[3] = { rx: 0, ry: 0 },
  zones?: Parameters<typeof buildParts>[4],
  split?: Parameters<typeof buildParts>[5],
  fase = true,
  hollow?: Parameters<typeof buildParts>[6],
) {
  const t0 = Date.now();
  try {
    const out = buildParts(model, values, { tol: 0.2, fase }, opts, zones, split, hollow);
    const groups = out.pieces ? out.pieces.map((p) => ({ label: p.label, parts: p.parts })) : [{ label: 'Modell', parts: out.parts }];
    for (const g of groups)
      for (const p of g.parts) {
        checks++;
        const s = analyzeMesh(meshFromPolygons(p.polys));
        const okk = s.manifold && s.volume > 0;
        if (!okk) {
          fails++;
          // Diagnose: erste Fehlkanten mit Koordinaten
          const m = meshFromPolygons(p.polys);
          const n = m.pos.length / 3;
          const dir = new Map<number, number>();
          for (let t = 0; t < m.tri.length; t += 3) for (let e = 0; e < 3; e++) { const k = m.tri[t + e] * n + m.tri[t + ((e + 1) % 3)]; dir.set(k, (dir.get(k) ?? 0) + 1); }
          let shown = 0;
          for (const [k, c] of dir) {
            const a = Math.floor(k / n), b = k % n;
            if (c > 1 || !dir.has(b * n + a)) {
              const P = (i: number) => `(${[0, 1, 2].map((j) => m.pos[3 * i + j].toFixed(3)).join(',')})`;
              console.log(`     Kante ${P(a)}→${P(b)} ×${c}, Gegenrichtung ×${dir.get(b * n + a) ?? 0}`);
              if (++shown >= 4) break;
            }
          }
        }
        console.log(`${okk ? '✓' : '✗'} ${label} › ${g.label} › ${p.name} (Slot ${p.slot}): ${s.triangles} Dreiecke, ${s.volume.toFixed(1)} mm³, offen ${s.openEdges}, nicht-manifold ${s.nonManifoldEdges}`);
      }
    if (!out.pieces && out.parts.length > 1) {
      const ps = out.parts.map((p) => {
        const m = meshFromPolygons(p.polys);
        return { mesh: m, stats: analyzeMesh(m, 45, 0) };
      });
      const before = ps.reduce((a, p) => a + p.stats.overhangArea, 0);
      suppressSupportedOverhangs(ps);
      const after = ps.reduce((a, p) => a + p.stats.overhangArea, 0);
      console.log(`   Überhänge mehrteilig: ${(before / 100).toFixed(2)} → ${(after / 100).toFixed(2)} cm² (aufliegende Flächen ausgenommen)`);
    }
    if (out.hollowNote) console.log(`   Hinweis: ${out.hollowNote}`);
    if (out.splitReport) console.log(`   Aufteilung: ${out.splitReport.counts.join('×')}, ${out.splitReport.joints} Verbinder ${out.splitReport.warnings.join(' | ')}`);
    console.log(`   (${Date.now() - t0} ms)`);
  } catch (e) {
    fails++;
    console.log(`✗ ${label}: FEHLER ${(e as Error).message}`);
  }
}

for (const t of TEMPLATES) {
  const v = defaultValues(t.model);
  check(`${t.id} (Fasen an)`, t.model, v);
  check(`${t.id} (Fasen aus)`, t.model, v, undefined, undefined, undefined, false);
}
const box = TEMPLATES.find((t) => t.id === 'box')!.model;
check('box Farbzonen', box, defaultValues(box), undefined, [{ z: 0, slot: 1 }, { z: 15, slot: 2 }]);
for (const joint of ['steck', 'duebel', 'kleben'] as JointType[]) {
  const org = TEMPLATES.find((t) => t.id === 'organizer')!.model;
  check(`organizer 240×160 geteilt (${joint})`, org, { ...defaultValues(org), L: 240, B: 160, H: 40, wall: 2.4, floor: 2 }, undefined, null, {
    opts: { ...DEFAULT_SPLIT, enabled: true, joint, pinD: 5, depth: 6 },
    bed: { size: 180, height: 180 },
  });
}
const plate = TEMPLATES.find((t) => t.id === 'plate')!.model;
check('lochplatte 240×120×10 geteilt (steck)', plate, { ...defaultValues(plate), L: 240, B: 120, T: 10 }, undefined, null, {
  opts: { ...DEFAULT_SPLIT, enabled: true, joint: 'steck', pinD: 5, depth: 6 },
  bed: { size: 180, height: 180 },
});
// Hohlraum automatisch
for (const id of ['box', 'wallholder', 'angle']) {
  const tm = TEMPLATES.find((t) => t.id === id)!.model;
  const big = id === 'box' ? { ...defaultValues(tm), L: 80, B: 60, H: 40, wall: 12, floor: 12 } : defaultValues(tm);
  check(`${id} mit Hohlraum`, tm, big, undefined, null, undefined, true, { enabled: true, wall: 2.4, roof: true });
}
{
  const { freeToModel, newPart, PRESETS } = await import('../src/cad/free');
  const block = newPart(PRESETS.find((p) => p.label === 'Quader')!, 1);
  block.size = [60, 40, 30];
  for (const dach of ['giebel', 'rund', 'flach']) {
    const cav = newPart(PRESETS.find((p) => p.label === 'Hohlraum')!, 2);
    cav.e.dach = dach;
    const fm = freeToModel([block, cav])!;
    check(`frei: Quader mit Hohlraum (${dach})`, fm, {});
  }
}
// Fächer: Setzkasten aus Quader + gleich großen negativen Teilen
{
  const { freeToModel, newPart, PRESETS, rasterHoles } = await import('../src/cad/free');
  const body = newPart(PRESETS.find((p) => p.label === 'Quader')!, 1);
  body.size = [200, 150, 60];
  body.pos = [0, 0, 30];
  for (const [nx, ny, nz, open] of [[4, 3, 1, true], [3, 2, 2, false]] as [number, number, number, boolean][]) {
    const r = rasterHoles(body, { nx, ny, nz, wall: 1.6, floor: 1.2, open, r: 1 });
    if ('error' in r) throw new Error(r.error);
    const holes = r.holes.map((h, i) => ({ ...h, id: 10 + i }));
    check(`frei: Setzkasten ${nx}×${ny}×${nz} ${open ? 'offen' : 'geschlossen'} (Fach ${r.cell.join('×')})`, freeToModel([body, ...holes])!, {});
  }
  // zu großer Setzkasten (wie beim Nutzer: 325 × 251 × 150) → automatisch geteilt mit Zapfen
  {
    const big = { ...body, size: [325, 251, 150] as [number, number, number], pos: [0, 0, 75] as [number, number, number] };
    const r = rasterHoles(big, { nx: 5, ny: 4, nz: 1, wall: 2, floor: 2, open: true, r: 1 });
    if ('error' in r) throw new Error(r.error);
    check('frei: großer Setzkasten 325×251×150 automatisch geteilt (steck)', freeToModel([big, ...r.holes.map((h, i) => ({ ...h, id: 100 + i }))])!, {}, undefined, null, {
      opts: { ...DEFAULT_SPLIT, enabled: true, joint: 'steck' },
      bed: { size: 256, height: 256 },
    });
  }
  // negatives Teil in 3 Stücke teilen
  const hole = newPart(PRESETS.find((p) => p.label === 'Hohlraum')!, 2);
  hole.kind = 'quader';
  hole.e = { r: 0 };
  hole.size = [90, 20, 10];
  hole.pos = [0, 0, 30];
  const r2 = rasterHoles(hole, { nx: 3, ny: 1, nz: 1, wall: 2, floor: 0, open: false, r: 0 });
  if ('error' in r2) throw new Error(r2.error);
  check('frei: negatives Teil in 3 Stücke geteilt', freeToModel([body, ...r2.holes.map((h, i) => ({ ...h, id: 50 + i }))])!, {});
}
const pm = photoModel(
  [[-20, -10], [20, -10], [25, 0], [20, 10], [-20, 10], [-25, 0]],
  [[[-5, -3], [5, -3], [5, 3], [-5, 3]]],
  50,
  20,
);
check('foto teil', pm, { ...defaultValues(pm), mode: 0 });
check('foto negativform', pm, { ...defaultValues(pm), mode: 1 });

// Frei bauen: jede Form einzeln, dazu Kombinationen mit Löchern, Text, Gelenken und zwei Farben
{
  let id = 1;
  const mk = (label: string, patch: Partial<FreePart> = {}): FreePart => ({ ...newPart(PRESETS.find((p) => p.label === label)!, id++), ...patch });
  for (const pr of PRESETS) {
    const p = mk(pr.label, { hole: false });
    check(`frei ${pr.label}`, freeToModel([p])!, {});
  }
  const platte = mk('Quader', { size: [70, 40, 4], pos: [0, 0, 2], e: { r: 4 } });
  check('frei Platte + Einstrich-Text + Gravur + Löcher (1 Farbe)', freeToModel([
    platte,
    mk('Text', { pos: [0, 6, 4.7], e: { text: 'Formwerk', font: 'einstrich', hoehe: 8, dicke: 1.6, strich: 0 } }),
    mk('Text', { hole: true, pos: [0, -10, 3.6], e: { text: 'Robert', font: 'einstrich', hoehe: 6, dicke: 1, strich: 0 } }),
    mk('Schraubloch', { pos: [-30, 0, 2], e: { d: 4, k: 8, L: 4 } }),
    mk('Magnetloch', { pos: [30, 0, 1.6] }),
  ])!, {});
  check('frei Platte + Text eingeschmolzen (1 Farbe)', freeToModel([
    mk('Quader', { size: [70, 40, 4], pos: [0, 0, 2], e: { r: 4 } }),
    mk('Text', { pos: [0, 6, 4.6], e: { text: 'Formwerk', hoehe: 8, dicke: 1.6, strich: 0 } }),
  ])!, {});
  {
    // Umriss-Schrift (wie im Browser erzeugt): Ring mit Loch, zweifarbig neben Löchern
    const ring = (r: number, n = 24): [number, number][] => Array.from({ length: n }, (_, i) => [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n)] as [number, number]);
    const outline = { key: 'test', width: 1, shapes: [{ outer: ring(0.5), holes: [ring(0.3).reverse()] }] };
    check('frei Umriss-Text zweifarbig + Löcher', freeToModel([
      mk('Quader', { size: [70, 40, 4], pos: [0, 0, 2], e: { r: 4 } }),
      mk('Text', { pos: [0, 6, 4.8], slot: 2, outline, e: { text: 'O', font: 'sans', fett: true, hoehe: 12, dicke: 1.6, strich: 0 } }),
      mk('Text', { hole: true, pos: [0, -10, 3.6], outline, e: { text: 'O', font: 'sans', fett: true, hoehe: 8, dicke: 1, strich: 0 } }),
      mk('Schraubloch', { pos: [-30, 0, 2], e: { d: 4, k: 8, L: 4 } }),
      mk('Magnetloch', { pos: [30, 0, 1.6] }),
    ])!, {});
  }
  check('frei Scharnier an zwei Platten', freeToModel([
    mk('Scharnier', { pos: [0, 0, 4] }),
    mk('Quader', { size: [40, 20, 2.4], pos: [0, -(4 + 0.4 + 15) - 9, 1.2] }),
  ])!, {});
  check('frei gedrehter Keil + Sechskant-Loch + Kugelgelenk', freeToModel([
    mk('Keil', { rot: [0, 0, 45], pos: [0, 0, 5] }),
    mk('Sechskant', { hole: true, pos: [0, 0, 5] }),
    mk('Kugelgelenk', { pos: [40, 0, 15] }),
  ])!, {});
}

// ---------------------------------------------------------------- Baugruppe
for (const type of ['duebel', 'steck'] as const) {
  const cube = (x: number, y: number, z: number): ModelDef => ({ name: `Quader ${x}×${y}×${z}`, params: [], root: [{ type: 'cube', size: [x, y, z] }], source: 'custom' });
  const polys = (m: ModelDef) => buildParts(m, {}, { tol: 0.2, fase: true }, { rx: 0, ry: 0 }).parts.flatMap((p) => p.polys);
  const box = (ps: number[][][]) => {
    const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
    for (const q of ps) for (const v of q) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], v[k]); mx[k] = Math.max(mx[k], v[k]); }
    return { mn, mx };
  };
  const A = cube(80, 50, 12), B = cube(80, 50, 12), C = cube(80, 50, 10), D = cube(50, 12, 40);
  const ba = box(polys(A)), bd = box(polys(D));
  const W = ba.mx[0] - ba.mn[0];
  const items: AsmItem[] = [
    { id: 1, name: 'A', model: A, values: {}, pos: [0, 0, 0], rot: [0, 0, 0] },
    { id: 2, name: 'B', model: B, values: {}, pos: [W, 0, 0], rot: [0, 0, 0] },
    { id: 3, name: 'C (oben)', model: C, values: {}, pos: [0, 0, 12], rot: [0, 0, 0] },
    // stehende Wand hinten an B, um Z gedreht
    { id: 4, name: 'D (Wand, gedreht)', model: D, values: {}, pos: [W + (ba.mn[0] + ba.mx[0]) / 2 - (bd.mn[1] + bd.mx[1]) / 2, 0, 12], rot: [0, 0, 90] },
  ];
  const geo = items.map((it) => ({ id: it.id, polys: polys(it.model) }));
  const res = planJoints(items, geo, { ...DEFAULT_ASM_JOINTS, type }, 0.2);
  checks++;
  const total = res.contacts.reduce((a, c) => a + c.joints, 0);
  const ok = res.contacts.length >= 2 && total >= 3;
  if (!ok) fails++;
  console.log(`${ok ? '✓' : '✗'} Baugruppe (${type}): ${res.contacts.length} Berührungen, ${total} Verbinder, ${res.pins} Dübel ${res.warnings.join(' | ')}`);
  for (const c of res.contacts) console.log(`   ${items.find((i) => i.id === c.a)!.name} ↔ ${items.find((i) => i.id === c.b)!.name}: Achse ${'XYZ'[c.axis]}, ${c.joints}`);
  for (const it of items) {
    const mods = res.mods.get(it.id)!;
    check(`Baugruppe ${type}: ${it.name} mit ${mods.sub.length} Löchern, ${mods.add.length} Zapfen`, { ...it.model, mods }, {});
    // Volumen muss sich durch Löcher verringern
  }
  if (res.pins) check(`Baugruppe ${type}: Dübelplatte`, pinsModel(res.pins, 6, 8), {});
}

// ---------------------------------------------------------------- Import (STL)
await (async () => {
  // „Fremde“ Datei: Stern aus der CAD-Engine als STL exportieren und wieder einlesen
  const star: ModelDef = { name: 'Stern', params: [], source: 'custom', root: [{ type: 'extrude', h: 3, shape: { type: 'polygon', points: Array.from({ length: 10 }, (_, i) => [Math.round((i % 2 ? 6 : 15) * Math.cos((i * Math.PI) / 5) * 100) / 100, Math.round((i % 2 ? 6 : 15) * Math.sin((i * Math.PI) / 5) * 100) / 100] as [number, number]) } }] };
  const sp = buildParts(star, {}, { tol: 0.2, fase: true }, { rx: 0, ry: 0 }).parts[0].polys;
  const bin = stlBinary([meshFromPolygons(sp)]);
  const ascii = 'solid x\n' + sp.flatMap((pl) => Array.from({ length: pl.length - 2 }, (_, k) => `facet normal 0 0 0\nouter loop\n${[pl[0], pl[k + 1], pl[k + 2]].map((v) => `vertex ${v.join(' ')}`).join('\n')}\nendloop\nendfacet`)).join('\n') + '\nendsolid x\n';
  for (const [label, buf] of [['binär', bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)], ['ASCII', new TextEncoder().encode(ascii).buffer]] as const) {
    checks++;
    try {
      const im = await parseMeshBuffer('stern', 'stl', buf as ArrayBuffer);
      const st = analyzeMesh(im.mesh);
      const ok = st.manifold && Math.abs(im.size[0] - 28.53) < 1.5 && Math.abs(im.size[2] - 3) < 0.01;
      if (!ok) fails++;
      console.log(`${ok ? '✓' : '✗'} STL-Import ${label}: ${st.triangles} Dreiecke, Größe ${im.size.join('×')}, wasserdicht ${st.manifold}`);
      await registerImported(meshFromJson(meshToJson(im)), false);
      const mk = (o: Partial<FreePart>): FreePart => ({ id: 1, kind: 'quader', name: 'x', hole: false, slot: 1, pos: [0, 0, 0], rot: [0, 0, 0], size: [10, 10, 10], e: {}, ...o });
      const fm = freeToModel([
        mk({ id: 1, size: [80, 40, 4], pos: [0, 0, 2] }),
        mk({ id: 2, kind: 'import', name: 'Logo', size: [im.size[0] * 1.5, im.size[1] * 1.5, 3], pos: [0, 0, 4 + 1.5 - 0.3], rot: [0, 0, 18], e: { ref: im.id }, slot: 2 }),
        mk({ id: 3, kind: 'import', name: 'Gravur', hole: true, size: [12, 12, 1.2], pos: [33, 0, 3.6], e: { ref: im.id } }),
      ])!;
      check(`Import ${label}: Platte mit eingraviertem Import`, fm, {});
      checks++;
      const r = runPipeline(fm, {}, { globals: { tol: 0.2, fase: true }, orientation: { rx: 0, ry: 0 }, zones: null, palette: [{ slot: 1, name: 'A', color: '#fff' }, { slot: 2, name: 'B', color: '#f00' }], material: 'pla', profile: PROFILES.standard, layer: 0.2, overhangDeg: 45, bedSize: 256, bedHeight: 256, split: { ...DEFAULT_SPLIT, enabled: false }, hollow: DEFAULT_HOLLOW });
      const imp = r.parts.find((p) => p.name === 'Import: Logo');
      const ok2 = !!imp && imp.stats.manifold && r.total.min[2] > -1e-6 && Math.abs(r.total.max[2] - 6.7) < 0.05 && r.parts.length === 2;
      if (!ok2) fails++;
      // Verschweißen: Platte + Logo als ein Körper (echte Vereinigung)
      const welded = freeToModel([
        mk({ id: 1, size: [80, 40, 4], pos: [0, 0, 2] }),
        mk({ id: 2, kind: 'import', name: 'Logo', size: [im.size[0] * 1.5, im.size[1] * 1.5, 3], pos: [0, 0, 4 + 1.5 - 0.3], rot: [0, 0, 18], e: { ref: im.id } }),
      ], { weldAll: true })!;
      checks++;
      if (welded.imports?.length) { fails++; console.log('✗ verschweißt: Import nicht in CSG'); }
      check(`Import ${label}: verschweißt zu einem Teil`, welded, {});
      console.log(`${ok2 ? '✓' : '✗'} Import ${label}: Logo als eigener Körper (Slot ${imp?.slot}), Höhe ${(r.total.max[2] - r.total.min[2]).toFixed(2)} mm, ${r.parts.length} Teile`);
    } catch (e) {
      fails++;
      console.log(`✗ STL-Import ${label}: FEHLER ${(e as Error).message}`);
    }
  }
})();

// ---------------------------------------------------------------- Schnell & sparsam
for (const id of ['hook', 'box', 'angle']) {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) continue;
  checks++;
  const polys = buildParts(t.model, defaultValues(t.model), { tol: 0.2, fase: true }, { rx: 0, ry: 0 }).parts.flatMap((p) => p.polys);
  const plan = optimizePrint(meshFromPolygons(polys), { profile: PROFILES.standard, layer: 0.2, orientation: { rx: 0, ry: 0 } }, { load: false, fine: false, orient: true }, { overhangDeg: 45, density: 1.24, bedSize: 256, bedHeight: 256 });
  const ok = plan.after.grams < plan.before.grams && plan.after.minutes < plan.before.minutes;
  if (!ok) fails++;
  console.log(`${ok ? '✓' : '✗'} Optimieren ${id}: ${plan.before.grams.toFixed(1)} g / ${plan.before.minutes.toFixed(0)} min → ${plan.after.grams.toFixed(1)} g / ${plan.after.minutes.toFixed(0)} min (X ${plan.orientation.rx}°, Y ${plan.orientation.ry}°) – ${plan.notes.join(' | ')}`);
}

console.log(`\n${checks - fails} von ${checks} Prüfungen bestanden.`);
if (fails) process.exit(1);
