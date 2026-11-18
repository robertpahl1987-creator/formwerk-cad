import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { PartResult } from '../state/pipeline';
import type { ViewOpts } from '../state/store';

interface Props {
  parts: PartResult[] | null;
  view: ViewOpts;
  bedSize: number;
  modelVersion: number;
}

interface Ctx3 {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  bed: THREE.Group;
  model: THREE.Group;
  dims: THREE.Group;
  plane: THREE.Plane;
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

const fmt = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mm`;

export function Viewer({ parts, view, bedSize, modelVersion }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx3 | null>(null);
  const lastVersion = useRef(-1);

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
    scene.add(bed, model, dims);
    const c: Ctx3 = { renderer, scene, camera, controls, bed, model, dims, plane: new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), raf: 0, bbox: null };
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

    const over = new THREE.Color(0xff4d4f);
    for (const part of parts) {
      const { pos: P, tri } = part.mesh;
      const n = tri.length;
      const arr = new Float32Array(n * 3);
      const col = new Float32Array(n * 3);
      const base = new THREE.Color(part.color);
      for (let i = 0; i < n; i++) {
        const v = tri[i] * 3;
        arr[i * 3] = P[v];
        arr[i * 3 + 1] = P[v + 1];
        arr[i * 3 + 2] = P[v + 2];
        const isOver = view.overhangs && part.stats.overhangFlags[(i / 3) | 0] === 1;
        const cc = isOver ? over : base;
        col[i * 3] = cc.r;
        col[i * 3 + 1] = cc.g;
        col[i * 3 + 2] = cc.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.computeVertexNormals();
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
      c.model.add(new THREE.Mesh(geo, mat));
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
  }, [parts, view, modelVersion]);

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
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button className={btn} title="Ansicht einpassen" onClick={() => ctx.current && frame(ctx.current, 'iso')}>⤢</button>
        <button className={btn} title="Draufsicht" onClick={() => ctx.current && frame(ctx.current, 'top')}>Top</button>
        <button className={btn} title="Vorderansicht" onClick={() => ctx.current && frame(ctx.current, 'front')}>Vorn</button>
        <button className={btn} title="Seitenansicht" onClick={() => ctx.current && frame(ctx.current, 'side')}>Seite</button>
      </div>
    </div>
  );
}
