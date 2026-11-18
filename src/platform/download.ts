import { wrapInZip } from '../mesh/export';
import { capability } from './claude';
import { isNativeApp, nativeSave } from './native';

/**
 * Speichert eine Datei. Normal (PWA/Browser): direkter Download.
 * Innerhalb von Claude: über die Download-Fähigkeit; Dateitypen, die dort
 * nicht erlaubt sind (.stl/.3mf/.scad), werden automatisch in ein ZIP gepackt.
 */
export async function saveFile(filename: string, data: Blob | Uint8Array | string): Promise<'saved' | 'zipped' | 'declined'> {
  if (isNativeApp()) {
    try {
      await nativeSave(filename, data);
      return 'saved';
    } catch (e) {
      // Teilen abgebrochen
      if (/cancel/i.test(String((e as Error)?.message ?? e))) return 'declined';
      throw e;
    }
  }
  const dl = await capability('downloads');
  if (dl) {
    try {
      await dl.save({ filename, data });
      return 'saved';
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === 'declined') return 'declined';
      if (code === 'rejected_extension' || code === 'extension_not_enabled') {
        const zip = await wrapInZip(filename, data);
        try {
          await dl.save({ filename: `${filename}.zip`, data: zip });
          return 'zipped';
        } catch (e2) {
          if ((e2 as { code?: string }).code === 'declined') return 'declined';
          throw new Error('Download nicht möglich');
        }
      }
      if (code === 'rate_limited') throw new Error('Bitte kurz warten – ein Download-Dialog ist schon offen.');
      // sonst: klassischer Download versuchen
    }
  }
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return 'saved';
}
