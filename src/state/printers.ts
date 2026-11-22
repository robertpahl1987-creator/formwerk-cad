/** Drucker-Profile: Bauraum + passender Slicer. bed = kleinere Bettseite (Formwerk rechnet mit quadratischem Bett). */
export interface PrinterProfile {
  id: string;
  name: string;
  vendor: string;
  bed: number;
  height: number;
  slicer: string;
}

export const PRINTERS: PrinterProfile[] = [
  { id: 'bambu-p1s', name: 'Bambu Lab P1S / P1P', vendor: 'Bambu Lab', bed: 256, height: 256, slicer: 'Bambu Studio' },
  { id: 'bambu-x1', name: 'Bambu Lab X1 Carbon / X1E', vendor: 'Bambu Lab', bed: 256, height: 256, slicer: 'Bambu Studio' },
  { id: 'bambu-a1', name: 'Bambu Lab A1', vendor: 'Bambu Lab', bed: 256, height: 256, slicer: 'Bambu Studio' },
  { id: 'bambu-a1mini', name: 'Bambu Lab A1 mini', vendor: 'Bambu Lab', bed: 180, height: 180, slicer: 'Bambu Studio' },
  { id: 'bambu-h2d', name: 'Bambu Lab H2D', vendor: 'Bambu Lab', bed: 320, height: 325, slicer: 'Bambu Studio' },
  { id: 'prusa-mk4', name: 'Prusa MK4 / MK4S', vendor: 'Prusa', bed: 210, height: 220, slicer: 'PrusaSlicer' },
  { id: 'prusa-core1', name: 'Prusa Core One', vendor: 'Prusa', bed: 220, height: 270, slicer: 'PrusaSlicer' },
  { id: 'prusa-mini', name: 'Prusa MINI+', vendor: 'Prusa', bed: 180, height: 180, slicer: 'PrusaSlicer' },
  { id: 'creality-k1', name: 'Creality K1 / K1C', vendor: 'Creality', bed: 220, height: 250, slicer: 'Creality Print / OrcaSlicer' },
  { id: 'creality-k1max', name: 'Creality K1 Max', vendor: 'Creality', bed: 300, height: 300, slicer: 'Creality Print / OrcaSlicer' },
  { id: 'creality-ender3v3', name: 'Creality Ender-3 V3 (SE/KE)', vendor: 'Creality', bed: 220, height: 250, slicer: 'Creality Print / OrcaSlicer' },
  { id: 'elegoo-n4', name: 'Elegoo Neptune 4 / 4 Pro', vendor: 'Elegoo', bed: 225, height: 265, slicer: 'OrcaSlicer' },
  { id: 'elegoo-n4max', name: 'Elegoo Neptune 4 Max', vendor: 'Elegoo', bed: 420, height: 480, slicer: 'OrcaSlicer' },
  { id: 'anycubic-kobra3', name: 'Anycubic Kobra 3', vendor: 'Anycubic', bed: 250, height: 260, slicer: 'Anycubic Slicer / OrcaSlicer' },
  { id: 'qidi-q1', name: 'QIDI Q1 Pro', vendor: 'QIDI', bed: 245, height: 240, slicer: 'QIDI Studio / OrcaSlicer' },
  { id: 'voron-350', name: 'Voron 2.4 (350)', vendor: 'Voron', bed: 350, height: 340, slicer: 'OrcaSlicer / PrusaSlicer' },
  { id: 'eigen', name: 'Eigener Drucker (Maße selbst eingeben)', vendor: 'Andere', bed: 0, height: 0, slicer: 'deinem Slicer' },
];

export const printerById = (id?: string) => PRINTERS.find((p) => p.id === id) ?? PRINTERS[0];
