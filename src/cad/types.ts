/**
 * Formwerk CAD – parametrisches Modellformat ("FWCAD-DSL").
 *
 * Ein Modell ist ein JSON-Baum aus CSG-Knoten. Alle Maße sind Millimeter,
 * alle Winkel Grad. Zahlenfelder dürfen Ausdrücke sein, die auf Parameter
 * verweisen (z. B. "L - 2*wall"). Der Baum wird deterministisch
 *   1) mit @jscad/modeling zu exakter B-Rep/CSG-Geometrie gebaut und
 *   2) 1:1 nach OpenSCAD übersetzt.
 * Dadurch gibt es keine „geratenen“ Meshes – nur mathematisch definierte Körper.
 */

export type Value = number | boolean | string;
/** Zahl, Boolean oder Ausdruck als String (z. B. "L/2 + tol"). */
export type Expr = number | boolean | string;
export type Vec2 = [Expr, Expr];
export type Vec3 = [Expr, Expr, Expr];

// ---------- 2D-Profile (nur innerhalb von extrude / revolve) ----------
export type Shape2D =
  | { type: 'rect'; size: Vec2; r?: Expr; center?: boolean }
  | { type: 'circle'; r?: Expr; d?: Expr; fn?: Expr }
  | {
      type: 'polygon';
      points: Vec2[];
      holes?: Vec2[][];
      /** Positive Werte vergrößern, negative verkleinern (z. B. Toleranz). */
      offset?: Expr;
    };

// ---------- 3D-Knoten ----------
export type CadNode =
  | { type: 'cube'; size: Vec3; center?: boolean }
  | { type: 'roundedCube'; size: Vec3; r: Expr; center?: boolean }
  | {
      type: 'cylinder';
      h: Expr;
      r?: Expr;
      d?: Expr;
      r1?: Expr;
      r2?: Expr;
      center?: boolean;
      fn?: Expr;
    }
  | { type: 'sphere'; r?: Expr; d?: Expr; fn?: Expr }
  | { type: 'extrude'; h: Expr; shape: Shape2D; center?: boolean }
  | { type: 'revolve'; shape: Shape2D; angle?: Expr; fn?: Expr }
  /** Horizontales Loch mit 45°-Spitze nach oben (überhangfrei druckbar), immer zentriert. */
  | { type: 'teardrop'; r?: Expr; d?: Expr; h: Expr; axis?: 'x' | 'y' | 'z' }
  /** Außengewinde (Achse Z, von z=0 bis h). d = Außendurchmesser, iso = metrisches 60°-Profil, sonst druckoptimiert 45°. Als Loch: d + 2*tol */
  | { type: 'thread'; d: Expr; pitch: Expr; h: Expr; iso?: boolean; chamfer?: boolean; left?: boolean }
  | { type: 'union' | 'difference' | 'intersection' | 'hull'; children: CadNode[] }
  | { type: 'translate'; v: Vec3; children: CadNode[] }
  | { type: 'rotate'; a: Vec3; children: CadNode[] }
  | { type: 'mirror'; v: Vec3; children: CadNode[] }
  | { type: 'scale'; v: Vec3; children: CadNode[] }
  /** Einstrich-Schrift (Beschriftung/Einlage), Text in XY, Höhe h nach +Z. */
  /** text darf {param}-Platzhalter für Textparameter enthalten. */
  | { type: 'text'; text: string; size: Expr; h: Expr; stroke?: Expr; center?: boolean; /** max. Breite – längerer Text wird verkleinert */ maxW?: Expr }
  /**
   * Mehrfarbendruck: Kinder gehören zu Filament-Slot `slot` (1–8, z. B. AMS).
   * Nur auf oberster Ebene (root) bildet ein color-Knoten ein eigenes Druckteil;
   * später aufgeführte Teile haben Vorrang (überlappende Bereiche werden
   * vorherigen Teilen abgezogen → saubere Einlagen ohne Überschneidung).
   */
  | { type: 'color'; slot: Expr; name?: string; children: CadNode[] }
  /** importierte Datei (STL/3MF/OBJ), zentriert und auf `size` skaliert – nur aus „Frei bauen“ */
  | { type: 'import'; ref: string; size: Vec3 }
  | { type: 'if'; cond: Expr; then: CadNode[]; else?: CadNode[] }
  | { type: 'for'; var: string; from: Expr; to: Expr; step?: Expr; children: CadNode[] };

export type ParamRole = 'length' | 'width' | 'height' | 'wall' | 'hole' | 'count' | 'depth';

export interface ParamDef {
  key: string;
  label: string;
  type: 'number' | 'bool' | 'select' | 'text';
  value: Value;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  group?: string;
  role?: ParamRole;
  options?: { value: number; label: string }[];
  hint?: string;
}

export interface ModelDef {
  name: string;
  description?: string;
  params: ParamDef[];
  /** Wurzelknoten – werden vereinigt. */
  root: CadNode[];
  source: 'template' | 'ai' | 'photo' | 'custom';
  templateId?: string;
  /** Die Beschreibung, aus der das Modell entstanden ist (nachträglich bearbeitbar). */
  prompt?: string;
  /**
   * Nachträgliche Änderungen im Druckbett-Koordinatensystem (nach dem Ablegen):
   * z. B. Dübellöcher und Steckzapfen aus der Baugruppe.
   */
  mods?: { sub: CadNode[]; add: CadNode[] };
  /** Frei gebaut: die Bauteile, aus denen das Modell entstanden ist (zum Wiederöffnen) */
  freeParts?: unknown[];
  /** Importierte Dateien als eigene Körper (werden im Slicer mit dem Modell verschmolzen) */
  imports?: ModelImport[];
}

export interface ModelImport {
  ref: string;
  name: string;
  slot: number;
  pos: [number, number, number];
  rot: [number, number, number];
  size: [number, number, number];
}

export interface Orientation {
  rx: number;
  ry: number;
}

export interface FilamentSlot {
  slot: number;
  name: string;
  color: string;
}

/** Farbwechsel nach Höhe: ab `z` (mm über dem Bett) wird Slot `slot` gedruckt. */
export interface ColorZone {
  z: number;
  slot: number;
}

/** Globale Variablen, die jedes Modell nutzen darf. */
export interface Globals {
  tol: number;
  fase: boolean;
}
