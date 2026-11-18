/** Text-Hilfen (gemeinsam für JSCAD-Bau und OpenSCAD-Export). */
const UMLAUT: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', Ä: 'Ae', Ö: 'Oe', Ü: 'Ue', ß: 'ss', '€': 'EUR', Ø: 'O', ø: 'o' };

/** Die Vektorschrift kennt nur ASCII – Umlaute werden umschrieben. */
export function normalizeText(t: string): string {
  return t
    .replace(/[äöüÄÖÜß€Øø]/g, (c) => UMLAUT[c])
    .replace(/[^\x20-\x7e]/g, '?')
    .slice(0, 60);
}

/** Ersetzt {param}-Platzhalter durch Textparameter. */
export function fillText(t: string, scope: Record<string, unknown>): string {
  return t.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_, k) => (scope[k] !== undefined ? String(scope[k]) : `{${k}}`));
}

/** OpenSCAD-Ausdruck für einen Text mit Platzhaltern: str("a", key, "b"). */
export function textToScad(t: string): string {
  const parts: string[] = [];
  let last = 0;
  for (const m of t.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g)) {
    if (m.index! > last) parts.push(JSON.stringify(normalizeText(t.slice(last, m.index))));
    parts.push(m[1]);
    last = m.index! + m[0].length;
  }
  if (last < t.length) parts.push(JSON.stringify(normalizeText(t.slice(last))));
  if (parts.length === 1) return parts[0];
  return `str(${parts.join(', ')})`;
}
