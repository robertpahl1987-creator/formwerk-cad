/**
 * Exporter – alles client-seitig im Browser:
 *  - Binär-STL (eine Datei, alle Teile)
 *  - 3MF (Millimeter, Metadaten, mehrere Teile mit Farb-/Slot-Zuordnung
 *    für Bambu Studio / OrcaSlicer, Basis-Materialien für andere Slicer)
 *  - ZIP mit einer STL je Farbe (universell für jeden Slicer)
 */
import JSZip from 'jszip';
import type { Mesh, PrintProfile } from './mesh';

export interface ExportPart {
  name: string;
  slot: number;
  color: string; // #rrggbb
  mesh: Mesh;
}

export function stlBinary(meshes: Mesh[], header = 'Formwerk CAD'): Uint8Array {
  const count = meshes.reduce((s, m) => s + m.tri.length / 3, 0);
  const buf = new ArrayBuffer(84 + count * 50);
  const dv = new DataView(buf);
  const enc = new TextEncoder().encode(header.slice(0, 79));
  new Uint8Array(buf, 0, 80).set(enc);
  dv.setUint32(80, count, true);
  let o = 84;
  for (const m of meshes) {
    const p = m.pos;
    for (let t = 0; t < m.tri.length; t += 3) {
      const a = 3 * m.tri[t], b = 3 * m.tri[t + 1], c = 3 * m.tri[t + 2];
      const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2];
      const vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const l = Math.hypot(nx, ny, nz) || 1;
      nx /= l; ny /= l; nz /= l;
      dv.setFloat32(o, nx, true); dv.setFloat32(o + 4, ny, true); dv.setFloat32(o + 8, nz, true);
      o += 12;
      for (const i of [a, b, c]) {
        dv.setFloat32(o, p[i], true); dv.setFloat32(o + 4, p[i + 1], true); dv.setFloat32(o + 8, p[i + 2], true);
        o += 12;
      }
      dv.setUint16(o, 0, true);
      o += 2;
    }
  }
  return new Uint8Array(buf);
}

const xmlEsc = (s: string) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!);
const f = (n: number) => {
  const r = Math.round(n * 1e5) / 1e5;
  return Object.is(r, -0) ? '0' : String(r);
};

function meshXml(m: Mesh): string {
  const out: string[] = ['<mesh><vertices>'];
  for (let i = 0; i < m.pos.length; i += 3) out.push(`<vertex x="${f(m.pos[i])}" y="${f(m.pos[i + 1])}" z="${f(m.pos[i + 2])}"/>`);
  out.push('</vertices><triangles>');
  for (let t = 0; t < m.tri.length; t += 3) out.push(`<triangle v1="${m.tri[t]}" v2="${m.tri[t + 1]}" v3="${m.tri[t + 2]}"/>`);
  out.push('</triangles></mesh>');
  return out.join('');
}

export interface ThreeMfOptions {
  title: string;
  bedSize: number;
  description?: string;
  /** Füllung/Wände – werden als Objekt-Einstellungen für Bambu Studio / OrcaSlicer gespeichert */
  profile?: PrintProfile;
  /** Schichthöhe in mm (Objekt-Einstellung) */
  layer?: number;
}

/** Ein druckbares Objekt (ggf. aus mehreren Farbteilen), Koordinaten relativ zur Bettmitte. */
export interface ExportObject {
  name: string;
  parts: ExportPart[];
}

function profileMeta(p: PrintProfile | undefined, ind: string, layer?: number): string {
  if (!p) return '';
  return [
    ...(layer ? [['layer_height', String(layer)]] : []),
    ['sparse_infill_density', `${Math.round(p.infill * 100)}%`],
    ['sparse_infill_pattern', p.pattern],
    ['wall_loops', String(p.walls)],
    ['top_shell_layers', String(p.top)],
    ['bottom_shell_layers', String(p.bottom)],
  ]
    .map(([k, v]) => `${ind}<metadata key="${k}" value="${v}"/>`)
    .join('\n');
}

export async function threeMf(objects: ExportObject[], opt: ThreeMfOptions): Promise<Blob> {
  const zip = new JSZip();
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
  <Default Extension="config" ContentType="text/xml"/>
</Types>`,
  );
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`,
  );
  const allParts = objects.flatMap((o) => o.parts);
  const slots = [...new Set(allParts.map((p) => p.slot))].sort((a, b) => a - b);
  const colorOf = (slot: number) => (allParts.find((p) => p.slot === slot)?.color ?? '#cccccc').toUpperCase();
  const c = opt.bedSize / 2;
  const res: string[] = [];
  const items: string[] = [];
  const cfg: string[] = [];
  let id = 2;
  for (const obj of objects) {
    const partIds: number[] = [];
    for (const p of obj.parts) {
      partIds.push(id);
      res.push(`<object id="${id}" type="model" name="${xmlEsc(p.name)}" pid="1" pindex="${slots.indexOf(p.slot)}">${meshXml(p.mesh)}</object>`);
      id++;
    }
    let objId: number;
    if (obj.parts.length > 1) {
      objId = id++;
      res.push(`<object id="${objId}" type="model" name="${xmlEsc(obj.name)}"><components>${partIds.map((pid) => `<component objectid="${pid}"/>`).join('')}</components></object>`);
    } else objId = partIds[0];
    items.push(`<item objectid="${objId}" transform="1 0 0 0 1 0 0 0 1 ${f(c)} ${f(c)} 0"/>`);
    cfg.push(`  <object id="${objId}">
    <metadata key="name" value="${xmlEsc(obj.name)}"/>
    <metadata key="extruder" value="${obj.parts[0]?.slot ?? 1}"/>
${profileMeta(opt.profile, '    ', opt.layer)}
${obj.parts
  .map(
    (p, i) => `    <part id="${partIds[i]}" subtype="normal_part">
      <metadata key="name" value="${xmlEsc(p.name)}"/>
      <metadata key="extruder" value="${p.slot}"/>
    </part>`,
  )
  .join('\n')}
  </object>`);
  }
  const model = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="de-DE" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <metadata name="Title">${xmlEsc(opt.title)}</metadata>
  <metadata name="Designer">Formwerk CAD</metadata>
  <metadata name="Application">Formwerk CAD</metadata>
  <metadata name="CreationDate">${new Date().toISOString().slice(0, 10)}</metadata>
  <metadata name="Description">${xmlEsc(opt.description ?? '')}</metadata>
  <resources>
    <basematerials id="1">${slots.map((sl) => `<base name="Filament ${sl}" displaycolor="${colorOf(sl)}FF"/>`).join('')}</basematerials>
    ${res.join('\n    ')}
  </resources>
  <build>
    ${items.join('\n    ')}
  </build>
</model>`;
  zip.file('3D/3dmodel.model', model);
  zip.file('Metadata/model_settings.config', `<?xml version="1.0" encoding="UTF-8"?>\n<config>\n${cfg.join('\n')}\n</config>`);
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 }, mimeType: 'model/3mf' });
}

/** Eine STL je Farbe (für Slicer ohne 3MF-Mehrfarbenimport). */
export async function stlPerColorZip(parts: ExportPart[], baseName: string): Promise<Blob> {
  const zip = new JSZip();
  const bySlot = new Map<number, ExportPart[]>();
  for (const p of parts) {
    if (!bySlot.has(p.slot)) bySlot.set(p.slot, []);
    bySlot.get(p.slot)!.push(p);
  }
  const readme: string[] = [
    `${baseName} – Mehrfarbendruck`,
    '',
    'Alle Dateien gemeinsam in den Slicer laden und bei der Frage „als ein Objekt mit mehreren Teilen laden?“ mit JA antworten.',
    'Die Teile liegen bereits passgenau zueinander (gemeinsamer Nullpunkt). Danach jedem Teil sein Filament zuweisen:',
    '',
  ];
  for (const [slot, ps] of bySlot) {
    const fn = `${baseName}_slot${slot}_${ps.map((p) => p.name).join('-').replace(/[^\w-]+/g, '_')}.stl`;
    zip.file(fn, stlBinary(ps.map((p) => p.mesh), `${baseName} slot ${slot}`));
    readme.push(`  ${fn}  →  Filament-Slot ${slot} (${ps[0].color})`);
  }
  zip.file('LIESMICH.txt', readme.join('\n'));
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

export async function wrapInZip(filename: string, data: Blob | Uint8Array | string): Promise<Blob> {
  const zip = new JSZip();
  zip.file(filename, data);
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

/** Mehrere Dateien in ein ZIP (z. B. eine 3MF je Druckplatte). */
export async function zipFiles(files: { name: string; data: Blob | Uint8Array | string }[]): Promise<Blob> {
  const zip = new JSZip();
  for (const fl of files) zip.file(fl.name, fl.data);
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}
