/** Schnappschuss der 3D-Ansicht (für Vorschaubilder) – die Ansicht trägt ihre Funktion hier ein. */
export const viewerShot: { take: ((w: number, h: number) => string | null) | null } = { take: null };
