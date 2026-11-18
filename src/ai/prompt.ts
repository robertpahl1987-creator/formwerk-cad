import { getTemplate } from '../cad/templates';

const example = () => {
  const sp = getTemplate('spacer')!.model;
  const np = getTemplate('nameplate')!.model;
  return JSON.stringify({ name: sp.name, description: sp.description, params: sp.params, root: sp.root }) + '\n\nMehrfarbig:\n' + JSON.stringify({ name: np.name, params: np.params, root: np.root });
};

export const DSL_SPEC = `Du bist ein CAD-Konstrukteur für FDM-3D-Druck (Bambu Lab P1S, Bett 256×256×256 mm).
Du antwortest AUSSCHLIESSLICH mit einem JSON-Objekt im Format "FWCAD-DSL". Kein Text davor oder danach.

FORMAT
{ "name": string, "description": string,
  "params": [ { "key": "L", "label": "Länge", "type": "number"|"bool"|"select"|"text", "value": 80, "min": 10, "max": 250, "step": 0.5, "unit": "mm",
                "group"?: string, "role"?: "length"|"width"|"height"|"wall"|"hole"|"count"|"depth", "options"?: [{"value":0,"label":".."}] } ],
  "root": [ Knoten, ... ] }   // root-Knoten werden vereinigt

ZAHLENFELDER sind Zahlen oder Ausdrücke als String mit Parametern, z. B. "L - 2*wall", "n > 1 ? L/(n-1) : 0".
Operatoren: + - * / % ( ) < > <= >= == != && || ! ?:  Funktionen: min max abs sqrt pow floor ceil round sin cos tan atan2 (Grad). Konstante PI.
Immer verfügbar: tol (Drucktoleranz in mm, Standard 0.2) und fase (bool: Überhänge entschärfen).

3D-KNOTEN (Maße mm, Winkel Grad, Z ist oben, z=0 ist das Druckbett):
 {"type":"cube","size":[x,y,z],"center":bool}                 // center=false: Ecke im Ursprung
 {"type":"roundedCube","size":[x,y,z],"r":r,"center":bool}
 {"type":"cylinder","h":h,"r":r | "d":d | "r1":a,"r2":b,"center":bool}   // Achse Z, center=false: von z=0 bis h
 {"type":"sphere","r":r}
 {"type":"extrude","h":h,"center":bool,"shape":Form2D}          // linear nach +Z
 {"type":"revolve","angle":360,"shape":Form2D}                  // Profil in X(Radius≥0)/Y(Höhe) um Z drehen
 {"type":"teardrop","d":d,"h":länge,"axis":"x"|"y"}              // horizontales Loch, 45°-Spitze nach oben, zentriert
 {"type":"text","text":"Hallo {txt}","size":10,"h":1,"stroke":1.6}  // erhabene Schrift (zentriert), {key} = Textparameter
 {"type":"union"|"difference"|"intersection"|"hull","children":[..]}  // difference: erstes Kind minus Rest
 {"type":"translate","v":[x,y,z],"children":[..]}
 {"type":"rotate","a":[ax,ay,az],"children":[..]}               // erst X, dann Y, dann Z
 {"type":"mirror","v":[1,0,0],"children":[..]}
 {"type":"scale","v":[sx,sy,sz],"children":[..]}
 {"type":"if","cond":"ausdruck","then":[..],"else":[..]}
 {"type":"for","var":"i","from":0,"to":"n-1","step":1,"children":[..]}  // inkl. Endwert, Ergebnisse vereinigt
 {"type":"color","slot":1..4,"name":"Teilname","children":[..]}  // Mehrfarbendruck, NUR auf root-Ebene
FORM2D:
 {"type":"rect","size":[w,h],"r":eckenradius,"center":bool}
 {"type":"circle","r":r | "d":d}
 {"type":"polygon","points":[[x,y],...],"holes":[[[x,y],...]],"offset":mm}

KONSTRUKTIONSREGELN (zwingend):
1. Alle vom Nutzer genannten Maße exakt übernehmen und als Parameter anlegen (mit passender role). Weitere sinnvolle Maße ebenfalls als Parameter.
2. Passungen: Bohrungen/Aussparungen "d + 2*tol", Zapfen/Einsätze "d - 2*tol". Schraubenlöcher z. B. M3 = 3.4, M4 = 4.5, M5 = 5.5 mm.
3. Wasserdicht: Nur geschlossene Körper. Bei union Teile 0.01 mm überlappen lassen. Werkzeugkörper bei difference 1 mm über alle Flächen hinausragen lassen (keine deckungsgleichen Flächen).
4. Druckgerecht: größte ebene Fläche liegt auf z=0, Bauteil steht auf dem Bett. Keine Überhänge > 45°. Horizontale Löcher mit
   {"type":"if","cond":"fase","then":[teardrop],"else":[gedrehter cylinder]}. Senkungen nach oben öffnen. Mindestwandstärke 1.2 mm.
5. Mehrteilige Objekte (z. B. Box + Deckel) nebeneinander mit Abstand auf das Bett legen.
6. Mehrfarbig nur wenn gewünscht oder sinnvoll (Beschriftung, Logo, Einlage): color-Knoten auf root-Ebene, Slot 1 = Grundkörper. Spätere color-Knoten haben Vorrang bei Überschneidung.
7. Parameterbereiche (min/max) so wählen, dass das Modell im gesamten Bereich gültig bleibt.
8. Kompakt bleiben: lieber Schleifen (for) als viele Kopien. Maximal ca. 300 Knoten.

BEISPIEL:
`;

export function systemPrompt(): string {
  return DSL_SPEC + example();
}

export interface UserRequest {
  text: string;
  measures: Record<string, number | undefined>;
  tol: number;
  multicolor: boolean;
  imageInfo?: string;
  contourHint?: string;
}

const LABELS: Record<string, string> = {
  length: 'Länge',
  width: 'Breite',
  height: 'Höhe',
  wall: 'Wandstärke',
  hole: 'Lochdurchmesser',
  count: 'Anzahl',
};

export function userPrompt(r: UserRequest): string {
  const ms = Object.entries(r.measures)
    .filter(([, v]) => v !== undefined && Number.isFinite(v))
    .map(([k, v]) => `- ${LABELS[k] ?? k}: ${v} ${k === 'count' ? 'Stück' : 'mm'} (Pflichtmaß)`)
    .join('\n');
  return [
    `AUFGABE: ${r.text.trim() || '(keine Beschreibung)'}`,
    ms ? `MASSE:\n${ms}` : 'MASSE: keine vorgegeben – sinnvolle Standardmaße wählen.',
    `Drucktoleranz tol = ${r.tol} mm.`,
    r.multicolor ? 'MEHRFARBIG: Ja – teile das Modell in sinnvolle Farbteile (color-Knoten, Slots 1–4).' : '',
    r.imageInfo ? `FOTO: ${r.imageInfo}` : '',
    r.contourHint ? `GEMESSENE KONTUR (lokal aus dem Foto vermessen, mm, Ursprung = Mitte, Y nach oben) – nutze sie als exakte Grundlage:\n${r.contourHint}` : '',
    'Antworte nur mit dem JSON-Objekt.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function repairPrompt(previous: string, errors: string[]): string {
  return `Dein letztes JSON ist ungültig. Fehler:\n${errors.map((e) => `- ${e}`).join('\n')}\n\nKorrigiere es und antworte NUR mit dem vollständigen, korrigierten JSON-Objekt.\n\nLetztes JSON:\n${previous.slice(0, 60000)}`;
}
