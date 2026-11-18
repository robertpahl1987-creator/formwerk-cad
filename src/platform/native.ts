/**
 * Native Android-App (Capacitor).
 *  - Speichern: Datei in den App-Cache schreiben und über das Android-Teilen-Menü
 *    anbieten (Bambu Handy, Drive, Downloads …) – <a download> geht im WebView nicht.
 *  - Updates: Die App lädt immer die aktuelle Web-Version (automatisch, ohne Neuinstallation).
 *    Nur wenn sich der native Teil ändert, gibt es eine neue APK – dann meldet die App das.
 */
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export const isNativeApp = () => Capacitor.isNativePlatform();

export const APK_URL = 'https://github.com/robertpahl1987-creator/formwerk-cad/releases/download/app/formwerk-cad.apk';
const RELEASE_API = 'https://api.github.com/repos/robertpahl1987-creator/formwerk-cad/releases/tags/app';

async function toBase64(data: Blob | Uint8Array | string): Promise<string> {
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart]);
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = '';
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

export async function nativeSave(filename: string, data: Blob | Uint8Array | string): Promise<void> {
  const safe = filename.replace(/[^\w.\-]+/g, '_');
  const res = await Filesystem.writeFile({ path: safe, data: await toBase64(data), directory: Directory.Cache });
  await Share.share({ title: safe, dialogTitle: 'Datei speichern oder senden', files: [res.uri] });
}

/** Prüft, ob eine neuere APK (nativer Teil) bereitsteht. Liefert die neue Versionsnummer oder null. */
export async function checkApkUpdate(): Promise<number | null> {
  if (!isNativeApp()) return null;
  try {
    const info = await App.getInfo();
    const installed = parseInt(info.build, 10) || 0;
    const res = await fetch(RELEASE_API, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) return null;
    const rel = await res.json();
    const m = String(rel.name ?? '').match(/build\s*(\d+)/i) ?? String(rel.body ?? '').match(/versionCode:\s*(\d+)/i);
    const latest = m ? parseInt(m[1], 10) : 0;
    return latest > installed ? latest : null;
  } catch {
    return null;
  }
}

export async function openApkDownload(): Promise<void> {
  if (isNativeApp()) await Browser.open({ url: APK_URL });
  else window.open(APK_URL, '_blank');
}
