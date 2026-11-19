import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { localExtent, type FreePart } from '../cad/free';
import type { PartResult } from '../state/pipeline';
import { getImported } from '../mesh/importMesh';
import { supportColumns } from '../mesh/supports';
import { printPreview } from '../state/printPreview';
import { paint } from '../state/paint';
import type { ViewOpts } from '../state/store';

/** Frei-bauen-Teile zum Anklicken (Hüllboxen) und Anzeigen negativer Teile. */
export interface FreeOverlay {
  parts: FreePart[];
  sel: number[];
  /** Verschiebung Modell → Druckbett (aus der Platzierung) */
  offset: [number, number, number];
}

interface Props {
  parts: PartResult[] | null;
  overlay?: FreeOverlay | null;
  onPick?: (id: number | null, additive: boolean) => void;
  onMenu?: (id: number | null, x: number, y: number, at: [number, number] | null) => void;
  /** Auswahl mit der Maus verschoben / gedreht (Modellkoordinaten) */
  onTransform?: (t: { move?: [number, number, number]; rot?: { axis: 0 | 1 | 2; deg: number; pivot: [number, number, number] } }) => void;
  view: ViewOpts;
  bedSize: number;
  modelVersion: number;
  /** Schichthöhe und Füllgrad für die Druckvorschau */
  layer?: number;
  infill?: number;
  /** Werkzeug wie in Bambu Studio / OrcaSlicer: Fläche aufs Bett legen, Messen */
  tool?: 'face' | 'measure' | 'paint' | null;
  /** Malen erlaubt (normale Ansicht des aktuellen Modells) + Farben der Filament-Slots */
  paintable?: boolean;
  slotColors?: Record<number, string>;
  onFace?: (normal: [number, number, number]) => void;
  /** Vorschau der Schnittebene für das Schneiden-Werkzeug */
  cutPreview?: { axis: 0 | 1 | 2; frac: number } | null;
}

interface Ctx3 {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  bed: THREE.Group;
  model: THREE.Group;
  dims: THREE.Group;
  overlay: THREE.Group;
  /** ausgewählte Teile (wird beim Ziehen als Vorschau mitbewegt) */
  selG: THREE.Group;
  /** Dreh-Ringe um die Auswahl */
  gizmo: THREE.Group;
  pivot: THREE.Vector3 | null;
  plane: THREE.Plane;
  /** Druckvorschau: alles oberhalb der aktuellen Schicht ausblenden */
  layerPlane: THREE.Plane;
  /** Messen / Schnittebene */
  tools: THREE.Group;
  raf: number;
  bbox: THREE.Box3 | null;
}

function disposeGroup(g: THREE.Object3D) {
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose?.();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else if (mat) {
      const map = (mat as THREE.SpriteMaterial).map;
      map?.dispose();
      mat.dispose();
    }
  });
  g.clear();
}

function makeBed(size: number): THREE.Group {
  const g = new THREE.Group();
  const half = size / 2;
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ color: 0x161b22, roughness: 0.95, metalness: 0 }));
  plate.position.z = -0.02;
  plate.receiveShadow = true;
  g.add(plate);
  const minor: number[] = [];
  const major: number[] = [];
  for (let v = -half; v <= half + 1e-6; v += 10) {
    const arr = Math.abs(Math.round(v) % 50) === 0 ? major : minor;
    arr.push(v, -half, 0, v, half, 0, -half, v, 0, half, v, 0);
  }
  const lines = (arr: number[], color: number, opacity: number) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  };
  g.add(lines(minor, 0x2c3440, 0.9));
  g.add(lines(major, 0x3d4756, 1));
  g.add(lines([-half, -half, 0.01, half, -half, 0.01, half, -half, 0.01, half, half, 0.01, half, half, 0.01, -half, half, 0.01, -half, half, 0.01, -half, -half, 0.01], 0x00ae42, 0.9));
  // Achsen
  const ax = lines([-half, -half, 0.02, -half + 30, -half, 0.02], 0xff5c5c, 1);
  const ay = lines([-half, -half, 0.02, -half, -half + 30, 0.02], 0x51cf66, 1);
  g.add(ax, ay);
  const label = textSprite(`${size} × ${size} mm`, '#5c6878', 'rgba(0,0,0,0)');
  label.position.set(0, -half - 8, 0);
  label.scale.multiplyScalar(size / 42);
  g.add(label);
  return g;
}

function textSprite(text: string, color = '#ffffff', bg = 'rgba(14,17,22,0.85)'): THREE.Sprite {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  const font = '600 44px Inter, system-ui, sans-serif';
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + 36;
  c.width = w;
  c.height = 68;
  ctx.font = font;
  ctx.fillStyle = bg;
  const r = 14;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(w, 0, w, 68, r);
  ctx.arcTo(w, 68, 0, 68, r);
  ctx.arcTo(0, 68, 0, 0, r);
  ctx.arcTo(0, 0, w, 0, r);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 18, 36);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sp.renderOrder = 10;
  sp.scale.set(w / 68, 1, 1);
  return sp;
}

function dimension(a: THREE.Vector3, b: THREE.Vector3, ext: [THREE.Vector3, THREE.Vector3][], label: string, scale: number, color = 0x4dabf7): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.95 });
  const pts: number[] = [a.x, a.y, a.z, b.x, b.y, b.z];
  for (const [p, q] of ext) pts.push(p.x, p.y, p.z, q.x, q.y, q.z);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const ls = new THREE.LineSegments(geo, mat);
  ls.renderOrder = 9;
  g.add(ls);
  const dir = b.clone().sub(a).normalize();
  const head = scale * 0.035;
  for (const [p, d] of [
    [a, dir.clone()],
    [b, dir.clone().negate()],
  ] as [THREE.Vector3, THREE.Vector3][]) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(head * 0.35, head, 12), new THREE.MeshBasicMaterial({ color, depthTest: false }));
    cone.renderOrder = 9;
    cone.position.copy(p).addScaledVector(d, head / 2);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().negate());
    g.add(cone);
  }
  const sp = textSprite(label);
  sp.position.copy(a).add(b).multiplyScalar(0.5);
  sp.scale.multiplyScalar(scale * 0.055);
  g.add(sp);
  return g;
}

/** Hüllbox eines Frei-bauen-Teils: Mittelpunkt, Drehung (erst X, dann Y, dann Z), halbe Kanten. */
function obb(p: FreePart, offset: [number, number, number]) {
  const ext = localExtent(p);
  const d = Math.PI / 180;
  const rot = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(p.rot[0] * d, p.rot[1] * d, p.rot[2] * d, 'ZYX')));
  return {
    center: new THREE.Vector3(p.pos[0] + offset[0], p.pos[1] + offset[1], p.pos[2] + offset[2]),
    rot,
    half: new THREE.Vector3(ext[0] / 2, ext[1] / 2, ext[2] / 2),
  };
}

/**
 * Material für die Druckvorschau: Schichtlinien an den Wänden, diagonale Bahnen auf Deckflächen,
 * matter Kunststoff. back = Innenseite (sichtbar am Schnitt) mit Füllmuster.
 */
function printMaterial(o: { layer: number; infill: number; clip: THREE.Plane[]; color?: THREE.Color; vertexColors?: boolean; opacity?: number; back?: boolean }): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    vertexColors: !!o.vertexColors,
    color: o.color ?? 0xffffff,
    roughness: 0.66,
    metalness: 0,
    clippingPlanes: o.clip,
    side: o.back ? THREE.BackSide : THREE.FrontSide,
    transparent: (o.opacity ?? 1) < 1,
    opacity: o.opacity ?? 1,
    depthWrite: (o.opacity ?? 1) >= 1,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const spacing = Math.max(1.2, (2 * 0.42) / Math.max(0.03, o.infill));
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uLayer = { value: Math.max(0.04, o.layer) };
    sh.uniforms.uSpacing = { value: spacing };
    sh.vertexShader = 'varying vec3 vWp;\nvarying vec3 vWn;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\n  vWp = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n#else\n  vWp = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#endif\n  vWn = normalize(mat3(modelMatrix) * objectNormal);');
    const front = `
      float sideF = 1.0 - smoothstep(0.75, 0.95, abs(vWn.z));
      float lf = fract(vWp.z / uLayer);
      float ridge = smoothstep(0.0, 0.35, lf) * (1.0 - smoothstep(0.65, 1.0, lf));
      diffuseColor.rgb *= mix(1.0, 0.78 + 0.22 * ridge, sideF);
      float topF = smoothstep(0.85, 0.97, vWn.z);
      float dd = fract((vWp.x + vWp.y) * 0.7071 / 0.42);
      diffuseColor.rgb *= mix(1.0, 0.92 + 0.08 * smoothstep(0.0, 0.5, dd) * (1.0 - smoothstep(0.5, 1.0, dd)), topF);`;
    const back = `
      vec2 g = abs(fract(vWp.xy / uSpacing) - 0.5);
      float gl = 1.0 - smoothstep(0.42 / uSpacing * 0.5, 0.42 / uSpacing, min(g.x, g.y));
      diffuseColor.rgb *= 0.45 + 0.45 * gl;`;
    sh.fragmentShader = 'uniform float uLayer;\nuniform float uSpacing;\nvarying vec3 vWp;\nvarying vec3 vWn;\n' + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + (o.back ? back : front));
  };
  m.customProgramCacheKey = () => (o.back ? 'fw-print-back' : 'fw-print-front');
  return m;
}

const fmt = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mm`;

export function Viewer({ parts, view, bedSize, modelVersion, overlay, onPick, onMenu, onTransform, layer = 0.2, infill = 0.15, tool = null, onFace, cutPreview = null, paintable = false, slotColors = {} }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx3 | null>(null);
  const lastVersion = useRef(-1);
  const live = useRef({ overlay, onPick, onMenu, onTransform, tool, onFace, paintable, slotColors });
  live.current = { overlay, onPick, onMenu, onTransform, tool, onFace, paintable, slotColors };
  const measurePts = useRef<THREE.Vector3[]>([]);

  // Initialisierung
  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.localClippingEnabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'none';
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 5000);
    camera.up.set(0, 0, 1);
    camera.position.set(180, -260, 200);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.screenSpacePanning = true;
    controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    controls.maxDistance = 2000;
    scene.add(new THREE.HemisphereLight(0xdde6f0, 0x1b1f26, 1.1));
    const d1 = new THREE.DirectionalLight(0xffffff, 1.6);
    d1.position.set(150, -200, 300);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x9fc5ff, 0.6);
    d2.position.set(-200, 150, 120);
    scene.add(d2);
    const bed = new THREE.Group();
    const model = new THREE.Group();
    const dims = new THREE.Group();
    const overlayG = new THREE.Group();
    const selG = new THREE.Group();
    selG.matrixAutoUpdate = false;
    const gizmo = new THREE.Group();
    const toolsG = new THREE.Group();
    scene.add(bed, model, dims, overlayG, selG, gizmo, toolsG);
    const c: Ctx3 = { renderer, scene, camera, controls, bed, model, dims, overlay: overlayG, selG, gizmo, pivot: null, plane: new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), layerPlane: new THREE.Plane(new THREE.Vector3(0, 0, -1), 1e6), tools: toolsG, raf: 0, bbox: null };

    // ---- Anklicken & Rechtsklick (nur wenn Frei-bauen-Teile vorhanden) ----
    const ray = new THREE.Raycaster();
    const hit = (clientX: number, clientY: number): { id: number | null; at: [number, number] | null } => {
      const ov = live.current.overlay;
      const r = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1), camera);
      const o = ray.ray.origin,
        d = ray.ray.direction;
      let at: [number, number] | null = null;
      if (Math.abs(d.z) > 1e-9) {
        const t0 = -o.z / d.z;
        if (t0 > 0) at = [o.x + d.x * t0 - (ov?.offset[0] ?? 0), o.y + d.y * t0 - (ov?.offset[1] ?? 0)];
      }
      if (!ov) return { id: null, at };
      let best: { id: number; t: number } | null = null;
      for (const p of ov.parts) {
        const { center, rot, half } = obb(p, ov.offset);
        const inv = rot.clone().transpose();
        const lo = o.clone().sub(center).applyMatrix3(inv);
        const ld = d.clone().applyMatrix3(inv);
        let tmin = -Infinity,
          tmax = Infinity;
        let miss = false;
        for (const k of ['x', 'y', 'z'] as const) {
          const h = half[k] + 0.5;
          if (Math.abs(ld[k]) < 1e-12) {
            if (Math.abs(lo[k]) > h) miss = true;
            continue;
          }
          let t1 = (-h - lo[k]) / ld[k],
            t2 = (h - lo[k]) / ld[k];
          if (t1 > t2) [t1, t2] = [t2, t1];
          tmin = Math.max(tmin, t1);
          tmax = Math.min(tmax, t2);
        }
        if (miss || tmax < Math.max(tmin, 0)) continue;
        const t = Math.max(tmin, 0);
        // Körper vor Löchern bevorzugen, wenn gleich weit
        const score = t + (p.hole ? 0.01 : 0);
        if (!best || score < best.t) best = { id: p.id, t: score };
      }
      return { id: best?.id ?? null, at };
    };
    let down: { x: number; y: number; t: number; touch: boolean } | null = null;
    let longTimer: ReturnType<typeof setTimeout> | null = null;
    let longFired = false;
    let rightDown: { x: number; y: number } | null = null;
    const cv = renderer.domElement;
    // ---- Ziehen: Auswahl verschieben (Teil ziehen) oder drehen (Ring ziehen) ----
    type Drag = { kind: 'rot'; axis: 0 | 1 | 2; a0: number; deg: number } | { kind: 'move'; p0: THREE.Vector3; d: THREE.Vector3; vertical: boolean };
    let drag: Drag | null = null;
    const ndc = (x: number, y: number) => {
      const r = cv.getBoundingClientRect();
      return new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    };
    const AX = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
    const onPlane = (x: number, y: number, normal: THREE.Vector3, through: THREE.Vector3) => {
      ray.setFromCamera(ndc(x, y), camera);
      return ray.ray.intersectPlane(new THREE.Plane().setFromNormalAndCoplanarPoint(normal, through), new THREE.Vector3());
    };
    const angleAt = (x: number, y: number, axis: number) => {
      const p = onPlane(x, y, AX[axis], c.pivot!);
      if (!p) return null;
      p.sub(c.pivot!);
      const u = (axis + 1) % 3,
        v = (axis + 2) % 3;
      return Math.atan2(p.getComponent(v), p.getComponent(u));
    };
    const vertPlaneNormal = () => {
      const n = camera.position.clone().sub(c.pivot!);
      n.z = 0;
      return n.lengthSq() < 1e-6 ? new THREE.Vector3(0, -1, 0) : n.normalize();
    };
    const setHud = (t: string | null) => {
      const el = hud.current;
      if (!el) return;
      el.style.display = t ? 'block' : 'none';
      if (t) el.textContent = t;
    };
    const startDrag = (e: PointerEvent): boolean => {
      const ov = live.current.overlay;
      if (!ov || !ov.sel.length || !c.pivot || !live.current.onTransform || e.button !== 0) return false;
      ray.setFromCamera(ndc(e.clientX, e.clientY), camera);
      const hits = ray.intersectObjects(c.gizmo.children.filter((o) => o.userData.pick), false);
      if (hits.length) {
        const axis = hits[0].object.userData.axis as 0 | 1 | 2;
        const a0 = angleAt(e.clientX, e.clientY, axis);
        if (a0 === null) return false;
        drag = { kind: 'rot', axis, a0, deg: 0 };
      } else {
        const h = hit(e.clientX, e.clientY);
        if (h.id === null || !ov.sel.includes(h.id)) return false;
        const vertical = e.altKey;
        const p0 = onPlane(e.clientX, e.clientY, vertical ? vertPlaneNormal() : AX[2], c.pivot);
        if (!p0) return false;
        drag = { kind: 'move', p0, d: new THREE.Vector3(), vertical };
      }
      controls.enabled = false;
      cv.setPointerCapture?.(e.pointerId);
      e.stopImmediatePropagation();
      return true;
    };
    const moveDrag = (e: PointerEvent) => {
      if (!drag || !c.pivot) return;
      const fine = e.shiftKey;
      const pv = c.pivot;
      if (drag.kind === 'rot') {
        const a = angleAt(e.clientX, e.clientY, drag.axis);
        if (a === null) return;
        let deg = ((a - drag.a0) * 180) / Math.PI;
        deg = ((deg + 540) % 360) - 180;
        const st = fine ? 1 : 5;
        deg = Math.round(deg / st) * st;
        drag.deg = deg;
        const m = new THREE.Matrix4().makeTranslation(pv.x, pv.y, pv.z).multiply(new THREE.Matrix4().makeRotationAxis(AX[drag.axis], (deg * Math.PI) / 180)).multiply(new THREE.Matrix4().makeTranslation(-pv.x, -pv.y, -pv.z));
        c.selG.matrix.copy(m);
        c.selG.matrixWorldNeedsUpdate = true;
        setHud(`Drehen um ${'XYZ'[drag.axis]}: ${deg > 0 ? '+' : ''}${deg}°`);
      } else {
        const p = onPlane(e.clientX, e.clientY, drag.vertical ? vertPlaneNormal() : AX[2], pv);
        if (!p) return;
        const d = p.sub(drag.p0);
        if (drag.vertical) d.set(0, 0, d.z);
        else d.z = 0;
        const st = fine ? 0.1 : 1;
        d.set(Math.round(d.x / st) * st, Math.round(d.y / st) * st, Math.round(d.z / st) * st);
        drag.d.copy(d);
        c.selG.matrix.makeTranslation(d.x, d.y, d.z);
        c.selG.matrixWorldNeedsUpdate = true;
        c.gizmo.position.copy(d);
        setHud(drag.vertical ? `Höhe ${d.z > 0 ? '+' : ''}${d.z.toFixed(1).replace('.', ',')} mm` : `X ${d.x.toFixed(1).replace('.', ',')}  Y ${d.y.toFixed(1).replace('.', ',')} mm`);
      }
    };
    const endDrag = (): boolean => {
      const dr = drag;
      drag = null;
      controls.enabled = true;
      setHud(null);
      if (!dr || !c.pivot) return false;
      const off = live.current.overlay?.offset ?? [0, 0, 0];
      if (dr.kind === 'rot' && dr.deg !== 0) {
        live.current.onTransform?.({ rot: { axis: dr.axis, deg: dr.deg, pivot: [c.pivot.x - off[0], c.pivot.y - off[1], c.pivot.z - off[2]] } });
        return true;
      }
      if (dr.kind === 'move' && dr.d.lengthSq() > 1e-9) {
        live.current.onTransform?.({ move: [dr.d.x, dr.d.y, dr.d.z] });
        return true;
      }
      c.selG.matrix.identity();
      c.gizmo.position.set(0, 0, 0);
      return false;
    };
    // ---- Malen (Farbe / Stützen) ----
    let painting = false;
    const paintAt = (x: number, y: number) => {
      ray.setFromCamera(ndc(x, y), camera);
      const hitM = ray.intersectObjects(c.model.children.filter((o) => o.userData.solid), false)[0];
      if (!hitM) return false;
      const mesh = hitM.object as THREE.Mesh;
      const cen = mesh.userData.centroids as Float32Array | undefined;
      if (!cen) return true;
      const r = paint.get().radius,
        r2 = r * r,
        p = hitM.point;
      const tris: number[] = [];
      for (let t = 0; t < cen.length / 3; t++) {
        const dx = cen[t * 3] - p.x, dy = cen[t * 3 + 1] - p.y, dz = cen[t * 3 + 2] - p.z;
        if (dx * dx + dy * dy + dz * dz <= r2) tris.push(t);
      }
      if (!tris.length && hitM.faceIndex !== undefined) tris.push(hitM.faceIndex);
      paint.apply(mesh.userData.partIndex as number, tris, cen.length / 3);
      return true;
    };
    const onDown = (e: PointerEvent) => {
      if (live.current.tool === 'paint' && live.current.paintable && e.button === 0) {
        if (paintAt(e.clientX, e.clientY)) {
          painting = true;
          controls.enabled = false;
          cv.setPointerCapture?.(e.pointerId);
          e.stopImmediatePropagation();
          down = null;
          return;
        }
      }
      if (startDrag(e)) {
        down = null;
        return;
      }
      if (e.button === 2) rightDown = { x: e.clientX, y: e.clientY };
      down = { x: e.clientX, y: e.clientY, t: performance.now(), touch: e.pointerType === 'touch' };
      longFired = false;
      if (e.pointerType === 'touch' && live.current.onMenu && live.current.overlay?.parts.length) {
        longTimer = setTimeout(() => {
          if (!down) return;
          longFired = true;
          const h = hit(down.x, down.y);
          live.current.onMenu?.(h.id, down.x, down.y, h.at);
        }, 550);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (painting) {
        paintAt(e.clientX, e.clientY);
        return;
      }
      if (drag) return moveDrag(e);
      // Mauszeiger zeigt an, was man greifen kann
      if (e.pointerType === 'mouse' && !e.buttons && c.pivot && live.current.onTransform) {
        ray.setFromCamera(ndc(e.clientX, e.clientY), camera);
        const onRing = ray.intersectObjects(c.gizmo.children.filter((o) => o.userData.pick), false).length > 0;
        const h = onRing ? null : hit(e.clientX, e.clientY);
        cv.style.cursor = onRing ? 'grab' : h?.id !== null && h && live.current.overlay?.sel.includes(h.id!) ? 'move' : '';
      }
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8 && longTimer) {
        clearTimeout(longTimer);
        longTimer = null;
      }
    };
    const onUp = (e: PointerEvent) => {
      if (painting) {
        painting = false;
        controls.enabled = true;
        return;
      }
      if (drag) {
        endDrag();
        return;
      }
      if (longTimer) clearTimeout(longTimer);
      longTimer = null;
      const d0 = down;
      down = null;
      if (!d0 || longFired || e.button !== 0) return;
      if (Math.hypot(e.clientX - d0.x, e.clientY - d0.y) > 5 || performance.now() - d0.t > 600) return;
      // Werkzeuge: Fläche aufs Bett / Messen → Treffer auf dem Modell
      const tl = live.current.tool;
      if (tl) {
        ray.setFromCamera(ndc(e.clientX, e.clientY), camera);
        const solids = c.model.children.filter((o) => o.userData.solid);
        const hitM = ray.intersectObjects(solids, false)[0];
        if (!hitM || !hitM.face) return;
        if (tl === 'face') {
          const n = hitM.face.normal.clone().normalize();
          live.current.onFace?.([n.x, n.y, n.z]);
          return;
        }
        // Messen: zwei Punkte → Abstand
        const pts = measurePts.current.length >= 2 ? [] : measurePts.current;
        pts.push(hitM.point.clone());
        measurePts.current = pts;
        drawMeasure();
        return;
      }
      if (!live.current.overlay?.parts.length || !live.current.onPick) return;
      const h = hit(e.clientX, e.clientY);
      live.current.onPick(h.id, e.ctrlKey || e.metaKey || e.shiftKey);
    };
    const drawMeasure = () => {
      disposeGroup(c.tools);
      const pts = measurePts.current;
      const s = c.bbox ? Math.max(30, c.bbox.getSize(new THREE.Vector3()).length() * 0.7) : 60;
      for (const p of pts) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(s * 0.008, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd43b, depthTest: false }));
        dot.position.copy(p);
        dot.renderOrder = 10;
        c.tools.add(dot);
      }
      if (pts.length === 2) {
        const [a, b] = pts;
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color: 0xffd43b, depthTest: false }));
        line.renderOrder = 10;
        const d = b.clone().sub(a);
        const lab = textSprite(`${fmt(d.length())}  (X ${Math.abs(d.x).toFixed(1).replace('.', ',')} · Y ${Math.abs(d.y).toFixed(1).replace('.', ',')} · Z ${Math.abs(d.z).toFixed(1).replace('.', ',')})`, '#ffd43b');
        lab.position.copy(a.clone().add(b).multiplyScalar(0.5));
        lab.scale.multiplyScalar(s / 60);
        lab.renderOrder = 11;
        c.tools.add(line, lab);
      }
    };
    const onCtx = (e: MouseEvent) => {
      if (!live.current.onMenu || !live.current.overlay) return;
      e.preventDefault();
      // Rechte Maustaste zum Verschieben der Ansicht benutzt → kein Menü
      if (rightDown && Math.hypot(e.clientX - rightDown.x, e.clientY - rightDown.y) > 6) return;
      rightDown = null;
      const h = hit(e.clientX, e.clientY);
      live.current.onMenu(h.id, e.clientX, e.clientY, h.at);
    };
    cv.addEventListener('pointerdown', onDown, { capture: true });
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('contextmenu', onCtx);
    ctx.current = c;
    const resize = () => {
      const w = el.clientWidth || 1,
        h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const loop = () => {
      c.raf = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();
    return () => {
      cv.removeEventListener('pointerdown', onDown, { capture: true });
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('contextmenu', onCtx);
      cancelAnimationFrame(c.raf);
      ro.disconnect();
      controls.dispose();
      disposeGroup(scene);
      renderer.dispose();
      renderer.domElement.remove();
      ctx.current = null;
    };
  }, []);

  // Druckbett
  useEffect(() => {
    const c = ctx.current;
    if (!c) return;
    disposeGroup(c.bed);
    c.bed.add(makeBed(bedSize));
  }, [bedSize]);

  // Modell + Ansichtsoptionen
  useEffect(() => {
    const c = ctx.current;
    if (!c) return;
    disposeGroup(c.model);
    disposeGroup(c.dims);
    if (!parts || !parts.length) return;
    const min = [0, 1, 2].map((k) => Math.min(...parts.map((p) => p.stats.min[k]))) as [number, number, number];
    const max = [0, 1, 2].map((k) => Math.max(...parts.map((p) => p.stats.max[k]))) as [number, number, number];
    const box = new THREE.Box3(new THREE.Vector3(...min), new THREE.Vector3(...max));
    c.bbox = box;
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 1);

    // Schnittebene
    const axisIdx = { x: 0, y: 1, z: 2 }[view.sectionAxis];
    const normal = new THREE.Vector3(axisIdx === 0 ? -1 : 0, axisIdx === 1 ? -1 : 0, axisIdx === 2 ? -1 : 0);
    const pos = min[axisIdx] + (max[axisIdx] - min[axisIdx]) * view.sectionPos;
    c.plane.set(normal, pos);
    const clip = view.section ? [c.plane] : [];
    const print = !!view.print && !view.xray;
    const pclip = print ? [...clip, c.layerPlane] : clip;
    c.layerPlane.constant = print ? min[2] + (max[2] - min[2]) * printPreview.get() + 1e-3 : 1e6;

    const over = new THREE.Color(0xff4d4f);
    const tagMesh = (m: THREE.Mesh, pi: number, arr: Float32Array, col: Float32Array) => {
      m.userData.solid = true;
      m.userData.partIndex = pi;
      m.userData.baseCol = col.slice();
      const cen = new Float32Array(arr.length / 3);
      for (let t = 0; t < arr.length / 9; t++)
        for (let k = 0; k < 3; k++) cen[t * 3 + k] = (arr[t * 9 + k] + arr[t * 9 + 3 + k] + arr[t * 9 + 6 + k]) / 3;
      m.userData.centroids = cen;
    };
    let partIdx = -1;
    for (const part of parts) {
      partIdx++;
      const { pos: P, tri } = part.mesh;
      const n = tri.length;
      if (part.role) {
        // Slicer-Hilfskörper: halbdurchsichtig mit Kanten (Modifier gelb, Blocker rot, Erzwinger blau)
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
        g.setIndex(new THREE.BufferAttribute(tri, 1));
        g.computeVertexNormals();
        const col = new THREE.Color(part.color);
        const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: pclip }));
        m.renderOrder = 3;
        const e = new THREE.LineSegments(new THREE.EdgesGeometry(g, 30), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9, clippingPlanes: pclip }));
        e.renderOrder = 3;
        c.model.add(m, e);
        continue;
      }
      const arr = new Float32Array(n * 3);
      const col = new Float32Array(n * 3);
      const base = new THREE.Color(part.color);
      for (let i = 0; i < n; i++) {
        const v = tri[i] * 3;
        arr[i * 3] = P[v];
        arr[i * 3 + 1] = P[v + 1];
        arr[i * 3 + 2] = P[v + 2];
        const isOver = !print && view.overhangs && part.stats.overhangFlags[(i / 3) | 0] === 1;
        const cc = isOver ? over : base;
        col[i * 3] = cc.r;
        col[i * 3 + 1] = cc.g;
        col[i * 3 + 2] = cc.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.computeVertexNormals();
      if (print) {
        const front = new THREE.Mesh(geo, printMaterial({ layer, infill, clip: pclip, vertexColors: true }));
        tagMesh(front, partIdx, arr, col);
        c.model.add(front);
        c.model.add(new THREE.Mesh(geo, printMaterial({ layer, infill, clip: pclip, color: base.clone().multiplyScalar(0.9), back: true })));
        continue;
      }
      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.55,
        metalness: 0.05,
        clippingPlanes: clip,
        transparent: view.xray,
        opacity: view.xray ? 0.28 : 1,
        depthWrite: !view.xray,
        side: view.xray ? THREE.DoubleSide : THREE.FrontSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      const solidMesh = new THREE.Mesh(geo, mat);
      tagMesh(solidMesh, partIdx, arr, col);
      c.model.add(solidMesh);
      if (view.section && !view.xray) {
        // Schnittfläche sichtbar machen: Rückseiten in Signalfarbe
        const cap = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff922b, side: THREE.BackSide, clippingPlanes: clip }));
        c.model.add(cap);
      }
      if (view.xray) {
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo, 28),
          new THREE.LineBasicMaterial({ color: new THREE.Color(part.color).lerp(new THREE.Color(0x74c0fc), 0.6), clippingPlanes: clip }),
        );
        c.model.add(edges);
      }
    }

    // Druckvorschau: Stützen (vereinfacht) unter Überhängen
    if (print && view.supports !== false) {
      const cols = supportColumns(parts.filter((p) => !p.role).map((p) => ({ mesh: p.mesh, flags: p.stats.overhangFlags })));
      if (cols.length) {
        const geo = new THREE.BoxGeometry(1.9, 1.9, 1);
        const mat = printMaterial({ layer, infill, clip: pclip, color: new THREE.Color(0xd9dde3), opacity: 0.55 });
        const inst = new THREE.InstancedMesh(geo, mat, cols.length);
        const m4 = new THREE.Matrix4();
        cols.forEach((cl, i) => {
          m4.makeScale(1, 1, cl.z1 - cl.z0).setPosition(cl.x, cl.y, (cl.z0 + cl.z1) / 2);
          inst.setMatrixAt(i, m4);
        });
        inst.renderOrder = 2;
        c.model.add(inst);
      }
    }

    if (view.dims) {
      const off = Math.max(5, maxDim * 0.09);
      const s = Math.max(maxDim, 30);
      const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
      const y0 = min[1] - off,
        x1 = max[0] + off;
      c.dims.add(
        dimension(v(min[0], y0, 0), v(max[0], y0, 0), [
          [v(min[0], min[1], 0), v(min[0], y0 - off * 0.2, 0)],
          [v(max[0], min[1], 0), v(max[0], y0 - off * 0.2, 0)],
        ], `X ${fmt(size.x)}`, s, 0xff6b6b),
      );
      c.dims.add(
        dimension(v(x1, min[1], 0), v(x1, max[1], 0), [
          [v(max[0], min[1], 0), v(x1 + off * 0.2, min[1], 0)],
          [v(max[0], max[1], 0), v(x1 + off * 0.2, max[1], 0)],
        ], `Y ${fmt(size.y)}`, s, 0x69db7c),
      );
      c.dims.add(
        dimension(v(x1, y0, min[2]), v(x1, y0, max[2]), [[v(max[0], min[1], max[2]), v(x1, y0, max[2])]], `Z ${fmt(size.z)}`, s, 0x4dabf7),
      );
    }

    if (modelVersion !== lastVersion.current) {
      lastVersion.current = modelVersion;
      frame(c, 'iso');
    }
  }, [parts, view, modelVersion, layer, infill]);

  // Bemalung anzeigen (bei jeder Änderung nur Farben neu setzen, kein Neuaufbau)
  useEffect(() => {
    const c = ctx.current;
    if (!c) return;
    const apply = () => {
      const ps = paint.get();
      const sc = live.current.slotColors;
      const blue = new THREE.Color(0x4dabf7),
        red = new THREE.Color(0xff6b6b),
        tmp = new THREE.Color();
      for (const o of c.model.children) {
        if (!o.userData.solid) continue;
        const m = o as THREE.Mesh;
        const attr = m.geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
        const base = m.userData.baseCol as Float32Array | undefined;
        if (!attr || !base) continue;
        const arr = attr.array as Float32Array;
        arr.set(base);
        if (live.current.paintable) {
          const cc = ps.color.get(m.userData.partIndex),
            ss = ps.support.get(m.userData.partIndex);
          const n = arr.length / 9;
          for (let t = 0; t < n; t++) {
            const cv = cc?.[t],
              sv = ss?.[t];
            if (!cv && !sv) continue;
            for (let v = 0; v < 3; v++) {
              const o3 = t * 9 + v * 3;
              tmp.setRGB(arr[o3], arr[o3 + 1], arr[o3 + 2]);
              if (cv) tmp.set(sc[cv] ?? '#cccccc');
              if (sv) tmp.lerp(sv === 1 ? blue : red, 0.65);
              arr[o3] = tmp.r;
              arr[o3 + 1] = tmp.g;
              arr[o3 + 2] = tmp.b;
            }
          }
        }
        attr.needsUpdate = true;
      }
    };
    if (paintable && parts) paint.sync(parts);
    apply();
    return paint.subscribe(apply);
  }, [parts, view, paintable, layer, infill]);

  // Messen zurücksetzen, wenn das Werkzeug wechselt oder das Modell sich ändert
  useEffect(() => {
    const c = ctx.current;
    if (!c) return;
    measurePts.current = [];
    disposeGroup(c.tools);
    if (host.current) host.current.style.cursor = tool ? 'crosshair' : '';
    // Schnittebene anzeigen
    if (cutPreview && c.bbox) {
      const b = c.bbox;
      const size = b.getSize(new THREE.Vector3());
      const ax = cutPreview.axis;
      const pos = b.min.getComponent(ax) + size.getComponent(ax) * Math.min(0.97, Math.max(0.03, cutPreview.frac));
      const w = (ax === 0 ? size.y : size.x) + 20,
        h = (ax === 2 ? size.y : size.z) + 20;
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0xff922b, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
      const ctr = b.getCenter(new THREE.Vector3());
      plane.position.copy(ctr);
      plane.position.setComponent(ax, pos);
      if (ax === 0) plane.rotation.y = Math.PI / 2;
      if (ax === 1) plane.rotation.x = Math.PI / 2;
      plane.renderOrder = 8;
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(plane.geometry), new THREE.LineBasicMaterial({ color: 0xff922b }));
      edge.position.copy(plane.position);
      edge.rotation.copy(plane.rotation);
      c.tools.add(plane, edge);
    }
  }, [tool, cutPreview, parts]);

  // Druckvorschau: Schicht-Regler bewegt nur die Schnittebene (kein Neuaufbau)
  useEffect(
    () =>
      printPreview.subscribe(() => {
        const c = ctx.current;
        if (!c || !c.bbox || !view.print) return;
        c.layerPlane.constant = c.bbox.min.z + (c.bbox.max.z - c.bbox.min.z) * printPreview.get() + 1e-3;
      }),
    [view.print],
  );

  // Frei bauen: negative Teile als rote Geister, Auswahl als grüner Rahmen
  useEffect(() => {
    const c = ctx.current;
    if (!c) return;
    disposeGroup(c.overlay);
    disposeGroup(c.selG);
    disposeGroup(c.gizmo);
    c.selG.matrix.identity();
    c.selG.matrixWorldNeedsUpdate = true;
    c.gizmo.position.set(0, 0, 0);
    c.pivot = null;
    if (!overlay) return;
    // Hüllbox der Auswahl → Drehpunkt + Ringe
    const selBox = new THREE.Box3();
    for (const p of overlay.parts) {
      if (!overlay.sel.includes(p.id)) continue;
      const { center, rot, half } = obb(p, overlay.offset);
      const m4 = new THREE.Matrix4().setFromMatrix3(rot).setPosition(center);
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) selBox.expandByPoint(new THREE.Vector3(sx * half.x, sy * half.y, sz * half.z).applyMatrix4(m4));
      // Importierte Teile: echte Form als Vorschau (sieht man beim Drehen/Verschieben)
      if (p.kind === 'import') {
        const im = getImported(String(p.e.ref ?? ''));
        if (im && im.mesh.tri.length / 3 <= 300000) {
          const g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(im.mesh.pos), 3));
          g.setIndex(new THREE.BufferAttribute(im.mesh.tri, 1));
          g.computeVertexNormals();
          const mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x3ddc84, transparent: true, opacity: 0.45, depthWrite: false }));
          mesh.scale.set(...([0, 1, 2].map((k) => (im.size[k] > 0 ? p.size[k] / im.size[k] : 1)) as [number, number, number]));
          const holder = new THREE.Group();
          holder.applyMatrix4(m4);
          holder.add(mesh);
          holder.renderOrder = 4;
          c.selG.add(holder);
        }
      }
    }
    if (!selBox.isEmpty() && live.current.onTransform) {
      const pv = selBox.getCenter(new THREE.Vector3());
      c.pivot = pv;
      const R = Math.max(selBox.getSize(new THREE.Vector3()).length() / 2 + 4, 10);
      const tube = Math.max(0.35, R * 0.012);
      const cols = [0xff5c5c, 0x3ddc84, 0x4c9aff];
      for (const axis of [0, 1, 2] as const) {
        const orient = (o: THREE.Object3D) => {
          if (axis === 0) o.rotation.y = Math.PI / 2;
          if (axis === 1) o.rotation.x = Math.PI / 2;
          o.position.copy(pv);
        };
        const ring = new THREE.Mesh(new THREE.TorusGeometry(R, tube, 8, 96), new THREE.MeshBasicMaterial({ color: cols[axis], depthTest: false, transparent: true, opacity: 0.9 }));
        ring.renderOrder = 9;
        orient(ring);
        const pick = new THREE.Mesh(new THREE.TorusGeometry(R, Math.max(tube * 5, R * 0.06), 6, 64), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, depthTest: false }));
        pick.userData = { pick: true, axis };
        orient(pick);
        c.gizmo.add(ring, pick);
      }
    }
    for (const p of overlay.parts) {
      const selected = overlay.sel.includes(p.id);
      if (!p.hole && !selected) continue;
      const { center, rot, half } = obb(p, overlay.offset);
      const geo = new THREE.BoxGeometry(half.x * 2 + 0.6, half.y * 2 + 0.6, half.z * 2 + 0.6);
      const m4 = new THREE.Matrix4().setFromMatrix3(rot);
      m4.setPosition(center);
      if (p.hole) {
        const ghost = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff5c5c, transparent: true, opacity: selected ? 0.28 : 0.14, depthWrite: false }));
        ghost.applyMatrix4(m4);
        ghost.renderOrder = 5;
        (selected ? c.selG : c.overlay).add(ghost);
      }
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: selected ? (p.hole ? 0xff8787 : 0x3ddc84) : 0xff5c5c, depthTest: false, transparent: true, opacity: selected ? 1 : 0.6 }),
      );
      edges.applyMatrix4(m4);
      edges.renderOrder = 6;
      (selected ? c.selG : c.overlay).add(edges);
    }
  }, [overlay]);

  const frame = (c: Ctx3, kind: 'iso' | 'top' | 'front' | 'side') => {
    const box = c.bbox ?? new THREE.Box3(new THREE.Vector3(-50, -50, 0), new THREE.Vector3(50, 50, 50));
    const center = box.getCenter(new THREE.Vector3());
    const r = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 15);
    const dist = (r / Math.sin(((c.camera.fov / 2) * Math.PI) / 180)) * 1.15;
    const dir =
      kind === 'top' ? new THREE.Vector3(0, -0.001, 1) : kind === 'front' ? new THREE.Vector3(0, -1, 0.05) : kind === 'side' ? new THREE.Vector3(1, 0, 0.05) : new THREE.Vector3(0.8, -1.25, 0.95);
    c.camera.position.copy(center).addScaledVector(dir.normalize(), dist);
    c.controls.target.copy(center);
    c.camera.near = Math.max(0.1, dist / 200);
    c.camera.far = dist * 20 + 2000;
    c.camera.updateProjectionMatrix();
    c.controls.update();
  };

  const btn = 'h-9 min-w-9 px-2 rounded-lg bg-[#161b22]/90 border border-[#30363d] text-[12px] text-slate-300 hover:text-white hover:border-[#00ae42] backdrop-blur';
  return (
    <div className="relative w-full h-full">
      <div ref={host} className="absolute inset-0" />
      <div ref={hud} style={{ display: 'none' }} className="absolute bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-lg bg-[#161b22]/95 border border-[#00ae42] px-3 py-1.5 text-[13px] text-white tabular-nums pointer-events-none" />
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button className={btn} title="Ansicht einpassen" onClick={() => ctx.current && frame(ctx.current, 'iso')}>⤢</button>
        <button className={btn} title="Draufsicht" onClick={() => ctx.current && frame(ctx.current, 'top')}>Top</button>
        <button className={btn} title="Vorderansicht" onClick={() => ctx.current && frame(ctx.current, 'front')}>Vorn</button>
        <button className={btn} title="Seitenansicht" onClick={() => ctx.current && frame(ctx.current, 'side')}>Seite</button>
      </div>
    </div>
  );
}
