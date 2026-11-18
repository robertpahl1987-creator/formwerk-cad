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

let fails = 0;
let checks = 0;
function check(label: string, model: ModelDef, values: Record<string, Value>, opts: Parameters<typeof buildParts>[3] = { rx: 0, ry: 0 }, zones?: Parameters<typeof buildParts>[4], split?: Parameters<typeof buildParts>[5], fase = true) {
  const t0 = Date.now();
  try {
    const out = buildParts(model, values, { tol: 0.2, fase }, opts, zones, split);
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
        return { mesh: m, stats: analyzeMesh(m) };
      });
      const before = ps.reduce((a, p) => a + p.stats.overhangArea, 0);
      suppressSupportedOverhangs(ps);
      const after = ps.reduce((a, p) => a + p.stats.overhangArea, 0);
      console.log(`   Überhänge mehrteilig: ${(before / 100).toFixed(2)} → ${(after / 100).toFixed(2)} cm² (aufliegende Flächen ausgenommen)`);
    }
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
const pm = photoModel(
  [[-20, -10], [20, -10], [25, 0], [20, 10], [-20, 10], [-25, 0]],
  [[[-5, -3], [5, -3], [5, 3], [-5, 3]]],
  50,
  20,
);
check('foto teil', pm, { ...defaultValues(pm), mode: 0 });
check('foto negativform', pm, { ...defaultValues(pm), mode: 1 });

console.log(`\n${checks - fails} von ${checks} Prüfungen bestanden.`);
if (fails) process.exit(1);
