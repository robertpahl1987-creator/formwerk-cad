# Formwerk CAD

Progressive Web App für **100 % druckbare, wasserdichte (manifold) und millimetergenaue 3D-Druck-Modelle**,
erstellt aus Text, Maßen oder einem Foto. Läuft im Browser, lässt sich auf Android, iOS, Windows, macOS und Linux
als App installieren und funktioniert offline.

## Prinzip: parametrisch statt „geraten“

```
Text / Maße / Foto ──► KI (Gemini · OpenAI · Claude)  oder  Offline-Vorlage / Konturerkennung
                          │
                          ▼
             FWCAD-DSL (JSON-CSG-Baum mit Parametern & Ausdrücken)
                          │  streng validiert, sichere Ausdrucksauswertung (kein eval)
          ┌───────────────┼──────────────────────────┐
          ▼               ▼                          ▼
  @jscad/modeling   OpenSCAD-Export (.scad,     Parameter-UI (Regler/Felder)
  (exakte CSG)      Customizer-kompatibel)
          │
          ▼
  Mesh-Pipeline: Verschweißen → T-Kreuzungs-Reparatur → Manifold-Prüfung
          │        → Volumen/Gewicht/Zeit → Überhang-Analyse → Ausrichtung
          ▼
  Three.js-Vorschau · 3MF (JSZip) · Binär-STL · Aufteilung auf Druckplatten
```

Die KI erzeugt **keine Meshes**, sondern ein parametrisches Modell aus Grundkörpern und Booleschen Operationen.
Dadurch ist jedes Ergebnis geschlossen, und alle Maße bleiben exakt und nachträglich einstellbar.

## Funktionen

| Bereich | Umfang |
|---|---|
| Text → CAD | Freitext + Pflichtmaße (Länge, Breite, Höhe, Wand, Loch-Ø, Anzahl) + Drucktoleranz (Standard 0,2 mm) |
| Foto → CAD | Kamera/Upload, **Referenzlinie** (2 Punkte + mm) oder **4-Punkt-Perspektiventzerrung** (A4, Kreditkarte, eigenes Rechteck), lokale Konturerkennung inkl. Innenlöcher, Extrusion oder Negativform; optional Vision-KI |
| Frei bauen | Baukasten: Quader (abgerundet), Zylinder, Kegel, Kugel, Halbkugel, Rohr, Keil, Sechskant, Text (Systemschriften, mehrzeilig, erhaben oder graviert), Loch, Magnetloch, Schraubloch mit Senkung, **Scharnier** und **Kugelgelenk** (beweglich in einem Stück). Jedes Teil als Körper oder Loch, Größe/Position/Drehung per Regler, Farb-Slot je Teil, „Passendes Loch“ mit Drucktoleranz, „Auf Teil setzen“, Rückgängig, Projekt speichern/laden |
| Vorlagen (offline) | Box mit Deckel, Kabelkanal, Werkzeug-Wandhalter, Distanzhülse, Lochplatte, Wandhaken, L-Winkel, Organizer, Namensschild (zweifarbig) |
| 3D-Viewer | 256 × 256 mm Druckbett-Raster, Bemaßungspfeile X/Y/Z, X-Ray, Schnittansicht (X/Y/Z), Überhänge rot, Touch-Gesten |
| Print-Check | Manifold-Status, Bettgröße, Gewicht, Filamentlänge, Druckzeit, Überhänge > 45° mit „Lage optimieren“ und „Fasen hinzufügen“ |
| Mehrfarbendruck | Farbteile (AMS-Slots 1–4) per `color`-Knoten, Text-Einlagen, Farbwechsel nach Höhe für jedes Modell, Schätzung der Farbwechsel und des Spülmaterials |
| Aufteilen | Automatisch passend zum Bett oder manuell je Achse. Verbindungen: **Steckzapfen**, **Dübel** (als eigene Teile) oder **Kleben**. Verbinderpositionen werden im echten Querschnitt mit Mindestwand berechnet. Verteilung auf mehrere Druckplatten, Druckausrichtung je Teil, Montageanleitung |
| Hohlraum & Füllung | Profile Leicht / Standard / Stabil / Maximal oder eigene Werte (Infill %, Muster, Wände, Decke, Boden). Die Werte werden als Objekt-Einstellungen ins 3MF geschrieben und vom Slicer übernommen. Konstruktive Hohlräume plant die KI mit selbsttragenden 45°-Decken |
| Export | `.3mf` (mm, Metadaten, Farbteile mit Extruder-Zuordnung für Bambu Studio/OrcaSlicer, Basismaterialien), `.stl` (binär), `.scad` (Quellcode), STL je Farbe (ZIP), ZIP mit einer 3MF je Druckplatte |

## Starten

```bash
npm install
npm run dev        # http://localhost:5173 (auch im WLAN erreichbar → am Handy testen)
npm run build      # Produktions-Build nach dist/
```

### KI-Schlüssel
In der App unter **⚙ Einstellungen** einen **Google-Gemini-API-Key** eintragen (kostenlos über
<https://aistudio.google.com/apikey>) oder alternativ einen OpenAI-Key. Der Schlüssel wird nur lokal im Browser
gespeichert und direkt an den Anbieter geschickt. Als fester Standard lässt er sich auch in
`src/ai/providers.ts` (`DEFAULT_AI.geminiKey`) setzen. Für öffentliche Seiten ist das nicht empfohlen, weil der Key
dann im ausgelieferten Code steht.
Ohne Key funktionieren die Vorlagen und die lokale Foto-Konturerkennung trotzdem.

### Auf GitHub Pages veröffentlichen
1. Repository anlegen und den Projektordner pushen (Branch `main`).
2. Im Repository unter **Settings → Pages → Source** „GitHub Actions“ auswählen.
3. Der Workflow `.github/workflows/deploy.yml` baut und veröffentlicht die App bei jedem Push.

### Android-App (APK) & automatische Updates
Der Workflow `.github/workflows/android.yml` baut mit Capacitor eine echte Android-App und stellt sie bereit unter:
<https://github.com/robertpahl1987-creator/formwerk-cad/releases/download/app/formwerk-cad.apk>

- **Automatische Updates:** Die App lädt beim Start immer die aktuelle Version von GitHub Pages. Jede Änderung am Code ist
  nach dem Push sofort in der App, ohne Neuinstallation. Offline läuft die zuletzt geladene Version weiter (Service Worker).
- **Neue APK nur bei nativen Änderungen** (Capacitor-Plugins, Symbol, Signatur). Die App erkennt das selbst und bietet
  „Installieren“ an. Android fragt dann einmal nach Bestätigung, weil Apps außerhalb des Play Stores nicht ungefragt installiert werden dürfen.
- Speichern/Export in der App läuft über das Android-Teilen-Menü (z. B. direkt an Bambu Handy, Drive oder Downloads).

### Installieren
- **Android/Chrome:** Menü → „App installieren“, oder den Button **Installieren** in der App
- **iPhone/iPad (Safari):** Teilen → „Zum Home-Bildschirm“
- **Windows/macOS/Linux (Chrome/Edge):** Installieren-Symbol in der Adressleiste. Danach läuft die App in einem eigenen Fenster.

## Projektstruktur

```
src/
  cad/        types.ts (DSL), expr.ts (sichere Ausdrücke), validate.ts, build.ts (JSCAD),
              scad.ts (OpenSCAD), templates.ts, split.ts (Aufteilen + Verbinder), text.ts
  mesh/       mesh.ts (Manifold, Reparatur, Analyse, Profile), export.ts (STL, 3MF, ZIP)
  photo/      vision.ts (Homographie, Segmentierung, Konturen), photoModel.ts
  ai/         prompt.ts (DSL-Spezifikation für das LLM), providers.ts (Gemini, OpenAI, Claude)
  state/      store.tsx (useReducer + Context), pipeline.ts (Build → Mesh → Platten)
  viewer/     Viewer.tsx (Three.js)
  components/ TextMode, PhotoMode, ModelPanels, Dialogs, ui
public/       manifest.webmanifest, sw.js (offline), icons/
```

## Genauigkeit & Grenzen
- Maße aus Text und Parametern sind exakt (CSG). Bohrungen und Passungen enthalten die eingestellte Drucktoleranz.
- Bei Fotos hängt die Genauigkeit von der Auflösung ab (wird angezeigt, typisch ±0,2–0,5 mm). Am genauesten ist ein
  Foto senkrecht von oben mit 4-Punkt-Entzerrung auf einem A4-Blatt. Abweichungen lassen sich mit „Maßkorrektur“ ausgleichen.
- Gewicht und Zeit sind Schätzungen nach Slicer-Logik. Den exakten Wert berechnet der Slicer.
- Die Teile-/Extruder-Zuordnung im 3MF folgt dem Format von Bambu Studio/OrcaSlicer. Andere Slicer übernehmen die Geometrie
  und die Teile, die Farben weist man dort zu (alternativ: „STL je Farbe“).
