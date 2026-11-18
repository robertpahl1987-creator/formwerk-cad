/**
 * „Schnell & sparsam“: sucht Druckausrichtung, Schichthöhe und Füllung, mit denen
 * das Teil am schnellsten und mit am wenigsten Filament gedruckt wird –
 * inklusive geschätztem Stützmaterial für Überhänge.
 */
import { analyzeMesh, estimatePrint, rotateMesh, type Mesh, type PrintEstimate, type PrintProfile } from './mesh';

export interface OptimizeGoal {
  /** Teil muss Kräfte aushalten (Halter, Haken) → Gyroid statt Blitz-Füllung, 3 Wände */
  load: boolean;
  /** Feine Details (Schrift, kleine Teile) → nicht gröber als 0,2 mm */
  fine: boolean;
  /** Ausrichtung mit optimieren (nicht bei aufgeteilten Modellen) */
  orient: boolean;
}

export interface OptimizePlan {
  profile: PrintProfile;
  layer: number;
  orientation: { rx: number; ry: number };
  before: PrintEstimate & { support: number };
  after: PrintEstimate & { support: number };
  notes: string[];
}

const ORIENTS: [number, number][] = [
  [0, 0],
  [180, 0],
  [90, 0],
  [-90, 0],
  [0, 90],
  [0, -90],
];

/** Schätzung inkl. Stützmaterial (Überhangfläche × mittlere Höhe × ~12 % Stützdichte). */
export function estimateWithSupport(m: Mesh, overhangDeg: number, density: number, pr: PrintProfile, layer: number): PrintEstimate & { support: number; height: number; size: number[] } {
  const st = analyzeMesh(m, overhangDeg, undefined);
  const h = st.max[2] - st.min[2];
  const e = estimatePrint(st.volume, st.area, st.areaTB, h, density, pr, layer);
  const supVol = st.overhangArea * (h / 2) * 0.12;
  const support = (supVol / 1000) * density;
  return {
    grams: e.grams + support,
    meters: e.meters + supVol / (Math.PI * 0.875 * 0.875) / 1000,
    minutes: e.minutes + supVol / 9 / 60 + (st.overhangArea > 50 ? 2 : 0),
    support,
    height: h,
    size: [st.max[0] - st.min[0], st.max[1] - st.min[1], h],
  };
}

/**
 * @param unrot Netz in Grundausrichtung (ohne aktuelle Drehung)
 */
export function optimizePrint(
  unrot: Mesh,
  current: { profile: PrintProfile; layer: number; orientation: { rx: number; ry: number } },
  goal: OptimizeGoal,
  o: { overhangDeg: number; density: number; bedSize: number; bedHeight: number },
): OptimizePlan {
  const notes: string[] = [];
  const profile: PrintProfile = goal.load
    ? { id: 'eigen', infill: 0.12, pattern: 'gyroid', walls: 3, top: 4, bottom: 3 }
    : { id: 'eigen', infill: 0.08, pattern: 'lightning', walls: 2, top: 4, bottom: 3 };
  const layer = goal.fine ? 0.2 : 0.28;
  notes.push(goal.load ? 'Füllung 12 % Gyroid, 3 Wände – hält Belastung, spart trotzdem' : 'Füllung 8 % Blitz, 2 Wände – stützt nur die Decken, spart am meisten');
  notes.push(goal.fine ? 'Schicht 0,2 mm – feine Details (Schrift) bleiben sauber' : 'Schicht 0,28 mm – rund 30 % weniger Schichten als 0,2 mm');

  const curMesh = rotateMesh(unrot, current.orientation.rx, current.orientation.ry);
  const before = estimateWithSupport(curMesh, o.overhangDeg, o.density, current.profile, current.layer);

  let best = { rx: current.orientation.rx, ry: current.orientation.ry, e: estimateWithSupport(curMesh, o.overhangDeg, o.density, profile, layer), score: Infinity };
  best.score = best.e.grams + best.e.minutes * 0.6;
  if (goal.orient) {
    for (const [rx, ry] of ORIENTS) {
      const e = estimateWithSupport(rotateMesh(unrot, rx, ry), o.overhangDeg, o.density, profile, layer);
      const fits = e.size[0] <= o.bedSize && e.size[1] <= o.bedSize && e.size[2] <= o.bedHeight;
      if (!fits) continue;
      // Gramm + Minuten gewichten; Stützen extra bestrafen (Nacharbeit, Oberfläche)
      const score = e.grams + e.minutes * 0.6 + e.support * 2;
      if (score < best.score - 0.01) best = { rx, ry, e, score };
    }
    if (best.rx !== current.orientation.rx || best.ry !== current.orientation.ry)
      notes.push(`Gedreht (X ${best.rx}°, Y ${best.ry}°) – ${best.e.support < 0.05 ? 'ohne Stützen' : 'weniger Stützen'}, ${Math.round(best.e.height)} mm hoch`);
    else notes.push('Ausrichtung ist bereits die beste');
  }
  if (best.e.support >= 0.05) notes.push(`Stützmaterial nötig (ca. ${best.e.support.toFixed(1).replace('.', ',')} g) – im Slicer „Baum-Stützen“ wählen, die sparen am meisten`);
  return {
    profile,
    layer,
    orientation: { rx: best.rx, ry: best.ry },
    before: { grams: before.grams, meters: before.meters, minutes: before.minutes, support: before.support },
    after: { grams: best.e.grams, meters: best.e.meters, minutes: best.e.minutes, support: best.e.support },
    notes,
  };
}
