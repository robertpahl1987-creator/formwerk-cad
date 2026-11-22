import { getTemplate, MEASURE_LABEL } from '../cad/templates';

const example = () => {
  const sp = getTemplate('spacer')!.model;
  const np = getTemplate('nameplate')!.model;
  return JSON.stringify({ name: sp.name, description: sp.description, params: sp.params, root: sp.root }) + '\n\nMehrfarbig:\n' + JSON.stringify({ name: np.name, params: np.params, root: np.root });
};

export const DSL_SPEC = `Du bist ein CAD-Konstrukteur für FDM-3D-Druck (Bambu Lab P1S, Bett 256×256×256 mm).
Du antwortest AUSSCHLIESSLICH mit einem JSON-Objekt im Format "FWCAD-DSL". Kein Text davor oder danach.

VORGEHEN (im Kopf, bevor du schreibst):
 a) Zerlege die Aufgabe in einzelne Anforderungen: jedes Maß, jede Anzahl, jedes Merkmal („mit Deckel“, „2 Löcher“, „Griff“, „für Wandmontage“, „Text …“), Zweck und Einbausituation.
 b) Stell dir das ECHTE Objekt vor, wie es ein guter Produktdesigner bauen würde: typische Proportionen, Funktionsdetails und Bedienung.
 c) Konstruiere so, dass JEDE Anforderung sichtbar umgesetzt ist, und schreibe sie in "checklist".

FORMAT
{ "name": string, "description": string,
  "checklist": [ { "req": "Anforderung aus der Aufgabe (kurz)", "ok": true, "how": "wie umgesetzt, mit Maß/Parameter" } ],
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
 {"type":"radial","h":h,"r0":unten,"r1":oben,"bulge":bauch,"sides":0|n,"waves":n,"amp":mm,"twist":grad,
    "pattern":"none"|"raendel"|"rillen"|"wellen"|"waben","depth":mm,"count":n,"wall":mm,"floor":mm}
    // Rotationskörper um Z ab z=0 (Vase, Becher, Knopf, Griff, Flasche): sides=0 rund, sides=6 Sechskant; wall>0 = hohl mit Boden floor;
    // pattern = echte Griffstruktur (Rändel, Rillen) – ideal für Drehknöpfe, Deckel, Griffe
 {"type":"dome","r":r,"wall":w,"rows":n,"holes":n,"hole":mm,"top":ø}   // Halbkugel-Schale ab z=0 (Kuppel oben) mit Fenstern – schnell & wasserdicht.
    // Für Kugeln/Käfige (Mooskugel, Futterkugel, Lampenschirm) statt sphere+difference verwenden!
 {"type":"thread","d":d,"pitch":p,"h":h,"iso":true,"chamfer":true}   // Außengewinde, Achse Z ab z=0 (M-Gewinde: iso=true, Steigung M6=1, M8=1.25, M10=1.5, M12=1.75)
 {"type":"thread","d":d,"pitch":p,"h":h,"iso":true,"internal":true,"od":aussen,"odfn":0|6,"floor":mm}  // Innengewinde (Mutter, Schraubdeckel); odfn=6 → Sechskant
    // Schraubdeckel: Dose mit Außengewinde, Deckel mit internal-Gewinde d + 2*tol + 0.4 – beide nebeneinander aufs Bett
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
8. Hohlräume (wenn gewünscht oder bei massiven, großen Teilen): geschlossener Hohlraum per difference, Mindestwand 2 mm, Decke als 45°-Satteldach (polygon-Profil extrudiert), damit ohne Stützen druckbar.
9. Kompakt bleiben: lieber Schleifen (for) als viele Kopien. Maximal ca. 400 Knoten.
10. REALISTISCH & DETAILLIERT – kein Klötzchen-Modell:
   - Sichtkanten runden oder fasen (roundedCube, rect mit r, hull aus versetzten Körpern), Innenkanten von Fächern leicht runden.
   - Funktionsdetails, die das echte Objekt hat: Griffmulden/Fingerkerben, Versteifungsrippen bei langen Wänden und Haken,
     Senkkopfbohrungen für Wandmontage, Kabeldurchführungen, Rastnasen/Deckelfalz, Standfüße/Fase am Boden, Ablauflöcher wo Wasser steht,
     Einführschrägen an Steckverbindungen. Nur sinnvolle Details, die zur Aufgabe passen.
   - Runde Dinge mit radial/revolve/cylinder statt eckig, organische Formen mit hull aus Kugeln/Zylindern, Profile mit polygon.
   - Echte Normmaße: Schrauben (M3 3.4 / Kopf 6.5, M4 4.5 / Kopf 8.5, Holzschraube 4 mm / Senkkopf 8), Magnete (z. B. 6×3, 10×2),
     Steckdosen/Handys/Flaschen/Batterien mit realen Maßen, wenn die Aufgabe so etwas nennt.
   - Proportionen glaubwürdig: Wandstärken 1.6–3 mm, Böden 1.2–2 mm, Haken mit Radius statt scharfer Ecke.
11. Für jedes wichtige Detail einen Parameter (z. B. Rundung, Rippen an/aus, Anzahl Löcher), damit der Nutzer es abschalten kann.
12. "checklist": jede Anforderung aus der Aufgabe als eigener Eintrag (auch Maße), "ok": false nur wenn wirklich nicht umsetzbar (dann in "how" begründen).

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
  /** Detailgrad: 'einfach' = schlicht und schnell druckbar, 'normal', 'hoch' = möglichst realistisch */
  detail?: 'einfach' | 'normal' | 'hoch';
}

const DETAIL: Record<string, string> = {
  einfach: 'DETAILGRAD: einfach – schlicht, schnell druckbar, nur die nötigen Funktionsmerkmale, trotzdem gerundete Kanten.',
  normal: 'DETAILGRAD: normal – realistisch mit den typischen Funktionsdetails.',
  hoch: 'DETAILGRAD: hoch – so realistisch und durchdacht wie ein gekauftes Produkt: alle passenden Funktionsdetails, saubere Rundungen/Fasen, gute Proportionen.',
};

const LABELS: Record<string, string> = MEASURE_LABEL;
const COUNTS = new Set(['count', 'cols', 'rows']);

export function userPrompt(r: UserRequest): string {
  const ms = Object.entries(r.measures)
    .filter(([, v]) => v !== undefined && Number.isFinite(v))
    .map(([k, v]) => `- ${LABELS[k] ?? k}: ${v} ${COUNTS.has(k) ? 'Stück' : 'mm'} (Pflichtmaß)`)
    .join('\n');
  return [
    `AUFGABE: ${r.text.trim() || '(keine Beschreibung)'}`,
    ms
      ? `MASSE (aus der Aufgabe gelesen, in mm umgerechnet – exakt so übernehmen und jeweils als eigenen Parameter anlegen; „Fach“-Maße sind Innenmaße eines einzelnen Fachs, das Außenmaß ergibt sich daraus):\n${ms}`
      : 'MASSE: keine vorgegeben – sinnvolle Standardmaße wählen.',
    `Drucktoleranz tol = ${r.tol} mm.`,
    DETAIL[r.detail ?? 'hoch'],
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

/** Zweiter Durchgang: Modell kritisch gegen die Aufgabe prüfen und verbessert zurückgeben. */
export function reviewPrompt(task: string, measures: string, modelJson: string, detail: UserRequest['detail'] = 'hoch'): string {
  return `Du prüfst ein CAD-Modell, das für folgende Aufgabe erstellt wurde, und verbesserst es.

AUFGABE: ${task.trim()}
${measures ? `GEFORDERTE MASSE:\n${measures}\n` : ''}${DETAIL[detail ?? 'hoch']}

PRÜFE STRENG, Punkt für Punkt:
1. Ist JEDE Anforderung der Aufgabe umgesetzt (jedes Maß exakt, jede Anzahl, jedes genannte Merkmal, Text)? Fehlt etwas → ergänzen.
2. Sieht es aus wie das echte Objekt? Proportionen, gerundete/gefaste Kanten, typische Funktionsdetails (Griff, Rippen, Befestigung, Falz …). Fehlt etwas Wesentliches → ergänzen.
3. Passt alles zusammen: Teile überlappen bzw. berühren sich wo nötig, nichts schwebt, Löcher gehen durch, Passungen mit tol, druckbar ohne Stützen, steht auf z=0.
4. Hat sich etwas eingeschlichen, das nicht gefragt war und stört → entfernen.

Antworte NUR mit dem vollständigen, verbesserten JSON-Objekt (gleiches Format, Parameter-Schlüssel möglichst beibehalten) inklusive aktualisierter "checklist".
Wenn wirklich nichts zu verbessern ist, gib das Modell unverändert zurück.

MODELL:
${modelJson.slice(0, 60000)}`;
}
